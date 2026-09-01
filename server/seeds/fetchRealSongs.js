const fs = require('fs');
const path = require('path');

async function buildExpandedSongDatabase() {
  console.log("Fetching and compiling massive 2000 - 2026 Bollywood songs catalog...");

  const searchTerms = [
    // 2024 - 2026 Hits
    "Bollywood Hits 2026", "Bollywood Hits 2025", "Bollywood Hits 2024", "Stree 2 Songs", "Fighter Bollywood Songs", 
    "Animal Movie Songs", "Chandu Champion Songs", "Bad Newz Songs", "Bhool Bhulaiyaa 3 Songs", "Singham Again Songs",
    "Teri Baaton Mein Aisa Uljha Jiya Songs", "Amar Singh Chamkila Songs", "Article 370 Songs", "Crew Movie Songs", "Dunki Songs",
    "Merry Christmas Hindi Songs", "Yodha Movie Songs", "Mr and Mrs Mahi Songs", "Khel Khel Mein Songs", "Jigra Songs",
    "Vedaa Movie Songs", "Sarfira Movie Songs", "Auron Mein Kahan Dum Tha", "Ulajh Movie Songs", "Kill Movie Songs",
    "Maidaan Movie Songs", "Bade Miyan Chote Miyan 2024", "Shaitaan Movie Songs", "Do Patti Songs", "Vicky Vidya Ka Woh Wala Video",
    
    // 2021 - 2023 Blockbusters & Hits
    "Jawan Movie Songs", "Pathaan Movie Songs", "Rocky Aur Rani Kii Prem Kahaani Songs", "Tu Jhoothi Main Makkaar Songs",
    "Gadar 2 Songs", "Tiger 3 Songs", "Brahmastra Songs", "RRR Hindi Songs", "Bhool Bhulaiyaa 2 Songs", "Gangubai Kathiawadi Songs",
    "Bhediya Movie Songs", "Shershaah Songs", "Pushpa Hindi Songs", "Atrangi Re Songs", "Sooryavanshi Songs", "Mimi Movie Songs",
    "Zara Hatke Zara Bachke Songs", "Satyaprem Ki Katha Songs", "Selfiee Movie Songs", "Vikram Vedha Hindi Songs", "Lal Singh Chaddha Songs",
    "Chor Nikal Ke Bhaga Songs", "Cirkus Songs", "Phone Bhoot Songs", "Jug Jugg Jeeyo Songs", "Ek Villain Returns Songs",
    "Gehraiyaan Songs", "Badhaai Do Songs", "Jayeshbhai Jordaar Songs", "Samrat Prithviraj Songs", "Shamshera Songs",
    "Darlings Movie Songs", "Raksha Bandhan Songs", "Goodbye Movie Songs", "Doctor G Songs", "Thank God Movie Songs",
    "Govinda Naam Mera Songs", "An Action Hero Songs", "Freddy Movie Songs", "Mission Majnu Songs", "Shehzada Songs",
    "Mrs Chatterjee Vs Norway Songs", "Bheed Movie Songs", "Gumraah Movie Songs", "Kisi Ka Bhai Kisi Ki Jaan Songs", "IB71 Songs",
    "Adipurush Hindi Songs", "Bawaal Songs", "Dream Girl 2 Songs", "The Great Indian Family", "Fukrey 3 Songs",
    "Mission Raniganj Songs", "Yaariyan 2 Songs", "Tejas Movie Songs", "Aankh Micholi Songs", "Tiger 3 Songs", "Sam Bahadur Songs",

    // 2015 - 2020 Superhits
    "Kabir Singh Songs", "War Movie Songs", "Gully Boy Songs", "Padmaavat Songs", "Simmba Songs", "Stree Movie Songs", "Sanju Movie Songs",
    "Baaghi 2 Songs", "Raazi Movie Songs", "Sonu Ke Titu Ki Sweety Songs", "Dangal Movie Songs", "Ae Dil Hai Mushkil Songs", "Sultan Movie Songs",
    "Bajrangi Bhaijaan Songs", "Tamasha Movie Songs", "Kapoor and Sons Songs", "Badrinath Ki Dulhania Songs", "Dil Dhadakne Do Songs",
    "Kedarnath Songs", "Luka Chuppi Songs", "Kesari Movie Songs", "Kalank Songs", "Bharat Movie Songs", "Mission Mangal Songs",
    "Chhichhore Songs", "Dream Girl Songs", "Housefull 4 Songs", "Pati Patni Aur Woh Songs", "Good Newwz Songs", "Tanhaji Songs",
    "Malang Movie Songs", "Shubh Mangal Zyada Saavdhan Songs", "Thappad Songs", "Baaghi 3 Songs", "Angrezi Medium Songs",
    "Gulabo Sitabo Songs", "Dil Bechara Songs", "Laxmii Songs", "Ludo Movie Songs", "Chhalaang Songs", "Durgamati Songs",
    "Coolie No 1 2020 Songs", "Indoo Ki Jawani Songs", "Roohi Movie Songs", "Mumbai Saga Songs", "Saina Movie Songs",
    "Radhe Songs", "Sardar Udham Songs", "BellBottom Songs", "Chehre Movie Songs", "Haseen Dillruba Songs", "Hungama 2 Songs",
    "Toofaan Songs", "Bhuj Songs", "Shiddat Movie Songs", "Sanak Songs", "Rashmi Rocket Songs", "Bunty Aur Babli 2 Songs",
    "Antim Songs", "Tadap Songs", "Chandigarh Kare Aashiqui Songs", "Velle Movie Songs", "83 Movie Hindi Songs",

    // 2010 - 2014 Romantic & Dance Eras
    "Aashiqui 2 Songs", "Yeh Jawaani Hai Deewani Songs", "Queen Movie Songs", "Barfi Movie Songs", "Ek Villain Songs",
    "Chennai Express Songs", "Cocktail Movie Songs", "Rockstar Movie Songs", "Zindagi Na Milegi Dobara Songs", "Agneepath Movie Songs",
    "Student of the Year Songs", "Jab Tak Hai Jaan Songs", "Goliyon Ki Raasleela Ram-Leela Songs", "Highway Movie Songs", "2 States Movie Songs",
    "Dabangg Songs", "Band Baaja Baaraat Songs", "Tanu Weds Manu Songs", "Singhan Songs", "Bodyguard Songs", "Ra.One Songs",
    "Don 2 Songs", "Rowdy Rathore Songs", "Bol Bachchan Songs", "Ek Tha Tiger Songs", "OMG Oh My God Songs", "Talaash Songs",
    "Special 26 Songs", "Kai Po Che Songs", "Jolly LLB Songs", "Aashiqui 2 Songs", "Shootout at Wadala Songs", "Fukrey Songs",
    "Lootera Songs", "Bhaag Milkha Bhaag Songs", "Grand Masti Songs", "Besharam Songs", "Krrish 3 Songs", "Dhoom 3 Songs",
    "Yaariyan Songs", "Jai Ho Songs", "Gunday Songs", "Shaadi Ke Side Effects", "Queen Songs", "Main Tera Hero Songs",
    "2 States Songs", "Heropanti Songs", "Citylights Songs", "Holiday Movie Songs", "Humshakals Songs", "Ek Villain Songs",
    "Humpty Sharma Ki Dulhania Songs", "Kick Movie Songs", "Entertainment Songs", "Singham Returns Songs", "Mardaani Songs",
    "Mary Kom Songs", "Creature 3D Songs", "Finding Fanny Songs", "Daawat-e-Ishq Songs", "Khoobsurat Songs", "Bang Bang Songs",
    "Haider Songs", "Happy New Year Songs", "Kill Dil Songs", "Action Jackson Songs", "PK Movie Songs",

    // 2000 - 2009 Golden Decade
    "Kabhi Khushi Kabhie Gham Songs", "Kal Ho Naa Ho Songs", "Dil Chahta Hai Songs", "Main Hoon Na Songs", "Dhoom 2 Songs",
    "Jab We Met Songs", "Om Shanti Om Songs", "Ghajini Movie Songs", "3 Idiots Songs", "Rab Ne Bana Di Jodi Songs", "Devdas Movie Songs",
    "Bunty Aur Babli Songs", "Fanaa Movie Songs", "Rang De Basanti Songs", "Taare Zameen Par Songs", "Kaho Naa Pyaar Hai Songs",
    "Lagaan Movie Songs", "Saathiya Movie Songs", "Veer Zaara Songs", "Swades Movie Songs", "Chak De India Songs", "Race Movie Songs",
    "Jaane Tu Ya Jaane Na Songs", "Dostana Movie Songs", "Rock On Songs", "Ajab Prem Ki Ghazab Kahani Songs", "Gori Tere Pyaar Mein Songs",
    "Rehnaa Hai Terre Dil Mein Songs", "Mohabbatein Songs", "Chori Chori Chupke Chupke Songs", "Hum Tum Songs",
    "Mujhse Shaadi Karogi Songs", "Aitraaz Songs", "No Entry Songs", "Salaam Namaste Songs", "Garam Masala Songs", "Krrish Songs",
    "Don 2006 Songs", "Dhoom 1 Songs", "Namastey London Songs", "Heyy Babyy Songs", "Partner Movie Songs", "Bhool Bhulaiyaa 1 Songs",
    "Welcome Movie Songs", "Jodhaa Akbar Songs", "Jannat Movie Songs", "Singh Is Kinng Songs", "Bachna Ae Haseeno Songs", "Kaminey Songs",
    "Wake Up Sid Songs", "All The Best Songs", "De Dana Dan Songs", "Once Upon a Time in Mumbaai Songs",

    // Top Artists 2000-2026 Focus
    "Arijit Singh Best Songs", "Shreya Ghoshal Romantic Hits", "Sonu Nigam 2000s Songs", "KK Best Bollywood Songs",
    "Mohit Chauhan Bollywood Songs", "Jubin Nautiyal Hits", "Sunidhi Chauhan Hits", "Shaan Bollywood Hits",
    "Atif Aslam Bollywood Melodies", "Pritam Bollywood Soundtracks", "Sachin Jigar Songs", "Vishal Shekhar Hits",
    "Amit Trivedi Bollywood Hits", "Mithoon Romantic Songs", "Darshan Raval Bollywood", "Jasleen Royal Songs",
    "B Praak Bollywood Hits", "Vishal Mishra Hindi Songs", "Shilpa Rao Melodies", "Armaan Malik Romantic Hits",
    "Neha Kakkar Hits", "Badshah Bollywood Party Songs", "Diljit Dosanjh Hindi Songs", "Anuv Jain Songs"
  ];

  const songMap = new Map();

  // Load existing songs if available
  let existing = [];
  try {
    existing = require('./songData.js');
    for (const s of existing) {
      const key = (s.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (key.length >= 2) songMap.set(key, s);
    }
  } catch(e) {}

  console.log(`Loaded ${songMap.size} existing clean songs. Querying new 2000-2026 tracks...`);

  for (const term of searchTerms) {
    try {
      await new Promise(r => setTimeout(r, 400)); // Respect iTunes rate limits
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=45`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();

      for (const track of data.results || []) {
        if (!track.trackName || !track.previewUrl) continue;
        
        const rawTitle = track.trackName;
        const lowerTitle = rawTitle.toLowerCase();
        const lowerArtist = (track.artistName || '').toLowerCase();

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

        // Balanced Difficulty Calibration (rebalanced Easy -> Medium -> Hard -> Expert -> Impossible):
        // 1: Top 2022-2026 Mega Hits
        // 2: 2012-2021 Superhits
        // 3: 2000-2011 Classics
        // 4: 1990-1999 Evergreen
        // 5: Pre-1990 Retro
        let difficulty = 2;
        if (releaseYear >= 2022) difficulty = 1;
        else if (releaseYear >= 2012) difficulty = 2;
        else if (releaseYear >= 2000) difficulty = 3;
        else if (releaseYear >= 1990) difficulty = 4;
        else difficulty = 5;

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
      console.warn(`Fetch notice for "${term}":`, e.message);
    }
  }

  const allSongs = Array.from(songMap.values());

  // Rebalance all existing songs' difficulties so Medium has a robust share:
  for (const s of allSongs) {
    const yr = s.releaseYear || 2020;
    if (yr >= 2023) s.difficulty = 1; // Easy (Ultra fresh viral hits)
    else if (yr >= 2013) s.difficulty = 2; // Medium (Pushed from Easy to Medium: 2013-2022 superhits!)
    else if (yr >= 2000) s.difficulty = 3; // Hard (2000-2012 Golden decade classics)
    else if (yr >= 1990) s.difficulty = 4; // Expert (90s romantic hits)
    else s.difficulty = 5; // Impossible (70s-80s retro tracks)
  }

  // Sort from latest (2026) to oldest
  allSongs.sort((a, b) => b.releaseYear - a.releaseYear);

  console.log(`\n🎉 Compiled ${allSongs.length} pure Bollywood songs with real audio streams across all decades!`);

  // Count by decade & difficulty
  const decadeCounts = {};
  const diffCounts = {};
  allSongs.forEach(s => {
    decadeCounts[s.decade] = (decadeCounts[s.decade] || 0) + 1;
    diffCounts[s.difficulty] = (diffCounts[s.difficulty] || 0) + 1;
  });
  console.log('Decade breakdown:', decadeCounts);
  console.log('Difficulty breakdown:', diffCounts);

  const fileContent = `// Auto-generated Pure Bollywood song catalog across 1970-2026\nmodule.exports = ${JSON.stringify(allSongs, null, 2)};\n`;
  
  const targetPath = path.join(__dirname, 'songData.js');
  fs.writeFileSync(targetPath, fileContent, 'utf-8');
  console.log(`Saved songData.js to ${targetPath}`);
}

buildExpandedSongDatabase();
