/**
 * File: services/filterInformation.js
 * Quản lý việc gọi API lấy thông tin danh mục bộ lọc và truy vấn lọc phim từ Server
 */

// Cấu hình URL mặc định kết nối đến Backend Node.js
const API_BASE_URL = "http://localhost:5000/api/movies";

/**
 * 1. Gọi API lấy danh sách các tùy chọn bộ lọc động từ MongoDB (Quốc gia, Thể loại, Năm)
 * @returns {Promise<{genres: Array, countries: Array, years: Array}>}
 */
async function getFilterOptions() {
    try {
        const response = await fetch(`${API_BASE_URL}/filter-options`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const resData = await response.json();

        if (resData.success) {
            return resData.data; // Trả về object: { genres: [...], countries: [...], years: [...] }
        }

        return { genres: [], countries: [], years: [] };
    } catch (error) {
        console.error("❌ Lỗi khi tải danh sách tùy chọn bộ lọc:", error);
        return { genres: [], countries: [], years: [] };
    }
}
/** * 2. Gọi API thực hiện truy vấn lọc phim dựa trên các thuộc tính được truyền vào
 * @param {Object} filterParams - Chứa các điều kiện { country, genre, year, type, order }
 * @returns {Promise<Array>} Danh sách phim thỏa mãn điều kiện
 */
async function fetchFilteredMovies(filterParams = {}) {
    try {
        const params = new URLSearchParams();
        // Đẩy các thuộc tính hợp lệ vào URLSearchParams
        if (filterParams.country) params.append("country", filterParams.country);
        if (filterParams.genre) params.append("genre", filterParams.genre);
        if (filterParams.year) params.append("year", filterParams.year);
        if (filterParams.type) params.append("type", filterParams.type);
        if (filterParams.order) params.append("order", filterParams.order);
        const response = await fetch(`${API_BASE_URL}/filter?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const resData = await response.json();
        if (resData.success) {
            return resData.data; // Trả về mảng danh sách phim
        }
        return [];
    } catch (error) {
        console.error("❌ Lỗi khi thực hiện lọc phim:", error);
        return [];
    }
}