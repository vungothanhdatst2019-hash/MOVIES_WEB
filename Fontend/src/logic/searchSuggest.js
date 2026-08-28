document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.getElementById("search-box");
    const searchInput = document.getElementById("search-text");
    const searchIcon = document.getElementById("search-icon");
    const searchDropdown = document.getElementById("search-dropdown");

    if (!searchBox || !searchInput) return;
    // Ngăn chặn sự kiện submit mặc định của Form nếu có
    searchBox.addEventListener("submit", (e) => {
        e.preventDefault();
    });
    let allMovies = [];
    // Tải danh sách phim
    if (typeof getAllMovies === "function") {
        getAllMovies()
            .then(data => { allMovies = data || []; })
            .catch(err => console.error("Lỗi lấy phim:", err));
    }
    // 🌟 Hàm điều hướng chuẩn xác 100% không dính dấu #
    function navigateToMovie(movieId) {
        if (!movieId) return;
        const currentPath = window.location.pathname;
        // Nếu ĐANG Ô TRANG XEM PHIM -> Chuyển hướng lại trang watch với ID mới
        if (currentPath.endsWith("watch.html")) {
            window.location.assign(`watch.html?id=${movieId}`);
            return;
        }
        // Nếu ĐANG Ở TRANG KHÁC (Trang chủ...)
        if (currentPath.includes("/pages/")) {
            window.location.assign(`watch.html?id=${movieId}`);
        } else {
            window.location.assign(`pages/watch.html?id=${movieId}`);
        }
    }
    function redirectToSearchPage(keyword) {
        if (!keyword) return;
        const currentPath = window.location.pathname;
        const searchUrl = `pages/search.html?q=${encodeURIComponent(keyword)}`;
        if (currentPath.includes("/pages/")) {
            window.location.assign(`search.html?q=${encodeURIComponent(keyword)}`);
        } else {
            window.location.assign(`pages/search.html?q=${encodedKeyword}`);
        }
    }
    // 1. Click nút Kính lúp
    if (searchIcon) {
        searchIcon.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const keyword = searchInput.value.trim();
            if (!searchBox.classList.contains("active")) {
                searchBox.classList.add("active");
                searchInput.focus();
            } else if (!keyword) {
                searchBox.classList.remove("active");
                if (searchDropdown) searchDropdown.style.display = "none";
            } else {
               redirectToSearchPage(keyword);
            }
        });
    }
    // 2. Focus ô nhập
    searchInput.addEventListener("focus", (e) => {
        e.stopPropagation();
        searchBox.classList.add("active");
    });
    // 3. Xử lý gõ phím & Bấm Enter
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Chặn dấu ? và # sinh ra từ Form
            e.stopPropagation();
            
            const keyword = searchInput.value.trim().toLowerCase();
            if (keyword) {
                redirectToSearchPage(keyword);
            }
        }
    });
    searchInput.addEventListener("input", (e) => {
        e.stopPropagation();
        const keyword = e.target.value.trim().toLowerCase();
        if (!keyword) {
            searchDropdown.style.display = "none";
            return;
        }
            const matchedMovies = allMovies.filter(movie => {
            const title = (movie.title || movie.name || "").toLowerCase();
            return title.includes(keyword);
        });
        renderDropdown(matchedMovies.slice(0, 5));
    });
    // 4. Render danh sách gợi ý
    function renderDropdown(movies) {
        searchDropdown.innerHTML = "";
        if (movies.length === 0) {
            searchDropdown.innerHTML = `<div style="padding: 10px; color: #9ca3af; text-align: center; font-size: 13px;">Không tìm thấy phim</div>`;
            searchDropdown.style.display = "block";
            return;
        }
        movies.forEach(movie => {
            const movieId = movie.movieId || movie._id || movie.id;
            const posterSrc = movie.posterUrl || movie.poster || "https://via.placeholder.com/40x55";
            const item = document.createElement("div"); // Dùng div thay cho a để tuyệt đối không bị dính link #
            item.className = "search-item";
            item.style.cursor = "pointer";
            item.innerHTML = `
                <img src="${posterSrc}" alt="Poster">
                <div class="search-item-info">
                    <span class="search-item-title">${movie.title || movie.name}</span>
                    <span class="search-item-year">${movie.year || '2026'}</span>
                </div>
            `;       
            item.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                navigateToMovie(movieId);
            });
            searchDropdown.appendChild(item);
        });

        searchDropdown.style.display = "block";
    }
    // 5. Đóng khi click ra ngoài
    document.addEventListener("click", (e) => {
        if (e.isTrusted && !searchBox.contains(e.target)) {
            searchBox.classList.remove("active");
            searchDropdown.style.display = "none";
        }
    });
});