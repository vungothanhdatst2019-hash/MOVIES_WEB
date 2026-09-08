/**
 * File: logic/home/navGenre.js
 * Quản lý nạp và hiển thị danh sách Thể Loại lên Navigation Menu
 */
async function loadNavGenres() {
    const genreMenu = document.getElementById("nav-genre-list");
    if (!genreMenu) return;
    try {
        if (typeof getFilterOptions !== "function") {
            setTimeout(loadNavGenres, 200);
            return;
        }
        const response = await getFilterOptions();        
        let genres = [];
        if (response && response.data && Array.isArray(response.data.genres)) {
            genres = response.data.genres;
        } else if (response && Array.isArray(response.genres)) {
            genres = response.genres;
        }
        if (genres.length > 0) {
            let html = "";
            genres.forEach(genre => {
                html += `<li><a href="search.html?genre=${encodeURIComponent(genre)}">${genre}</a></li>`;
            });
            genreMenu.innerHTML = html;
        } else {
            genreMenu.innerHTML = `<li><a href="#">Không có dữ liệu</a></li>`;
        }
    } catch (error) {
        console.error("❌ Lỗi nạp menu thể loại:", error);
        genreMenu.innerHTML = `<li><a href="#">Lỗi tải thể loại</a></li>`;
    }
}
// Tự động chạy khi DOM sẵn sàng 
function safeInitNavGenres() {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        loadNavGenres();
    } else {
        document.addEventListener("DOMContentLoaded", loadNavGenres);
    }
}
safeInitNavGenres();