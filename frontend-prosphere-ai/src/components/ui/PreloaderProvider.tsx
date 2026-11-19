'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export const PreloaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const pathname = usePathname();
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    // Wait for fonts and styles to be active
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setMounted(true);
      }, 400); // 400ms fade transition
    }, 550);

    return () => clearTimeout(timer);
  }, []);

  // Top slim progress bar during route transitions
  useEffect(() => {
    setRouteLoading(true);
    const routeTimer = setTimeout(() => {
      setRouteLoading(false);
    }, 300);
    return () => clearTimeout(routeTimer);
  }, [pathname]);

  return (
    <>
      {/* Top Slim Loading Bar during navigation */}
      {routeLoading && (
        <div className="fixed top-0 left-0 right-0 h-0.5 z-[999999] bg-gradient-to-r from-secondary via-primary to-secondary animate-pulse shadow-[0_0_8px_rgba(158,233,57,0.8)]" />
      )}

      {/* Initial Hard Refresh / Full Screen Preloader */}
      {!mounted && (
        <div
          className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#03170b] transition-opacity duration-400 ease-out select-none ${
            isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{ backgroundColor: '#03170b' }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-primary/10 via-secondary/15 to-transparent blur-3xl pointer-events-none animate-pulse" />

          {/* Centered Brand Loading Box */}
          <div className="relative flex flex-col items-center z-10">
            {/* Logo Icon with glowing ring */}
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#0b2013] border border-primary/40 flex items-center justify-center shadow-[0_0_25px_rgba(158,233,57,0.3)] relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-secondary/40 to-transparent animate-spin"
                  style={{ animationDuration: '2.5s' }}
                />
                <div className="relative z-10 w-12 h-12 rounded-xl bg-[#0f2417] flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[28px] animate-pulse">
                    auto_awesome
                  </span>
                </div>
              </div>
            </div>

            {/* Logo Wordmark */}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-2xl text-[#d0e9d4] tracking-tight font-display">
                ProSphere
              </span>
              <span className="bg-primary text-[#1f3700] font-bold text-xs px-2 py-0.5 rounded shadow-[0_0_8px_rgba(158,233,57,0.4)]">
                AI
              </span>
            </div>

            {/* Subtitle */}
            <p className="text-xs text-[#c1cab0] font-medium tracking-wide mb-5">
              Loading Live Telemetry & Insights...
            </p>

            {/* Glowing Loading Bar */}
            <div className="w-44 h-1.5 bg-[#0f2417] rounded-full overflow-hidden p-0.5 border border-[#424936]/40">
              <div className="h-full bg-gradient-to-r from-secondary via-primary to-secondary rounded-full shadow-[0_0_10px_rgba(158,233,57,0.7)] animate-pulse" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={!mounted ? 'opacity-90' : 'opacity-100 transition-opacity duration-300'}>
        {children}
      </div>
    </>
  );
};
