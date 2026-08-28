/**
 * Chức năng: Nhấn giữ chuột kéo cuộn DỌC cho danh sách tập phim (watch.html)
 */
function enableVerticalDragScroll(target) {
    const container = typeof target === "string" ? document.querySelector(target) : target;
    if (!container) return;

    let isDown = false;
    let startY;
    let scrollTop;
    let isDragging = false;

    // Chặn kéo ảnh/văn bản mặc định
    container.addEventListener("dragstart", (e) => e.preventDefault());

    // 1. Nhấn giữ chuột trái
    container.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return; // Chỉ nhận chuột trái

        isDown = true;
        isDragging = false;
        container.style.cursor = "grabbing";

        startY = e.pageY - container.offsetTop;
        scrollTop = container.scrollTop;
    });

    // 2. Thả chuột hoặc rời khỏi khung
    const stopDragging = () => {
        isDown = false;
        container.style.cursor = "grab";
    };

    container.addEventListener("mouseleave", stopDragging);
    container.addEventListener("mouseup", stopDragging);

    // 3. Di chuyển chuột theo chiều DỌC (Y-axis)
    container.addEventListener("mousemove", (e) => {
        if (!isDown) return;

        const y = e.pageY - container.offsetTop;
        const walk = (y - startY) * 1.8; // Tốc độ cuộn

        // Nếu di chuyển hơn 5px tính là hành động KÉO CUỘN
        if (Math.abs(walk) > 5) {
            isDragging = true;
            e.preventDefault();
            container.scrollTop = scrollTop - walk;
        }
    });

    // 4. Chặn chọn tập phim khi đang giữ chuột kéo cuộn
    container.addEventListener("click", (e) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);
}