import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Mic2, Headphones, Monitor, Volume2, Heart } from 'lucide-react';
import { usePlayback } from '../context/PlaybackContext';

const PlayerBar = () => {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    loopMode,
    isShuffle,
    togglePlayPause,
    handleNextTrack,
    handlePreviousTrack,
    seekTo,
    adjustVolume,
    toggleLoopMode,
    toggleShuffle,
  } = usePlayback();

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLoopIcon = () => {
    if (loopMode === 'one') return <Repeat size={16} className="text-spotify-green" />;
    if (loopMode === 'all') return <Repeat size={16} className="text-spotify-green" />;
    return <Repeat size={16} />;
  };

  return (
    <footer className="h-20 bg-spotify-dark border-t border-spotify-light/20 px-4 flex items-center justify-between">
      {/* Left: Track Info */}
      <div className="flex items-center gap-4 w-1/4 min-w-[180px]">
        {currentTrack ? (
          <>
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-14 h-14 rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{currentTrack.title}</p>
              <p className="text-spotify-lighter text-sm truncate">{currentTrack.artist}</p>
            </div>
            <button className="text-spotify-lighter hover:text-white transition-colors">
              <Heart size={16} />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-spotify-light rounded" />
            <div className="flex-1">
              <div className="h-4 bg-spotify-light rounded w-3/4 mb-2" />
              <div className="h-3 bg-spotify-light rounded w-1/2" />
            </div>
          </div>
        )}
      </div>

      {/* Center: Player Controls */}
      <div className="flex flex-col items-center gap-2 w-2/4 max-w-[722px]">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleShuffle}
            className={`text-spotify-lighter hover:text-white transition-colors ${isShuffle ? 'text-spotify-green' : ''}`}
          >
            <Shuffle size={16} />
          </button>
          <button
            onClick={handlePreviousTrack}
            className="text-spotify-lighter hover:text-white transition-colors"
          >
            <SkipBack size={20} />
          </button>
          <button
            onClick={togglePlayPause}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={16} className="text-black" /> : <Play size={16} className="text-black ml-0.5" />}
          </button>
          <button
            onClick={handleNextTrack}
            className="text-spotify-lighter hover:text-white transition-colors"
          >
            <SkipForward size={20} />
          </button>
          <button
            onClick={toggleLoopMode}
            className="text-spotify-lighter hover:text-white transition-colors"
          >
            {getLoopIcon()}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-spotify-lighter w-10 text-right">
            {formatTime(progress)}
          </span>
          <div
            className="flex-1 h-1 bg-spotify-light rounded-full cursor-pointer group relative"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percentage = (e.clientX - rect.left) / rect.width;
              const seekTime = percentage * duration;
              seekTo(seekTime);
            }}
          >
            <div
              className="h-full bg-white rounded-full relative group-hover:bg-spotify-green transition-colors"
              style={{ width: duration > 0 ? `${(progress / duration) * 100}%` : '0%' }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <span className="text-xs text-spotify-lighter w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right: Volume & Extra Controls */}
      <div className="flex items-center gap-3 w-1/4 justify-end">
        <button className="text-spotify-lighter hover:text-white transition-colors" title="Start a Spotify Jam Session">
          <Mic2 size={18} />
        </button>
        <button className="text-spotify-lighter hover:text-white transition-colors" title="Smartwatch / Laptop Controller Sync">
          <Headphones size={18} />
        </button>
        <button className="text-spotify-lighter hover:text-white transition-colors" title="Connect to a device">
          <Monitor size={18} />
        </button>
        <div className="flex items-center gap-2 group">
          <button className="text-spotify-lighter hover:text-white transition-colors">
            <Volume2 size={18} />
          </button>
          <div
            className="w-24 h-1 bg-spotify-light rounded-full cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percentage = (e.clientX - rect.left) / rect.width;
              adjustVolume(percentage);
            }}
          >
            <div
              className="h-full bg-white rounded-full group-hover:bg-spotify-green transition-colors"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PlayerBar;
