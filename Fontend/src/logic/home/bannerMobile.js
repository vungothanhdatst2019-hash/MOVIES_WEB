function renderHeroBanner(featuredMovies) {
    if (!featuredMovies || featuredMovies.length === 0) return;
    let currentIndex = 0;
    let autoPlayTimer = null;

    const resolvePoster = (m) => (typeof getPosterUrl === "function"
        ? getPosterUrl(m)
        : (m.posterUrl || m.poster || "https://via.placeholder.com/300x450?text=No+Image"));

    const resolveBackground = (m) => {
        return m.backgroundUrl || m.backdrop || m.banner || m.posterUrl || m.poster || "";
    };

    const updateBanner = (index) => {
        // NẾU MENU HOẶC TÌM KIẾM ĐANG MỞ THÌ BỎ QUA VIỆC TỰ ĐỘNG CHUYỂN BANNER
        if (window.isMobileNavOpen) return;

        const total = featuredMovies.length;
        currentIndex = (index + total) % total;
        
        const movie = featuredMovies[currentIndex];
        if (!movie) return;

        const movieId = movie.movieId || movie._id;
        const bgUrl = resolveBackground(movie);

        const titleEl = document.getElementById("banner-title");
        const yearEl = document.getElementById("banner-year");
        const descEl = document.getElementById("banner-description");
        if (titleEl) titleEl.textContent = movie.title || "Chưa có tên";
        if (yearEl) yearEl.textContent = movie.year || "2026";
        if (descEl) descEl.textContent = movie.description || movie.content || "Chưa có mô tả phim.";

        const playBtn = document.getElementById("banner-play-btn");
        const infoBtn = document.getElementById("banner-info-btn");
        if (playBtn) playBtn.href = `watch.html?id=${movieId}`;
        if (infoBtn) infoBtn.href = `introduce.html?id=${movieId}`;

        if (window.innerWidth <= 767) {
            setupMobileUI(featuredMovies, currentIndex, movie);
        } else {
            setupDesktopUI(bgUrl, currentIndex);
        }
    };

    const setupDesktopUI = (bgUrl, index) => {
        const carousel = document.getElementById("mobile-poster-carousel");
        if (carousel) carousel.style.display = "none";

        const subTitle = document.getElementById("mobile-banner-subtitle");
        if (subTitle) subTitle.style.display = "none";

        const blurElement = document.getElementById("hero-banner-blur");
        const mainElement = document.getElementById("hero-banner-main");

        if (blurElement) {
            blurElement.style.backgroundImage = `url('${bgUrl}')`;
            blurElement.style.display = "block";
        }
        if (mainElement) {
            mainElement.style.backgroundImage = `url('${bgUrl}')`;
            mainElement.style.display = "block";
        }

        const thumbs = document.querySelectorAll(".banner-thumbnails .thumb-item");
        thumbs.forEach((t, idx) => {
            if (idx === index) t.classList.add("active");
            else t.classList.remove("active");
        });
    };

    const setupMobileUI = (movies, index, movie) => {
        const heroBanner = document.getElementById("hero-banner");
        if (!heroBanner) return;

        let carousel = document.getElementById("mobile-poster-carousel");
        if (!carousel) {
            carousel = document.createElement("div");
            carousel.id = "mobile-poster-carousel";
            carousel.className = "mobile-poster-carousel";
            heroBanner.insertBefore(carousel, heroBanner.firstChild);

            ["click", "touchstart", "touchend"].forEach(eventType => {
                carousel.addEventListener(eventType, (e) => {
                    e.stopPropagation();
                });
            });

            const types = ["prev", "active", "next"];
            types.forEach(type => {
                const img = document.createElement("img");
                img.id = `mobile-poster-img-${type}`;
                img.className = `mobile-poster-item ${type === 'active' ? 'mobile-poster-active' : 'mobile-poster-side mobile-poster-' + type}`;
                carousel.appendChild(img);
            });

            let startX = 0;
            carousel.addEventListener("touchstart", (e) => {
                startX = e.touches[0].clientX;
            }, { passive: true });

            carousel.addEventListener("touchend", (e) => {
                let endX = e.changedTouches[0].clientX;
                let diffX = startX - endX;
                if (Math.abs(diffX) > 40) {
                    if (diffX > 0) updateBanner(currentIndex + 1);
                    else updateBanner(currentIndex - 1);
                }
            }, { passive: true });
        } else {
            carousel.style.display = "flex";
        }

        const total = movies.length;
        const prevIndex = (index - 1 + total) % total;
        const nextIndex = (index + 1) % total;

        const posterData = [
            { id: "mobile-poster-img-prev", targetIdx: prevIndex, movie: movies[prevIndex] },
            { id: "mobile-poster-img-active", targetIdx: index, movie: movies[index] },
            { id: "mobile-poster-img-next", targetIdx: nextIndex, movie: movies[nextIndex] }
        ];

        posterData.forEach(item => {
            const imgEl = document.getElementById(item.id);
            if (imgEl) {
                imgEl.src = resolvePoster(item.movie);
                imgEl.alt = item.movie.title || "";
                
                imgEl.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (item.targetIdx !== currentIndex) {
                        updateBanner(item.targetIdx);
                    }
                };
            }
        });

        let subTitleEl = document.getElementById("mobile-banner-subtitle");
        const titleEl = document.getElementById("banner-title");
        if (!subTitleEl && titleEl) {
            subTitleEl = document.createElement("p");
            subTitleEl.id = "mobile-banner-subtitle";
            subTitleEl.className = "mobile-banner-subtitle";
            titleEl.parentNode.insertBefore(subTitleEl, titleEl.nextSibling);
        }
        if (subTitleEl) {
            subTitleEl.style.display = "block";
            subTitleEl.textContent = movie.originalTitle || movie.engTitle || "";
        }

        const badgesContainer = document.querySelector(".banner-badges");
        if (badgesContainer) {
            const quality = movie.quality || "FHD";
            const year = movie.year || "2026";

            badgesContainer.innerHTML = `
                <span class="m-badge m-badge-quality">${quality}</span>
                <span class="m-badge">${year}</span>
            `;
        }
    };

    const thumbsContainer = document.getElementById("banner-thumbnails");
    if (thumbsContainer) {
        thumbsContainer.innerHTML = "";
        featuredMovies.forEach((m, idx) => {
            const img = document.createElement("img");
            img.src = resolvePoster(m);
            img.className = `thumb-item ${idx === 0 ? 'active' : ''}`;
            img.onclick = () => {
                updateBanner(idx);
            };
            thumbsContainer.appendChild(img);
        });
    }
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => {
        if (!window.isMobileNavOpen) { // Chỉ chuyển khi Menu/Search không mở
            updateBanner(currentIndex + 1);
        }
    }, 7000);

    window.addEventListener("resize", () => {
        updateBanner(currentIndex);
    });

    updateBanner(0);
}