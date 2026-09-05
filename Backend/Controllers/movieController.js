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
// 🌟 2.1 [GET] /api/movies/filter-options - Lấy danh sách danh mục lọc động từ DB
// [GET] /api/movies/filter-options - Lấy danh sách danh mục lọc động từ DB
exports.getFilterOptions = async (req, res) => {
  try {
    const rawCategories = await Movie.distinct('category');
    const rawNations = await Movie.distinct('nation');
    const rawYears = await Movie.distinct('year');

    // 1. Làm phẳng mảng category và lọc trùng
    const flatCategories = Array.isArray(rawCategories)
      ? [...new Set(rawCategories.flat().filter(Boolean))]
      : [];

    // 2. Làm phẳng quốc gia và xóa khoảng trắng thừa
    const cleanNations = Array.isArray(rawNations)
      ? [...new Set(rawNations.flat().map(n => typeof n === 'string' ? n.trim() : n).filter(Boolean))]
      : [];

    // 3. Lọc năm giảm dần
    const sortedYears = Array.isArray(rawYears)
      ? [...new Set(rawYears.filter(y => y && !isNaN(y)))].sort((a, b) => b - a)
      : [];

    res.status(200).json({
      success: true,
      data: {
        genres: flatCategories,
        countries: cleanNations,
        years: sortedYears
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// 🌟 2.2 [GET] /api/movies/filter - Lọc phim theo điều kiện
exports.filterMovies = async (req, res) => {
  try {
    const { country, genre, year, type, order } = req.query;
    let query = {};

    // Ánh xạ tham số nhận từ query string với tên trường thực tế trong MongoDB
    if (country) query.nation = country;
    if (genre) query.category = genre;
    if (year) query.year = Number(year);
    if (type) query.type = type;

    // Thứ tự sắp xếp (mặc định giảm dần theo ngày tạo/năm)
    const sortOrder = order === 'asc' ? 1 : -1;

    const movies = await Movie.find(query).sort({ year: sortOrder, _id: sortOrder });

    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
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
