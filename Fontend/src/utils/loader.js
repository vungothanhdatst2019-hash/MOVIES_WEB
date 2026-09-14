const Loader = {
    // Tự tạo hoặc lấy màn hình overlay
    getOverlay() {
        let overlay = document.getElementById("loading-screen");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "loading-screen";
            overlay.className = "loader-wrapper";
            overlay.innerHTML = `
`;
document.body.prepend(overlay);
}
return overlay;
},
// Hiển thị màn hình chờ
show() {
    const overlay = this.getOverlay();
    overlay.classList.remove("hidden");
},
// Ẩn màn hình chờ
hide() {
    const overlay = document.getElementById("loading-screen");
    if (overlay) {
        overlay.classList.add("hidden");
    }
}
};
// Tự động khởi tạo giao diện loader ngay khi script nạp
if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", () => Loader.getOverlay());
} else {
Loader.getOverlay();
}