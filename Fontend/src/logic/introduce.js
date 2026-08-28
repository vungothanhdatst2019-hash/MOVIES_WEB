/**
 * File: js/logic/introduce.js
 * Chức năng: Đổ dữ liệu phim và backgroundUrl cho trang introduce.html
 */
async function initIntroducePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("id") || "1";

    try {
        const movie = await getMovieById(movieId);
        if (!movie) return;

        // 1. Xử lý Ảnh Banner Background (Ưu tiên backgroundUrl từ MongoDB)
        const bannerUrl = movie.backgroundUrl;
        document.getElementById("banner-wrapper").style.backgroundImage = `url('${bannerUrl}')`;

        // 2. Xử lý Ảnh Poster
        const posterUrl = getPosterUrl(movie); // Dùng hàm từ formatters.js
        document.getElementById("movie-poster").src = posterUrl;

        // 3. Đổ thông tin chữ
        const title = movie.title || "Chưa có tên";
        const cat = parseCategories(movie.category); // Dùng hàm từ formatters.js

        document.getElementById("movie-title").textContent = title;
        document.getElementById("movie-original-title").textContent = movie.originalTitle || movie.name || title;
        document.getElementById("movie-category").textContent = cat;
        document.getElementById("breadcrumb-title").textContent = title;

        // 4. Cập nhật Link nút Xem phim
        const watchUrl = `watch.html?id=${movie.movieId || movie._id}`;
        document.getElementById("watch-now-btn").href = watchUrl;
        document.getElementById("play-btn-banner").href = watchUrl;

        // 5. Highlight Link
        const highlightLink = document.getElementById("highlight-link");
        highlightLink.textContent = `${title}`;
        highlightLink.href = watchUrl;

        document.getElementById("movie-description").textContent = 
        movie.description || movie.content || "Nội dung phim đang được cập nhật...";

    } catch (error) {
        console.error("❌ Lỗi nạp dữ liệu trang introduce:", error);
    }
}

document.addEventListener("DOMContentLoaded", initIntroducePage);