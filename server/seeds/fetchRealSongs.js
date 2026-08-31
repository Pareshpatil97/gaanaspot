const fs = require('fs');
const path = require('path');

async function buildExpandedSongDatabase() {
  console.log("Fetching massive Bollywood songs catalog across all eras (1970 - 2026)...");

  const searchTerms = [
    // 2024 - 2026 Latest Hits
    "Bollywood Hits 2026", "Bollywood Hits 2025", "Bollywood Hits 2024", "Stree 2", "Fighter Bollywood", 
    "Animal Bollywood", "Chandu Champion", "Bad Newz Bollywood", "Bhool Bhulaiyaa 3", "Singham Again",
    "Teri Baaton Mein Aisa Uljha Jiya", "Amar Singh Chamkila", "Article 370", "Crew Bollywood", "Dunki",
    
    // 2021 - 2023 Modern Hits
    "Jawan Bollywood", "Pathaan Bollywood", "Rocky Aur Rani Kii Prem Kahaani", "Tu Jhoothi Main Makkaar",
    "Gadar 2", "Tiger 3", "Brahmastra", "RRR Hindi", "Bhool Bhulaiyaa 2", "Gangubai Kathiawadi",
    "Bhediya Bollywood", "Shershaah Bollywood", "Pushpa Hindi", "Atrangi Re", "Sooryavanshi", "Mimi Bollywood",
    "Zara Hatke Zara Bachke", "Satyaprem Ki Katha", "Selfiee", "Vikram Vedha Hindi", "Lal Singh Chaddha",
    
    // 2010 - 2020 Superhits
    "Kabir Singh", "War Bollywood", "Gully Boy", "Padmaavat", "Simmba", "Stree Bollywood", "Sanju Bollywood",
    "Baaghi 2", "Raazi Bollywood", "Sonu Ke Titu Ki Sweety", "Dangal", "Ae Dil Hai Mushkil", "Sultan Bollywood",
    "Bajrangi Bhaijaan", "Tamasha Bollywood", "Aashiqui 2", "Yeh Jawaani Hai Deewani", "Queen Bollywood",
    "Kapoor and Sons", "Badrinath Ki Dulhania", "Dil Dhadakne Do", "Barfi Bollywood", "Ek Villain",
    "Chennai Express", "Cocktail Bollywood", "Rockstar Bollywood", "Zindagi Na Milegi Dobara",
    
    // 2000 - 2010 Golden Decade
    "Kabhi Khushi Kabhie Gham", "Kal Ho Naa Ho", "Dil Chahta Hai", "Main Hoon Na", "Dhoom 2",
    "Jab We Met", "Om Shanti Om", "Ghajini", "3 Idiots", "Rab Ne Bana Di Jodi", "Devdas Bollywood",
    "Bunty Aur Babli", "Fanaa Bollywood", "Rang De Basanti", "Taare Zameen Par", "Kaho Naa Pyaar Hai",
    "Lagaan Bollywood", "Saathiya Bollywood", "Veer Zaara", "Swades", "Chak De India", "Race Bollywood",
    "Jaane Tu Ya Jaane Na", "Dostana Bollywood", "Rock On Bollywood", "Ajab Prem Ki Ghazab Kahani",
    
    // 1990s Evergreen Era
    "Dilwale Dulhania Le Jayenge", "Kuch Kuch Hota Hai", "Hum Aapke Hain Koun", "Dil To Pagal Hai",
    "Baazigar", "Mohra Bollywood", "Raja Hindustani", "Pardes Bollywood", "Taal Bollywood", "Dil Se Bollywood",
    "Hum Dil De Chuke Sanam", "Border Bollywood", "1942 A Love Story", "Aashiqui 1990", "Saajan Bollywood",
    "Jo Jeeta Wohi Sikandar", "Darr Bollywood", "Khiladi Bollywood", "Main Khiladi Tu Anari", "Andaz Apna Apna",
    "Rangeela Bollywood", "Gupt Bollywood", "Soldier Bollywood", "Sarfarosh", "Biwi No 1",
    
    // 1970s - 1980s Retro Classics
    "Sholay", "Don 1978", "Deewaar Bollywood", "Amar Akbar Anthony", "Mr India 1987", "Qayamat Se Qayamat Tak",
    "Maine Pyar Kiya", "Tezaab Bollywood", "Chandni Bollywood", "Karz 1980", "Hum Kisise Kum Naheen",
    "Kabhie Kabhie 1976", "Silsila Bollywood", "Yaadon Ki Baaraat", "Aradhana Bollywood", "Kati Patang",
    "Hare Rama Hare Krishna", "Bobby 1973", "Chupke Chupke 1975", "Muqaddar Ka Sikandar", "Laawaris 1981",
    "Disco Dancer", "Hero 1983", "Ram Lakhan", "Tridev Bollywood", "Chalbaaz 1989",
    
    // Legend Artists (Deep search)
    "Arijit Singh Romantic Hits", "Shreya Ghoshal Hits", "Sonu Nigam Hits", "KK Hindi Hits", "Mohit Chauhan Hits",
    "Jubin Nautiyal Hits", "Neha Kakkar Hits", "Armaan Malik Hits", "Sunidhi Chauhan Hits", "Shaan Hindi Hits",
    "Kishore Kumar Romantic Hits", "Lata Mangeshkar Hits", "Mohammed Rafi Classic Hits", "Mukesh Hits",
    "Asha Bhosle Cabaret Hits", "Udit Narayan 90s Hits", "Alka Yagnik Romantic Hits", "Kumar Sanu Melodies",
    "A R Rahman Hindi Classics", "Pritam Hits", "Sachin Jigar Hits", "Vishal Shekhar Hits", "Atif Aslam Hits"
  ];

  const songMap = new Map();

  for (const term of searchTerms) {
    try {
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=35`;
      const res = await fetch(url);
      const data = await res.json();

      for (const track of data.results || []) {
        if (!track.trackName || !track.previewUrl) continue;
        
        // Clean song title
        let cleanTitle = track.trackName
          .replace(/\s*\(From\s+.*?\)/gi, '')
          .replace(/\s*\(Lyrical.*?\)/gi, '')
          .replace(/\s*\(Video.*?\)/gi, '')
          .replace(/\s*\(Audio.*?\)/gi, '')
          .replace(/\s*\(Original\s+Motion\s+Picture.*?\)/gi, '')
          .replace(/\s*\[.*?\]/g, '')
          .trim();

        if (cleanTitle.length < 2) cleanTitle = track.trackName;

        const dedupeKey = cleanTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (songMap.has(dedupeKey)) continue;

        const releaseYear = parseInt(track.releaseDate?.slice(0, 4)) || 2022;
        
        // Decade & Genre Tagging
        let decade = '2020s';
        if (releaseYear >= 2020) decade = '2020s';
        else if (releaseYear >= 2010) decade = '2010s';
        else if (releaseYear >= 2000) decade = '2000s';
        else if (releaseYear >= 1990) decade = '1990s';
        else if (releaseYear >= 1980) decade = '1980s';
        else decade = '1970s';

        let genre = ['Bollywood'];
        if (releaseYear >= 2020) genre.push('Romantic');
        else if (releaseYear >= 2010) genre.push('Party', 'Romantic');
        else if (releaseYear >= 1990 && releaseYear < 2000) genre.push('Retro');
        else if (releaseYear < 1990) genre.push('Retro', 'Classical');

        let difficulty = 2;
        if (releaseYear >= 2018) difficulty = 1;
        else if (releaseYear < 1985) difficulty = 3;

        songMap.set(dedupeKey, {
          title: cleanTitle,
          movie: track.collectionName?.replace(/\s*\(Original.*?\)/gi, '').trim() || 'Bollywood',
          singers: [track.artistName],
          artists: [track.artistName],
          composers: [track.artistName],
          lyricist: track.artistName,
          releaseYear,
          decade,
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
  // Sort from latest (2026) to oldest (1970s)
  allSongs.sort((a, b) => b.releaseYear - a.releaseYear);

  console.log(`\n🎉 Compiled ${allSongs.length} unique Bollywood songs with real audio streams across all decades!`);

  // Count by decade
  const counts = {};
  allSongs.forEach(s => {
    counts[s.decade] = (counts[s.decade] || 0) + 1;
  });
  console.log('Decade breakdown:', counts);

  const fileContent = `// Auto-generated Bollywood song catalog across 1970-2026\nmodule.exports = ${JSON.stringify(allSongs, null, 2)};\n`;
  
  const targetPath = path.join(__dirname, 'songData.js');
  fs.writeFileSync(targetPath, fileContent, 'utf-8');
  console.log(`Saved songData.js to ${targetPath}`);
}

buildExpandedSongDatabase();
