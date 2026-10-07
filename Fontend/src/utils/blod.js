async function loadProtectedImage(imgElement, proxyUrl) {
    const response = await fetch(proxyUrl);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    imgElement.src = objectUrl; // Link sẽ biến thành blob:https://freephim.com/a1b2-c3d4...
}

// Gọi nạp ảnh
const posterImg = document.getElementById('poster-img');
loadProtectedImage(posterImg, '/api/v1/image-proxy?path=/mEH96rSqjUDLI5rAnu7sTIDTdc8.jpg');