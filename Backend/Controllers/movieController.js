const Movie = require('../models/Movie');

// 1. [POST] /api/movies - Tạo mới phim
exports.createMovie = async (req, res) => {
  try {
    const newMovie = await Movie.create(req.body);
    res.status(201).json({ success: true, data: newMovie });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 2. [GET] /api/movies - Lấy danh sách tất cả phim
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({ success: true, count: movies.length, data: movies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. [GET] /api/movies/:id - Lấy chi tiết 1 phim
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phim' });
    }
    res.status(200).json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. [PUT] /api/movies/:id - Cập nhật thông tin phim
exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Trả về data mới sau khi cập nhật
      runValidators: true, // Kiểm tra validation trong Schema
    });
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phim' });
    }
    res.status(200).json({ success: true, data: movie });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 5. [DELETE] /api/movies/:id - Xóa phim
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phim' });
    }
    res.status(200).json({ success: true, message: 'Xóa phim thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};