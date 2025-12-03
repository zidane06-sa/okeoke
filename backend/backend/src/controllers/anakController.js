const Anak = require('../models/AnakSchema');

// --- C: Create
const create = async (req, res) => {
    const { user, namaLengkap, tanggalLahir, jenisKelamin, alamat, kelas, kondisi_khusus } = req.body;

    try {
        // Validasi field wajib
        if (!user || !namaLengkap || !tanggalLahir || !jenisKelamin || !alamat || !kelas) {
            return res.status(400).json({ 
                success: false,
                message: 'Field wajib: user, namaLengkap, tanggalLahir, jenisKelamin, alamat, kelas' 
            });
        }

        const newAnak = new Anak({
            user,
            namaLengkap,
            tanggalLahir,
            jenisKelamin,
            alamat,
            kelas,
            kondisi_khusus: kondisi_khusus || ''
        });

        await newAnak.save();
        res.status(201).json({ 
            success: true,
            data: newAnak 
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
        const { parentId } = req.query;
        const filter = {};
        if (parentId) filter.user = parentId;

        const anaks = await Anak.find(filter).lean();
        res.status(200).json({ success: true, data: anaks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// --- R: Read One
const getOne = async (req, res) => {
    try {
        const anak = await Anak.findById(req.params.id);

        if (anak == null) {
            return res.status(404).json({ success: false, message: 'Anak tidak ditemukan' });
        }
        res.status(200).json({ success: true, data: anak });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// --- U: Update
const update = async (req, res) => {
    const updates = req.body;

    try {
        const updatedAnak = await Anak.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (updatedAnak == null) {
            return res.status(404).json({ success: false, message: 'Anak tidak ditemukan' });
        }
        res.status(200).json({ success: true, data: updatedAnak });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

// --- D: Delete
const remove = async (req, res) => {
    try {
        const anak = await Anak.findByIdAndDelete(req.params.id);

        if (anak == null) {
            return res.status(404).json({ success: false, message: 'Anak tidak ditemukan' });
        }
        res.status(200).json({ success: true, message: 'Anak berhasil dihapus' });
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
