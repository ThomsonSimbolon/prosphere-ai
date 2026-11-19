import React from 'react';

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#03170b] select-none"
      style={{ backgroundColor: '#03170b' }}
    >
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-primary/10 via-secondary/15 to-transparent blur-3xl pointer-events-none animate-pulse" />

      {/* Centered Brand Loading Box */}
      <div className="relative flex flex-col items-center z-10">
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

        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-2xl text-[#d0e9d4] tracking-tight font-display">
            ProSphere
          </span>
          <span className="bg-primary text-[#1f3700] font-bold text-xs px-2 py-0.5 rounded shadow-[0_0_8px_rgba(158,233,57,0.4)]">
            AI
          </span>
        </div>

        <p className="text-xs text-[#c1cab0] font-medium tracking-wide mb-5">
          Loading Live Telemetry & Insights...
        </p>

        <div className="w-44 h-1.5 bg-[#0f2417] rounded-full overflow-hidden p-0.5 border border-[#424936]/40">
          <div
            className="h-full bg-gradient-to-r from-secondary via-primary to-secondary rounded-full shadow-[0_0_10px_rgba(158,233,57,0.7)] animate-pulse"
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}
