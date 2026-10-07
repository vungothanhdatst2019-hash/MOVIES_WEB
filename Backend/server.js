const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const movieRoutes = require('./Routes/movieRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Phục vụ tài nguyên tĩnh từ gốc thư mục Fontend (CSS, JS, Images...)
app.use(express.static(path.join(__dirname, '../Fontend/src')));

// 2. Phục vụ các file HTML trực tiếp từ thư mục src/pages
app.use(express.static(path.join(__dirname, '../Fontend/src/pages')));

// 3. API Routes
app.use('/api/movies', movieRoutes);

// 4. Route cho trang chủ "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Fontend/src/pages/Home.html'));
});

// 5. Route tĩnh xử lý file HTML trang con (như /introduce.html, /detail.html)
app.get('/:page.html', (req, res) => {
  const pageFile = path.join(__dirname, '../Fontend/src/pages', `${req.params.page}.html`);
  res.sendFile(pageFile, (err) => {
    if (err) {
      // Nếu không tìm thấy file HTML tương ứng, trả về Home.html
      res.sendFile(path.join(__dirname, '../Fontend/src/pages/Home.html'));
    }
  });
});

// Kết nối MongoDB và Khởi chạy Server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Đã kết nối thành công với MongoDB');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
  }); 