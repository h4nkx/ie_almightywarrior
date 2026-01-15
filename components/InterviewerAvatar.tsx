
import * as React from 'react';

interface InterviewerAvatarProps {
  isThinking: boolean;
  onClick: () => void;
}

const InterviewerAvatar = ({ isThinking, onClick }: InterviewerAvatarProps) => {
  return (
    <div 
      onClick={onClick}
      className="relative group cursor-pointer flex flex-col items-center"
    >
      {/* Background Decorative Circles - Completely Static */}
      <div className="absolute -top-10 w-64 h-64 border border-blue-500/10 rounded-full opacity-20"></div>
      <div className="absolute -top-6 w-48 h-48 border border-dashed border-cyan-500/10 rounded-full opacity-20"></div>

      {/* Interviewer Character Container */}
      <div className="relative w-56 h-72 perspective-1000">
        <svg 
          viewBox="0 0 200 250" 
          className="w-full h-full drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] transition-transform duration-500"
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
          
          {/* Hair */}
          <path 
            d="M63 85 C 60 50, 80 30, 100 30 C 125 30, 140 50, 137 85 L 140 100 L 130 95 C 120 80, 80 80, 70 95 L 60 100 Z" 
            fill="#334155" 
          />

          {/* Eyes & Glasses */}
          <g>
            <path d="M70 105 L 95 105 M 105 105 L 130 105" stroke="#0f172a" strokeWidth="3" />
            <rect x="72" y="98" width="22" height="15" rx="2" fill="rgba(147,197,253,0.1)" stroke="#1e293b" strokeWidth="1" />
            <rect x="106" y="98" width="22" height="15" rx="2" fill="rgba(147,197,253,0.1)" stroke="#1e293b" strokeWidth="1" />
            {/* Simple Lenses Highlight */}
            <line x1="75" y1="102" x2="90" y2="102" stroke="#60a5fa" strokeWidth="1" opacity={isThinking ? 0.6 : 0.2} />
            <line x1="110" y1="108" x2="125" y2="108" stroke="#60a5fa" strokeWidth="1" opacity={isThinking ? 0.6 : 0.2} />
          </g>

          {/* Completely Static Mouth */}
          <path 
            d="M92 158 L 108 158"
            fill="none" 
            stroke="#94a3b8" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* Nameplate */}
      <div className="mt-2 text-center">
        <div className="bg-slate-900 border px-6 py-1.5 rounded-lg shadow-lg border-b-2 border-slate-700 border-b-blue-600 transition-colors duration-500">
          <p className="text-white text-sm font-bold tracking-tight">首席面试官：徐博士</p>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-500">
            SYSTEM_ACTIVE
          </p>
        </div>
        
        {/* Simple Status Text */}
        <div className="mt-3 flex justify-center items-center h-4">
            {isThinking && (
              <span className="text-blue-400 text-[9px] font-mono uppercase tracking-[0.1em]">正在思考回答...</span>
            )}
        </div>
      </div>
    </div>
  );
};

export default InterviewerAvatar;
