/**
 * File: logic/category/series.js
 * Quản lý nạp và hiển thị danh sách Phim Bộ
 */
let currentSeriesPage = 1;
const ITEMS_PER_PAGE = 28;
/**
 * Lấy danh sách phim bộ từ API và hiển thị
 */
async function loadSeriesMovies(page = 1) {
    const container = document.getElementById("movie-list");
    const paginationContainer = document.getElementById("pagination");
    if (!container) return;
    try {
        // 1. Gọi API lấy tất cả danh sách phim
        const allMovies = await getAllMovies();
        
        if (!allMovies || allMovies.length === 0) {
            container.innerHTML = `<p style="color: white; text-align: center;">Chưa có dữ liệu phim!</p>`;
            return;
        }
        // 2. Lọc chính xác các phim là Phim Bộ (type === "series")
        const seriesMovies = allMovies.filter(movie => 
            movie.type === "series" || movie.isSeries === true
        );
        if (seriesMovies.length === 0) {
            container.innerHTML = `<p style="color: white; text-align: center;">Không có phim bộ nào!</p>`;
            return;
        }
        // 3. Tính toán phân trang (28 phim/trang)
        const totalItems = seriesMovies.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        currentSeriesPage = Math.max(1, Math.min(page, totalPages));

        const startIndex = (currentSeriesPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const paginatedMovies = seriesMovies.slice(startIndex, endIndex);

        // 4. Render danh sách thẻ phim
        if (typeof renderMovieList === "function") {
            renderMovieList(paginatedMovies, container);
        } else {
            const fragment = document.createDocumentFragment();
            paginatedMovies.forEach(movie => {
                fragment.appendChild(createMovieCard(movie));
            });
            container.innerHTML = "";
            container.appendChild(fragment);
        }

        // 5. Render thanh phân trang nếu có
        if (paginationContainer && typeof renderPagination === "function") {
            renderPagination(totalPages, currentSeriesPage, (newPage) => {
                loadSeriesMovies(newPage);
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }

    } catch (error) {
        console.error("❌ Lỗi nạp danh sách Phim Bộ:", error);
        container.innerHTML = `<p style="color: white; text-align: center;">Lỗi tải dữ liệu. Vui lòng thử lại sau!</p>`;
    }
}
/**
 * Khởi chạy an toàn chống lỗi trễ khi F5
 */
function safeInitSeries() {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        loadSeriesMovies(1);
    } else {
        document.addEventListener("DOMContentLoaded", () => loadSeriesMovies(1));
    }
}
safeInitSeries();