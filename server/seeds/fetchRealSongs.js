const fs = require('fs');
const path = require('path');

async function buildExpandedSongDatabase() {
  console.log("Fetching massive, strictly-filtered Bollywood songs catalog across all eras (1970 - 2026)...");

  const searchTerms = [
    // 2024 - 2026 Hits
    "Bollywood Hits 2026", "Bollywood Hits 2025", "Bollywood Hits 2024", "Stree 2 Songs", "Fighter Bollywood Songs", 
    "Animal Movie Songs", "Chandu Champion Songs", "Bad Newz Songs", "Bhool Bhulaiyaa 3 Songs", "Singham Again Songs",
    "Teri Baaton Mein Aisa Uljha Jiya Songs", "Amar Singh Chamkila Songs", "Article 370 Songs", "Crew Movie Songs", "Dunki Songs",
    "Merry Christmas Hindi Songs", "Yodha Movie Songs", "Mr and Mrs Mahi Songs", "Khel Khel Mein Songs", "Jigra Songs",
    
    // 2021 - 2023 Modern Hits
    "Jawan Movie Songs", "Pathaan Movie Songs", "Rocky Aur Rani Kii Prem Kahaani Songs", "Tu Jhoothi Main Makkaar Songs",
    "Gadar 2 Songs", "Tiger 3 Songs", "Brahmastra Songs", "RRR Hindi Songs", "Bhool Bhulaiyaa 2 Songs", "Gangubai Kathiawadi Songs",
    "Bhediya Movie Songs", "Shershaah Songs", "Pushpa Hindi Songs", "Atrangi Re Songs", "Sooryavanshi Songs", "Mimi Movie Songs",
    "Zara Hatke Zara Bachke Songs", "Satyaprem Ki Katha Songs", "Selfiee Movie Songs", "Vikram Vedha Hindi Songs", "Lal Singh Chaddha Songs",
    "Chor Nikal Ke Bhaga Songs", "Cirkus Songs", "Phone Bhoot Songs", "Jug Jugg Jeeyo Songs", "Ek Villain Returns Songs",
    
    // 2010 - 2020 Superhits
    "Kabir Singh Songs", "War Movie Songs", "Gully Boy Songs", "Padmaavat Songs", "Simmba Songs", "Stree Movie Songs", "Sanju Movie Songs",
    "Baaghi 2 Songs", "Raazi Movie Songs", "Sonu Ke Titu Ki Sweety Songs", "Dangal Movie Songs", "Ae Dil Hai Mushkil Songs", "Sultan Movie Songs",
    "Bajrangi Bhaijaan Songs", "Tamasha Movie Songs", "Aashiqui 2 Songs", "Yeh Jawaani Hai Deewani Songs", "Queen Movie Songs",
    "Kapoor and Sons Songs", "Badrinath Ki Dulhania Songs", "Dil Dhadakne Do Songs", "Barfi Movie Songs", "Ek Villain Songs",
    "Chennai Express Songs", "Cocktail Movie Songs", "Rockstar Movie Songs", "Zindagi Na Milegi Dobara Songs", "Agneepath Movie Songs",
    "Student of the Year Songs", "Jab Tak Hai Jaan Songs", "Goliyon Ki Raasleela Ram-Leela Songs", "Highway Movie Songs", "2 States Movie Songs",
    "Hass Pyaar Movie Songs", "Ki and Ka Songs", "Baar Baar Dekho Songs", "Dear Zindagi Songs", "Raees Movie Songs", "Badrinath Ki Dulhania Songs",
    "Half Girlfriend Songs", "Toilet Ek Prem Katha Songs", "Bareilly Ki Barfi Songs", "Secret Superstar Songs", "Tiger Zinda Hai Songs",
    "Luka Chuppi Songs", "Kesari Movie Songs", "Kalank Songs", "Bharat Movie Songs", "Mission Mangal Songs", "Housefull 4 Songs",
    "Pati Patni Aur Woh Songs", "Good Newwz Songs", "Tanhaji Songs", "Malang Movie Songs", "Shubh Mangal Zyada Saavdhan Songs",
    
    // 2000 - 2010 Golden Decade
    "Kabhi Khushi Kabhie Gham Songs", "Kal Ho Naa Ho Songs", "Dil Chahta Hai Songs", "Main Hoon Na Songs", "Dhoom 2 Songs",
    "Jab We Met Songs", "Om Shanti Om Songs", "Ghajini Movie Songs", "3 Idiots Songs", "Rab Ne Bana Di Jodi Songs", "Devdas Movie Songs",
    "Bunty Aur Babli Songs", "Fanaa Movie Songs", "Rang De Basanti Songs", "Taare Zameen Par Songs", "Kaho Naa Pyaar Hai Songs",
    "Lagaan Movie Songs", "Saathiya Movie Songs", "Veer Zaara Songs", "Swades Movie Songs", "Chak De India Songs", "Race Movie Songs",
    "Jaane Tu Ya Jaane Na Songs", "Dostana Movie Songs", "Rock On Songs", "Ajab Prem Ki Ghazab Kahani Songs", "Gori Tere Pyaar Mein Songs",
    "Rehnaa Hai Terre Dil Mein Songs", "Mohabbatein Songs", "Kaho Na Pyaar Hai Songs", "Chori Chori Chupke Chupke Songs", "Hum Tum Songs",
    "Mujhse Shaadi Karogi Songs", "Aitraaz Songs", "No Entry Songs", "Salaam Namaste Songs", "Garam Masala Songs", "Krrish Songs",
    "Don 2006 Songs", "Dhoom 1 Songs", "Namastey London Songs", "Heyy Babyy Songs", "Partner Movie Songs", "Bhool Bhulaiyaa 1 Songs",
    "Welcome Movie Songs", "Jodhaa Akbar Songs", "Jannat Movie Songs", "Singh Is Kinng Songs", "Bachna Ae Haseeno Songs", "Kaminey Songs",
    "Wake Up Sid Songs", "All The Best Songs", "De Dana Dan Songs", "Once Upon a Time in Mumbaai Songs", "Dabangg Songs", "Band Baaja Baaraat Songs",
    
    // 1990s Evergreen Era
    "Dilwale Dulhania Le Jayenge Songs", "Kuch Kuch Hota Hai Songs", "Hum Aapke Hain Koun Songs", "Dil To Pagal Hai Songs",
    "Baazigar Songs", "Mohra Movie Songs", "Raja Hindustani Songs", "Pardes Movie Songs", "Taal Movie Songs", "Dil Se Songs",
    "Hum Dil De Chuke Sanam Songs", "Border Movie Songs", "1942 A Love Story Songs", "Aashiqui 1990 Songs", "Saajan Movie Songs",
    "Jo Jeeta Wohi Sikandar Songs", "Darr Movie Songs", "Khiladi Movie Songs", "Main Khiladi Tu Anari Songs", "Andaz Apna Apna Songs",
    "Rangeela Movie Songs", "Gupt Movie Songs", "Soldier Movie Songs", "Sarfarosh Songs", "Biwi No 1 Songs", "Hum Saath Saath Hain Songs",
    "Karan Arjun Songs", "Raja Movie 1995 Songs", "Coolie No 1 Songs", "Jeet Movie Songs", "Judwaa Songs", "Hero No 1 Songs",
    "Pyaar Kiya To Darna Kya Songs", "Ghulam Movie Songs", "Major Saab Songs", "Soldier 1998 Songs", "Sirf Tum Songs", "Hum Dil De Chuke Sanam Songs",
    "Mann Movie Songs", "Haseena Maan Jaayegi Songs", "Vaastav Songs", "Kaho Naa Pyaar Hai 1999 Songs",
    
    // 1970s - 1980s Retro Classics
    "Sholay Movie Songs", "Don 1978 Songs", "Deewaar Movie Songs", "Amar Akbar Anthony Songs", "Mr India 1987 Songs", "Qayamat Se Qayamat Tak Songs",
    "Maine Pyar Kiya Songs", "Tezaab Movie Songs", "Chandni Movie Songs", "Karz 1980 Songs", "Hum Kisise Kum Naheen Songs",
    "Kabhie Kabhie 1976 Songs", "Silsila Movie Songs", "Yaadon Ki Baaraat Songs", "Aradhana Movie Songs", "Kati Patang Songs",
    "Hare Rama Hare Krishna Songs", "Bobby 1973 Songs", "Chupke Chupke 1975 Songs", "Muqaddar Ka Sikandar Songs", "Laawaris 1981 Songs",
    "Disco Dancer Songs", "Hero 1983 Songs", "Ram Lakhan Songs", "Tridev Movie Songs", "Chalbaaz 1989 Songs", "Satyam Shivam Sundaram Songs",
    "Gol Maal 1979 Songs", "Namak Halaal Songs", "Sharaabi Songs", "Sanam Teri Kasam 1982 Songs", "Himmatwala 1983 Songs", "Nagina Songs",
    "Mr Natwarlal Songs", "Suhaag 1979 Songs", "The Burning Train Songs", "Do Aur Do Paanch Songs", "Dostana 1980 Songs",
    
    // Top Legend Artists
    "Arijit Singh Best Hindi Songs", "Shreya Ghoshal Romantic Hindi Songs", "Sonu Nigam Evergreen Songs", "KK Hindi Melodies",
    "Mohit Chauhan Bollywood Songs", "Jubin Nautiyal Romantic Songs", "Sunidhi Chauhan Item Songs", "Shaan Bollywood Songs",
    "Kishore Kumar Romantic Hits", "Lata Mangeshkar Solos", "Mohammed Rafi Classic Hits", "Mukesh Hindi Melodies",
    "Asha Bhosle Evergreen Hits", "Udit Narayan 90s Romantic Songs", "Alka Yagnik Romantic Duets", "Kumar Sanu 90s Melodies",
    "A R Rahman Hindi Soundtrack", "Pritam Chakraborty Bollywood Hits", "Sachin Jigar Hits", "Vishal Shekhar Bollywood Hits",
    "Atif Aslam Bollywood Hits", "Rahat Fateh Ali Khan Hindi Songs", "Lucky Ali Evergreen Songs", "Badshah Bollywood Party Songs",
    "Diljit Dosanjh Bollywood Songs", "B Praak Hindi Songs", "Vishal Mishra Songs", "Shilpa Rao Bollywood Songs"
  ];

  const songMap = new Map();

  for (const term of searchTerms) {
    try {
      await new Promise(r => setTimeout(r, 450)); // Respect iTunes rate limits
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=40`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();

      for (const track of data.results || []) {
        if (!track.trackName || !track.previewUrl) continue;
        
        const rawTitle = track.trackName;
        const lowerTitle = rawTitle.toLowerCase();
        const lowerArtist = (track.artistName || '').toLowerCase();
        const lowerAlbum = (track.collectionName || '').toLowerCase();

        // 1. Strictly exclude non-songs and non-Bollywood items
        if (
          lowerTitle.includes('intro') ||
          lowerTitle.includes('theme') ||
          lowerTitle.includes('instrumental') ||
          lowerTitle.includes('dialogue') ||
          lowerTitle.includes('score') ||
          lowerTitle.includes('teaser') ||
          lowerTitle.includes('trailer') ||
          lowerTitle.includes('promo') ||
          lowerTitle.includes('bgm') ||
          lowerTitle.includes('karaoke') ||
          lowerTitle.includes('mashup') ||
          lowerTitle.includes('live') ||
          lowerTitle.includes('acoustic') ||
          lowerTitle.includes('shloka') ||
          lowerTitle.includes('mantra') ||
          lowerTitle.includes('podcast') ||
          lowerTitle.includes('speech') ||
          lowerTitle.includes('talk') ||
          lowerTitle.includes('ringtone') ||
          lowerTitle.includes('remix')
        ) continue;

        // 2. Strictly exclude western/non-Hindi artists
        if (
          lowerArtist.includes('tones and i') ||
          lowerArtist.includes('sia') ||
          lowerArtist.includes('ed sheeran') ||
          lowerArtist.includes('taylor swift') ||
          lowerArtist.includes('bieber') ||
          lowerArtist.includes('drake') ||
          lowerArtist.includes('selena') ||
          lowerArtist.includes('ariana') ||
          lowerArtist.includes('eminem')
        ) continue;

        // 3. Clean song title
        let cleanTitle = rawTitle
          .replace(/\s*\(From\s+.*?\)/gi, '')
          .replace(/\s*\(Lyrical.*?\)/gi, '')
          .replace(/\s*\(Video.*?\)/gi, '')
          .replace(/\s*\(Audio.*?\)/gi, '')
          .replace(/\s*\(Original\s+Motion\s+Picture.*?\)/gi, '')
          .replace(/\s*\(Original\s+Soundtrack.*?\)/gi, '')
          .replace(/\s*\(Hindi.*?\)/gi, '')
          .replace(/\s*\[.*?\]/g, '')
          .trim();

        if (cleanTitle.length < 2) cleanTitle = rawTitle;

        // Skip titles that are purely numbers or too short
        if (/^\d+$/.test(cleanTitle) || cleanTitle.length < 2) continue;

        const dedupeKey = cleanTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (songMap.has(dedupeKey)) continue;

        const releaseYear = parseInt(track.releaseDate?.slice(0, 4)) || 2022;
        
        // Decade Tagging
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

        // Calibrate difficulty: 1 (Easy), 2 (Medium), 3 (Hard), 4 (Expert), 5 (Impossible)
        let difficulty = 2;
        if (releaseYear >= 2018) difficulty = 1; // Latest mega hits
        else if (releaseYear >= 2010) difficulty = 2; // 2010s hits
        else if (releaseYear >= 2000) difficulty = 3; // 2000s classics
        else if (releaseYear >= 1990) difficulty = 4; // 90s evergreen
        else difficulty = 5; // 70s-80s retro

        songMap.set(dedupeKey, {
          title: cleanTitle,
          movie: track.collectionName?.replace(/\s*\(Original.*?\)/gi, '').replace(/\s*\(Soundtrack.*?\)/gi, '').trim() || 'Bollywood',
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

  console.log(`\n🎉 Compiled ${allSongs.length} pure Bollywood songs with real audio streams across all decades!`);

  // Count by decade
  const counts = {};
  allSongs.forEach(s => {
    counts[s.decade] = (counts[s.decade] || 0) + 1;
  });
  console.log('Decade breakdown:', counts);

  const fileContent = `// Auto-generated Pure Bollywood song catalog across 1970-2026\nmodule.exports = ${JSON.stringify(allSongs, null, 2)};\n`;
  
  const targetPath = path.join(__dirname, 'songData.js');
  fs.writeFileSync(targetPath, fileContent, 'utf-8');
  console.log(`Saved songData.js to ${targetPath}`);
}

buildExpandedSongDatabase();
