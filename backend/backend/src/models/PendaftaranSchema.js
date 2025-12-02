const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    namaLengkap: {
        type: String,
        required: [true, 'Nama lengkap anak harus diisi']
    },

    tanggalLahir: {
        type: Date,
        required: [true, 'Tanggal lahir anak harus diisi']
    },

    jenisKelamin: {
        type: String,
        required: [true, 'Jenis kelamin harus diisi'],
        enum: {
            values: ['L', 'P'],
            message: 'Jenis kelamin {VALUE} tidak valid'
        }
    },

    tanggalDaftar: {
        type: Date,
        required: [true, 'Tanggal daftar wajib diisi'],
        default: Date.now
    },

    status: {
        type: String,
        required: [true, 'Status harus diisi'],
        enum: {
            values: ['BELUM_DITERIMA', 'DITERIMA'],
            message: 'Status {VALUE} tidak valid'
        },
        default: 'BELUM_DITERIMA'
    },

    anakCreated: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Pendaftaran = mongoose.model('Pendaftaran', Schema);

module.exports = Pendaftaran;
