/**
 * File: js/logic/banner.js
 * Chức năng: Quản lý hiển thị và chuyển đổi phim trên Hero Banner (desktop + mobile)
 *
 * Cấu trúc:
 *   - Helper thuần (không đụng DOM): resolvePosterUrl, resolveBackgroundUrl, resolveMovieId,
 *     resolveDubSubInfo, resolveCategories
 *   - Banner Desktop: updateDesktopBackground, updateDesktopText, updateDesktopTags,
 *     updateDesktopActions, updateActiveThumbnail, renderThumbnails
 *   - Banner Mobile: createMobilePosterElement, renderMobilePosterCarousel, updateMobileText,
 *     createMobileBadge, updateMobileBadges, updateMobileActions
 *   - Điều phối: updateBanner (cập nhật 1 slide), renderHeroBanner (entry point)
 */

/* ============================================================
 * HELPER THUẦN
 * ============================================================ */

/** Lấy URL poster của phim, ưu tiên hàm getPosterUrl() toàn cục nếu tồn tại */
function resolvePosterUrl(movie) {
    if (typeof getPosterUrl === "function") return getPosterUrl(movie);
    return movie.posterUrl || movie.poster || "https://via.placeholder.com/300x450?text=No+Image";
}

/** Lấy URL background của phim (ưu tiên backgroundUrl -> posterUrl -> poster) */
function resolveBackgroundUrl(movie) {
    return movie.backgroundUrl || movie.posterUrl || movie.poster;
}

/** Lấy id phim, hỗ trợ cả 2 tên field movieId/_id */
function resolveMovieId(movie) {
    return movie.movieId || movie._id;
}

/** Lấy thông tin thuyết minh/vietsub hiển thị trên badge banner mobile */
function resolveDubSubInfo(movie) {
    return movie.dubSubInfo || movie.langInfo || movie.lang || movie.subLang || "";
}

/** Chuẩn hóa category của phim về dạng mảng, tối đa 3 phần tử */
function resolveCategories(movie) {
    const categories = Array.isArray(movie.category) ? movie.category : [movie.category || "Phim"];
    return categories.slice(0, 3);
}
/* ============================================================
 * BANNER DESKTOP
 * ============================================================ */

/** Cập nhật ảnh nền (lớp mờ + lớp chính) của banner desktop */
function updateDesktopBackground(movie) {
    const bgUrl = resolveBackgroundUrl(movie);
    const blurElement = document.getElementById("hero-banner-blur");
    const mainElement = document.getElementById("hero-banner-main");

    if (blurElement) blurElement.style.backgroundImage = `url('${bgUrl}')`;
    if (mainElement) mainElement.style.backgroundImage = `url('${bgUrl}')`;
}

/** Cập nhật tiêu đề, năm, mô tả của banner desktop */
function updateDesktopText(movie) {
    const titleEl = document.getElementById("banner-title");
    const yearEl = document.getElementById("banner-year");
    const descEl = document.getElementById("banner-description");

    if (titleEl) titleEl.textContent = movie.title || "Chưa có tên";
    if (yearEl) yearEl.textContent = movie.year || "2026";
    if (descEl) descEl.textContent = movie.description || movie.content || "Chưa có mô tả phim.";
}

/** Render danh sách tag thể loại của banner desktop */
function updateDesktopTags(movie) {
    const tagsContainer = document.getElementById("banner-tags");
    if (!tagsContainer) return;

    tagsContainer.innerHTML = "";
    resolveCategories(movie).forEach(cat => {
        const span = document.createElement("span");
        span.className = "tag-item";
        span.textContent = cat;
        tagsContainer.appendChild(span);
    });
}

/** Gán link cho nút "Xem ngay" / "Chi tiết" của banner desktop */
function updateDesktopActions(movie) {
    const movieId = resolveMovieId(movie);
    const playBtn = document.getElementById("banner-play-btn");
    const infoBtn = document.getElementById("banner-info-btn");

    if (playBtn) playBtn.href = `watch.html?id=${movieId}`;
    if (infoBtn) infoBtn.href = `introduce.html?id=${movieId}`;
}

/** Đánh dấu active cho thumbnail tương ứng với slide đang hiển thị */
function updateActiveThumbnail(index) {
    document.querySelectorAll(".thumb-item").forEach((thumb, idx) => {
        thumb.classList.toggle("active", idx === index);
    });
}

/** Render danh sách thumbnail góc dưới phải, gắn click để chuyển slide (chỉ chạy 1 lần) */
function renderThumbnails(movies, onSelect) {
    const thumbsContainer = document.getElementById("banner-thumbnails");
    if (!thumbsContainer) return;

    thumbsContainer.innerHTML = "";
    movies.forEach((movie, index) => {
        const img = document.createElement("img");
        img.src = resolvePosterUrl(movie);
        img.className = `thumb-item ${index === 0 ? "active" : ""}`;
        img.addEventListener("click", () => onSelect(index));
        thumbsContainer.appendChild(img);
    });
}


/* ============================================================
 * BANNER MOBILE
 * ============================================================ */

/** Tạo 1 thẻ <img> poster cho carousel mobile */
function createMobilePosterElement(movie, type) {
    const img = document.createElement("img");
    img.src = resolvePosterUrl(movie);
    img.alt = movie.title || "";
    img.className = type === "active"
        ? "mobile-poster-item mobile-poster-active"
        : `mobile-poster-item mobile-poster-side mobile-poster-${type}`;
    return img;
}

/** Render carousel 3 poster (trước - hiện tại - sau) cho banner mobile */
function renderMobilePosterCarousel(movies, index) {
    const carousel = document.getElementById("mobile-poster-carousel");
    if (!carousel) return;

    const total = movies.length;
    const posterOrder = [
        { movie: movies[(index - 1 + total) % total], type: "prev" },
        { movie: movies[index], type: "active" },
        { movie: movies[(index + 1) % total], type: "next" }
    ];

    carousel.innerHTML = "";
    posterOrder.forEach(({ movie, type }) => {
        carousel.appendChild(createMobilePosterElement(movie, type));
    });
}

/** Cập nhật tiêu đề, phụ đề, mô tả của banner mobile */
function updateMobileText(movie) {
    const titleEl = document.getElementById("mobile-banner-title");
    const subEl = document.getElementById("mobile-banner-subtitle");
    const descEl = document.getElementById("mobile-banner-description");

    if (titleEl) titleEl.textContent = movie.title || "Chưa có tên";
    if (subEl) subEl.textContent = movie.originalTitle || movie.engTitle || "";
    if (descEl) descEl.textContent = movie.description || movie.content || "Chưa có mô tả phim.";
}

/** Tạo 1 badge (span) cho banner mobile */
function createMobileBadge(text, extraClass = "") {
    const span = document.createElement("span");
    span.className = `m-badge ${extraClass}`.trim();
    span.textContent = text;
    return span;
}

/** Render các badge: chất lượng / năm / thuyết minh-vietsub của banner mobile */
function updateMobileBadges(movie) {
    const badgesEl = document.getElementById("mobile-banner-badges");
    if (!badgesEl) return;
    badgesEl.innerHTML = "";
    const year = movie.year || "";
    const dubSub = resolveDubSubInfo(movie);

    badgesEl.appendChild(createMobileBadge(movie.quality || "FHD", "m-badge-quality"));
    if (year) badgesEl.appendChild(createMobileBadge(year));
    if (dubSub) badgesEl.appendChild(createMobileBadge(dubSub));
}

/** Gán link cho nút "Xem phim" / "Thông tin" của banner mobile */
function updateMobileActions(movie) {
    const movieId = resolveMovieId(movie);
    const playBtn = document.getElementById("mobile-banner-play-btn");
    const infoBtn = document.getElementById("mobile-banner-info-btn");

    if (playBtn) playBtn.href = `watch.html?id=${movieId}`;
    if (infoBtn) infoBtn.href = `introduce.html?id=${movieId}`;
}


/* ============================================================
 * ĐIỀU PHỐI CHUNG
 * ============================================================ */

/** Cập nhật toàn bộ banner (desktop + mobile) cho 1 slide tại vị trí index */
function updateBanner(movies, index) {
    const movie = movies[index];

    // Desktop
    updateDesktopBackground(movie);
    updateDesktopText(movie);
    updateDesktopTags(movie);
    updateDesktopActions(movie);
    updateActiveThumbnail(index);

    // Mobile
    renderMobilePosterCarousel(movies, index);
    updateMobileText(movie);
    updateMobileBadges(movie);
    updateMobileActions(movie);
}

/**
 * Entry point: khởi tạo Hero Banner (desktop + mobile) từ danh sách phim nổi bật.
 * @param {Array} featuredMovies - Danh sách phim dùng cho banner (thường 6 phim mới nhất)
 */
function renderHeroBanner(featuredMovies) {
    if (!featuredMovies || featuredMovies.length === 0) return;

    const goToSlide = (index) => updateBanner(featuredMovies, index);

    renderThumbnails(featuredMovies, goToSlide);
    goToSlide(0);
}