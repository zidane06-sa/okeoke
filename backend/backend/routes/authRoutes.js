const express = require('express');
const router = express.Router();

// Mock user database
const mockUsers = [
  {
    _id: '1',
    email: 'parent@example.com',
    password: '123456',
    role: 'parent',
    name: 'Orang Tua'
  },
  {
    _id: '2',
    email: 'admin@example.com',
    password: '123456',
    role: 'admin',
    name: 'Admin'
  },
  {
    _id: '3',
    email: 'teacher@example.com',
    password: '123456',
    role: 'teacher',
    name: 'Guru'
  }
];

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email dan password harus diisi'
    });
  }

  // Cari user di mock data
  const user = mockUsers.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Email atau password salah'
    });
  }

  // Return user tanpa password
  const userResponse = {
    id: user._id,
    email: user.email,
    role: user.role,
    name: user.name
  };

  return res.json({
    success: true,
    message: 'Login berhasil',
    data: userResponse,
    token: 'mock-token-' + user._id
  });
});

module.exports = router;
