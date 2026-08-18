document.addEventListener("DOMContentLoaded", async () => {
    // 1. Lấy ID từ URL (?id=...), nếu không có thì mặc định lấy "75219" để test
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("id") || "969681"; 

    const playerContainer = document.getElementById("player-container");

    try {
        // 2. Gọi API thông qua movieService.js
        const movie = await getMovieById(movieId);
        console.log("✅ Đã lấy dữ liệu phim thành công:", movie);

        // 3. Đổ thông tin phim ra giao diện HTML
        document.getElementById("movie-title").textContent = movie.title || "Chưa có tên phim";
        document.getElementById("movie-year").textContent = movie.year || "2026";
        document.getElementById("movie-category").textContent = movie.category || "Hành Động";
        document.getElementById("movie-description").textContent = movie.description || "Đang cập nhật nội dung...";

        // 4. Xử lý Trình phát Video
        const videoSrc = movie.videoUrl;

        if (!videoSrc) {
            playerContainer.innerHTML = `<div style="color:white; display:flex; justify-content:center; align-items:center; height:100%;">Bộ phim này hiện chưa có link video!</div>`;
            return;
        }

        // =========================================================
        // TRƯỜNG HỢP 1: File luồng HLS (.m3u8) -> Chạy Hls.js qua Proxy Backend
        // =========================================================
        if (videoSrc.includes(".m3u8")) {
            playerContainer.innerHTML = `<video id="video-player" controls autoplay style="width:100%; height:100%;"></video>`;
            const video = document.getElementById("video-player");

            // Bọc link .m3u8 gốc qua API Proxy Backend để "vượt rào" bảo vệ
            const proxyUrl = `http://localhost:5000/api/movies/proxy/stream?url=${encodeURIComponent(videoSrc)}`;

            if (window.Hls && Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(proxyUrl);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch(err => console.log("Trình duyệt chặn autoplay:", err));
                });
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                // Hỗ trợ riêng cho trình duyệt Safari (macOS / iOS)
                video.src = proxyUrl;
            } else {
                playerContainer.innerHTML = `<div style="color:white; display:flex; justify-content:center; align-items:center; height:100%;">Trình duyệt của bạn không hỗ trợ phát file .m3u8!</div>`;
            }
        } 
        // =========================================================
        // TRƯỜNG HỢP 2: Link nhúng (Iframe / Embed / Player)
        // =========================================================
        else if (videoSrc.includes("embed") || videoSrc.includes("iframe") || videoSrc.includes("player")) {
            playerContainer.innerHTML = `
                <iframe 
                    src="${videoSrc}" 
                    allowfullscreen 
                    allow="autoplay; encrypted-media" 
                    scrolling="no"
                    referrerpolicy="no-referrer">
                </iframe>`;
        } 
        // =========================================================
        // TRƯỜNG HỢP 3: File MP4 trực tiếp
        // =========================================================
        else {
            playerContainer.innerHTML = `
                <video controls autoplay style="width: 100%; height: 100%;">
                    <source src="${videoSrc}" type="video/mp4">
                    Trình duyệt của bạn không hỗ trợ phát video MP4.
                </video>`;
        }

    } catch (error) {
        console.error("❌ Lỗi khi tải phim:", error);
        document.getElementById("movie-title").textContent = "Không thể tải được bộ phim này!";
        document.getElementById("movie-description").textContent = "Vui lòng kiểm tra lại kết nối Server Node.js hoặc ID phim.";
    }
});