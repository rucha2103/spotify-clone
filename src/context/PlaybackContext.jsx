import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const PlaybackContext = createContext();

export const PlaybackProvider = ({ children }) => {
  // HTML5 Audio object instance
  const audioRef = useRef(null);
  
  // Current track being played
  const [currentTrack, setCurrentTrack] = useState(null);
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Progress timeline (current time in seconds)
  const [progress, setProgress] = useState(0);
  
  // Duration in seconds
  const [duration, setDuration] = useState(0);
  
  // Discovery dial stage
  const [discoveryStage, setDiscoveryStage] = useState('familiar');
  
  // Offline mode toggle
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  // Volume control (0-1)
  const [volume, setVolume] = useState(0.7);
  
  // Loop mode: 'off', 'all', 'one'
  const [loopMode, setLoopMode] = useState('off');
  
  // Shuffle mode
  const [isShuffle, setIsShuffle] = useState(false);
  
  // Queue of tracks
  const [queue, setQueue] = useState([]);
  
  // Current queue index
  const [queueIndex, setQueueIndex] = useState(0);
  
  // Loading state for track changes
  const [isLoading, setIsLoading] = useState(false);

  // Initialize audio object on mount
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update volume when state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle timeupdate event - update progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (loopMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNextTrack();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [loopMode]);

  // Play a specific track
  const playTrack = useCallback((track) => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsLoading(true);
    
    // Unload previous audio
    audio.pause();
    audio.currentTime = 0;
    
    // Set new audio source
    audio.src = track.audioUrl;
    
    // Update state
    setCurrentTrack(track);
    setProgress(0);
    
    // Play the new track
    audio.play()
      .then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error playing track:', error);
        setIsLoading(false);
      });
  }, []);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  }, [isPlaying, currentTrack]);

  // Handle next track
  const handleNextTrack = useCallback(() => {
    if (queue.length > 0) {
      const nextIndex = isShuffle 
        ? Math.floor(Math.random() * queue.length)
        : (queueIndex + 1) % queue.length;
      
      setQueueIndex(nextIndex);
      playTrack(queue[nextIndex]);
    }
  }, [queue, queueIndex, isShuffle, playTrack]);

  // Handle previous track
  const handlePreviousTrack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (progress > 3) {
      // If more than 3 seconds in, restart current track
      audio.currentTime = 0;
    } else {
      if (queue.length > 0) {
        const prevIndex = isShuffle
          ? Math.floor(Math.random() * queue.length)
          : (queueIndex - 1 + queue.length) % queue.length;
        
        setQueueIndex(prevIndex);
        playTrack(queue[prevIndex]);
      }
    }
  }, [progress, queue, queueIndex, isShuffle, playTrack]);

  // Seek to specific position (in seconds)
  const seekTo = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = time;
    setProgress(time);
  }, []);

  // Adjust volume (0-1)
  const adjustVolume = useCallback((val) => {
    const normalizedVolume = Math.max(0, Math.min(1, val));
    setVolume(normalizedVolume);
  }, []);

  // Set queue
  const setQueueTracks = useCallback((tracks) => {
    setQueue(tracks);
    setQueueIndex(0);
  }, []);

  // Toggle loop mode
  const toggleLoopMode = useCallback(() => {
    setLoopMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  // Toggle shuffle
  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => !prev);
  }, []);

  // Toggle offline mode
  const toggleOfflineMode = useCallback(() => {
    setIsOfflineMode(prev => !prev);
  }, []);

  // Change discovery stage
  const changeDiscoveryStage = useCallback((stage) => {
    setDiscoveryStage(stage);
  }, []);

  const value = {
    // State
    currentTrack,
    isPlaying,
    progress,
    duration,
    discoveryStage,
    isOfflineMode,
    volume,
    loopMode,
    isShuffle,
    queue,
    queueIndex,
    isLoading,
    
    // Actions
    playTrack,
    togglePlayPause,
    handleNextTrack,
    handlePreviousTrack,
    seekTo,
    adjustVolume,
    setQueueTracks,
    toggleLoopMode,
    toggleShuffle,
    toggleOfflineMode,
    changeDiscoveryStage,
    setIsLoading,
  };

  return (
    <PlaybackContext.Provider value={value}>
      {children}
    </PlaybackContext.Provider>
  );
};

export const usePlayback = () => {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
};
