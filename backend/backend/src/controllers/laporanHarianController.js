const LaporanHarian = require('../models/LaporanHarianSchema');

// --- C: Create
const create = async (req, res) => {
    const { userId, rencanaPembelajaranId, anakId, tanggal, catatanAktivitas, fotoKegiatanURL, catatanKhusus } = req.body;

    try {
        const newLaporanHarian = new LaporanHarian({
            userId,
            rencanaPembelajaranId,
            anakId,
            tanggal,
            catatanAktivitas,
            fotoKegiatanURL,
            catatankhusus: catatanKhusus
        });

        await newLaporanHarian.save();
        res.status(201).json({ 
            success: true,
            data: newLaporanHarian 
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
        if (anakId) filter.anakId = anakId;

        console.log('GetAll filter:', filter);
        const laporanHarians = await LaporanHarian.find(filter)
            .populate('anakId', 'namaLengkap fullName')
            .sort({ tanggal: -1 });
        
        console.log('Found laporanHarians:', laporanHarians);
        res.status(200).json({ success: true, data: laporanHarians });
    } catch (error) {
        console.error('Error in getAll:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// --- R: Read One
const getOne = async (req, res) => {
    try {
        const laporanHarian = await LaporanHarian.findById(req.params.id)
            .populate('anakId', 'namaLengkap fullName');

        if (laporanHarian == null) {
            return res.status(404).json({ success: false, message: 'Laporan tidak ditemukan' });
        }
        res.status(200).json({ success: true, data: laporanHarian });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// --- U: Update
const update = async (req, res) => {
    const updates = req.body;

    try {
        const updatedLaporanHarian = await LaporanHarian.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).populate('anakId', 'namaLengkap fullName');

        if (updatedLaporanHarian == null) {
            return res.status(404).json({ success: false, message: 'Laporan tidak ditemukan' });
        }
        res.status(200).json({ success: true, data: updatedLaporanHarian });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

// --- D: Delete
const remove = async (req, res) => {
    try {
        const laporanHarian = await LaporanHarian.findByIdAndDelete(req.params.id);

        if (laporanHarian == null) {
            return res.status(404).json({ success: false, message: 'Laporan tidak ditemukan' });
        }
        res.status(200).json({ success: true, message: 'Laporan berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    create,
    getAll,
    getOne,
    update,
    remove
}
