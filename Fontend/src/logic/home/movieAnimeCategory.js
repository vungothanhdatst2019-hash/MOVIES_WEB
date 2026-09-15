let globalAnimeList = [];
// Chuẩn hóa chuỗi: viết thường + bỏ dấu tiếng Việt, để so khớp thể loại chính xác hơn
function normalizeAnimeText(str) {
    if (!str) return "";
    return str
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}
function renderAnimeMovies(movies) {
    const container = document.getElementById("anime-movie-list");
    if (!container) return;
    container.innerHTML = "";
    if (!movies || movies.length === 0) {
        container.innerHTML = `<p style="color:#94a3b8;">Chưa có dữ liệu phim hoạt hình!</p>`;
        return;
    }
    const displayMovies = movies.slice(0, 7);
    const fragment = document.createDocumentFragment();
    displayMovies.forEach(movie => {
        const card = document.createElement("div");
        card.className = "movie-card";
        card.onclick = () => {
            window.location.href = `introduce.html?id=${movie.movieId || movie._id}`;
        };
        const quality = movie.quality || "HD";
        const year = movie.year || "";
        const category = Array.isArray(movie.genres)
            ? movie.genres.join(", ")
            : (movie.category || movie.genre || "");
        const bgImg = movie.backgroundUrl || movie.posterUrl || movie.poster || movie.thumbnail || 'https://via.placeholder.com/300x400?text=No+Image';
        card.style.backgroundImage = `url('${bgImg}')`;
        // Cấu trúc giống hệt phim bộ/phim chiếu rạp: badge góc trên, năm góc trên phải, tiêu đề trong overlay góc dưới trái
        card.innerHTML = `
            <div class="card-badges">
                <span class="badge-episode">${quality}</span>
            </div>
            ${year ? `<span class="card-year">${year}</span>` : ''}
            <div class="card-info-overlay">
                <p class="card-title-main">${movie.title}</p>
                ${category ? `<p class="card-title-sub">${category}</p>` : ''}
            </div>
        `;
        fragment.appendChild(card);
    });
    container.appendChild(fragment);
}
function setupAnimeTabs() {
    const tabs = document.querySelectorAll(".anime-section .tab-btn");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            const filterValue = tab.getAttribute("data-filter");
            if (!filterValue || filterValue === "all") {
                renderAnimeMovies(globalAnimeList);
            } else {
                const normalizedFilter = normalizeAnimeText(filterValue);
                const filtered = globalAnimeList.filter(movie => {
                    const genres = Array.isArray(movie.genres)
                        ? movie.genres
                        : [movie.genre || movie.category || ""];
                    return genres.some(g => normalizeAnimeText(g).includes(normalizedFilter));
                });
                if (filtered.length === 0) {
                    console.warn(
                        `Không tìm thấy phim hoạt hình nào khớp thể loại "${filterValue}". Kiểm tra dữ liệu genres thực tế của vài phim đầu:`,
                        globalAnimeList.slice(0, 3).map(m => ({ title: m.title, genres: m.genres, genre: m.genre, category: m.category }))
                    );
                }
                renderAnimeMovies(filtered);
            }
        });
    });
}
function initAnimeSection(allMovies) {
    if (!allMovies || allMovies.length === 0) return;
    // Cách 1: lọc theo field type/isAnime
    globalAnimeList = allMovies.filter(movie => movie.type === "anime");
    // Cách 2 (dự phòng): nếu không có phim nào khớp, thử lọc theo thể loại chứa "hoạt hình" / "anime"
    if (globalAnimeList.length === 0) {
        globalAnimeList = allMovies.filter(movie => {
            const genres = Array.isArray(movie.genres)
                ? movie.genres
                : [movie.genre || movie.category || ""];
            return genres.some(g => {
                const normalized = normalizeAnimeText(g);
                return normalized.includes("hoat hinh") || normalized.includes("anime");
            });
        });
    }
    if (globalAnimeList.length === 0) {
        console.warn(
            "Không tìm thấy phim hoạt hình nào. Kiểm tra dữ liệu thực tế của vài phim đầu tiên:",
            allMovies.slice(0, 5).map(m => ({ title: m.title, type: m.type, isAnime: m.isAnime, genres: m.genres, genre: m.genre, category: m.category }))
        );
    }
    globalAnimeList.sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
    renderAnimeMovies(globalAnimeList);
    setupAnimeTabs();
}