import { useEffect, useState } from 'react';
import { Sparkles, ChevronDown, Lock, Sliders, Radio, Check } from 'lucide-react';
import { usePlayback } from '../context/PlaybackContext';

const DiscoveryControl = ({ onOpenChange }) => {
  const { discoveryStage, changeDiscoveryStage } = usePlayback();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingStage, setPendingStage] = useState(discoveryStage);

  const stages = [
    { id: 'familiar', label: 'Familiar', color: 'from-green-500 to-emerald-400', icon: '🎯', description: 'Your most played tracks and favorites' },
    { id: 'rediscover', label: 'Rediscover', color: 'from-amber-500 to-yellow-400', icon: '⏳', description: 'Forgotten gems from your library' },
    { id: 'balanced', label: 'Balanced', color: 'from-blue-500 to-cyan-400', icon: '⚖️', description: '50% fresh tracks & 50% familiar favorites' },
    { id: 'fresh', label: 'Fresh', color: 'from-violet-500 to-purple-400', icon: '✨', description: 'New artists matching your taste' },
    { id: 'wild', label: 'Wild', color: 'from-violet-600 to-indigo-500', icon: '🚀', description: 'Explore niche genres and obscure tracks' },
  ];

  const currentStage = stages.find(s => s.id === discoveryStage);
  const pendingStageDetails = stages.find(s => s.id === pendingStage);
  const pendingStageIndex = stages.findIndex(s => s.id === pendingStage);

  useEffect(() => {
    setPendingStage(discoveryStage);
  }, [discoveryStage]);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  const handleStageSelect = (stageId) => {
    setPendingStage(stageId);
    changeDiscoveryStage(stageId);
  };

  const handleSliderChange = (event) => {
    handleStageSelect(stages[Number(event.target.value)].id);
  };

  const handleApplyChanges = () => {
    setIsOpen(false);
  };

  const togglePanel = () => {
    setIsOpen(prev => !prev);
  };

  const getStageIndex = () => stages.findIndex(s => s.id === discoveryStage);

  return (
    <div className="relative">
      {/* Discovery Bar - Accordion Style */}
      <div className="sticky top-0 z-40 bg-gradient-to-b from-spotify-black via-spotify-black/95 to-transparent p-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* Accordion Trigger */}
          <button
            onClick={togglePanel}
            className="flex-1 max-w-md flex items-center justify-between px-4 py-3 bg-spotify-light/10 rounded-xl border border-spotify-light/20 hover:border-spotify-green/50 hover:bg-spotify-light/20 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-spotify-green rounded-lg">
                <Sparkles size={16} className="text-white" />
              </div>
              <div className="text-left">
                <span className="text-xs font-semibold text-spotify-green uppercase tracking-wider">Discovery</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">{currentStage?.label}</span>
                  <span className="text-xl">{currentStage?.icon}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i <= getStageIndex() ? 'bg-spotify-green' : 'bg-spotify-light/30'
                    }`}
                  />
                ))}
              </div>
              <ChevronDown 
                size={18} 
                className={`text-spotify-lighter transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              />
            </div>
          </button>

          {/* User Profile */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full cursor-pointer hover:scale-105 transition-transform" />
          </div>
        </div>

        {/* Accordion Content - Discovery Stages */}
        {isOpen && (
          <div className="mt-4 p-5 bg-spotify-light/10 rounded-xl border border-spotify-light/20 animate-in fade-in slide-in-from-top-2 duration-200 relative overflow-hidden">
            <div className={`absolute inset-0 opacity-20 pointer-events-none ${
              pendingStage === 'rediscover'
                ? 'bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.45),transparent_42%)]'
                : pendingStage === 'wild'
                  ? 'bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.55),transparent_46%)]'
                  : pendingStage === 'fresh'
                    ? 'bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.4),transparent_44%)]'
                    : 'bg-[radial-gradient(circle_at_top_right,rgba(29,185,84,0.42),transparent_42%)]'
            }`} />

            <div className="relative">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2">
                  <Sliders size={20} className="text-spotify-green" />
                  <h3 className="text-sm font-semibold text-white">Discovery Dial</h3>
                </div>
                <button
                  onClick={handleApplyChanges}
                  className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-spotify-green px-4 py-2 text-sm font-bold text-black shadow-[0_0_18px_rgba(29,185,84,0.22)] transition-all hover:scale-[1.02] hover:bg-spotify-greenHover"
                >
                  <Check size={16} />
                  Apply changes
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-lg font-bold text-white">{pendingStageDetails?.label}</p>
                    <p className="text-xs text-spotify-lighter">{pendingStageDetails?.description}</p>
                  </div>
                  <span className="text-2xl">{pendingStageDetails?.icon}</span>
                </div>

                <div className="relative px-1">
                  <div className="absolute left-1 right-1 top-1/2 h-1 -translate-y-1/2 rounded-full bg-spotify-light" />
                  <div
                    className="absolute left-1 top-1/2 h-1 -translate-y-1/2 rounded-full bg-spotify-green"
                    style={{ width: `calc(${pendingStageIndex * 25}% - ${pendingStageIndex === 0 ? 0 : 2}px)` }}
                  />
                  <input
                    type="range"
                    min="0"
                    max={stages.length - 1}
                    step="1"
                    value={pendingStageIndex}
                    onChange={handleSliderChange}
                    aria-label="Discovery type"
                    className="discovery-slider relative z-10 w-full"
                  />
                </div>

                <div className="mt-2 grid grid-cols-5 gap-2">
                  {stages.map((stage) => (
                    <button
                      key={stage.id}
                      onClick={() => handleStageSelect(stage.id)}
                      className={`min-w-0 rounded-md px-1 py-1.5 text-[11px] font-semibold transition-colors ${
                        pendingStage === stage.id
                          ? 'text-white bg-white/10'
                          : 'text-spotify-lighter hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="block truncate">{stage.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative grid grid-cols-1 gap-2 xl:grid-cols-5">
              {stages.map((stage, index) => (
                <button
                  key={stage.id}
                  onClick={() => handleStageSelect(stage.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-all relative overflow-hidden group ${
                    pendingStage === stage.id
                      ? 'bg-gradient-to-r ' + stage.color + ' border-white/30'
                      : 'bg-spotify-light/10 border-spotify-light/20 hover:bg-spotify-light/20 hover:border-spotify-light/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{stage.icon}</span>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">
                            {stage.label}
                          </span>
                          {stage.id === 'wild' && (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/30 rounded-full border border-amber-500/50">
                              <Lock size={10} className="text-amber-400" />
                              <span className="text-xs font-semibold text-amber-400">Sandbox</span>
                            </div>
                          )}
                        </div>
                        <p className={`text-xs mt-0.5 ${pendingStage === stage.id ? 'text-white/80' : 'text-spotify-lighter'}`}>
                          {stage.description}
                        </p>
                      </div>
                    </div>
                    
                    {pendingStage === stage.id && (
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <Radio size={12} className="text-spotify-green fill-current" />
                      </div>
                    )}
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="mt-2 flex gap-0.5">
                    {stages.map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-0.5 rounded-full transition-all ${
                          i <= index 
                            ? pendingStage === stage.id 
                              ? 'bg-white' 
                              : 'bg-spotify-light/30'
                            : 'bg-spotify-light/10'
                        }`}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Wild Mode Banner */}
      {discoveryStage === 'wild' && !isOpen && (
        <div className="mx-4 mt-4 bg-gradient-to-r from-violet-600/30 to-indigo-600/30 border-2 border-violet-500/50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/20">
              <Lock size={16} className="text-violet-300" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-violet-200">
                Taste Sandbox Mode Active
              </p>
              <p className="mt-1 max-w-2xl text-sm leading-5 text-violet-100/85">
                Wild Mode is a protected discovery space. Songs you play here help you explore niche genres and unexpected artists, but they will not affect your regular Spotify recommendations or reshape your usual mixes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoveryControl;
