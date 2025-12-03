const fs = require("fs");
const path = require("path");
const os = require("os");
const multer = require("multer");

const baseUploadDir = process.env.VERCEL
  ? path.join(os.tmpdir(), "uploads")     // Vercel: /tmp/uploads
  : path.join(process.cwd(), "uploads");  // Local: ./uploads

const paymentProofDir = path.join(baseUploadDir, "payment-proofs");
fs.mkdirSync(paymentProofDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, paymentProofDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

module.exports = multer({ storage });
