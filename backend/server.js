const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cek environment
console.log('📧 EMAIL_USER:', process.env.EMAIL_USER ? '✓ Ada' : '✗ Tidak ada');
console.log('📧 EMAIL_PASS:', process.env.EMAIL_PASS ? '✓ Ada' : '✗ Tidak ada');
console.log('📧 EMAIL_TO:', process.env.EMAIL_TO ? '✓ Ada' : '✗ Tidak ada');

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ============= ROUTES =============

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: '✅ Backend jalan!' 
  });
});

// Contact endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    console.log('📩 Menerima:', { name, email, message });

    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Semua field harus diisi' 
      });
    }

    const mailOptions = {
      from: `"Portfolio" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `Pesan dari ${name}`,
      text: `
        Nama: ${name}
        Email: ${email}
        Pesan: ${message}
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true, 
      message: '✅ Pesan terkirim!' 
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mengirim pesan' 
    });
  }
});

// 404 handler - PASTIKAN INI TIDAK PAKE *
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint tidak ditemukan' 
  });
});

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════╗
║  🚀 BACKEND JALAN!           ║
║  Port: ${PORT}                   ║
║  URL: http://localhost:${PORT}  ║
╚══════════════════════════════╝
  `);
});