import React, { useState, useEffect, useRef } from 'react';
import { Message, Sender, EmoteType } from './types';
import { initializeChat, sendMessageToGemini } from './services/geminiService';
import { subscribeToConfig, updateGlobalConfig } from './services/configService';
import ChatBubble from './components/ChatBubble';
import InputArea from './components/InputArea';
import Mascot from './components/Mascot';
import AdminModal from './components/AdminModal';

export const LOGO_URL = "https://res.cloudinary.com/dim98gun7/image/upload/v1769353691/Logo_Kementrian_Imigrasi_dan_Pemasyarakatan__2024_1_ihjxaz.png";
const SITHEM_IMG_URL = "https://res.cloudinary.com/dim98gun7/image/upload/v1769353649/sithem_kpqggx.svg";

// Batasan Pertanyaan per Sesi untuk Menghemat Token
const MAX_QUESTIONS = 10;

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmote, setCurrentEmote] = useState<EmoteType>(EmoteType.SMILE);
  const [isMobileInfoOpen, setIsMobileInfoOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  
  // State for Global Config
  const [announcement, setAnnouncement] = useState('');
  const [globalApiKey, setGlobalApiKey] = useState('');
  
  // Counter Pertanyaan
  const [questionCount, setQuestionCount] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to Global Database (Firebase)
  useEffect(() => {
    // 1. Load from LocalStorage first (for instant load/cache)
    const cachedAnnouncement = localStorage.getItem('kero_announcement');
    if (cachedAnnouncement) setAnnouncement(cachedAnnouncement);

    // 2. Subscribe to Realtime Database
    const unsubscribe = subscribeToConfig((data) => {
      console.log("Menerima Update Global:", data);
      
      // Update State
      if (data.announcement !== undefined) {
        setAnnouncement(data.announcement);
        localStorage.setItem('kero_announcement', data.announcement); // Sync local cache
      }
      if (data.geminiApiKey !== undefined) {
        setGlobalApiKey(data.geminiApiKey);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Re-initialize Chat whenever announcement or API key changes
  useEffect(() => {
    initializeChat(announcement, globalApiKey);
    
    // Only set initial greeting if chat is empty
    if (messages.length === 0) {
        const greetingText = announcement 
          ? `**Om Swastiastu!**\n\n⚠️ **PENGUMUMAN PENTING:**\n${announcement}\n\nSaya **Sithem**, siap melayani informasi dalam **900 bahasa dunia & daerah**.\nAda yang bisa dibantu terkait info di atas atau jadwal kunjungan?`
          : "**Om Swastiastu!**\nSelamat datang di layanan Kero-Care Lapas Kelas IIA Kerobokan.\n\nSaya **Sithem**, siap melayani informasi dalam **900 bahasa dunia & daerah**.\n\nSesuai jadwal terbaru:\n- **Pagi**: 09.00 - 11.30 WITA\n- **Siang**: 13.00 - 14.30 WITA.\n\nSilakan tanya jadwal Wisma atau syarat kunjungan!";

        setMessages([
          {
            id: 'init-1',
            text: greetingText,
            sender: Sender.BOT,
            timestamp: new Date(),
          }
        ]);
    }
  }, [announcement, globalApiKey]);

  // Handle saving from Admin Modal (Writes to Firebase)
  const handleSaveConfig = (newAnnouncement: string, newApiKey: string) => {
    updateGlobalConfig(newAnnouncement, newApiKey);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: Sender.USER,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // CEK LIMIT PERTANYAAN
    if (questionCount >= MAX_QUESTIONS) {
        setTimeout(() => {
            const limitMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "⚠️ **Kuota Pertanyaan Habis**\n\nMohon maaf Gek/Bli, untuk menjaga kualitas layanan, sesi tanya jawab otomatis dibatasi.\n\nJika butuh informasi lebih mendalam atau pengaduan, silakan hubungi petugas kami via WhatsApp:\n\n👉 **WA Pengaduan: 0811 3988 664**\n\nSuksma. [EMOTE: BOW]",
                sender: Sender.BOT,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, limitMsg]);
            setCurrentEmote(EmoteType.BOW);
        }, 600);
        return;
    }

    setIsLoading(true);
    setCurrentEmote(EmoteType.NEUTRAL); 
    setQuestionCount(prev => prev + 1); // Tambah counter

    // Pass the globalApiKey to the service
    const response = await sendMessageToGemini(text, announcement, globalApiKey);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: response.text,
      sender: Sender.BOT,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMsg]);
    setCurrentEmote(response.emote);
    setIsLoading(false);
  };

  return (
    <div className="flex h-full w-full bg-slate-50 relative overflow-hidden font-sans">
      
      <AdminModal 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)} 
        currentAnnouncement={announcement}
        currentApiKey={globalApiKey}
        onSave={handleSaveConfig}
      />

      {/* Desktop Background Decor */}
      <div className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="hidden md:block absolute top-0 left-0 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      {/* Main Container */}
      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto h-full z-10 shadow-2xl bg-white/90 md:bg-white overflow-hidden md:rounded-2xl md:my-4 md:border md:border-gray-200">
        
        {/* Left Panel: Identity & Mascot (Desktop) */}
        <div className="hidden md:flex w-full md:w-1/3 bg-slate-900 text-white flex-col items-center justify-between p-6 relative overflow-hidden">
          {/* Abstract Balinese Pattern Overlay */}
          <div className="absolute inset-0 opacity-20" style={{ 
            backgroundImage: `url("https://www.transparenttextures.com/patterns/batik-ramp.png")`,
            backgroundSize: '150px'
          }}></div>
          
          <div className="z-10 w-full flex flex-col items-center mt-6 text-center">
            <div className="w-full max-w-[200px] mb-6 bg-white/10 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/20">
              <img src={LOGO_URL} alt="Logo Kementerian" className="w-full h-auto object-contain" />
            </div>
            <h1 className="text-3xl font-bold font-sans tracking-tight mb-1 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">KERO-CARE</h1>
            <p className="text-blue-200 text-xs font-light tracking-widest uppercase mt-2">Lapas Kelas IIA Kerobokan</p>
            <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mt-4 rounded-full"></div>
          </div>

          <div className="z-10 flex-grow flex items-center justify-center py-4">
            <Mascot emote={currentEmote} />
          </div>

          <div className="z-10 text-center mb-4 w-full">
            <h2 className="text-2xl font-bold text-white drop-shadow-md">Sithem</h2>
            <p className="text-sm text-yellow-100 opacity-90">Asisten Digital Humas</p>
            <div className="mt-4 flex gap-2 justify-center mb-6">
               <span className="px-3 py-1 bg-black/30 rounded-full text-xs backdrop-blur-sm border border-white/10 shadow-inner text-yellow-200">Gratis</span>
               <span className="px-3 py-1 bg-black/30 rounded-full text-xs backdrop-blur-sm border border-white/10 shadow-inner text-yellow-200">900 Bahasa</span>
            </div>
            
            <button 
              onClick={() => setIsAdminModalOpen(true)}
              className="text-[10px] text-slate-400 hover:text-white underline transition"
            >
              Admin Login
            </button>
          </div>
        </div>

        {/* Mobile Info Drawer (Overlay) */}
        {isMobileInfoOpen && (
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden flex justify-end transition-opacity" onClick={() => setIsMobileInfoOpen(false)}>
            <div 
              className="w-4/5 max-w-xs h-full bg-[#1a1a1a] text-white p-6 shadow-2xl flex flex-col animate-slide-in-right border-l border-yellow-500/30 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 opacity-10" style={{ 
                backgroundImage: `url("https://www.transparenttextures.com/patterns/batik-ramp.png")` 
              }}></div>
              
              <div className="relative z-10 flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg text-yellow-400">Tentang Sithem</h2>
                <button onClick={() => setIsMobileInfoOpen(false)} className="text-white/80 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="relative z-10 flex-grow flex flex-col items-center text-center">
                 <div className="w-full max-w-[180px] mb-6 bg-white rounded-lg p-2 shadow-lg">
                    <img src={LOGO_URL} alt="Logo" className="w-full h-auto object-contain" />
                 </div>
                 <div className="transform scale-75 origin-center">
                    <Mascot emote={currentEmote} />
                 </div>
                 <h3 className="text-xl font-bold text-yellow-400 mt-2">Sithem</h3>
                 <p className="text-xs text-slate-300 mt-1">Lapas Kelas IIA Kerobokan</p>
                 <div className="mt-6 space-y-3 w-full">
                    <div className="bg-white/5 p-4 rounded-xl text-sm border border-yellow-500/20 shadow-lg">
                      <span className="block font-bold text-yellow-400 mb-2 border-b border-yellow-500/20 pb-1">Jadwal Kunjungan</span>
                      <div className="flex justify-between text-xs text-slate-200">
                        <span>Pagi</span><span className="font-mono">09.00 - 11.30</span>
                      </div>
                      <div className="flex justify-between text-xs mt-2 text-slate-200">
                        <span>Siang</span><span className="font-mono">13.00 - 14.30</span>
                      </div>
                    </div>
                 </div>
              </div>
              <div className="relative z-10 mt-auto border-t border-white/10 pt-4 text-center">
                 <button 
                  onClick={() => { setIsMobileInfoOpen(false); setIsAdminModalOpen(true); }}
                  className="text-xs text-slate-500 hover:text-yellow-400 transition"
                 >
                   Admin Login
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Panel: Chat Interface */}
        <div className="w-full md:w-2/3 flex flex-col h-full relative">
          
          {/* Mobile Background (Simple Gradient) */}
          <div className="md:hidden absolute inset-0 z-0 bg-slate-50 overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-white"></div>
          </div>

          {/* Sticky Header Mobile (REF: Mas Bewok Style) */}
          <div className="md:hidden sticky top-0 z-50 transition-all">
             {/* The Rounded Card Container */}
             <div className="bg-white rounded-b-[2rem] shadow-xl pb-4 pt-3 px-6 mx-auto w-full relative">
                
                {/* Back Arrow (Decor) */}
                <div className="absolute left-6 top-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-slate-800">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </div>

                {/* Right Action (Decor) */}
                <div className="absolute right-6 top-6" onClick={() => setIsMobileInfoOpen(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-800">
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 5.25V4.5z" clipRule="evenodd" />
                  </svg>
                </div>

                {/* Center Content: Name & Status */}
                <div className="flex flex-col items-center justify-center pt-2">
                   <h1 className="font-extrabold text-xl text-slate-900 tracking-tight">Sithem</h1>
                   <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs font-medium text-slate-500">online</span>
                   </div>
                </div>

             </div>
          </div>
          
          {/* Announcement Banner (Adjusted Position) */}
          {announcement && (
            <div className="relative z-10 bg-orange-100 px-4 py-2 text-xs text-orange-900 border-b border-orange-200 flex items-center gap-2 shadow-sm">
               <span className="flex h-2 w-2 relative flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-600"></span>
               </span>
               <span className="font-bold truncate flex-1">{announcement}</span>
            </div>
          )}

          {/* Messages Area */}
          <div className="relative z-10 flex-grow overflow-y-auto p-4 md:p-6 scrollbar-hide space-y-6">
             {messages.map((msg) => (
               <ChatBubble key={msg.id} message={msg} />
             ))}
             
             {/* Thinking Animation (New "Surprise" Style) */}
             {isLoading && (
               <div className="flex w-full mt-6 mb-4 animate-fade-in-up">
                  <div className="relative">
                     {/* Bouncing Sithem */}
                     <div className="w-16 h-16 md:w-20 md:h-20 animate-bounce">
                        <img 
                           src={SITHEM_IMG_URL} 
                           alt="Thinking..." 
                           className="w-full h-full object-contain filter drop-shadow-lg"
                        />
                     </div>
                     {/* Thought Cloud */}
                     <div className="absolute -top-6 -right-12 bg-white px-3 py-2 rounded-xl rounded-bl-none shadow-md border border-gray-200 animate-pulse">
                        <p className="text-xs text-slate-500 italic">Sedang mengetik...</p>
                     </div>
                  </div>
               </div>
             )}

             <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="relative z-20">
             <InputArea onSendMessage={handleSendMessage} isLoading={isLoading || questionCount >= MAX_QUESTIONS} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;