const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const axios = require('axios');
const movieController = require('../Controllers/movieController');

console.log("🚀 Kiểm tra Axios đã nạp chưa:", typeof axios);
router.get('/proxy/stream', async (req, res) => {
    try {
        const videoUrl = req.query.url; // Lấy link m3u8 truyền qua tham số ?url=...

        if (!videoUrl) {
            return res.status(400).json({ message: "Thiếu tham số url video!" });
        }

        // Server Node.js "đóng giả" trình duyệt gửi request sang streamvsmov
        const response = await axios({
            method: 'get',
            url: videoUrl,
            responseType: 'stream', // Trả về dạng luồng dữ liệu (Stream)
            headers: {
                // Đính kèm Referer giả lập để qua mặt hàng rào bảo vệ
                'Referer': 'https://v1.streamvsmov.com/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        // Bật CORS cho phép Frontend localhost nhận dữ liệu video
        res.setHeader('Access-Control-Allow-Origin', '*');
        if (response.headers['content-type']) {
            res.setHeader('Content-Type', response.headers['content-type']);
        }

        // Bơm (pipe) trực tiếp luồng dữ liệu video về cho Frontend
        response.data.pipe(res);

    } catch (error) {
        console.error("❌ Lỗi Proxy:", error.message);
        res.status(500).send("Không thể tải luồng video qua Proxy!");
    }
});
// 🌟 Route lấy danh sách tùy chọn lọc (Genre, Nation, Year) từ DB
router.get('/filter-options', movieController.getFilterOptions);

// 🌟 Route thực hiện truy vấn lọc phim
router.get('/filter', movieController.filterMovies);

// Lấy danh sách tất cả phim
router.get('/', movieController.getAllMovies);
// API: Lấy thông tin phim theo movieId hoặc _id (GET /api/movies/:id)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Ưu tiên tìm theo movieId tự đặt trước (vd: "phim-01")
        let movie = await Movie.findOne({ movieId: id });

        // 2. Nếu không thấy và id gửi lên là ObjectId 24 ký tự hợp lệ, thử tìm theo _id của MongoDB
        if (!movie && mongoose.Types.ObjectId.isValid(id)) {
            movie = await Movie.findById(id);
        }

        if (!movie) {
            return res.status(404).json({ message: "Không tìm thấy bộ phim này!" });
        }

        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server", error: error.message });
    }
});
module.exports = router;