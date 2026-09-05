const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    movieId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    type: { type: mongoose.Schema.Types.Mixed, default: "Phim" },   
    description: { type: String },                 
    videoUrl: { type: String, required: true },  
    category: { type: mongoose.Schema.Types.Mixed, default: ["Phim"]},                    
    year: { type: Number },
    nation: { type: String },
    performer: { type: mongoose.Schema.Types.Mixed },                       
    posterUrl: { type: String, required: true },
    backgroundUrl: { type: String, required: true },              
    episodes: [{ type: mongoose.Schema.Types.Mixed }], 
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);