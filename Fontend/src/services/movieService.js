// Khai báo URL gốc của Backend Node.js
const BASE_URL = "http://localhost:5000/api/movies";

/**
 * Lấy danh sách tất cả phim từ Backend
 * @returns {Promise<Array>} Mảng danh sách các bộ phim
 */
async function getAllMovies() {
    try {
        const response = await fetch(BASE_URL);
        
        if (!response.ok) {
            throw new Error(`Lỗi kết nối API: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ MovieService - Lỗi getAllMovies:", error);
        throw error; // Chuyển lỗi ra ngoài cho UI xử lý
    }
}

/**
 * Lấy thông tin chi tiết 1 bộ phim theo ID
 * @param {string} id - ID phim (movieId hoặc _id)
 * @returns {Promise<Object>} Đối tượng thông tin bộ phim
 */
async function getMovieById(id) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`);
        
        if (!response.ok) {
            throw new Error(`Lỗi kết nối API: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`❌ MovieService - Lỗi getMovieById (${id}):`, error);
        throw error;
    }
}