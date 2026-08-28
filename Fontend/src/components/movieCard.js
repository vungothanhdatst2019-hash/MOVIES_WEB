/**
 * Tạo thẻ HTML đại diện cho 1 bộ phim
 */
function createMovieCard(movie) {
    const id = movie.movieId || movie._id;
    const categories = parseCategories(movie.category || movie.categories || movie.genres);
    const posterSrc = getPosterUrl(movie);

    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `
        <a href="watch.html?id=${id}" class="movie-link">
        <a href="introduce.html?id=${id}" class="movie-link">
            <div class="poster-wrapper">
                <img 
                    src="${posterSrc}" 
                    alt="${movie.title}" 
                    class="movie-poster"
                    onerror="this.onerror=null; this.src='https://via.placeholder.com/200x300?text=Loi+Anh';"
                />
                <span class="movie-year">${movie.year || '2026'}</span>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-category">${categories}</p>
            </div>
        </a>
    `;

    return movieCard;
}