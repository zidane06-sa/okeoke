const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    anak: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'anak',
        required: true,
    },

    nominal: {
        type: Number,
        required: [true, 'Nominal harus diisi'],
    },
    
    tanggalJatuhTempo: {
        type: Date,
        required: true,
    },

    periode: {
        type: String,
        required: [true, 'Periode harus diisi'],
    },

    tanggalPembayaran: {
        type: Date,
        required: false,
    },

    status: {
        type: String,
        enum: ['unpaid', 'verified', 'pending-verification', 'rejected'],
        default: 'unpaid',
        required: [true, 'Status harus diisi'],
    },

    paymentProofUrl: {
        type: String,
        required: false,
        default: null,
    }
}, {
    timestamps: true
});

const Tagihan = mongoose.model('tagihan', Schema);
module.exports = Tagihan;
