let globalSingleList = [];

// Chuẩn hóa chuỗi: viết thường + bỏ dấu tiếng Việt, để so khớp thể loại chính xác hơn
function normalizeText(str) {
    if (!str) return "";
    return str
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function renderSingleMovies(movies) {
    const container = document.getElementById("single-movie-list");
    if (!container) return;

    container.innerHTML = "";
    if (!movies || movies.length === 0) {
        container.innerHTML = `<p style="color:#94a3b8;">Chưa có dữ liệu phim chiếu rạp!</p>`;
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

        // Cấu trúc giống hệt phim bộ: badge góc trên, tiêu đề trong overlay góc dưới trái
        card.innerHTML = `
            <div class="card-badges">
                <span class="badge-episode">${quality}</span>
                ${year ? `<span class="badge-sub">${year}</span>` : ''}
            </div>
            <div class="card-info-overlay">
                <p class="card-title-main">${movie.title}</p>
                ${category ? `<p class="card-title-sub">${category}</p>` : ''}
            </div>
        `;
        fragment.appendChild(card);
    });

    container.appendChild(fragment);
}

function setupSingleTabs() {
    const tabs = document.querySelectorAll(".single-section .tab-btn");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const filterValue = tab.getAttribute("data-filter");
            if (!filterValue || filterValue === "all") {
                renderSingleMovies(globalSingleList);
            } else {
                const normalizedFilter = normalizeText(filterValue);
                const filtered = globalSingleList.filter(movie => {
                    const genres = Array.isArray(movie.genres)
                        ? movie.genres
                        : [movie.genre || movie.category || ""];
                    return genres.some(g => normalizeText(g).includes(normalizedFilter));
                });

                if (filtered.length === 0) {
                    console.warn(
                        `Không tìm thấy phim nào khớp thể loại "${filterValue}". Kiểm tra dữ liệu genres thực tế của vài phim đầu:`,
                        globalSingleList.slice(0, 3).map(m => ({ title: m.title, genres: m.genres, genre: m.genre, category: m.category }))
                    );
                }

                renderSingleMovies(filtered);
            }
        });
    });
}

function initSingleSection(allMovies) {
    if (!allMovies || allMovies.length === 0) return;
    globalSingleList = allMovies.filter(movie => movie.type === "single" || movie.isSeries === false);
    globalSingleList.sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
    renderSingleMovies(globalSingleList);
    setupSingleTabs();
}