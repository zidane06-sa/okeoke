const Tagihan = require('../models/TagihanSchema');
const path = require('path');

// --- C: Create
const create = async (req, res) => {
  const { anak, nominal, tanggalJatuhTempo, periode } = req.body;

  try {
    if (!anak || !nominal || !tanggalJatuhTempo || !periode) {
      return res.status(400).json({
        success: false,
        message: 'Field wajib: anak, nominal, tanggalJatuhTempo, periode'
      });
    }

    const newTagihan = new Tagihan({
      anak,
      nominal,
      tanggalJatuhTempo,
      periode,
      status: 'unpaid'
    });

    await newTagihan.save();
    res.status(201).json({
      success: true,
      data: newTagihan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// --- R: Read All
const getAll = async (req, res) => {
  try {
    const { anakId } = req.query;
    const filter = {};
    if (anakId) filter.anak = anakId;

    const tagihans = await Tagihan.find(filter)
      .populate('anak', 'namaLengkap')
      .sort({ tanggalJatuhTempo: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: tagihans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// --- R: Read One
const getOne = async (req, res) => {
  try {
    const tagihan = await Tagihan.findById(req.params.id)
      .populate('anak', 'namaLengkap');

    if (!tagihan) {
      return res.status(404).json({
        success: false,
        message: 'Tagihan tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: tagihan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// --- U: Update
const update = async (req, res) => {
  const updates = req.body;

  try {
    const updatedTagihan = await Tagihan.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('anak', 'namaLengkap');

    if (!updatedTagihan) {
      return res.status(404).json({
        success: false,
        message: 'Tagihan tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedTagihan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

// --- D: Delete
const remove = async (req, res) => {
  try {
    const tagihan = await Tagihan.findByIdAndDelete(req.params.id);

    if (!tagihan) {
      return res.status(404).json({
        success: false,
        message: 'Tagihan tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tagihan berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// --- Upload Payment Proof
const uploadPaymentProof = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File tidak ditemukan'
      });
    }

    // Construct file URL
    const fileUrl = `/uploads/payment-proofs/${req.file.filename}`;

    // Update Tagihan dengan payment proof URL
    const updatedTagihan = await Tagihan.findByIdAndUpdate(
      id,
      {
        paymentProofUrl: fileUrl,
        tanggalPembayaran: new Date(),
        status: 'pending-verification'
      },
      { new: true, runValidators: true }
    ).populate('anak', 'namaLengkap');

    if (!updatedTagihan) {
      return res.status(404).json({
        success: false,
        message: 'Tagihan tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bukti pembayaran berhasil diupload',
      data: updatedTagihan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove,
  uploadPaymentProof
};