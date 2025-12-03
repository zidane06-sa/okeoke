const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const os = require('os');

const app = express();

// Simple CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files (uploads folder)
// Vercel: /tmp/uploads, Local: ./uploads
const uploadBase = process.env.VERCEL
  ? path.join(os.tmpdir(), 'uploads')
  : path.join(__dirname, 'uploads');

app.use('/uploads', express.static(uploadBase));

// Import Routes
const userRoutes = require('./src/routes/userRoutes');
const anakRoutes = require('./src/routes/anakRoutes');
const tagihanRoutes = require('./src/routes/tagihanRoutes');
const jadwalPerawatanRoutes = require('./src/routes/jadwalPerawatanRoutes');
const laporanHarianRoutes = require('./src/routes/laporanHarianRoutes');
const rencanaPembelajaranRoutes = require('./src/routes/rencanaPembelajaranRoutes');

// ✅ Jangan hardcode password: pakai env di Vercel
const url = process.env.MONGODB_URI || 'mongodb+srv://zidane06sa:Unicaca123@cluster0.nohu2ep.mongodb.net/RPL'

mongoose.connect(url)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ Error connecting to MongoDB:', err));

// Routes
app.use('/user', userRoutes);
app.use('/children', anakRoutes);
app.use('/tagihan', tagihanRoutes);
app.use('/jadwalPerawatan', jadwalPerawatanRoutes);
app.use('/laporanHarian', laporanHarianRoutes);
app.use('/rencanaPembelajaran', rencanaPembelajaranRoutes);

// Test Route
app.get('/', (req, res) => {
  res.json({
    message: 'Backend API is running!',
    timestamp: new Date().toISOString()
  });
});

// ✅ export app untuk Vercel
module.exports = app;

// ✅ listen hanya kalau lokal
if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
}
