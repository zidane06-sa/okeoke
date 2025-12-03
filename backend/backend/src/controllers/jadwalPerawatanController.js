const JadwalPerawatan = require('../models/JadwalPerawatanSchema');

// --- C: Create (for both jadwal perawatan and complaints)
const create = async (req, res) => {
    const { itemName, namaBarang, deskripsiPekerjaan, description, tanggalJadwal, status, photoUrl, createdByRole, createdBy } = req.body;
    const userIdFromAuth = req.user?.id; // Try to get from auth middleware

    try {
        // Support both jadwal perawatan and complaint submissions
        if (!itemName && !namaBarang) {
            return res.status(400).json({ 
                success: false,
                message: 'Field wajib: itemName atau namaBarang' 
            });
        }

        // Use createdBy from request body or auth middleware
        const finalCreatedBy = createdBy || userIdFromAuth;

        const newJadwalPerawatan = new JadwalPerawatan({
            itemName: itemName || namaBarang,
            namaBarang,
            description: description || deskripsiPekerjaan,
            deskripsiPekerjaan,
            photoUrl: photoUrl || '',
            tanggalJadwal,
            status: status || 'new',
            createdBy: finalCreatedBy, // Can be undefined - that's ok for now
            createdByRole: createdByRole || 'parent'
        });

        await newJadwalPerawatan.save();
        res.status(201).json({ 
            success: true,
            data: newJadwalPerawatan 
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
        const { createdBy, status } = req.query;
        const filter = {};
        if (createdBy) filter.createdBy = createdBy;
        if (status) filter.status = status;

        console.log('GetAll filter:', filter);
        const jadwalPerawatans = await JadwalPerawatan.find(filter)
            .populate('createdBy', 'fullName email')
            .sort({ createdAt: -1 });
        console.log('Found jadwalPerawatans:', jadwalPerawatans);
        res.status(200).json({ success: true, data: jadwalPerawatans });
    } catch (error) {
        console.error('Error in getAll:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// --- R: Read One
const getOne = async (req, res) => {
    try {
        const jadwalPerawatan = await JadwalPerawatan.findById(req.params.id)
            .populate('createdBy', 'fullName email');

        if (jadwalPerawatan == null) {
            return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
        }
        res.status(200).json({ success: true, data: jadwalPerawatan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// --- U: Update
const update = async (req, res) => {
    const updates = req.body;

    try {
        const updatedJadwalPerawatan = await JadwalPerawatan.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).populate('createdBy', 'fullName email');

        if (updatedJadwalPerawatan == null) {
            return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
        }
        res.status(200).json({ success: true, data: updatedJadwalPerawatan });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

// --- D: Delete
const remove = async (req, res) => {
    try {
        const jadwalPerawatan = await JadwalPerawatan.findByIdAndDelete(req.params.id);

        if (jadwalPerawatan == null) {
            return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
        }
        res.status(200).json({ success: true, message: 'Data berhasil dihapus' });
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