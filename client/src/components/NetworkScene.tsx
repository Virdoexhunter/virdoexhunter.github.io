import { useRef, useState, useEffect } from "react";
import { Html } from "@react-three/drei";
import gameVideo from "@assets/generated_videos/cyberpunk_video_game_gameplay_footage.mp4";

type SectionType = "profile" | "experience" | "skills" | "achievements" | "contact" | null;

interface NetworkSceneProps {
  onNodeClick: (section: SectionType) => void;
}

const SECTIONS = [
  { id: "profile", label: "01_PROFILE", color: "#00ffff" },
  { id: "experience", label: "02_EXPERIENCE", color: "#bd00ff" },
  { id: "skills", label: "03_SKILLS", color: "#00ff00" },
  { id: "achievements", label: "04_ACHIEVEMENTS", color: "#eab308" },
  { id: "contact", label: "05_COMM_LINK", color: "#ef4444" },
] as const;

export function NetworkScene({ onNodeClick }: NetworkSceneProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-mono">
      {/* Background Game Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      >
        <source src={gameVideo} type="video/mp4" />
      </video>

      {/* Retro CRT Scanlines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-10" 
           style={{ background: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 2px)', backgroundSize: '100% 2px' }} />
      
      {/* Glitch Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 opacity-10 bg-gradient-to-t from-primary/20 to-transparent mix-blend-overlay" />

      {/* HUD System Header */}
      <div className="absolute top-0 left-0 w-full p-6 z-30 flex justify-between items-start">
        <div className="border-l-4 border-primary pl-4 bg-black/40 backdrop-blur-md p-4">
          <h1 className="text-2xl font-bold text-primary tracking-widest uppercase">DEEPAK.SEC</h1>
          <p className="text-[10px] text-primary/70 mt-1 uppercase">Mission_Status: ACTIVE // System_Load: STABLE</p>
        </div>
        <div className="text-right bg-black/40 backdrop-blur-md p-4 border-r-4 border-primary">
          <p className="text-[10px] text-primary/70 uppercase">Uptime: 00:00:15:23</p>
          <p className="text-[10px] text-primary/70 uppercase">Location: CYBER_CITY_NODE_01</p>
        </div>
      </div>

      {/* Main Game Menu Nodes */}
      <div className="absolute inset-0 flex items-center justify-center z-30">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-4 w-full max-w-6xl">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => onNodeClick(section.id as SectionType)}
              onMouseEnter={() => setActiveSection(section.id)}
              onMouseLeave={() => setActiveSection(null)}
              className="group relative h-48 border border-primary/20 bg-black/60 backdrop-blur-xl hover:border-primary transition-all duration-300 flex flex-col items-center justify-center gap-4 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <div className="absolute bottom-0 right-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-right" />
              
              <div 
                className="w-16 h-16 border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{ borderColor: section.color, color: section.color, boxShadow: activeSection === section.id ? `0 0 20px ${section.color}` : 'none' }}
              >
                <span className="text-xl font-bold">{section.label.split('_')[0]}</span>
              </div>
              
              <span className="text-xs font-bold tracking-widest text-primary/80 group-hover:text-primary transition-colors">
                {section.label.split('_')[1]}
              </span>
              
              {/* Corner Accents */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-primary/40" />
              <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-primary/40" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-primary/40" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-primary/40" />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom HUD Bar */}
      <div className="absolute bottom-0 left-0 w-full p-6 z-30 bg-gradient-to-t from-black to-transparent">
        <div className="flex justify-between items-center bg-black/60 border border-primary/20 backdrop-blur-md p-4">
          <div className="flex gap-8">
            <div className="flex flex-col">
              <span className="text-[8px] text-primary/50 uppercase">Connection_Type</span>
              <span className="text-xs text-primary uppercase">Secure_Shell_AES-256</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-primary/50 uppercase">Terminal_Key</span>
              <span className="text-xs text-primary uppercase">VIRD_HUNTER_0.1</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 h-2 bg-primary/20 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-primary animate-pulse" />
            </div>
            <span className="text-[10px] text-primary uppercase animate-pulse">Syncing...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
