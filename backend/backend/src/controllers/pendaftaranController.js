const Pendaftaran = require('../models/PendaftaranSchema');
const Anak = require('../models/AnakSchema');

// === CREATE Pendaftaran ===
const create = async (req, res) => {
    try {
        const { user, namaLengkap, tanggalLahir, jenisKelamin } = req.body;

        const newPendaftaran = new Pendaftaran({
            user,
            namaLengkap,
            tanggalLahir,
            jenisKelamin
        });

        await newPendaftaran.save();
        res.status(201).json(newPendaftaran);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// === GET ALL Pendaftaran ===
const getAll = async (req, res) => {
    try {
        const pendaftaranList = await Pendaftaran.find().populate('user');
        res.status(200).json(pendaftaranList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// === GET ONE Pendaftaran ===
const getOne = async (req, res) => {
    try {
        const pendaftaran = await Pendaftaran.findById(req.params.id).populate('user');
        
        if (!pendaftaran) {
            return res.status(404).json({ message: 'Pendaftaran tidak ditemukan' });
        }
        
        res.status(200).json(pendaftaran);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// === UPDATE Pendaftaran (FULL UPDATE) ===
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Cari data pendaftaran lama
        const oldPendaftaran = await Pendaftaran.findById(id);
        
        // Update data pendaftaran
        const updatedPendaftaran = await Pendaftaran.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedPendaftaran) {
            return res.status(404).json({ message: 'Pendaftaran tidak ditemukan' });
        }

        // ⭐ OTOMATIS CEK: Jika status berubah jadi DITERIMA dan belum dibuat anak
        if (updates.status === 'DITERIMA' && 
            !oldPendaftaran.anakCreated && 
            !updatedPendaftaran.anakCreated) {
            
            // Cek dulu apakah sudah ada data anak dengan user yang sama
            const existingAnak = await Anak.findOne({ user: updatedPendaftaran.user });
            
            if (!existingAnak) {
                // Buat data anak baru
                const newAnak = new Anak({
                    user: updatedPendaftaran.user,
                    namaLengkap: updatedPendaftaran.namaLengkap,
                    tanggalLahir: updatedPendaftaran.tanggalLahir
                });

                await newAnak.save();
                
                // Update flag anakCreated
                await Pendaftaran.findByIdAndUpdate(
                    id,
                    { anakCreated: true }
                );

                console.log('✅ Data anak berhasil dibuat otomatis dari pendaftaran');
            }
        }

        res.status(200).json(updatedPendaftaran);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// === UPDATE STATUS ONLY (Seperti sebelumnya) ===
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const pendaftaran = await Pendaftaran.findById(id);
        
        if (!pendaftaran) {
            return res.status(404).json({ message: 'Pendaftaran tidak ditemukan' });
        }

        if (status === 'DITERIMA' && !pendaftaran.anakCreated) {
            
            // ⭐⭐ SEKARANG INCLUDES JENIS KELAMIN ⭐⭐
            const newAnak = new Anak({
                user: pendaftaran.user,
                namaLengkap: pendaftaran.namaLengkap,
                tanggalLahir: pendaftaran.tanggalLahir,
                jenisKelamin: pendaftaran.jenisKelamin  // ← TAMBAH INI
            });

            await newAnak.save();
            
            const updatedPendaftaran = await Pendaftaran.findByIdAndUpdate(
                id, 
                { 
                    status: 'DITERIMA',
                    anakCreated: true
                },
                { new: true, runValidators: true }
            );

            return res.status(200).json({ 
                success: true,
                message: 'Status berhasil diupdate dan data anak berhasil dibuat otomatis!',
                pendaftaran: updatedPendaftaran,
                anak: newAnak
            });
        }

        // ... sisa code tetap sama
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// === DELETE Pendaftaran ===
const remove = async (req, res) => {
    try {
        const pendaftaran = await Pendaftaran.findByIdAndDelete(req.params.id);

        if (!pendaftaran) {
            return res.status(404).json({ message: 'Pendaftaran tidak ditemukan' });
        }
        
        res.status(200).json({ message: 'Pendaftaran berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    create,
    getAll, 
    getOne,
    update,      // ← Full update (bisa otomatis create anak)
    updateStatus, // ← Update status only (bisa otomatis create anak)  
    remove
};