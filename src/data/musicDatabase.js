// 1. Stable, pre-verified streaming audio assets (SoundHelix test suite)
const audioPool = Array.from({ length: 16 }, (_, i) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${i + 1}.mp3`);

// 2. Curated Unsplash images optimized for music album covers
const coverPool = [
  "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
  "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&q=80"
];

// 3. Metadata Seeds across the different required genres
const genreSeeds = {
  Pop: { artists: ["The Weeknd", "Taylor Swift", "Dua Lipa", "Billie Eilish"], albums: ["Starboy", "Midnight Musings", "Future Nostalgia", "Hit Me Hard"] },
  HipHop: { artists: ["Drake", "Kendrick Lamar", "Travis Scott", "Post Malone"], albums: ["Certified Lover", "DAMN.", "Utopia", "Hollywood Bleeding"] },
  Indie: { artists: ["Fred again..", "Khruangbin", "Men I Trust", "Beach House"], albums: ["Actual Life", "Con Todo El Mundo", "Oncle Jazz", "Bloom"] },
  Synthwave: { artists: ["Neon Shifter", "Laserhawk", "Tokyo 1982", "CyberDrive"], albums: ["Outrun Horizon", "Nightdrive Legends", "Metropolis Grid", "Data Stream"] },
  Devotional: { artists: ["Sacred Echoes", "Ananda Mantra", "Vedic Chants", "Dhruva"], albums: ["Morning Awakening", "Shanti Waves", "Eternal Chants", "Sattva Vibe"] }
};

// 4. Generate the 100-song relational graph programmatically
const generateMusicDatabase = () => {
  const songs = [];

  for (let i = 1; i <= 100; i++) {
    let genre, artist, album, streamCount, isLiked, playlists, lastPlayed, isCore, isDownloaded;
    
    // Assign index loops into the 5 exact Dial Buckets (20 songs each)
    if (i <= 20) { // Bucket A: Familiar (Comfort Loops)
      genre = i % 2 === 0 ? "Pop" : "HipHop";
      streamCount = Math.floor(Math.random() * 200000000) + 300000000; // 300M+ streams
      isLiked = true;
      playlists = ["Chill Mix", "Coding Session"];
      lastPlayed = Math.random() > 0.5 ? 0 : 1; // Played this/last month
      isCore = true;
      isDownloaded = true;
    } 
    else if (i <= 40) { // Bucket B: Rediscover (Library Time Capsule)
      genre = "Indie";
      streamCount = Math.floor(Math.random() * 50000000) + 10000000;
      isLiked = Math.random() > 0.3;
      playlists = ["Old Favorites", "Gym"];
      lastPlayed = Math.floor(Math.random() * 18) + 6; // 6 to 24 months ago
      isCore = true;
      isDownloaded = true;
    } 
    else if (i <= 60) { // Bucket C: Balanced (Baseline Standard Mix)
      genre = i % 2 === 0 ? "Pop" : "Indie";
      streamCount = Math.floor(Math.random() * 100000000) + 50000000;
      isLiked = false;
      playlists = [];
      lastPlayed = Math.floor(Math.random() * 4) + 2; // 2 to 5 months ago
      isCore = true;
      isDownloaded = false;
    } 
    else if (i <= 80) { // Bucket D: Fresh (New tracking in familiar styles)
      genre = i % 2 === 0 ? "HipHop" : "Indie";
      streamCount = Math.floor(Math.random() * 5000000) + 1000000; 
      isLiked = false;
      playlists = [];
      lastPlayed = Math.floor(Math.random() * 12) + 12; // 12+ months ago or never
      isCore = true;
      isDownloaded = false;
    } 
    else { // Bucket E: Wild (Obscure wildcards / Vibe contamination safety check)
      genre = i % 2 === 0 ? "Synthwave" : "Devotional"; // Matches specific user personas
      streamCount = Math.floor(Math.random() * 40000) + 1000; // Ultra-low streaming metrics (<50k)
      isLiked = false;
      playlists = [];
      lastPlayed = 24; 
      isCore = false; // Intentionally breaks target historical data
      isDownloaded = false;
    }

    // Pick mapping variables safely from our seed pools using indexes
    const seed = genreSeeds[genre];
    artist = seed.artists[i % seed.artists.length] + ` (Sim ${Math.floor(i/4)})`;
    album = seed.albums[i % seed.albums.length];
    const trackTitle = `${album} Segment Part ${((i % 4) + 1)}`;

    songs.push({
      id: `track_${String(i).padStart(3, '0')}`,
      title: trackTitle,
      artist: artist,
      album: album,
      duration: `0${Math.floor(Math.random() * 3) + 3}:${Math.floor(Math.random() * 50) + 10}`, // Realistic track timing
      audioUrl: audioPool[i % audioPool.length], // Map audio links programmatically
      coverUrl: coverPool[i % coverPool.length],
      genre: genre,
      streamCount: streamCount,
      isLiked: isLiked,
      userCustomPlaylists: playlists,
      lastPlayedMonthsAgo: lastPlayed,
      isCoreGenre: isCore,
      isDownloadedOffline: isDownloaded
    });
  }
  return songs;
};

const musicDatabase = generateMusicDatabase();

// Helper functions to get buckets
export const getBucketA = () => musicDatabase.slice(0, 20);
export const getBucketB = () => musicDatabase.slice(20, 40);
export const getBucketC = () => musicDatabase.slice(40, 60);
export const getBucketD = () => musicDatabase.slice(60, 80);
export const getBucketE = () => musicDatabase.slice(80, 100);

export default musicDatabase;
