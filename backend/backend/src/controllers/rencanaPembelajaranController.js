const RencanaPembelajaran = require('../models/RencanaPembelajaranSchema');


// --- C: Create
const create = async (req, res) => {
    const { anakId, userId, judulKegiatan, deskripsi, bahanPerlengkapan, tanggal, status } = req.body;
    const userIdFromAuth = req.user?.id;

    try {
        const newRencanaPembelajaran = new RencanaPembelajaran({
            anakId,
            userId: userId || userIdFromAuth,
            judulKegiatan,
            deskripsi: deskripsi || '',
            bahanPerlengkapan: bahanPerlengkapan || '',
            tanggal,
            status: status || 'planned'
        });

        await newRencanaPembelajaran.save();
        res.status(201).json({ 
            success: true,
            data: newRencanaPembelajaran 
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
        const { anakId, userId, status } = req.query;
        const filter = {};
        if (anakId) filter.anakId = anakId;
        if (userId) filter.userId = userId;
        if (status) filter.status = status;

        console.log('GetAll filter:', filter);
        const rencanaPembelajarans = await RencanaPembelajaran.find(filter)
            .populate('anakId', 'namaLengkap fullName')
            .sort({ tanggal: -1 });
        
        console.log('Found rencanaPembelajarans:', rencanaPembelajarans);
        res.status(200).json({ success: true, data: rencanaPembelajarans });
    } catch (error) {
        console.error('Error in getAll:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// --- R: Read One
const getOne = async (req, res) => {
    try {
        const rencanaPembelajaran = await RencanaPembelajaran.findById(req.params.id)
            .populate('anakId', 'namaLengkap fullName');

        if (rencanaPembelajaran == null) {
            return res.status(404).json({ success: false, message: 'Rencana pembelajaran tidak ditemukan' });
        }
        res.status(200).json({ success: true, data: rencanaPembelajaran });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// --- U: Update
const update = async (req, res) => {
    // Data yang akan di-update ada di req.body
    const updates = req.body;

    try {
        const updatedRencanaPembelajaran = await RencanaPembelajaran.findByIdAndUpdate(
            req.params.id, // ID user yang akan di-update
            updates,       // Data update
            { new: true, runValidators: true } // Opsi: kembalikan dokumen baru (new: true) dan jalankan validasi (runValidators: true)
        ).populate('anakId', 'fullName')
         .populate('userId', 'fullName');

        if (updatedRencanaPembelajaran == null) {
            return res.status(404).json({ success: false, message: 'Rencana pembelajaran tidak ditemukan' });
        }
        // Beri respons 200 OK dan data user yang sudah di-update
        res.status(200).json({ success: true, data: updatedRencanaPembelajaran });
    } catch (error) {
        // Error validasi atau error lain
        res.status(400).json({ success: false, message: error.message });
    }
}

// --- D: Delete
const remove = async (req, res) => {
    try {
        const rencanaPembelajaran = await RencanaPembelajaran.findByIdAndDelete(req.params.id);

        if (rencanaPembelajaran == null) {
            return res.status(404).json({ success: false, message: 'Rencana pembelajaran tidak ditemukan' });
        }
        // Beri respons 200 OK dan pesan sukses
        res.status(200).json({ success: true, message: 'Rencana pembelajaran berhasil dihapus' });
    } catch (error) {
        // Error lain
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