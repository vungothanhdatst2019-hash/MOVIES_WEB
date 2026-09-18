/**
 * Hiển thị phần "Có thể bạn cũng thích" theo layout poster giống Phim mới đề cử
 */
function renderRecommendationMovies(movies) {
    const container = document.getElementById("recommendation-list");
    if (!container) return;
    container.innerHTML = "";
    if (!movies || movies.length === 0) {
        container.innerHTML = `<p style="color:#94a3b8;">Chưa có gợi ý phim nào!</p>`;
        return;
    }
    const fragment = document.createDocumentFragment();
    movies.forEach(movie => {
        const card = document.createElement("div");
        card.className = "movie-card";
        const posterImg = movie.posterUrl || movie.poster || movie.thumbnail || 'https://via.placeholder.com/300x400?text=No+Image';
        const year = movie.year || "";
        const category = Array.isArray(movie.genres)
            ? movie.genres.join(", ")
            : (movie.category || movie.genre || "");

        // Cấu trúc giống hệt "Phim mới đề cử": poster dọc + thông tin bên dưới
        card.innerHTML = `
            <a href="introduce.html?id=${movie.movieId || movie._id}" class="movie-link">
                <div class="poster-wrapper">
                    <img src="${posterImg}" alt="${movie.title}" class="movie-poster" loading="lazy">
                    ${year ? `<span class="movie-year">${year}</span>` : ''}
                </div>
                <div class="movie-info">
                    <p class="movie-title">${movie.title}</p>
                    <p class="movie-category">${category}</p>
                </div>
            </a>
        `;
        fragment.appendChild(card);
    });
    container.appendChild(fragment);
}
function initRecommendationSection(allMovies) {
    if (!allMovies || allMovies.length === 0) return;
    // Sắp xếp theo năm mới nhất -> cũ nhất, lấy 12 phim đầu
    const sorted = [...allMovies].sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
    const recommended = sorted.slice(0, 7);
    renderRecommendationMovies(recommended);
}