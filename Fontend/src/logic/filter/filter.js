/**
 * File: logic/filter/filter.js
 */
// 1. Khởi tạo đối tượng lưu trữ trạng thái bộ lọc
let filterState = {
    country: "",
    year: "",
    language: "",
    order: "desc",
    type: "",
    genre: ""
};

// 2. Hàm gọi API từ filterInformation.js và đổ dữ liệu vào HTML
async function loadAndRenderFilterOptions() {
    if (typeof getFilterOptions !== 'function') {
        console.error("❌ Chưa nạp file filterInformation.js hoặc không tìm thấy hàm getFilterOptions!");
        return;
    }

    const data = await getFilterOptions();
    if (!data) return;

    // --- Render Danh sách Quốc gia ---
    const countryContainer = document.getElementById("filter-country");
    if (countryContainer && Array.isArray(data.countries) && data.countries.length > 0) {
        let countryHTML = `<span class="filter-option active" data-value="">Tất cả</span>`;
        data.countries.forEach(country => {
            countryHTML += `<span class="filter-option" data-value="${country}">${country}</span>`;
        });
        countryContainer.innerHTML = countryHTML;
    }

    // --- Render Danh sách Năm ---
    const yearContainer = document.getElementById("filter-year");
    if (yearContainer && Array.isArray(data.years) && data.years.length > 0) {
        let yearHTML = `<span class="filter-option active" data-value="">Tất cả</span>`;
        data.years.forEach(year => {
            yearHTML += `<span class="filter-option" data-value="${year}">${year}</span>`;
        });
        yearContainer.innerHTML = yearHTML;
    }

    // --- Render Danh sách Thể loại ---
    const genreContainer = document.getElementById("filter-genre");
    if (genreContainer && Array.isArray(data.genres) && data.genres.length > 0) {
        let genreHTML = `<span class="filter-option active" data-value="">Tất cả</span>`;
        data.genres.forEach(genre => {
            genreHTML += `<span class="filter-option" data-value="${genre}">${genre}</span>`;
        });
        genreContainer.innerHTML = genreHTML;
    }
}

// 3. Hàm reset bộ lọc (Xóa bộ lọc)
function resetFilters() {
    filterState = {
        country: "",
        year: "",
        language: "",
        order: "desc",
        type: "",
        genre: ""
    };
    
    // Reset giao diện về nút "Tất cả"
    document.querySelectorAll(".filter-options").forEach(container => {
        const options = container.querySelectorAll(".filter-option");
        options.forEach(opt => opt.classList.remove("active"));
        if (options[0]) options[0].classList.add("active");
    });
}

// 4. Khởi tạo sự kiện giao diện
document.addEventListener("DOMContentLoaded", () => {
    // Tải và render dữ liệu từ MongoDB
    loadAndRenderFilterOptions();

    const filterBtn = document.getElementById("filter-button");
    const filterModal = document.getElementById("filter-modal");
    const closeModalBtn = document.getElementById("close-filter-modal");
    const btnReset = document.getElementById("btn-reset-filter");
    const btnApply = document.getElementById("btn-apply-filter");

    // Mở Modal khi bấm nút "Bộ lọc"
    if (filterBtn && filterModal) {
        filterBtn.addEventListener("click", () => {
            filterModal.style.display = "block";
        });
    }

    // Đóng Modal khi bấm nút "X"
    if (closeModalBtn && filterModal) {
        closeModalBtn.addEventListener("click", () => {
            filterModal.style.display = "none";
        });
    }

    // Đóng Modal khi bấm ra ngoài vùng nội dung
    window.addEventListener("click", (event) => {
        if (event.target === filterModal) {
            filterModal.style.display = "none";
        }
    });

    // Bắt sự kiện chọn nút option (Event Delegation hỗ trợ các nút sinh ra động)
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("filter-option")) {
            const container = e.target.closest(".filter-options");
            if (!container) return;

            // Đổi class active
            container.querySelectorAll(".filter-option").forEach(opt => opt.classList.remove("active"));
            e.target.classList.add("active");

            // Cập nhật giá trị vào filterState
            const filterType = container.id.replace("filter-", "");
            if (filterState.hasOwnProperty(filterType)) {
                filterState[filterType] = e.target.getAttribute("data-value") || "";
            }
        }
    });

    // Xử lý nút "Xóa bộ lọc"
    if (btnReset) {
        btnReset.addEventListener("click", resetFilters);
    }

    // Xử lý nút "Lọc kết quả"
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