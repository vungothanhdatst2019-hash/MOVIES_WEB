/**
 * File: js/services/movieService.js
 * Chức năng: Quản lý toàn bộ yêu cầu API liên quan đến Phim
 */

const API_BASE_URL = "http://localhost:5000/api/movies";

/**
 * Lấy danh sách tất cả phim cho trang Home
 */
async function getAllMovies() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error("Lỗi mạng khi tải danh sách phim");
        return await response.json();
    } catch (error) {
        console.error("❌ Error getAllMovies:", error);
        return [];
    }
}

/**
 * Lấy thông tin chi tiết 1 bộ phim theo ID cho trang Watch
 */
async function getMovieById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) throw new Error("Không tìm thấy bộ phim này");
        return await response.json();
    } catch (error) {
        console.error(`❌ Error getMovieById (${id}):`, error);
        return null;
    }
}