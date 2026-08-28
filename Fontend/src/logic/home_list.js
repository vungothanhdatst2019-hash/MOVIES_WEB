/**
 * Hiển thị danh sách tất cả các phim ra khung container
 */
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

    try {
        // 1. Gọi API lấy danh sách phim
        const movies = await getAllMovies();

        if (movies && movies.length > 0) {
            // 🌟 Khai báo biến bannerMovies đúng chuẩn
            const bannerMovies = movies.slice(0, 6);

            // 2. Render Banner
            if (typeof renderHeroBanner === "function") {
                renderHeroBanner(bannerMovies);
            }

            // 3. Khởi chạy hiệu ứng Auto Slide 4s
            if (typeof startBannerAutoSlide === "function") {
                startBannerAutoSlide(bannerMovies);
            }
        }

        // 4. Render danh sách Phim Mới Đề Cử bên dưới (12 phim)
        if (movieListContainer) {
            if (typeof enableDragScroll === "function") {
                enableDragScroll(movieListContainer);
            }
            renderMovieList(movies.slice(0, 12), movieListContainer);
        }   
    } catch (error) {
        console.error("❌ Lỗi nạp dữ liệu trang chủ:", error);
    }
}
document.addEventListener("DOMContentLoaded", initHomePage);