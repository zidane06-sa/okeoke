const fs = require("fs");
const path = require("path");
const os = require("os");
const multer = require("multer");

// ✅ Vercel: tulis ke /tmp (writable). Local: tulis ke ./uploads
const baseUploadDir = process.env.VERCEL
  ? path.join(os.tmpdir(), "uploads")      // /tmp/uploads
  : path.join(process.cwd(), "uploads");   // ./uploads

const paymentProofDir = path.join(baseUploadDir, "payment-proofs");

// ✅ bikin folder + parent folder
fs.mkdirSync(paymentProofDir, { recursive: true });

// (opsional) buat ngecek di Vercel logs
console.log("UPLOAD DIR USED =", paymentProofDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, paymentProofDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${unique}-${file.originalname}`);
  },
});

module.exports = multer({ storage });
