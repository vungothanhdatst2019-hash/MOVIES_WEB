/**
 * File: js/logic/introducePerformer.js
 * Chức năng: Render danh sách diễn viên cho trang introduce.html
 */

function renderPerformers(performerList) {
    const castContainer = document.getElementById("cast-slider");
    if (!castContainer) return;

    castContainer.innerHTML = "";

    // Nếu không có dữ liệu diễn viên
    if (!performerList || performerList.length === 0) {
        castContainer.innerHTML = `<div style="color: #94a3b8; font-size: 14px;">Chưa cập nhật thông tin diễn viên.</div>`;
        return;
    }

    // Render danh sách từng diễn viên
    performerList.forEach(item => {
        const castItem = document.createElement("div");
        castItem.className = "cast-item";

        const avatar = item.imageUrl || "https://via.placeholder.com/100?text=Actor";
        const actorName = item.name || "Diễn viên";
        const characterName = item.cast ? `vai ${item.cast}` : "";

        castItem.innerHTML = `
            <div class="cast-avatar-wrapper">
                <img src="${avatar}" alt="${actorName}" loading="lazy">
            </div>
            <span class="cast-name">${actorName}</span>
            ${characterName ? `<span class="cast-role">${characterName}</span>` : ""}
        `;

        castContainer.appendChild(castItem);
    });

    // Gọi hàm kích hoạt hiệu ứng kéo từ file introducePerformerAnimations.js
    if (typeof setupPerformerDragScroll === "function") {
        setupPerformerDragScroll(castContainer);
    }
}