document.addEventListener("DOMContentLoaded", () => {
    const MOBILE_BREAKPOINT = 767;
 
    // ================= MENU HAMBURGER =================
    const menuToggle = document.getElementById("mobile-menu");
    const menuList = document.querySelector(".left-nav > ul.menu");
 
    if (menuToggle && menuList) {
        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            menuList.classList.toggle("mobile-menu-open");
            menuToggle.classList.toggle("active");
        });
 
        document.addEventListener("click", (e) => {
            if (window.innerWidth > MOBILE_BREAKPOINT) return;

            // KIỂM TRA BỔ SUNG: Nếu điểm click nằm trong Banner, KHÔNG đóng Menu
            const heroBanner = document.getElementById("hero-banner");
            if (heroBanner && heroBanner.contains(e.target)) return;

            if (!menuList.contains(e.target) && !menuToggle.contains(e.target)) {
                menuList.classList.remove("mobile-menu-open");
                menuToggle.classList.remove("active");
            }
        });
    }
 
    // ================= DROPDOWN "THỂ LOẠI" (MOBILE) =================
    const dropDownParent = document.querySelector(".left-nav .drop-down");
    const dropDownToggle = dropDownParent ? dropDownParent.querySelector(":scope > a") : null;
 
    if (dropDownParent && dropDownToggle) {
        dropDownToggle.addEventListener("click", (e) => {
            if (window.innerWidth > MOBILE_BREAKPOINT) return;
            e.preventDefault();
            e.stopPropagation();
            dropDownParent.classList.toggle("open");
        });
    }
 
    // ================= THANH TÌM KIẾM =================
    const searchBox = document.getElementById("search-box");
    const searchIcon = document.getElementById("search-icon");
    const searchInput = document.getElementById("search-text");
    const containerEl = document.querySelector(".container");
 
    if (searchBox && searchIcon && searchInput) {
        searchIcon.addEventListener("click", (e) => {
            if (window.innerWidth > MOBILE_BREAKPOINT) return;
            e.preventDefault();
            e.stopPropagation();
            const isOpen = searchBox.classList.toggle("mobile-search-open");
            if (containerEl) containerEl.classList.toggle("mobile-search-mode", isOpen);
            if (isOpen) {
                setTimeout(() => searchInput.focus(), 50);
            }
        });
 
        document.addEventListener("click", (e) => {
            if (window.innerWidth > MOBILE_BREAKPOINT) return;

            // KIỂM TRA BỔ SUNG: Nếu điểm click nằm trong Banner, KHÔNG đóng Search Box
            const heroBanner = document.getElementById("hero-banner");
            if (heroBanner && heroBanner.contains(e.target)) return;

            if (!searchBox.contains(e.target)) {
                searchBox.classList.remove("mobile-search-open");
                if (containerEl) containerEl.classList.remove("mobile-search-mode");
            }
        });
    }
});