import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Clock, Download, MoreHorizontal } from 'lucide-react';
import { usePlayback } from '../context/PlaybackContext';
import musicDatabase, { getBucketA, getBucketB, getBucketC, getBucketD, getBucketE } from '../data/musicDatabase';

const HomeFeed = ({ selectedPlaylist }) => {
  const { discoveryStage, playTrack, isOfflineMode, setIsLoading } = usePlayback();
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  // Filter tracks based on discovery stage or selected playlist
  useEffect(() => {
    setIsLoadingData(true);
    
    // Simulate 600ms shimmer effect
    setTimeout(() => {
      let tracks = [];
      
      if (selectedPlaylist && selectedPlaylist.songs) {
        // Show selected playlist songs
        tracks = selectedPlaylist.songs;
      } else {
        // Filter based on discovery stage
        switch (discoveryStage) {
          case 'familiar':
            tracks = getBucketA();
            break;
          case 'rediscover':
            tracks = getBucketB();
            break;
          case 'balanced':
            const bucketA = getBucketA();
            const bucketD = getBucketD();
            tracks = [...bucketA.slice(0, 4), ...bucketD.slice(0, 4)];
            break;
          case 'fresh':
            tracks = getBucketD();
            break;
          case 'wild':
            tracks = getBucketE();
            break;
          default:
            tracks = getBucketA();
        }
      }
      
      setFilteredTracks(tracks);
      setIsLoadingData(false);
    }, 600);
  }, [discoveryStage, selectedPlaylist]);

  useEffect(() => {
    setSelectedSuggestion(null);
  }, [discoveryStage, selectedPlaylist]);

  const handleTrackClick = (track) => {
    // Simulate offline mode bug for non-downloaded tracks
    if (isOfflineMode && !track.isDownloadedOffline) {
      setIsLoading(true);
      // Simulate infinite loading shimmer
      return;
    }
    
    playTrack(track);
  };

  const openSuggestionPlaylist = (item, index) => {
    const startIndex = filteredTracks.length ? index % filteredTracks.length : 0;
    const songs = [
      ...filteredTracks.slice(startIndex),
      ...filteredTracks.slice(0, startIndex),
    ].slice(0, 12);

    setSelectedSuggestion({
      name: item.title,
      description: item.description,
      gradient: item.gradient,
      songs,
    });
  };

  const activePlaylist = selectedPlaylist?.songs ? selectedPlaylist : selectedSuggestion;
  const isSuggestionPlaylist = Boolean(selectedSuggestion && !selectedPlaylist?.songs);

  // If a playlist is selected, show only that playlist's songs
  if (activePlaylist && activePlaylist.songs) {
    if (isLoadingData) {
      return (
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-spotify-dark to-spotify-black">
          <div className="animate-pulse">
            <div className="h-8 bg-spotify-light rounded w-1/3 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="bg-spotify-light rounded-lg aspect-square" />
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-spotify-dark to-spotify-black">
        {isSuggestionPlaylist && (
          <button
            onClick={() => setSelectedSuggestion(null)}
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-spotify-lighter transition-colors hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to home
          </button>
        )}

        <div className="flex items-center gap-6 mb-8">
          <div className={`w-48 h-48 bg-gradient-to-br ${activePlaylist.gradient || 'from-purple-700 to-blue-500'} rounded-lg shadow-2xl flex items-center justify-center`}>
            <Play size={48} className="text-white ml-2" />
          </div>
          <div>
            <span className="text-xs font-semibold text-spotify-lighter uppercase">Playlist</span>
            <h1 className="text-5xl font-bold text-white mb-4">{activePlaylist.name}</h1>
            <p className="text-spotify-lighter text-sm">
              {activePlaylist.description ? `${activePlaylist.description} • ` : ''}
              {activePlaylist.songs.length} songs • Created by Spotify
            </p>
          </div>
        </div>

        {/* Track List */}
        <div className="bg-spotify-light/10 rounded-lg overflow-hidden">
          <div className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-2 border-b border-spotify-light/20 text-spotify-lighter text-sm">
            <span>#</span>
            <span>Title</span>
            <span>Album</span>
            <span className="text-right">
              <Clock size={14} />
            </span>
          </div>

          {activePlaylist.songs.map((track, index) => (
            <div
              key={track.id}
              onClick={() => handleTrackClick(track)}
              className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-3 hover:bg-spotify-light/20 cursor-pointer group items-center transition-colors"
            >
              <div className="relative">
                <span className="text-spotify-lighter group-hover:hidden">{index + 1}</span>
                <Play size={14} className="text-white hidden group-hover:block absolute top-1/2 -translate-y-1/2" />
              </div>
              
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-10 h-10 rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{track.title}</p>
                  <p className="text-spotify-lighter text-sm truncate">{track.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <span className="text-spotify-lighter text-sm truncate">{track.album}</span>
                {track.isDownloadedOffline && (
                  <Download size={14} className="text-spotify-green flex-shrink-0" />
                )}
              </div>

              <div className="text-right flex items-center justify-end gap-2">
                <span className="text-spotify-lighter text-sm">{track.duration}</span>
                <button className="text-spotify-lighter hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  // Home page with suggestions and recommendations
  if (isLoadingData) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-spotify-dark to-spotify-black">
        <div className="space-y-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-8 bg-spotify-light rounded w-1/3 mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="bg-spotify-light rounded-lg aspect-square" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const homepageByDiscovery = {
    familiar: {
      topTitle: 'Your Regular Rotation',
      madeTitle: 'Comfort Picks',
      discoveryTitle: 'More Of What You Love',
      recentlyPlayed: [
        { title: 'Your Everyday Mix', description: 'Regular songs you keep coming back to', gradient: 'from-green-700 to-emerald-500' },
        { title: 'Most Played Lately', description: 'Your current repeat favorites', gradient: 'from-purple-700 to-blue-500' },
        { title: 'Comfort Queue', description: 'Familiar tracks for any mood', gradient: 'from-pink-700 to-rose-500' },
        { title: 'Liked Songs Radio', description: 'Built from your saved music', gradient: 'from-cyan-700 to-blue-500' },
        { title: 'Daily Repeat', description: 'Songs that already feel like home', gradient: 'from-indigo-700 to-violet-500' },
        { title: 'Regular Drive Mix', description: 'Reliable tracks from your library', gradient: 'from-amber-700 to-orange-500' },
      ],
      madeForYou: [
        { title: 'Daily Mix: Favorites', description: 'Artists and songs you play often', gradient: 'from-green-700 to-teal-500' },
        { title: 'Your Safe Picks', description: 'Low-skip music from your history', gradient: 'from-purple-700 to-blue-500' },
        { title: 'Always On', description: 'Regular songs for focus and flow', gradient: 'from-cyan-700 to-blue-500' },
        { title: 'Liked And Loved', description: 'Saved tracks with similar favorites', gradient: 'from-pink-700 to-rose-500' },
        { title: 'Back To Your Basics', description: 'The sound you know best', gradient: 'from-emerald-700 to-green-500' },
      ],
      discoverWeekly: [
        { title: 'Familiar Discover Weekly', description: 'New suggestions close to your usual taste', gradient: 'from-green-700 to-emerald-500' },
        { title: 'Same Lane Finds', description: 'Fresh tracks that still feel familiar', gradient: 'from-blue-700 to-indigo-500' },
        { title: 'More Like Your Likes', description: 'Recommendations from your regular saves', gradient: 'from-purple-700 to-pink-500' },
        { title: 'Repeat-Ready Picks', description: 'Songs likely to join your rotation', gradient: 'from-amber-700 to-yellow-500' },
        { title: 'Your Genre Comfort Zone', description: 'Playlist ideas from your strongest genres', gradient: 'from-cyan-700 to-teal-500' },
      ],
    },
    rediscover: {
      topTitle: 'Rediscover Your Library',
      madeTitle: 'Hidden Gems For You',
      discoveryTitle: 'Long Time No Listen',
      recentlyPlayed: [
        { title: 'Hidden Gems From Your Library', description: 'Great songs you have not played in months', gradient: 'from-amber-700 to-yellow-500' },
        { title: 'Forgotten Favorites', description: 'Old saves worth bringing back', gradient: 'from-orange-700 to-amber-500' },
        { title: 'Deep Cuts You Loved', description: 'Less-played tracks from familiar artists', gradient: 'from-purple-700 to-blue-500' },
        { title: 'Throwback Queue', description: 'Past favorites from your listening history', gradient: 'from-cyan-700 to-teal-500' },
        { title: 'Buried In Your Likes', description: 'Saved songs waiting for another spin', gradient: 'from-pink-700 to-rose-500' },
        { title: 'Library Time Capsule', description: 'Music from another chapter of your taste', gradient: 'from-indigo-700 to-violet-500' },
      ],
      madeForYou: [
        { title: 'Not Played Since 2024', description: 'Tracks missing from recent rotation', gradient: 'from-amber-700 to-yellow-500' },
        { title: 'Old Mood, New Moment', description: 'Past favorites matched to today', gradient: 'from-orange-700 to-red-500' },
        { title: 'Rediscovery Mix 1', description: 'Hidden gems from your older plays', gradient: 'from-violet-700 to-purple-500' },
        { title: 'Almost Forgotten', description: 'Songs you used to play more often', gradient: 'from-blue-700 to-indigo-500' },
        { title: 'Saved But Sleeping', description: 'Quiet corners of your library', gradient: 'from-teal-700 to-cyan-500' },
      ],
      discoverWeekly: [
        { title: 'The Comeback List', description: 'Songs ready to re-enter your week', gradient: 'from-amber-700 to-yellow-500' },
        { title: 'Deep Library Radio', description: 'Recommendations from forgotten saves', gradient: 'from-purple-700 to-pink-500' },
        { title: 'Time Capsule Weekly', description: 'Old favorites with nearby discoveries', gradient: 'from-cyan-700 to-blue-500' },
        { title: 'Past Taste, Present Mood', description: 'Your older listening patterns refreshed', gradient: 'from-indigo-700 to-violet-500' },
        { title: 'Hidden Gem Blend', description: 'Rarely played songs and adjacent finds', gradient: 'from-orange-700 to-amber-500' },
      ],
    },
    balanced: {
      topTitle: 'Balanced Discovery',
      madeTitle: 'Half Familiar, Half Fresh',
      discoveryTitle: 'Blended For You',
      recentlyPlayed: [
        { title: '50/50 Discovery Mix', description: 'Regular favorites blended with new finds', gradient: 'from-blue-700 to-cyan-500' },
        { title: 'Fresh Around Your Favorites', description: 'New songs beside tracks you know', gradient: 'from-green-700 to-teal-500' },
        { title: 'Comfort Meets New', description: 'A balanced route out of your routine', gradient: 'from-purple-700 to-blue-500' },
        { title: 'Your Taste, Expanded', description: 'Familiar anchors with fresh edges', gradient: 'from-cyan-700 to-teal-500' },
        { title: 'Balanced Daily Mix', description: 'A safe amount of surprise', gradient: 'from-amber-700 to-orange-500' },
        { title: 'Bridge Songs', description: 'Tracks connecting old favorites to new artists', gradient: 'from-pink-700 to-rose-500' },
      ],
      madeForYou: [
        { title: 'Known And New', description: 'A careful blend of your taste', gradient: 'from-blue-700 to-cyan-500' },
        { title: 'Taste Bridge 1', description: 'Familiar genres with newer voices', gradient: 'from-purple-700 to-pink-500' },
        { title: 'Fresh But Not Random', description: 'New music with recognizable signals', gradient: 'from-green-700 to-emerald-500' },
        { title: 'Middle Ground Mix', description: 'Comfort tracks and discovery tracks together', gradient: 'from-indigo-700 to-violet-500' },
        { title: 'Soft Launch Discovery', description: 'New suggestions without a hard pivot', gradient: 'from-teal-700 to-cyan-500' },
      ],
      discoverWeekly: [
        { title: 'Balanced Discover Weekly', description: '50% fresh tracks and 50% familiar favorites', gradient: 'from-blue-700 to-indigo-500' },
        { title: 'New Neighbors', description: 'Artists close to your current rotation', gradient: 'from-green-700 to-teal-500' },
        { title: 'Discovery With Anchors', description: 'New picks grounded in your favorites', gradient: 'from-purple-700 to-blue-500' },
        { title: 'The Taste Expansion Pack', description: 'A measured step outside your library', gradient: 'from-cyan-700 to-blue-500' },
        { title: 'Half-Step Fresh', description: 'Enough novelty to notice', gradient: 'from-amber-700 to-yellow-500' },
      ],
    },
    fresh: {
      topTitle: 'Fresh Finds',
      madeTitle: 'New Artists For You',
      discoveryTitle: 'Outside Your Usual Rotation',
      recentlyPlayed: [
        { title: 'Fresh Finds For Your Taste', description: 'New artists that match your listening profile', gradient: 'from-violet-700 to-purple-500' },
        { title: 'Never Played Before', description: 'Songs outside your regular history', gradient: 'from-cyan-700 to-blue-500' },
        { title: 'New Artist Radar', description: 'Artists you have not explored yet', gradient: 'from-green-700 to-teal-500' },
        { title: 'Fresh Genre Crossovers', description: 'New sounds near your favorite moods', gradient: 'from-pink-700 to-rose-500' },
        { title: 'Tonight\'s New Saves', description: 'Playlist candidates you may want to keep', gradient: 'from-indigo-700 to-violet-500' },
        { title: 'Recently Emerging', description: 'Fresh tracks gaining signal in your lane', gradient: 'from-amber-700 to-orange-500' },
      ],
      madeForYou: [
        { title: 'Fresh Daily Mix 1', description: 'New artists, familiar energy', gradient: 'from-violet-700 to-purple-500' },
        { title: 'Under-The-Radar Now', description: 'Recent releases near your taste', gradient: 'from-blue-700 to-indigo-500' },
        { title: 'New Voices', description: 'Artists missing from your library', gradient: 'from-green-700 to-emerald-500' },
        { title: 'Fresh But Playable', description: 'New tracks with low-risk fit', gradient: 'from-cyan-700 to-teal-500' },
        { title: 'First Listen Queue', description: 'Songs selected for discovery mode', gradient: 'from-pink-700 to-rose-500' },
      ],
      discoverWeekly: [
        { title: 'Fresh Discover Weekly', description: 'Newer picks with fewer repeats', gradient: 'from-violet-700 to-purple-500' },
        { title: 'Release Radar Expanded', description: 'New releases beyond your usual artists', gradient: 'from-blue-700 to-indigo-500' },
        { title: 'New Artist Sampler', description: 'A quick tour of unfamiliar names', gradient: 'from-green-700 to-teal-500' },
        { title: 'Fresh Match Radio', description: 'New music matched to your listening shape', gradient: 'from-cyan-700 to-blue-500' },
        { title: 'No Repeat Discovery', description: 'Songs you are unlikely to have played before', gradient: 'from-amber-700 to-yellow-500' },
      ],
    },
    wild: {
      topTitle: 'Wild Mode',
      madeTitle: 'Taste Sandbox',
      discoveryTitle: 'Far From Your Usual',
      recentlyPlayed: [
        { title: 'Taste Sandbox', description: 'Unexpected tracks outside your normal lanes', gradient: 'from-violet-700 to-indigo-500' },
        { title: 'Obscure Finds Lab', description: 'Niche artists and low-familiarity picks', gradient: 'from-fuchsia-700 to-purple-500' },
        { title: 'Genre Jump', description: 'A sharper turn away from your routine', gradient: 'from-cyan-700 to-blue-500' },
        { title: 'The Weird Good Queue', description: 'Surprising tracks with a possible spark', gradient: 'from-amber-700 to-orange-500' },
        { title: 'Deep Internet Signals', description: 'Discovery inspired by emerging sounds', gradient: 'from-green-700 to-teal-500' },
        { title: 'Wild Card Radio', description: 'Less predictable recommendations', gradient: 'from-pink-700 to-rose-500' },
      ],
      madeForYou: [
        { title: 'Experimental Daily Mix', description: 'A wider swing from your profile', gradient: 'from-violet-700 to-indigo-500' },
        { title: 'Niche Genre Portal', description: 'Obscure styles and unexpected artists', gradient: 'from-fuchsia-700 to-purple-500' },
        { title: 'Algorithm Breakout', description: 'Recommendations with fewer comfort anchors', gradient: 'from-blue-700 to-cyan-500' },
        { title: 'Underground Sampler', description: 'Artists far from your main rotation', gradient: 'from-green-700 to-teal-500' },
        { title: 'Risky But Interesting', description: 'Songs chosen for surprise', gradient: 'from-amber-700 to-yellow-500' },
      ],
      discoverWeekly: [
        { title: 'Wild Discover Weekly', description: 'Niche, strange, and less predictable picks', gradient: 'from-violet-700 to-indigo-500' },
        { title: 'Far Edge Finds', description: 'Music at the outer edge of your taste', gradient: 'from-fuchsia-700 to-purple-500' },
        { title: 'Sandbox Releases', description: 'New tracks with exploratory energy', gradient: 'from-cyan-700 to-blue-500' },
        { title: 'Deep Cut Discovery', description: 'Rare artists and unusual genre links', gradient: 'from-green-700 to-emerald-500' },
        { title: 'Surprise Me Queue', description: 'A deliberately less familiar playlist', gradient: 'from-orange-700 to-amber-500' },
      ],
    },
  };

  const homepageContent = homepageByDiscovery[discoveryStage] || homepageByDiscovery.familiar;
  const { recentlyPlayed, madeForYou, discoverWeekly } = homepageContent;

  const songSuggestions = filteredTracks.slice(0, 10);
  const renderPlaylistCard = (item, index) => (
    <button
      key={item.title}
      onClick={() => openSuggestionPlaylist(item, index)}
      className="bg-gradient-to-br from-spotify-light to-spotify-dark rounded-lg p-4 hover:bg-spotify-light transition-colors group cursor-pointer relative overflow-hidden text-left"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
      <div className="relative">
        <div className="w-full aspect-square bg-gradient-to-br from-spotify-light to-spotify-dark rounded-md mb-4 flex items-center justify-center">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg`}>
            <Play size={24} className="text-white ml-1" />
          </div>
        </div>
        <h3 className="font-bold text-white truncate">{item.title}</h3>
        <p className="text-sm text-spotify-lighter line-clamp-2">{item.description}</p>
      </div>
    </button>
  );

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-spotify-dark to-spotify-black">
      {/* Recently Played - 6 slots at top */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">{homepageContent.topTitle}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {recentlyPlayed.map(renderPlaylistCard)}
        </div>
      </section>

      {/* Made For You */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">{homepageContent.madeTitle}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {madeForYou.map(renderPlaylistCard)}
        </div>
      </section>

      {/* Discover Weekly */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">{homepageContent.discoveryTitle}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {discoverWeekly.map(renderPlaylistCard)}
        </div>
      </section>

      {/* Song Suggestions */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Recommended Songs</h2>
        <div className="bg-spotify-light/10 rounded-lg overflow-hidden">
          <div className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-2 border-b border-spotify-light/20 text-spotify-lighter text-sm">
            <span>#</span>
            <span>Title</span>
            <span>Album</span>
            <span className="text-right">
              <Clock size={14} />
            </span>
          </div>

          {songSuggestions.map((track, index) => (
            <div
              key={track.id}
              onClick={() => handleTrackClick(track)}
              className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-3 hover:bg-spotify-light/20 cursor-pointer group items-center transition-colors"
            >
              <div className="relative">
                <span className="text-spotify-lighter group-hover:hidden">{index + 1}</span>
                <Play size={14} className="text-white hidden group-hover:block absolute top-1/2 -translate-y-1/2" />
              </div>
              
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-10 h-10 rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{track.title}</p>
                  <p className="text-spotify-lighter text-sm truncate">{track.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <span className="text-spotify-lighter text-sm truncate">{track.album}</span>
                {track.isDownloadedOffline && (
                  <Download size={14} className="text-spotify-green flex-shrink-0" />
                )}
              </div>

              <div className="text-right flex items-center justify-end gap-2">
                <span className="text-spotify-lighter text-sm">{track.duration}</span>
                <button className="text-spotify-lighter hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomeFeed;
