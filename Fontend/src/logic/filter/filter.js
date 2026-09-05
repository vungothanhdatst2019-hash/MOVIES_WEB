/**
 * File: logic/filter/filter.js
 */

let filterState = {
    country: "",
    year: "",
    order: "desc",
    type: "",
    genre: ""
};

// Hàm đổ dữ liệu từ MongoDB vào giao diện HTML
async function loadAndRenderFilterOptions() {
    if (typeof getFilterOptions !== 'function') {
        console.error("❌ Không tìm thấy hàm getFilterOptions! Kiểm tra lại file filterInformation.js");
        return;
    }

    const data = await getFilterOptions();
    if (!data) return;

    // 1. Render Danh sách Quốc gia
    const countryContainer = document.getElementById("filter-country");
    if (countryContainer && Array.isArray(data.countries) && data.countries.length > 0) {
        let html = `<span class="filter-option active" data-value="">Tất cả</span>`;
        data.countries.forEach(country => {
            html += `<span class="filter-option" data-value="${country}">${country}</span>`;
        });
        countryContainer.innerHTML = html;
    }

    // 2. Render Danh sách Năm
    const yearContainer = document.getElementById("filter-year");
    if (yearContainer && Array.isArray(data.years) && data.years.length > 0) {
        let html = `<span class="filter-option active" data-value="">Tất cả</span>`;
        data.years.forEach(year => {
            html += `<span class="filter-option" data-value="${year}">${year}</span>`;
        });
        yearContainer.innerHTML = html;
    }

    // 3. Render Danh sách Thể loại
    const genreContainer = document.getElementById("filter-genre");
    if (genreContainer && Array.isArray(data.genres) && data.genres.length > 0) {
        let html = `<span class="filter-option active" data-value="">Tất cả</span>`;
        data.genres.forEach(genre => {
            html += `<span class="filter-option" data-value="${genre}">${genre}</span>`;
        });
        genreContainer.innerHTML = html;
    }
}

// Reset bộ lọc
function resetFilters() {
    filterState = { country: "", year: "", order: "desc", type: "", genre: "" };
    document.querySelectorAll(".filter-options").forEach(container => {
        const options = container.querySelectorAll(".filter-option");
        options.forEach(opt => opt.classList.remove("active"));
        if (options[0]) options[0].classList.add("active");
    });
}

// Sự kiện
document.addEventListener("DOMContentLoaded", () => {
    // Tải dữ liệu bộ lọc ngay khi vào trang
    loadAndRenderFilterOptions();

    const filterBtn = document.getElementById("filter-button");
    const filterModal = document.getElementById("filter-modal");
    const closeModalBtn = document.getElementById("close-filter-modal");
    const btnReset = document.getElementById("btn-reset-filter");
    const btnApply = document.getElementById("btn-apply-filter");

    if (filterBtn && filterModal) {
        filterBtn.addEventListener("click", () => {
            filterModal.style.display = "block";
            loadAndRenderFilterOptions(); // Gọi lại để đảm bảo cập nhật đủ
        });
    }

    if (closeModalBtn && filterModal) {
        closeModalBtn.addEventListener("click", () => filterModal.style.display = "none");
    }

    window.addEventListener("click", (e) => {
        if (e.target === filterModal) filterModal.style.display = "none";
    });

    // Chọn tùy chọn lọc
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("filter-option")) {
            const container = e.target.closest(".filter-options");
            if (!container) return;

            container.querySelectorAll(".filter-option").forEach(opt => opt.classList.remove("active"));
            e.target.classList.add("active");

            const filterType = container.id.replace("filter-", "");
            if (filterState.hasOwnProperty(filterType)) {
                filterState[filterType] = e.target.getAttribute("data-value") || "";
            }
        }
    });

    if (btnReset) btnReset.addEventListener("click", resetFilters);

    if (btnApply) {
        btnApply.addEventListener("click", () => {
            if (filterModal) filterModal.style.display = "none";
            const params = new URLSearchParams();
            Object.keys(filterState).forEach(key => {
                if (filterState[key]) params.set(key, filterState[key]);
            });
            window.location.search = params.toString();
        });
    }
});