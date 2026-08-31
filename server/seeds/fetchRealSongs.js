const fs = require('fs');
const path = require('path');

async function buildSongDatabase() {
  console.log("Fetching Bollywood songs catalog from open music API...");

  const searchTerms = [
    "Arijit Singh Bollywood", "Shreya Ghoshal Hindi", "KK Hindi Hits", 
    "Sonu Nigam Hits", "Lata Mangeshkar Golden Hits", "Kishore Kumar Hits",
    "Mohd Rafi Classic", "Mukesh Hindi Hits", "R D Burman Hits", 
    "A R Rahman Hindi", "Pritam Bollywood Hits", "Atif Aslam Bollywood",
    "Udit Narayan 90s", "Alka Yagnik 90s", "Kumar Sanu 90s Hits",
    "Badshah Bollywood", "Diljit Dosanjh Hindi", "Jubin Nautiyal Hits",
    "Bollywood Dance Hits", "Bollywood Romantic Hits", "Bollywood 2024",
    "Bollywood 2023 Hits", "Bollywood 2010s", "Bollywood 2000s", "Bollywood 90s",
    "Bollywood 80s", "Bollywood 70s", "Shankar Ehsaan Loy", "Vishal Shekhar",
    "Sachin Jigar", "Mithoon Hits", "Ankit Tiwari", "Armaan Malik Bollywood"
  ];

  const songMap = new Map();

  for (const term of searchTerms) {
    try {
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=30`;
      const res = await fetch(url);
      const data = await res.json();

      for (const track of data.results || []) {
        if (!track.trackName || !track.previewUrl) continue;
        
        // Clean title (remove "From XYZ", "(Lyrical)", etc.)
        let cleanTitle = track.trackName
          .replace(/\s*\(From\s+.*?\)/gi, '')
          .replace(/\s*\(Lyrical.*?\)/gi, '')
          .replace(/\s*\(Video.*?\)/gi, '')
          .replace(/\s*\(Audio.*?\)/gi, '')
          .replace(/\s*\[.*?\]/g, '')
          .trim();

        if (cleanTitle.length < 2) cleanTitle = track.trackName;

        const dedupeKey = cleanTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (songMap.has(dedupeKey)) continue;

        const releaseYear = parseInt(track.releaseDate?.slice(0, 4)) || 2020;
        
        // Determine genre based on year and metadata
        let genre = ['Bollywood'];
        if (releaseYear >= 2020) genre.push('Romantic');
        else if (releaseYear >= 2010) genre.push('Romantic');
        else if (releaseYear >= 1990 && releaseYear < 2000) genre.push('Retro');
        else if (releaseYear < 1990) genre.push('Retro', 'Classical');

        let difficulty = 2;
        if (releaseYear >= 2015) difficulty = 1;
        else if (releaseYear < 1985) difficulty = 3;

        songMap.set(dedupeKey, {
          title: cleanTitle,
          movie: track.collectionName?.replace(/\s*\(Original.*?\)/gi, '').trim() || 'Bollywood',
          singers: [track.artistName],
          artists: [track.artistName],
          composers: [track.artistName],
          lyricist: track.artistName,
          releaseYear,
          genre,
          difficulty,
          audioPreviewUrl: track.previewUrl,
          artworkUrl: track.artworkUrl100?.replace('100x100bb.jpg', '400x400bb.jpg') || '',
          aliases: [track.trackName, cleanTitle]
        });
      }
    } catch (e) {
      console.warn(`Fetch error for "${term}":`, e.message);
    }
  }

  const allSongs = Array.from(songMap.values());
  // Sort from newest to oldest
  allSongs.sort((a, b) => b.releaseYear - a.releaseYear);

  console.log(`Successfully compiled ${allSongs.length} real Bollywood songs with audio preview streams!`);

  const fileContent = `// Auto-generated Bollywood song catalog with real audio previews from open API\nmodule.exports = ${JSON.stringify(allSongs, null, 2)};\n`;
  
  const targetPath = path.join(__dirname, 'songData.js');
  fs.writeFileSync(targetPath, fileContent, 'utf-8');
  console.log(`Saved to ${targetPath}`);
}

buildSongDatabase();
