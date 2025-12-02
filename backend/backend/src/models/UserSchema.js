const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Nama harus diisi'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email harus diisi'],
    unique: true,
    trim: true,
    lowercase: true
  },
  noTelfon: {
    type: String,
    required: [true, 'Nomor handphone harus diisi'],
    trim: true
  },
  passwordHash: {
    type: String,
    required: [true, 'Password harus diisi'],
    minlength: [6, 'Password minimal 6 karakter']
  },
  role: {
    type: String,
    enum: ['parent', 'admin', 'teacher'], // ✅ ENUM YANG VALID
    default: 'parent' // ✅ DEFAULT VALUE
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
