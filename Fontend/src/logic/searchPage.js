document.addEventListener("DOMContentLoaded", async () => {
    const searchGrid = document.getElementById("search-movie-grid");
    const keywordDisplay = document.getElementById("keyword-display");
    
    if (!searchGrid) return;

    // Lấy từ khóa 'q' từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get("q") ? urlParams.get("q").trim() : "";

    if (keywordDisplay) {
        keywordDisplay.textContent = keyword || "Tất cả";
    }

    try {
        // Lấy danh sách toàn bộ phim từ API/service
        const allMovies = typeof getAllMovies === "function" ? await getAllMovies() : [];

        // Lọc danh sách phim theo từ khóa
        const results = allMovies.filter(movie => {
            const title = (movie.title || movie.name || "").toLowerCase();
            return title.includes(keyword.toLowerCase());
        });

        searchGrid.innerHTML = "";

        if (results.length === 0) {
            searchGrid.innerHTML = `
                <div style="grid-column: 1 / -1; color: #9ca3af; font-size: 16px; margin-top: 20px;">
                    Không tìm thấy phim nào phù hợp với từ khóa "${keyword}".
                </div>`;
            return;
        }

        // Render từng thẻ phim sử dụng hàm createMovieCard có sẵn
        results.forEach(movie => {
            if (typeof createMovieCard === "function") {
                const card = createMovieCard(movie);
                searchGrid.appendChild(card);
            }
        });

    } catch (error) {
        console.error("Lỗi khi tải danh sách tìm kiếm:", error);
        searchGrid.innerHTML = `<div style="color: white;">Đã xảy ra lỗi khi tải dữ liệu!</div>`;
    }
});