import React from 'react';
import { EmoteType } from '../types';

interface MascotProps {
  emote: EmoteType;
}

const Mascot: React.FC<MascotProps> = ({ emote }) => {
  
  // Base colors
  const skinColor = "#FFD1A9";
  const uniformColor = "#1e3a8a"; // Dark blue
  const accentColor = "#fbbf24"; // Gold/Yellow

  // Render eyes based on emote
  const renderEyes = () => {
    if (emote === EmoteType.SMILE) {
      return (
        <g>
          {/* Joyful arches */}
          <path d="M70 95 Q85 85 100 95" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" />
          <path d="M140 95 Q155 85 170 95" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    } else if (emote === EmoteType.SERIOUS) {
      return (
        <g>
          {/* Focused circles */}
          <circle cx="85" cy="95" r="8" fill="#333" />
          <circle cx="155" cy="95" r="8" fill="#333" />
          {/* Eyebrows determined */}
          <path d="M70 85 L100 90" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
          <path d="M170 85 L140 90" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    } else if (emote === EmoteType.BOW) {
      return (
        <g>
           {/* Closed eyes happy */}
           <path d="M70 100 Q85 105 100 100" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" />
           <path d="M140 100 Q155 105 170 100" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    }
    // Neutral
    return (
      <g>
        <circle cx="85" cy="95" r="8" fill="#333" />
        <circle cx="155" cy="95" r="8" fill="#333" />
        <path d="M70 80 Q85 75 100 80" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        <path d="M140 80 Q155 75 170 80" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      </g>
    );
  };

  // Render mouth based on emote
  const renderMouth = () => {
    if (emote === EmoteType.SMILE) {
      return <path d="M90 130 Q120 160 150 130" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" />;
    } else if (emote === EmoteType.SERIOUS) {
      return <path d="M100 140 L140 140" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" />;
    } else if (emote === EmoteType.BOW) {
      return <path d="M100 135 Q120 145 140 135" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />;
    }
    // Neutral
    return <path d="M100 140 Q120 145 140 140" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round" />;
  };

  // Render Body/Pose (Simple abstraction)
  const renderBody = () => {
     if (emote === EmoteType.BOW) {
        return (
             <g transform="translate(0, 10)">
                <path d="M60 200 L180 200 L190 300 L50 300 Z" fill={uniformColor} />
                {/* Hand on chest */}
                 <path d="M120 220 L160 240 L140 260 L100 240 Z" fill={skinColor} stroke="#333" strokeWidth="2"/>
             </g>
        );
     }
     return (
        <g>
            <path d="M60 200 L180 200 L190 300 L50 300 Z" fill={uniformColor} />
            {/* Nametag */}
            <rect x="130" y="220" width="40" height="10" fill="#fff" />
            <rect x="70" y="220" width="15" height="15" fill={accentColor} rx="5" />
        </g>
     );
  };

  return (
    <div className="relative w-64 h-64 mx-auto transition-all duration-500 ease-in-out">
        {/* Ant Antennae */}
        <svg viewBox="0 0 240 300" className="w-full h-full drop-shadow-xl">
             {/* Antennae */}
             <path d="M80 50 Q60 10 40 40" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round">
                <animate attributeName="d" values="M80 50 Q60 10 40 40;M80 50 Q50 0 30 30;M80 50 Q60 10 40 40" dur="4s" repeatCount="indefinite"/>
             </path>
             <circle cx="40" cy="40" r="5" fill="#333"/>
             <path d="M160 50 Q180 10 200 40" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round">
                <animate attributeName="d" values="M160 50 Q180 10 200 40;M160 50 Q190 0 210 30;M160 50 Q180 10 200 40" dur="4.2s" repeatCount="indefinite"/>
             </path>
             <circle cx="200" cy="40" r="5" fill="#333"/>

            {renderBody()}

            {/* Head */}
            <ellipse cx="120" cy="120" rx="80" ry="75" fill={skinColor} stroke="#e5e5e5" strokeWidth="2" />
            
            {/* Hat (Pecci/Udeng style abstract) */}
            <path d="M40 80 Q120 30 200 80 L200 60 Q120 10 40 60 Z" fill={uniformColor} />
            <rect x="110" y="45" width="20" height="20" fill={accentColor} rx="2" transform="rotate(45 120 55)" />

            {renderEyes()}
            {renderMouth()}

            {/* Cheeks */}
            <circle cx="60" cy="115" r="10" fill="#ff9999" opacity="0.4" />
            <circle cx="180" cy="115" r="10" fill="#ff9999" opacity="0.4" />
        </svg>

        {/* Speech bubble indicator if needed, purely decorative */}
        <div className={`absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-full transform transition-all duration-300 ${emote === EmoteType.SMILE ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
            Ramah!
        </div>
        <div className={`absolute top-0 left-0 bg-red-600 text-white text-xs px-2 py-1 rounded-full transform transition-all duration-300 ${emote === EmoteType.SERIOUS ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
            Penting!
        </div>
    </div>
  );
};

export default Mascot;