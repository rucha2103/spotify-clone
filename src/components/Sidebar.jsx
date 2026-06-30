import { Home, Search, Library, Plus, Heart } from 'lucide-react';
import { useState } from 'react';
import musicDatabase from '../data/musicDatabase';

const Sidebar = ({ onPlaylistSelect, selectedPlaylist, onHomeClick }) => {
  const mockPlaylists = [
    { id: 1, name: "Chill Mix", icon: Heart, songs: musicDatabase.filter(song => song.genre === 'Indie').slice(0, 15) },
    { id: 2, name: "Coding Session", icon: Heart, songs: musicDatabase.filter(song => song.genre === 'Synthwave').slice(0, 15) },
    { id: 3, name: "Gym", icon: Heart, songs: musicDatabase.filter(song => song.genre === 'HipHop').slice(0, 15) },
    { id: 4, name: "Favorite Tracks", icon: Heart, songs: musicDatabase.filter(song => song.isLiked).slice(0, 20) },
  ];

  const handlePlaylistClick = (playlist) => {
    if (onPlaylistSelect) {
      onPlaylistSelect(playlist);
    }
  };

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    }
  };

  return (
    <aside className="w-64 bg-black flex flex-col p-2 gap-2 flex-shrink-0">
      {/* Spotify Logo */}
      <div className="bg-spotify-dark rounded-lg p-4">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <span className="text-xl font-bold text-white">Spotify</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-spotify-dark rounded-lg p-4">
        <ul className="space-y-4">
          <li>
            <a href="#" onClick={handleHomeClick} className="flex items-center gap-4 text-white font-semibold hover:text-white transition-colors">
              <Home size={24} />
              <span>Home</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-4 text-spotify-lighter font-semibold hover:text-white transition-colors">
              <Search size={24} />
              <span>Search</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Library Section */}
      <div className="bg-spotify-dark rounded-lg p-4 flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-spotify-lighter hover:text-white cursor-pointer transition-colors">
            <Library size={24} />
            <span className="font-semibold">Your Library</span>
          </div>
          <button className="text-spotify-lighter hover:text-white transition-colors">
            <Plus size={20} />
          </button>
        </div>

        {/* Mock Playlists */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {mockPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => handlePlaylistClick(playlist)}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors group ${
                selectedPlaylist?.id === playlist.id ? 'bg-spotify-light/30' : 'hover:bg-spotify-light'
              }`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-700 to-blue-500 rounded flex items-center justify-center flex-shrink-0">
                <Heart size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{playlist.name}</p>
                <p className="text-spotify-lighter text-sm truncate">Playlist • {playlist.songs.length} songs</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
