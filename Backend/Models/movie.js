const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  movieId: { type: String, required: true, unique: true },
    title: { type: String, required: true },        // Tên phim
    description: { type: String },                 // Mô tả
    videoUrl: { type: String, required: true },   // LINK VIDEO/IFRAME LƯU Ở ĐÂY
    category: { type: String },                    // Thể loại
    year: { type: Number },                        // Năm sản xuất
    posterUrl: { type: String }                    // Link ảnh bìa phim
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);