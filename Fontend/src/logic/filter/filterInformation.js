/**
 * File: services/filterInformation.js
 */
const API_BASE_URL = "http://localhost:5000/api/movies";

async function getFilterOptions() {
    try {
        console.log("🔄 Đang tải dữ liệu tùy chọn bộ lọc...");
        const response = await fetch(`${API_BASE_URL}/filter-options`);
        
        if (!response.ok) {
            throw new Error(`Lỗi kết nối Server! Status: ${response.status}`);
        }

        const resData = await response.json();
        console.log("📦 Dữ liệu options nhận được:", resData);

        if (resData.success && resData.data) {
            return resData.data;
        }

        return { genres: [], countries: [], years: [] };
    } catch (error) {
        console.error("❌ Lỗi khi lấy tùy chọn bộ lọc:", error);
        return { genres: [], countries: [], years: [] };
    }
}