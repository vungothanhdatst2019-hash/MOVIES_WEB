/**
 * File: js/logic/watch.js
 * Chức năng: Xử lý phát Video, Chọn Tập và Render Diễn viên cho trang xem phim
 */

/**
 * Hàm phát video linh hoạt (Xử lý Player Embed, HLS .m3u8 và MP4)
 */
function renderVideoPlayer(videoSrc, playerContainer) {
    if (!videoSrc) {
        playerContainer.innerHTML = `<div class="player-message">Bộ phim này hiện chưa có video!</div>`;
        return;
    }

    // Trường hợp 1: Link Player / Embed / Iframe
    if (videoSrc.includes("player.phimapi.com") || videoSrc.includes("embed") || videoSrc.includes("iframe") || videoSrc.includes("/player/")) {
        playerContainer.innerHTML = `
            <iframe 
                src="${videoSrc}" 
                allowfullscreen 
                allow="autoplay; encrypted-media; picture-in-picture" 
                style="width: 100%; height: 100%; border: none;"
                scrolling="no"
                referrerpolicy="no-referrer">
            </iframe>`;
    } 
    // Trường hợp 2: File luồng HLS (.m3u8)
    else if (videoSrc.includes(".m3u8")) {
        playerContainer.innerHTML = `<video id="video-player" controls autoplay style="width:100%; height:100%;"></video>`;
        const video = document.getElementById("video-player");
        const proxyUrl = `http://localhost:5000/api/movies/proxy/stream?url=${encodeURIComponent(videoSrc)}`;

        if (window.Hls && Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(proxyUrl);
            hls.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = proxyUrl;
        }
    } 
    // Trường hợp 3: File MP4
    else {
        playerContainer.innerHTML = `
            <video controls autoplay style="width: 100%; height: 100%;">
                <source src="${videoSrc}" type="video/mp4">
            </video>`;
    }
}

/**
 * Hiển thị các nút bấm chọn Tập Phim (Tập 1, Tập 2...)
 */
function renderEpisodeButtons(episodes, playerContainer, episodesContainer) {
    episodesContainer.innerHTML = "";

    episodes.forEach((ep, index) => {
        const btn = document.createElement("button");
        btn.textContent = ep.name || `Tập ${index + 1}`;
        btn.style.cssText = "padding: 8px 16px; background: #333; color: white; border: 1px solid #555; border-radius: 4px; cursor: pointer; transition: 0.2s;";

        btn.addEventListener("click", () => {
            // Reset tất cả các nút về màu xám ban đầu
            document.querySelectorAll("#episodes-container button").forEach(b => {
                b.style.background = "#333";
            });
            btn.style.background = "#e50914";
            
            // Phát video của tập đó
            renderVideoPlayer(ep.videoUrl, playerContainer);
        });

        episodesContainer.appendChild(btn);
    });

    // Mặc định phát ngay Tập 1
    if (episodes.length > 0) {
        renderVideoPlayer(episodes[0].videoUrl, playerContainer);
        if (episodesContainer.children[0]) {
            episodesContainer.children[0].style.background = "#e50914";
        }
    }   
}

/**
 * Hàm khởi tạo chính cho trang Watch
 */
async function initWatchPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("id");

    const playerContainer = document.getElementById("player-container");
    const episodesContainer = document.getElementById("episodes-container");

    // Kích hoạt tính năng kéo cuộn DỌC riêng cho danh sách tập phim (nếu có)
    if (episodesContainer && typeof enableVerticalDragScroll === "function") {
        enableVerticalDragScroll(episodesContainer);
    }

    try {
        const movie = await getMovieById(movieId);

        if (!movie) {
            document.getElementById("movie-title").textContent = "Không tìm thấy phim!";
            return;
        }

        // Đổ thông tin chi tiết phim
        document.getElementById("movie-title").textContent = movie.title || "Chưa có tên";
        document.getElementById("movie-year").textContent = movie.year || "2026";
        document.getElementById("movie-category").textContent = parseCategories(movie.category);
        document.getElementById("movie-description").textContent = movie.description || "Chưa có mô tả.";

        // Chuẩn hóa danh sách tập phim
        const episodes = movie.episodes && movie.episodes.length > 0 
            ? movie.episodes 
            : [{ name: "Tập Full", videoUrl: movie.videoUrl }];

        // Render nút chọn tập và phát phim
        renderEpisodeButtons(episodes, playerContainer, episodesContainer);

        // 🌟 HIỂN THỊ DANH SÁCH DIỄN VIÊN 🌟
        if (typeof renderPerformers === "function") {
            renderPerformers(movie.performer);
        }

    } catch (error) {
        console.error("❌ Lỗi trang xem phim:", error);
    }
}

window.addEventListener("popstate", () => {
    window.location.reload();
});
document.addEventListener("DOMContentLoaded", initWatchPage);