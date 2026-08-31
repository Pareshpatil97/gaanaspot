class AudioProvider {
  getAudioUrl(song) {
    return song.audioPreviewUrl || '/audio/placeholder.mp3';
  }

  getArtworkUrl(song) {
    return song.artworkUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(song.title)}&background=8b5cf6&color=fff&size=300`;
  }
}

module.exports = new AudioProvider();
