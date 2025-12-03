const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'User harus diisi'],
    },
    
    namaLengkap: {
        type: String,
        required: [true, 'Nama lengkap harus diisi'],
        minlength: [3, 'Nama lengkap minimal 3 karakter'],
    },

    kelas: {
        type: String,
        required: [true, 'Kelas harus diisi'],
        minlength: [3, 'Kelas minimal 3 karakter'],
    },
    
    tanggalLahir: {
        type: Date,
        required: [true, 'Tanggal lahir harus diisi'],
    },

    jenisKelamin: {
        type: String,
        required: [true, 'Jenis kelamin harus diisi'],
        enum: {
            values: ['L', 'P'],
            message: 'Jenis kelamin harus L atau P'
        }
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

    kondisi_khusus: {
        type: String,
        default: '',
    },

    alamat: {
        type: String,
        required: [true, 'Alamat harus diisi'],
        minlength: [5, 'Alamat minimal 5 karakter'],
    },
    
}, {
    timestamps: true
});

const Anak = mongoose.model('anak', Schema);
module.exports = Anak;
