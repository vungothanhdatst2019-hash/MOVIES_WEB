/**
 * File: js/logic/introducePerformerAnimations.js
 * Chức năng: Quản lý hiệu ứng kéo chuột (Drag to Scroll) cho danh sách diễn viên
 */

function setupPerformerDragScroll(container) {
    if (!container) return;

    let isMouseDown = false;
    let startX = 0;
    let scrollLeft = 0;

    // Chặn sự kiện kéo ảnh mặc định của trình duyệt trên toàn bộ container
    container.addEventListener("dragstart", (e) => e.preventDefault());

    // 1. Nhấn chuột xuống
    container.addEventListener("mousedown", (e) => {
        isMouseDown = true;
        startX = e.clientX;
        scrollLeft = container.scrollLeft;
        container.style.cursor = "grabbing";
    });

    // 2. Rời chuột khỏi vùng slider hoặc thả chuột ở bất kỳ đâu trên màn hình
    window.addEventListener("mouseup", () => {
        if (!isMouseDown) return;
        isMouseDown = false;
        if (container) container.style.cursor = "grab";
    });

    // 3. Di chuyển chuột để cuộn
    container.addEventListener("mousemove", (e) => {
        if (!isMouseDown) return;
        e.preventDefault();
        
        // Tính khoảng cách di chuyển
        const distanceX = e.clientX - startX;
        container.scrollLeft = scrollLeft - distanceX;
    });

    // 4. Hỗ trợ cuộn mượt bằng con lăn chuột (Wheel)
    container.addEventListener("wheel", (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            container.scrollLeft += e.deltaY;
        }
    }, { passive: false });
}