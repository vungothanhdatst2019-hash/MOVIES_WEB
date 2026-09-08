/**
 * File: logic/home/home_list.js
 * Hiển thị danh sách phim và khởi chạy trang chủ
 */
// Hiển thị danh sách các phim ra khung container
function renderMovieList(movies, container) {
    container.innerHTML = ""; // Xóa nội dung cũ
    if (!movies || movies.length === 0) {
        container.innerHTML = `<p style="color: white;">Chưa có bộ phim nào!</p>`;
        return;
    }
    const fragment = document.createDocumentFragment();
    movies.forEach(movie => {
        const cardElement = createMovieCard(movie);
        fragment.appendChild(cardElement);
    });
    container.appendChild(fragment);
}
/**
 * Khởi chạy trang chủ Home
 */
async function initHomePage() {
    const movieListContainer = document.getElementById("movie-list");
    loadNavGenres(); // Nạp danh sách thể loại vào menu
    try {
        // 1. Gọi API lấy danh sách tất cả phim
        const movies = await getAllMovies();
        if (movies && movies.length > 0) {
            // 🌟 Sắp xếp danh sách phim theo năm phát hành giảm dần (Mới nhất -> Cũ nhất)
            const sortedMovies = [...movies].sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
            // 🌟 Lấy đúng 6 phim có năm mới nhất
            const bannerMovies = sortedMovies.slice(0, 6);
            // 2. Render Banner với 6 phim mới nhất
            if (typeof renderHeroBanner === "function") {
                renderHeroBanner(bannerMovies);
            }
            // 3. Khởi chạy hiệu ứng Auto Slide
            if (typeof startBannerAutoSlide === "function") {
                startBannerAutoSlide(bannerMovies);
            }
        }
        // 4. Render danh sách Phim Mới Đề Cử bên dưới (12 phim)
        if (movieListContainer) {
            if (typeof enableDragScroll === "function") {
                enableDragScroll(movieListContainer);
            }
            renderMovieList(movies.slice(0, 11), movieListContainer);
        }   
    } catch (error) {
        console.error("❌ Lỗi nạp dữ liệu trang chủ:", error);
    }
}
// Hàm khởi chạy an toàn cho Home List
function safeInitHome() {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        initHomePage();
    } else {
        document.addEventListener("DOMContentLoaded", initHomePage);
    }
}
// Chạy hàm kiểm tra
safeInitHome();