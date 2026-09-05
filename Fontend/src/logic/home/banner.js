/**
 * File: js/logic/banner.js
 * Chức năng: Quản lý hiển thị và chuyển đổi phim trên Hero Banner
 */
function renderHeroBanner(featuredMovies) {
    if (!featuredMovies || featuredMovies.length === 0) return;
    let currentIndex = 0;
    const updateBanner = (index) => {
        const movie = featuredMovies[index];
        // 1. Cập nhật Background (Ưu tiên backgroundUrl, nếu không có dùng posterUrl)
        const bgUrl = movie.backgroundUrl || movie.posterUrl || movie.poster;
        const bannerElement = document.getElementById("hero-banner");
        if (bannerElement) {
            bannerElement.style.backgroundImage = `url('${bgUrl}')`;
        }
        // 2. Cập nhật thông tin chữ
        const title = movie.title || "Chưa có tên";
        const titleEl = document.getElementById("banner-title");
        const yearEl = document.getElementById("banner-year");
        const descEl = document.getElementById("banner-description");
        if (titleEl) titleEl.textContent = title;
        if (yearEl) yearEl.textContent = movie.year || "2026";
        if (descEl) descEl.textContent = movie.description || movie.content || "Chưa có mô tả phim.";
        // 3. Render các Tag Thể Loại
        const tagsContainer = document.getElementById("banner-tags");
        if (tagsContainer) {
            tagsContainer.innerHTML = "";
            const categories = Array.isArray(movie.category) ? movie.category : [movie.category || "Phim"];
            categories.slice(0, 3).forEach(cat => {
                const span = document.createElement("span");
                span.className = "tag-item";
                span.textContent = cat;
                tagsContainer.appendChild(span);
            });
        }
        // 4. Gán đường dẫn cho nút hành động
        const movieId = movie.movieId || movie._id;
        const playBtn = document.getElementById("banner-play-btn");
        const infoBtn = document.getElementById("banner-info-btn");

        if (playBtn) playBtn.href = `watch.html?id=${movieId}`;
        if (infoBtn) infoBtn.href = `introduce.html?id=${movieId}`;
        // 5. Active thumbnail tương ứng
        const thumbs = document.querySelectorAll(".thumb-item");
        thumbs.forEach((thumb, idx) => {
            if (idx === index) thumb.classList.add("active");
            else thumb.classList.remove("active");
        });
    };
    // Render danh sách ảnh nhỏ ở góc phải dưới
    const thumbsContainer = document.getElementById("banner-thumbnails");
    if (thumbsContainer) {
        thumbsContainer.innerHTML = "";

        featuredMovies.forEach((movie, index) => {
            const img = document.createElement("img");

            const posterSrc = typeof getPosterUrl === "function" 
            ? getPosterUrl(movie) 
            : (movie.posterUrl || movie.poster || "https://via.placeholder.com/200x300?text=Loi+Anh");

        img.src = posterSrc;
        img.className = `thumb-item ${index === 0 ? 'active' : ''}`;

        img.addEventListener("click", () => {
            currentIndex = index;
            updateBanner(currentIndex);
        });
            thumbsContainer.appendChild(img);
        });
    }
    updateBanner(0);
}
