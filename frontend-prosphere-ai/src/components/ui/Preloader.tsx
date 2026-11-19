import React from 'react';
import { Icon } from './Icon';

interface PreloaderProps {
  isLoading?: boolean;
}

export const Preloader: React.FC<PreloaderProps> = ({ isLoading = true }) => {
  if (!isLoading) return null;

  return (
    <div
      id="prosphere-preloader"
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#03170b] transition-opacity duration-500 ease-out select-none"
    >
      {/* Background radial gradient glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-primary/10 via-secondary/15 to-transparent blur-3xl pointer-events-none animate-pulse" />

      {/* Main Logo & Ring Container */}
      <div className="relative flex flex-col items-center z-10">
        {/* Animated Glowing Ring */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-surface-container-low border border-primary/30 flex items-center justify-center shadow-[0_0_30px_rgba(158,233,57,0.25)] relative overflow-hidden group">
            {/* Spinning gradient border accent */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-secondary/30 to-transparent animate-spin" style={{ animationDuration: '3s' }} />
            <div className="relative z-10 w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center">
              <Icon name="auto_awesome" size={32} className="text-primary animate-pulse" />
            </div>
          </div>
        </div>

        {/* Brand Text */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">
            ProSphere
          </span>
          <span className="bg-primary text-on-primary font-bold text-xs px-2 py-0.5 rounded shadow-[0_0_10px_rgba(158,233,57,0.4)]">
            AI
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-xs text-on-surface-variant font-medium tracking-wide mb-6">
          Initializing Enterprise Telemetry...
        </p>

        {/* Progress Bar Track */}
        <div className="w-48 h-1.5 bg-surface-container rounded-full overflow-hidden p-0.5 border border-outline-variant/30">
          <div className="h-full bg-gradient-to-r from-secondary via-primary to-secondary rounded-full shadow-[0_0_12px_rgba(158,233,57,0.6)] animate-pulse" style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  );
};
