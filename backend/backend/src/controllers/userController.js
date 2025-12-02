const User = require('../models/UserSchema');
const bcrypt = require('bcryptjs');

// ✅ RENAME FUNCTION & UPDATE LOGIC
exports.register = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;

        console.log('📨 Registration attempt:', { name, email, phone });

        // Validasi required fields
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'Semua field harus diisi'
            });
        }

        // Cek jika user sudah ada
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email sudah terdaftar'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Buat user baru - SESUAI DENGAN SCHEMA KAMU
        const newUser = new User({
            username: name,        // Field di schema: username
            passwordHash: hashedPassword, // Field di schema: passwordHash
            email: email,
            noTelfon: phone,       // Field di schema: noTelfon
            role: role || 'parent'
        });

        await newUser.save();

        console.log('✅ User registered successfully:', newUser.email);

        // Response tanpa password
        const userResponse = {
            id: newUser._id,
            name: newUser.username,
            email: newUser.email,
            phone: newUser.noTelfon,
            role: newUser.role,
            createdAt: newUser.createdAt
        };

        res.status(201).json({
            success: true,
            message: 'Registrasi berhasil',
            data: userResponse
        });

    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server: ' + error.message
        });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Cari user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Email atau password salah'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Email atau password salah'
            });
        }

        // Login successful
        const userResponse = {
            id: user._id,
            name: user.username,
            email: user.email,
            phone: user.noTelfon,
            role: user.role
        };

        res.json({
            success: true,
            message: 'Login berhasil',
            data: userResponse
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server'
        });
    }
}

// ✅ KEEP YOUR EXISTING FUNCTIONS BUT RENAME FOR CONSISTENCY
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-passwordHash');
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');
        if (user == null) {
            return res.status(404).json({
                success: false,
                message: 'Cannot find user'
            });
        }
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message 
        });
    }
}

exports.updateUser = async (req, res) => {
    const updates = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select('-passwordHash');

        if (updatedUser == null) {
            return res.status(404).json({
                success: false,
                message: 'Cannot find user'
            });
        }
        res.json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message 
        });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (user == null) {
            return res.status(404).json({
                success: false,
                message: 'Cannot find user'
            });
        }
        res.json({
            success: true,
            message: 'User was deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message 
        });
    }
}

// ✅ ALIAS FUNCTIONS UNTUK COMPATIBILITY
exports.create = exports.register;
exports.getAll = exports.getAllUsers;
exports.getOne = exports.getUserById;
exports.update = exports.updateUser;
exports.remove = exports.deleteUser;