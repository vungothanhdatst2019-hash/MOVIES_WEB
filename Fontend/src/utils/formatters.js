/**
 * Bóc tách và định dạng danh sách thể loại phim thành chuỗi hiển thị
 */
function parseCategories(rawCat) {
    if (!rawCat) return "Phim";

    // Xử lý chuỗi dạng JSON '["Bí Ẩn", "Kinh Dị"]'
    if (typeof rawCat === "string" && rawCat.startsWith("[")) {
        try {
            rawCat = JSON.parse(rawCat);
        } catch (e) {
            // Giữ nguyên nếu không parse được
        }
    }

    // Xử lý kiểu Mảng (Array)
    if (Array.isArray(rawCat) && rawCat.length > 0) {
        const list = rawCat
            .map(item => {
                if (typeof item === "object" && item !== null) {
                    return item.name || item.title || item.label || "";
                }
                return String(item).trim();
            })
            .filter(item => item !== "");

        return list.length > 0 ? list.join(", ") : "Phim";
    }

    // Xử lý kiểu Chuỗi (String)
    if (typeof rawCat === "string" && rawCat.trim() !== "") {
        return rawCat.trim();
    }

    return "Phim";
}

/**
 * Quét và lấy URL hình ảnh từ nhiều tên trường khác nhau
 */
function getPosterUrl(movie) {
    return movie.posterUrl 
        || movie.poster 
        || movie.thumb_Url 
        || movie.thumbUrl 
        || movie.image 
        || 'https://via.placeholder.com/200x300?text=No+Image';
}