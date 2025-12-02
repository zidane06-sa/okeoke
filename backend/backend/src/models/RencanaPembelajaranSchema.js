const mongoose = require('mongoose');

// Define the Schema for Rencana Pembelajaran (Learning Plans)
const Schema = new mongoose.Schema({
    anakId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'anak',
        required: true,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },

    judulKegiatan: {
        type: String,
        required: true,
    },

    deskripsi: {
        type: String,
        required: false,
    },

    bahanPerlengkapan: {
        type: String,
        required: false,
    },

    tanggal: {
        type: Date,
        required: true,
    },

    status: {
        type: String,
        enum: ['planned', 'in_progress', 'completed'],
        default: 'planned'
    }
}, {
    timestamps: true
});

const RencanaPembelajaran = mongoose.model('rencanaPembelajaran', Schema);

module.exports = RencanaPembelajaran;
