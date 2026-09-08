/**
 * File: js/logic/bannerSlide.js
 * Chức năng: Tự động chuyển Banner sau 4s và reset đếm giờ khi người dùng click
 */
(function () {
    let slideInterval = null;
    const INTERVAL_TIME = 3000; 
    window.startBannerAutoSlide = function (featuredMovies) {
        if (!featuredMovies || featuredMovies.length <= 1) return;
        let currentIndex = 0;
        // 1. Hàm chuyển slide tiếp theo
        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % featuredMovies.length;
            const thumbs = document.querySelectorAll(".thumb-item");
            if (thumbs && thumbs[currentIndex]) {
                thumbs[currentIndex].click();
            }
        };
        // 2. Hàm khởi tạo / Reset bộ đếm 4s
        const resetTimer = () => {
            if (slideInterval) clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, INTERVAL_TIME);
        };
        // Bắt đầu chạy slide lần đầu
        resetTimer();
        // 3. Lắng nghe sự kiện click thủ công vào từng MovieCard thumbnail
        const thumbs = document.querySelectorAll(".thumb-item");
        thumbs.forEach((thumb, index) => {
            thumb.addEventListener("click", () => {
                currentIndex = index; // Cập nhật lại vị trí phim hiện tại
                resetTimer();         // Reset lại đủ 4s cho phim vừa chọn
            });
        });
        // 4. Tạm dừng khi rê chuột vào Banner và tiếp tục khi di chuột ra ngoài
        const bannerElement = document.getElementById("hero-banner");
        if (bannerElement) {
            bannerElement.addEventListener("mouseenter", () => {
                if (slideInterval) clearInterval(slideInterval);
            });
            bannerElement.addEventListener("mouseleave", () => {
                resetTimer();
            });
        }
    };
})();