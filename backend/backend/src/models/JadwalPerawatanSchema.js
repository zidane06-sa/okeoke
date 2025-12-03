const mongoose = require('mongoose');

// 1. Define the Schema
// A Mongoose Schema defines the structure of the documents 
// within a MongoDB collection.
const Schema = new mongoose.Schema({
    
    inventaris: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'inventaris',
        required: false,
    },

    itemName: {
        type: String,
        required: [true, 'Nama inventaris harus diisi'],
        minlength: [3, 'Nama inventaris minimal 3 karakter'],
    },

    namaBarang: {
        type: String,
        required: false,
    },

    description: {
        type: String,
        required: false,
    },

    deskripsiPekerjaan: {
        type: String,
        required: false,
    },
    
    photoUrl: {
        type: String,
        required: false,
    },

    tanggalJadwal: {
        type: Date,
        required: false,
    },

    status: {
        type: String,
        enum: ['new', 'in_progress', 'completed', 'pending', 'approved', 'rejected'],
        default: 'new',
        required: true,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false,
    },

    createdByRole: {
        type: String,
        enum: ['parent', 'admin', 'teacher'],
        default: 'parent',
        required: false,
    },

    workProofUrl: {
        type: String,
        default: '',
    },

    completionProofUrl: {
        type: String,
        default: '',
    },
}, {
    // Schema Options (Optional, but useful)
    timestamps: true // Adds two fields: 'createdAt' and 'updatedAt' automatically
});

// 2. Create the Model
// A Mongoose Model is a class used to construct documents 
// and interact with the MongoDB database collection.
const JadwalPerawatan = mongoose.model('jadwalPerawatan', Schema);

// 3. Export the Model
module.exports = JadwalPerawatan;
