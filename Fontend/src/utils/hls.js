// Nếu dùng Hls.js
const hls = new Hls({
  maxBufferLength: 30,          
  maxMaxBufferLength: 60,       
  maxBufferSize: 30 * 1024 * 1024 
});