/**
 * File: logic/search/searchPage.js
 */
document.addEventListener("DOMContentLoaded", async () => {
    const searchGrid = document.getElementById("search-movie-grid");
    const keywordDisplay = document.getElementById("keyword-display");
    const paginationContainer = document.getElementById("pagination-container");

    if (!searchGrid) return;

    // 1. Trích xuất toàn bộ tham số từ URL Params
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get("q") ? urlParams.get("q").trim() : "";
    const country = urlParams.get("country") || "";
    const year = urlParams.get("year") || "";
    const genre = urlParams.get("genre") || "";
    const type = urlParams.get("type") || "";
    const order = urlParams.get("order") || "desc";
    const currentPage = parseInt(urlParams.get("page")) || 1;
    const limit = 28;
    // 2. Cập nhật tiêu đề hiển thị
    if (keywordDisplay) {
        if (keyword) {
            keywordDisplay.textContent = `"${keyword}"`;
        } else if (country || year || genre || type) {
            keywordDisplay.textContent = "Kết quả bộ lọc";
        } else {
            keywordDisplay.textContent = "Tất cả phim";
        }
    }
    try {
        let movies = [];
        let totalPages = 1;
        // 3. Kiểm tra xem có sử dụng bộ lọc hay không
        const isFiltering = country || keyword === "" && (country || year || genre || type || urlParams.has("order"));
        if (isFiltering && !keyword) {
            // Gọi API lọc trực tiếp từ Backend có phân trang
            const queryParams = new URLSearchParams({ country, year, genre, type, order, page: currentPage, limit }).toString();
            const response = await fetch(`http://localhost:5000/api/movies/filter?${queryParams}`);
            const resData = await response.json();
            if (resData.success) {
                movies = resData.data;
                totalPages = resData.pagination ? resData.pagination.totalPages : 1;
            }
        } else {
            // Lấy tất cả phim và lọc theo từ khóa 'q' (nếu có)
            const allMovies = typeof getAllMovies === "function" ? await getAllMovies() : [];
            let filtered = allMovies.filter(movie => {
                const title = (movie.title || movie.name || "").toLowerCase();
                return title.includes(keyword.toLowerCase());
            });
            // Sắp xếp theo năm
            if (order === "asc") {
                filtered.sort((a, b) => (a.year || 0) - (b.year || 0));
            } else {
                filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
            }
            totalPages = Math.ceil(filtered.length / limit) || 1;
            movies = filtered.slice((currentPage - 1) * limit, currentPage * limit);
        }
        // 4. Render dữ liệu ra giao diện
        searchGrid.innerHTML = "";
        if (movies.length === 0) {
            searchGrid.innerHTML = `
                <div style="grid-column: 1 / -1; color: #9ca3af; font-size: 16px; margin-top: 20px; text-align: center;">
                    Không tìm thấy bộ phim nào phù hợp với yêu cầu!
                </div>`;
            if (paginationContainer) paginationContainer.innerHTML = "";
            return;
        }
        movies.forEach(movie => {
            if (typeof createMovieCard === "function") {
                searchGrid.appendChild(createMovieCard(movie));
            }
        });
        // 5. Render phân trang
        renderPagination(currentPage, totalPages);
    } catch (error) {
        console.error("Lỗi:", error);
        searchGrid.innerHTML = `<div style="color: white; text-align: center;">Đã xảy ra lỗi khi tải dữ liệu!</div>`;
    }
    // Hàm Tạo Thanh Phân Trang
    function renderPagination(page, total) {
        if (!paginationContainer || total <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = "";
            return;
        }
        let html = "";
        // Nút Prev
        html += `<button class="page-btn ${page === 1 ? 'disabled' : ''}" data-page="${page - 1}"><</button>`;
        let pages = [];
        if (total <= 6) {
            for (let i = 1; i <= total; i++) pages.push(i);
        } else {
            if (page <= 3) {
                pages = [1, 2, 3, 4, '...', total];
            } else if (page >= total - 2) {
                pages = [1, '...', total - 3, total - 2, total - 1, total];
            } else {
                pages = [1, '...', page - 1, page, page + 1, '...', total];
            }
        }
        pages.forEach(p => {
            if (p === '...') {
                html += `<span class="page-dots">...</span>`;
            } else {
                html += `<button class="page-btn ${p === page ? 'active' : ''}" data-page="${p}">${p}</button>`;
            }
        });
        // Nút Next
        html += `<button class="page-btn ${page === total ? 'disabled' : ''}" data-page="${page + 1}">></button>`;
        paginationContainer.innerHTML = html;
        // Bắt sự kiện chuyển trang
        paginationContainer.querySelectorAll(".page-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const selectedPage = parseInt(e.target.getAttribute("data-page"));
                if (selectedPage && selectedPage >= 1 && selectedPage <= total && selectedPage !== page) {
                    urlParams.set("page", selectedPage);
                    window.location.search = urlParams.toString();
                }
            });
        });
    }
});