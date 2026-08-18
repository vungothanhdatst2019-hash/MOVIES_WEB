const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const movieRoutes = require('./routes/movieRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Đọc dữ liệu JSON trong req.body

// Routes
app.use('/api/movies', movieRoutes);

// Kết nối MongoDB và Khởi chạy Server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Đã kết nối thành công với MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
  }); 