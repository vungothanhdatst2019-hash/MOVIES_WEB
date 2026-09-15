let globalSeriesList = [];

function renderFeaturedSeries(movies) {
    const container = document.getElementById("series-list");
    if (!container) return;
    
    container.innerHTML = "";
    if (!movies || movies.length === 0) {
        container.innerHTML = `<p style="color:#94a3b8;">Chưa có dữ liệu phim bộ!</p>`;
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
    // Lấy số tập hiện tại (chỉ lấy số, tránh bị lặp chữ "Tập")
    const currentEpNum = movie.currentEpisode || movie.currentEp || 1;
    const quality = movie.quality || "HD";
    const year = movie.year || "";
    const category = Array.isArray(movie.genres)
        ? movie.genres.join(", ")
        : (movie.category || movie.genre || "");
    const totalEp =
        movie.totalEpisodes ||
        movie.totalEp ||
        movie.episodeTotal ||
        movie.totalEpisode ||
        movie.maxEpisode ||
        movie.episodeCount ||
        (Array.isArray(movie.episodes) ? movie.episodes.length : "") ||
        "";
    if (!totalEp) {
        console.warn("Không tìm thấy tổng số tập cho phim:", movie.title, movie);
    }
    const epBadgeText = totalEp ? `Tập ${currentEpNum}/${totalEp}` : `Tập ${currentEpNum}`;
    const bgImg = movie.backgroundUrl || 'https://via.placeholder.com/300x400?text=No+Image';
    card.style.backgroundImage = `url('${bgImg}')`;

    // Cấu trúc đúng với CSS: badge ở góc trên (HD, số tập, năm), tiêu đề + thể loại nằm trong overlay ở góc dưới trái
    card.innerHTML = `
        <div class="card-badges">
            <span class="badge-episode">${quality}</span>
            <span class="badge-episode">${epBadgeText}</span>
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
function setupSeriesTabs() {
const tabs = document.querySelectorAll(".series-section .tab-btn");
tabs.forEach(tab => {
tab.addEventListener("click", () => {
tabs.forEach(t => t.classList.remove("active"));
tab.classList.add("active");
        const filterValue = tab.getAttribute("data-filter");
        if (!filterValue || filterValue === "all") {
            renderFeaturedSeries(globalSeriesList);
        } else if (filterValue === "full") {
            const fullSeries = globalSeriesList.filter(m => m.isFull === true);
            renderFeaturedSeries(fullSeries);
        } else {
            const filtered = globalSeriesList.filter(m => 
                m.country && m.country.toLowerCase().includes(filterValue.toLowerCase())
            );
            renderFeaturedSeries(filtered);
        }
    });
});
}
function initSeriesSection(allMovies) {
if (!allMovies || allMovies.length === 0) return;
globalSeriesList = allMovies.filter(movie => movie.type === "series" || movie.isSeries === true);
globalSeriesList.sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
renderFeaturedSeries(globalSeriesList);
setupSeriesTabs();
}