/**
 * File: logic/home/home_list.js
 * Hiển thị danh sách phim và khởi chạy trang chủ
 */

const MAX_LOADING_WAIT_MS = 6000; // Tối đa chờ ảnh banner, quá thời gian này vẫn tắt loading để không treo trang

// Hiển thị danh sách các phim ra khung container
function renderMovieList(movies, container) {
    if (!container) return;
    container.innerHTML = ""; // Xóa nội dung cũ
    if (!movies || movies.length === 0) {
        container.innerHTML = `<p style="color: white;">Chưa có bộ phim nào!</p>`;
        return;
    }
    const fragment = document.createDocumentFragment();
    movies.forEach(movie => {
        fragment.appendChild(createMovieCard(movie));
    });
    container.appendChild(fragment);
}

/** Tải trước 1 ảnh; luôn resolve (kể cả lỗi/timeout) để không làm kẹt màn hình loading */
function preloadImage(url, timeoutMs = MAX_LOADING_WAIT_MS) {
    return new Promise(resolve => {
        if (!url) return resolve();
        const img = new Image();
        const timer = setTimeout(resolve, timeoutMs);
        const done = () => { clearTimeout(timer); resolve(); };
        img.onload = done;
        img.onerror = done;
        img.src = url;
    });
}

/** Tải trước các ảnh quan trọng của banner (ảnh nền slide đầu + toàn bộ thumbnail) */
function preloadBannerImages(bannerMovies) {
    const urls = [];
    if (bannerMovies.length > 0 && typeof resolveBackgroundUrl === "function") {
        urls.push(resolveBackgroundUrl(bannerMovies[0]));
    }
    if (typeof resolvePosterUrl === "function") {
        bannerMovies.forEach(movie => urls.push(resolvePosterUrl(movie)));
    }
    return Promise.all(urls.map(url => preloadImage(url)));
}

/** Lấy 6 phim có năm mới nhất để làm banner */
function getBannerMovies(movies) {
    return [...movies]
        .sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0))
        .slice(0, 6);
}

/** Render banner + auto slide */
function initBanner(bannerMovies) {
    if (typeof renderHeroBanner === "function") renderHeroBanner(bannerMovies);
    if (typeof startBannerAutoSlide === "function") startBannerAutoSlide(bannerMovies);
}

/** Render "Phim mới đề cử" (11 phim) */
function initRecommendedList(movies) {
    const container = document.getElementById("movie-list");
    if (!container) return;
    if (typeof enableDragScroll === "function") enableDragScroll(container);
    renderMovieList(movies.slice(0, 11), container);
}

/** Khởi chạy các section bên dưới (phim bộ, chiếu rạp, hoạt hình, gợi ý) */
function initSections(movies) {
    if (typeof initSeriesSection === "function") initSeriesSection(movies);
    if (typeof initSingleSection === "function") initSingleSection(movies);
    if (typeof initAnimeSection === "function") initAnimeSection(movies);
    if (typeof initRecommendationSection === "function") initRecommendationSection(movies);
}

/** Tắt màn hình loading (chỉ gọi sau khi mọi thứ cần thiết đã sẵn sàng) */
function hideLoading() {
    if (typeof Loader !== "undefined") Loader.hide();
}

/**
 * Khởi chạy trang chủ Home
 * Thứ tự: gọi API 1 lần -> render toàn bộ -> chờ ảnh banner tải xong -> mới tắt loading
 */
async function initHomePage() {
    loadNavGenres(); // Nạp danh sách thể loại vào menu (chạy song song, không chặn loading)

    try {
        const movies = await getAllMovies();

        if (movies && movies.length > 0) {
            const bannerMovies = getBannerMovies(movies);

            initBanner(bannerMovies);
            initRecommendedList(movies);
            initSections(movies);

            // Chờ ảnh banner tải xong (hoặc hết thời gian tối đa) rồi mới tắt loading
            await preloadBannerImages(bannerMovies);
        }
    } catch (error) {
        console.error("❌ Lỗi nạp dữ liệu trang chủ:", error);
    } finally {
        hideLoading();
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
safeInitHome();