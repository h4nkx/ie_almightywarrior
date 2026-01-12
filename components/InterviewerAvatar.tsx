
import * as React from 'react';

interface InterviewerAvatarProps {
  isThinking: boolean;
  onClick: () => void;
}

/**
 * Renders the interviewer character Dr. Lu.
 * Uses explicit React imports to ensure IntrinsicElements are correctly typed 
 * in all environments.
 */
const InterviewerAvatar = ({ isThinking, onClick }: InterviewerAvatarProps) => {
  return (
    <div 
      onClick={onClick}
      className="relative group cursor-pointer flex flex-col items-center"
    >
      {/* Background Tech Circle (Hologram) */}
      <div className={`absolute -top-10 w-64 h-64 border border-blue-500/10 rounded-full animate-[spin_10s_linear_infinite] ${isThinking ? 'border-blue-500/40 opacity-100' : 'opacity-30'}`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
      </div>
      <div className={`absolute -top-6 w-48 h-48 border border-dashed border-cyan-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse] ${isThinking ? 'opacity-100' : 'opacity-20'}`}></div>

      {/* Interviewer Character Container */}
      <div className="relative w-56 h-72 perspective-1000">
        <svg 
          viewBox="0 0 200 250" 
          className="w-full h-full drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-105"
        >
          {/* Suit Shoulder */}
          <path 
            d="M20 250 C 20 210, 50 180, 100 180 C 150 180, 180 210, 180 250" 
            fill="#1e293b" 
            stroke="#334155" 
            strokeWidth="2"
          />
          <path d="M70 180 L 100 220 L 130 180" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          {/* Tie */}
          <path d="M95 195 L 105 195 L 102 245 L 98 245 Z" fill="#991b1b" />
          
          {/* Head & Neck */}
          <rect x="85" y="160" width="30" height="25" fill="#f1f5f9" />
          <path 
            d="M65 80 C 65 40, 135 40, 135 80 L 135 150 C 135 180, 65 180, 65 150 Z" 
            fill="#f8fafc" 
            stroke="#e2e8f0" 
            strokeWidth="1"
          />
          
          {/* Hair - Sharp Executive Cut */}
          <path 
            d="M63 85 C 60 50, 80 30, 100 30 C 125 30, 140 50, 137 85 L 140 100 L 130 95 C 120 80, 80 80, 70 95 L 60 100 Z" 
            fill="#334155" 
          />

          {/* Eyes & Glasses */}
          <g className={isThinking ? 'animate-pulse' : ''}>
            {/* Tech Glasses Frame */}
            <path d="M70 105 L 95 105 M 105 105 L 130 105" stroke="#0f172a" strokeWidth="3" />
            <rect x="72" y="98" width="22" height="15" rx="2" fill="rgba(147,197,253,0.1)" stroke="#1e293b" strokeWidth="1" />
            <rect x="106" y="98" width="22" height="15" rx="2" fill="rgba(147,197,253,0.1)" stroke="#1e293b" strokeWidth="1" />
            {/* Blue Glow in lenses */}
            <line x1="75" y1="102" x2="90" y2="102" stroke="#60a5fa" strokeWidth="1" opacity={isThinking ? 0.8 : 0.2} />
            <line x1="110" y1="108" x2="125" y2="108" stroke="#60a5fa" strokeWidth="1" opacity={isThinking ? 0.8 : 0.2} />
          </g>

          {/* Mouth */}
          <path 
            d={isThinking ? "M90 155 Q 100 165 110 155" : "M92 158 L 108 158"} 
            fill="none" 
            stroke="#94a3b8" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-all flex items-end justify-center pb-12 opacity-0 group-hover:opacity-100">
            <div className="bg-slate-900/90 backdrop-blur-md border border-blue-500/30 px-3 py-1.5 rounded-full shadow-2xl">
                <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Open AI Menu</span>
            </div>
        </div>
      </div>
      
      {/* Nameplate */}
      <div className="mt-2 text-center">
        <div className="bg-slate-900 border border-slate-700 px-6 py-1.5 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.4)] border-b-2 border-b-blue-600">
          <p className="text-white text-sm font-bold tracking-tight">首席面试官：陆博士 (Dr. Industrial)</p>
          <p className="text-blue-500 text-[10px] font-mono uppercase tracking-[0.2em]">Tier-1 System Architect</p>
        </div>
        {/* Active Thinking Indicator */}
        {isThinking && (
          <div className="mt-2 flex justify-center space-x-1">
             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
             <span className="text-blue-400 text-[10px] font-mono animate-pulse uppercase">Processing IE Metrics...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewerAvatar;
