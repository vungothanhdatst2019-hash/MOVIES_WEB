/**
 * Quản lý độc lập toàn bộ logic bộ lọc phim (Filter Manager)
 */
// 1. Khởi tạo đối tượng lưu trữ trạng thái bộ lọc
let filterState = {
    country: "",
    year: "",
    type: "",
    genre: "",
    order: "desc" // "desc": Giảm dần (Năm mới -> cũ), "asc": Tăng dần (Năm cũ -> mới)
};

/**
 * 2. Hàm nạp dữ liệu tùy chọn bộ lọc động từ Backend (MongoDB)
 */
async function loadAndRenderFilterOptions() {
    if (typeof getFilterOptions !== 'function') {
        console.error("❌ Chưa nhúng file filterInformation.js hoặc không tìm thấy hàm getFilterOptions!");
        return;
    }

    const data = await getFilterOptions();
    if (!data) return;

    // --- Render Danh sách Quốc gia ---
    const countryContainer = document.getElementById("filter-country");
    if (countryContainer && Array.isArray(data.countries) && data.countries.length > 0) {
        let html = `<span class="filter-option active" data-value="">Tất cả</span>`;
        data.countries.forEach(country => {
            html += `<span class="filter-option" data-value="${country}">${country}</span>`;
        });
        countryContainer.innerHTML = html;
    }

    // --- Render Danh sách Năm ---
    const yearContainer = document.getElementById("filter-year");
    if (yearContainer && Array.isArray(data.years) && data.years.length > 0) {
        let html = `<span class="filter-option active" data-value="">Tất cả</span>`;
        data.years.forEach(year => {
            html += `<span class="filter-option" data-value="${year}">${year}</span>`;
        });
        yearContainer.innerHTML = html;
    }

    // --- Render Danh sách Thể loại ---
    const genreContainer = document.getElementById("filter-genre");
    if (genreContainer && Array.isArray(data.genres) && data.genres.length > 0) {
        let html = `<span class="filter-option active" data-value="">Tất cả</span>`;
        data.genres.forEach(genre => {
            html += `<span class="filter-option" data-value="${genre}">${genre}</span>`;
        });
        genreContainer.innerHTML = html;
    }
}

/**
 * 3. Hàm Xóa / Reset bộ lọc về trạng thái mặc định
 */
function resetFilters() {
    filterState = {
        country: "",
        year: "",
        type: "",
        genre: "",
        order: "desc"
    };

    // Đưa tất cả các ô chọn về trạng thái active ban đầu (Mục "Tất cả" hoặc "Giảm dần")
    document.querySelectorAll(".filter-options").forEach(container => {
        const options = container.querySelectorAll(".filter-option");
        options.forEach(opt => opt.classList.remove("active"));
        if (options[0]) options[0].classList.add("active");
    });
}

/**
 * 4. Khởi tạo và đăng ký các sự kiện tương tác
 */
document.addEventListener("DOMContentLoaded", () => {
    // Nạp dữ liệu danh mục ngay khi giao diện sẵn sàng
    loadAndRenderFilterOptions();

    const filterBtn = document.getElementById("filter-button");
    const filterModal = document.getElementById("filter-modal");
    const closeModalBtn = document.getElementById("close-filter-modal");
    const btnReset = document.getElementById("btn-reset-filter");
    const btnApply = document.getElementById("btn-apply-filter");

    // Bật Modal bộ lọc
    if (filterBtn && filterModal) {
        filterBtn.addEventListener("click", () => {
            filterModal.style.display = "block";
            loadAndRenderFilterOptions(); // Gọi lại để đồng bộ dữ liệu mới nhất
        });
    }

    // Tắt Modal bộ lọc khi bấm dấu X
    if (closeModalBtn && filterModal) {
        closeModalBtn.addEventListener("click", () => {
            filterModal.style.display = "none";
        });
    }

    // Tắt Modal khi bấm ra vùng đen bên ngoài
    window.addEventListener("click", (e) => {
        if (e.target === filterModal) {
            filterModal.style.display = "none";
        }
    });

    // Bắt sự kiện chọn tùy chọn lọc (Dùng Event Delegation cho toàn bộ tùy chọn, bao gồm Thứ tự theo số năm)
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("filter-option")) {
            const container = e.target.closest(".filter-options");
            if (!container) return;

            // Bỏ active cũ, gán active cho nút mới bấm
            container.querySelectorAll(".filter-option").forEach(opt => opt.classList.remove("active"));
            e.target.classList.add("active");

            // Tách ID container để lấy tên tiêu chí (vd: filter-order -> order, filter-year -> year)
            const filterKey = container.id.replace("filter-", "");

            if (filterState.hasOwnProperty(filterKey)) {
                filterState[filterKey] = e.target.getAttribute("data-value") || "";
            }
        }
    });

    // Sự kiện nút "Xóa bộ lọc"
    if (btnReset) {
        btnReset.addEventListener("click", resetFilters);
    }

    // Sự kiện nút "Lọc kết quả"
    if (btnApply) {
        btnApply.addEventListener("click", () => {
            if (filterModal) filterModal.style.display = "none";

            const params = new URLSearchParams();

            // Đẩy tất cả tiêu chí có dữ liệu vào URL Query Parameters
            Object.keys(filterState).forEach(key => {
                if (filterState[key]) {
                    params.set(key, filterState[key]);
                }
            });

            // Thực hiện chuyển hướng trang để tải danh sách phim theo bộ lọc
            window.location.search = params.toString();
        });
    }
});