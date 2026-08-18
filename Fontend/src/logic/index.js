document.addEventListener("DOMContentLoaded", () => {
    const banner = document.querySelector(".banner");
    const imgs = document.querySelectorAll(".banner img");
    const prevBtn = document.getElementById("prev-button");
    const nextBtn = document.getElementById("next-button");

    if (!banner || imgs.length === 0) return;

    let currentIndex = 0;
    const totalImages = imgs.length;
    let autoSlideTimer;

    // Hàm cập nhật vị trí trượt banner
    function updateBanner() {
        banner.style.transform = `translateX(-${currentIndex * 106}%)`;
    }

    // Chuyển sang ảnh tiếp theo
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalImages;
        updateBanner();
    }

    // Quay lại ảnh trước
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateBanner();
    }

    // Bắt sự kiện bấm nút Next & Prev
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            nextSlide();
            resetAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            prevSlide();
            resetAutoSlide();
        });
    }

    // Bắt đầu tự động chuyển ảnh sau mỗi 3 giây
    function startAutoSlide() {
        autoSlideTimer = setInterval(nextSlide, 4000);
    }

    // Reset lại đếm giờ khi người dùng tự bấm nút
    function resetAutoSlide() {
        clearInterval(autoSlideTimer);
        startAutoSlide();
    }

    // Chạy auto slide lần đầu
    startAutoSlide();
});