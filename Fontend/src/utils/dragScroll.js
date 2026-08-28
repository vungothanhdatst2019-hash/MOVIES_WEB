/**
 * File: js/utils/dragScroll.js
 * Chức năng: Nhấn giữ chuột trái và kéo để cuộn (Drag-to-Scroll)
 */

function enableDragScroll(target) {
    const container = typeof target === "string" ? document.querySelector(target) : target;
    if (!container) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragging = false; // Cờ phân biệt giữa KÉO CUỘN hay CLICK MỞ PHIM

    // 1. CHẶN hành vi kéo ảnh/link mặc định của trình duyệt (Tránh bị hiện bóng ảnh)
    container.addEventListener("dragstart", (e) => e.preventDefault());

    // 2. NHẤN GIỮ CHUỘT XUỐNG
    container.addEventListener("mousedown", (e) => {
        // Chỉ xử lý khi nhấn chuột trái (button = 0)
        if (e.button !== 0) return;

        isDown = true;
        isDragging = false; // Mặc định chưa kéo
        container.style.cursor = "grabbing";
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    // 3. THẢ CHUỘT HOẶC RỜI CHUỘT KHỎI KHUNG
    const stopDragging = () => {
        isDown = false;
        container.style.cursor = "grab";
    };

    container.addEventListener("mouseleave", stopDragging);
    container.addEventListener("mouseup", stopDragging);

    // 4. VỪA NHẤN GIỮ VỪA KÉO CHUỘT SANG NGAN
    container.addEventListener("mousemove", (e) => {
        if (!isDown) return;

        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1.8; // Hệ số tốc độ kéo

        // Nếu di chuyển chuột hơn 5px thì mới tính là đang KÉO CUỘN
        if (Math.abs(walk) > 5) {
            isDragging = true;
            e.preventDefault(); // Chặn bôi đen văn bản
            container.scrollLeft = scrollLeft - walk;
        }
    });

    // 5. CHẶN MỞ PHIM KHI ĐANG KÉO (Tránh thả chuột ra là bị chuyển trang watch.html)
    container.addEventListener("click", (e) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);
}