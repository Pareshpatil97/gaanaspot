const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  normalizedTitle: { type: String, index: true },
  movie: { type: String, trim: true },
  singers: [{ type: String }],
  artists: [{ type: String }],
  composers: [{ type: String }],
  lyricist: { type: String },
  releaseYear: { type: Number },
  decade: { type: String },
  genre: [{
    type: String,
    enum: ['Romantic', 'Party', 'Sad', 'Classical', 'Devotional', 'Retro', 'Bollywood', 'Indie Hindi']
  }],
  difficulty: { type: Number, enum: [1, 2, 3, 4, 5], default: 2 },
  language: { type: String, default: 'Hindi' },
  audioPreviewUrl: { type: String },
  artworkUrl: { type: String },
  aliases: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

SongSchema.index({ normalizedTitle: 'text' }, { default_language: 'none', language_override: 'none' });
SongSchema.index({ genre: 1 });
SongSchema.index({ decade: 1 });
SongSchema.index({ difficulty: 1 });
SongSchema.index({ isActive: 1 });

SongSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.normalizedTitle = this.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, ' ').trim();
  }
  if (this.isModified('releaseYear') && this.releaseYear) {
    const dec = Math.floor(this.releaseYear / 10) * 10;
    this.decade = `${dec}s`;
  }
  next();
});

module.exports = mongoose.model('Song', SongSchema);
