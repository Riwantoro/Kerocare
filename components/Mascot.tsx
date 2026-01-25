import React from 'react';
import { EmoteType } from '../types';

interface MascotProps {
  emote: EmoteType;
}

const Mascot: React.FC<MascotProps> = ({ emote }) => {
  
  // Sithem Colors (Semut Hitam / Black Ant)
  const skinColor = "#1f2937"; // Dark Gray/Black (Ant body)
  const skinHighlight = "#374151"; // Slightly lighter for 3D effect
  const strokeColor = "#ffffff"; // White stroke for visibility on dark skin
  const uniformColor = "#ffffff"; // White Uniform (Kemeja Putih)
  const uniformShadow = "#e5e7eb";
  const accentColor = "#fbbf24"; // Gold/Yellow (Pangkat/Buttons)
  const tieColor = "#1e3a8a"; // Dark Blue tie/details

  // Render eyes based on emote
  const renderEyes = () => {
    if (emote === EmoteType.SMILE) {
      return (
        <g>
          {/* Joyful Arches */}
          <path d="M70 95 Q85 85 100 95" fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
          <path d="M140 95 Q155 85 170 95" fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    } else if (emote === EmoteType.SERIOUS) {
      return (
        <g>
          {/* Serious Eyes (Circles with flat top eyebrows) */}
          <circle cx="85" cy="95" r="10" fill="white" />
          <circle cx="85" cy="95" r="4" fill="black" />
          
          <circle cx="155" cy="95" r="10" fill="white" />
          <circle cx="155" cy="95" r="4" fill="black" />

          {/* Angled Eyebrows */}
          <path d="M65 80 L100 88" fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
          <path d="M175 80 L140 88" fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    } else if (emote === EmoteType.BOW) {
      return (
        <g>
           {/* Closed Eyes (Happy curve down) */}
           <path d="M70 100 Q85 105 100 100" fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
           <path d="M140 100 Q155 105 170 100" fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    }
    // Neutral (Large cute eyes)
    return (
      <g>
        <ellipse cx="85" cy="95" rx="14" ry="18" fill="white" />
        <circle cx="85" cy="95" r="7" fill="black" />
        <circle cx="89" cy="92" r="2" fill="white" fillOpacity="0.8" />
        
        <ellipse cx="155" cy="95" rx="14" ry="18" fill="white" />
        <circle cx="155" cy="95" r="7" fill="black" />
        <circle cx="159" cy="92" r="2" fill="white" fillOpacity="0.8" />
      </g>
    );
  };

  // Render mouth based on emote
  const renderMouth = () => {
    if (emote === EmoteType.SMILE) {
      return (
        <g>
          <path d="M90 135 Q120 160 150 135" fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
          {/* Cheek tint */}
          <ellipse cx="70" cy="120" rx="8" ry="5" fill="#ef4444" opacity="0.4" />
          <ellipse cx="170" cy="120" rx="8" ry="5" fill="#ef4444" opacity="0.4" />
        </g>
      );
    } else if (emote === EmoteType.SERIOUS) {
      return <path d="M100 145 L140 145" fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />;
    } else if (emote === EmoteType.BOW) {
      return <path d="M100 140 Q120 150 140 140" fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />;
    }
    // Neutral
    return <path d="M105 145 Q120 150 135 145" fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />;
  };

  return (
    <div className="relative w-48 h-48 transition-transform duration-300">
      <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
        
        {/* Antennae */}
        <path d="M80 50 Q60 10 40 30" fill="none" stroke={skinColor} strokeWidth="6" strokeLinecap="round" />
        <circle cx="40" cy="30" r="5" fill={skinColor} />
        <path d="M160 50 Q180 10 200 30" fill="none" stroke={skinColor} strokeWidth="6" strokeLinecap="round" />
        <circle cx="200" cy="30" r="5" fill={skinColor} />

        {/* Head (Black Ant Shape) */}
        <ellipse cx="120" cy="100" rx="75" ry="65" fill={skinColor} />
        <ellipse cx="120" cy="90" rx="60" ry="50" fill={skinHighlight} opacity="0.3" /> {/* Highlight */}

        {/* Uniform Collar */}
        <path d="M90 160 L120 180 L150 160" fill={uniformColor} stroke={uniformShadow} strokeWidth="2" />
        <path d="M90 160 L80 180 L120 200" fill={uniformColor} />
        <path d="M150 160 L160 180 L120 200" fill={uniformColor} />

        {/* Body/Torso (Uniform) */}
        <path d="M70 170 Q60 220 70 240 L170 240 Q180 220 170 170" fill={uniformColor} />
        
        {/* Uniform Details */}
        <line x1="120" y1="180" x2="120" y2="240" stroke={uniformShadow} strokeWidth="2" />
        {/* Buttons */}
        <circle cx="120" cy="200" r="3" fill={accentColor} />
        <circle cx="120" cy="220" r="3" fill={accentColor} />

        {/* Pangkat (Rank Badges) on Shoulders */}
        <rect x="65" y="175" width="20" height="10" rx="2" fill={skinColor} />
        <rect x="67" y="177" width="16" height="6" rx="1" fill={accentColor} />
        
        <rect x="155" y="175" width="20" height="10" rx="2" fill={skinColor} />
        <rect x="157" y="177" width="16" height="6" rx="1" fill={accentColor} />

        {/* ID Card / Lanyard */}
        <path d="M100 170 Q120 210 140 170" fill="none" stroke="#3b82f6" strokeWidth="2" />
        <rect x="112" y="195" width="16" height="22" rx="2" fill="black" stroke="#ccc" strokeWidth="1" />
        <rect x="114" y="197" width="12" height="10" fill="white" opacity="0.5" />

        {/* Facial Features */}
        {renderEyes()}
        {renderMouth()}

        {/* Hands (Simple blobs) */}
        {emote === EmoteType.BOW ? (
           <g>
             <path d="M70 200 Q120 200 170 200" fill="none" stroke={skinColor} strokeWidth="12" strokeLinecap="round" />
           </g>
        ) : (
           <g>
             <circle cx="50" cy="200" r="12" fill={skinColor} />
             <circle cx="190" cy="200" r="12" fill={skinColor} />
           </g>
        )}

      </svg>
    </div>
  );
};

export default Mascot;