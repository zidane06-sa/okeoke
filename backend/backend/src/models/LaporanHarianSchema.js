const mongoose = require('mongoose');

// Define the Schema for Laporan Harian (Daily Reports)
const Schema = new mongoose.Schema({
    anakId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'anak',
        required: true
    },

    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    rencanaPembelajaranId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rencanaPembelajaran',
        required: false,
    }],

    tanggal: {
        type: Date,
        required: [true, 'Tanggal laporan harus diisi'],
    },
    
    catatanAktivitas: {
        type: String,
        required: true,
    },

    catatankhusus: {
        type: String,
        required: false,
    },

    fotoKegiatanURL: {
        type: String,
        required: false,
        default: ''
    },
}, {
    timestamps: true
});

const LaporanHarian = mongoose.model('laporanHarian', Schema);

module.exports = LaporanHarian;
