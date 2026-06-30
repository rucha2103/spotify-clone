import { useState } from 'react'
import { PlaybackProvider } from './context/PlaybackContext'
import Sidebar from './components/Sidebar'
import PlayerBar from './components/PlayerBar'
import DiscoveryControl from './components/DiscoveryControl'
import HomeFeed from './components/HomeFeed'

function App() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false)

  const handlePlaylistSelect = (playlist) => {
    setSelectedPlaylist(playlist)
  }

  const handleHomeClick = () => {
    setSelectedPlaylist(null)
  }

  return (
    <PlaybackProvider>
      <div className="flex h-screen flex-col">
        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar 
            onPlaylistSelect={handlePlaylistSelect} 
            selectedPlaylist={selectedPlaylist}
            onHomeClick={handleHomeClick}
          />
          <div className="flex flex-1 flex-col overflow-hidden">
            <DiscoveryControl onOpenChange={setIsDiscoveryOpen} />
            <HomeFeed selectedPlaylist={selectedPlaylist} />
          </div>
        </div>
        
        {/* Player Bar */}
        {!isDiscoveryOpen && <PlayerBar />}
      </div>
    </PlaybackProvider>
  )
}

export default App
