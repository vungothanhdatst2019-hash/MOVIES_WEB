const Movie = require('../models/Movie');
// 1. Lấy tất cả danh sách phim (Phục vụ trang chủ / Home)
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách phim", error: error.message });
  }
};
// 2. Lấy danh mục tùy chọn bộ lọc động từ MongoDB
exports.getFilterOptions = async (req, res) => {
  try {
    const rawCategories = await Movie.distinct('category');
    const rawNations = await Movie.distinct('nation');
    const rawYears = await Movie.distinct('year');
    const flatCategories = Array.isArray(rawCategories)
      ? [...new Set(rawCategories.flat().filter(item => item && typeof item === 'string'))]
      : [];
    const cleanNations = Array.isArray(rawNations)
      ? [...new Set(rawNations.map(n => (typeof n === 'string' ? n.trim() : n)).filter(Boolean))]
      : [];
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
// 3. Xử lý Lọc phim theo các điều kiện
exports.filterMovies = async (req, res) => {
  try {
    const { country, genre, year, type, order } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 28;
    const skip = (page - 1) * limit;
    let query = {};

    if (country) query.nation = country;
    if (year) query.year = Number(year);
    if (type) query.type = type;
    if (genre) query.category = { $in: [genre] };

    if (type) {
      if (["anime", "hoathinh", "Hoạt Hình"].includes(type.toLowerCase())) {
        query.type = { $regex: /anime|hoathinh|hoạt hình/i };
      } else {
        query.type = { $regex: new RegExp(type, "i") };
      }
    }
    const sortOrder = order === 'asc' ? 1 : -1;
    // Đếm tổng số phim thỏa điều kiện
    const totalMovies = await Movie.countDocuments(query);
    const totalPages = Math.ceil(totalMovies / limit); 
    const movies = await Movie.find(query)
      .sort({ year: sortOrder, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: movies,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalMovies: totalMovies,
        limit: limit
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};