import React, { useState, useEffect, useRef } from 'react';
import { Message, Sender, EmoteType } from './types';
import { initializeChat, sendMessageToGemini } from './services/geminiService';
import ChatBubble from './components/ChatBubble';
import InputArea from './components/InputArea';
import Mascot from './components/Mascot';
import AdminModal from './components/AdminModal';

// Placeholder URL for the Ministry Logo. 
// NOTE: Please replace this URL with the local path to your specific file (e.g., "/assets/logo-kementerian.png") 
// if you have the exact file from the prompt. Using a high-res Coat of Arms proxy for now.
export const LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Emblem_of_the_Ministry_of_Law_and_Human_Rights_of_Indonesia.svg/240px-Emblem_of_the_Ministry_of_Law_and_Human_Rights_of_Indonesia.svg.png";

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmote, setCurrentEmote] = useState<EmoteType>(EmoteType.SMILE);
  const [isMobileInfoOpen, setIsMobileInfoOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedAnnouncement = localStorage.getItem('kero_announcement');
    if (savedAnnouncement) {
      setAnnouncement(savedAnnouncement);
    }
  }, []);

  useEffect(() => {
    initializeChat(announcement);
    
    const greetingText = announcement 
      ? `**Om Swastiastu!**\n\n⚠️ **PENGUMUMAN PENTING:**\n${announcement}\n\nSaya **Sithem**, ada yang bisa dibantu terkait info di atas atau jadwal kunjungan?`
      : "**Om Swastiastu!**\nSelamat datang di layanan Kero-Care Lapas Kelas IIA Kerobokan.\n\nSaya **Sithem**. Sesuai jadwal terbaru:\n- **Pagi**: 09.00 - 11.30 WITA\n- **Siang**: 13.00 - 14.30 WITA.\n\nSilakan tanya jadwal Wisma atau syarat kunjungan!";

    setMessages([
      {
        id: 'init-1',
        text: greetingText,
        sender: Sender.BOT,
        timestamp: new Date(),
      }
    ]);
  }, [announcement]);

  const handleSaveAnnouncement = (text: string) => {
    setAnnouncement(text);
    localStorage.setItem('kero_announcement', text);
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
    setIsLoading(true);
    setCurrentEmote(EmoteType.NEUTRAL); 

    const response = await sendMessageToGemini(text, announcement);

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
        onSave={handleSaveAnnouncement}
      />

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto h-full z-10 shadow-2xl bg-white overflow-hidden md:rounded-2xl md:my-4 md:border md:border-gray-200">
        
        {/* Left Panel: Identity & Mascot (Desktop) */}
        <div className="hidden md:flex w-full md:w-1/3 bg-gradient-to-br from-slate-900 to-blue-900 text-white flex-col items-center justify-between p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/batik-ramp.png')]"></div>
          
          <div className="z-10 w-full flex flex-col items-center mt-6 text-center">
            <div className="w-24 h-24 mb-4 bg-white rounded-full p-2 shadow-lg flex items-center justify-center">
              <img src={LOGO_URL} alt="Logo Kementerian" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-bold font-sans tracking-tight mb-1 leading-none">KERO-CARE</h1>
            <p className="text-blue-200 text-xs font-light tracking-widest uppercase mt-2">Kementerian Imigrasi dan Pemasyarakatan</p>
            <p className="text-white text-sm font-semibold mt-1">Lapas Kelas IIA Kerobokan</p>
            <div className="w-16 h-1 bg-yellow-400 mt-4 rounded-full"></div>
          </div>

          <div className="z-10 flex-grow flex items-center justify-center py-4 transform hover:scale-105 transition-transform duration-500">
            <Mascot emote={currentEmote} />
          </div>

          <div className="z-10 text-center mb-4 w-full">
            <h2 className="text-xl font-bold text-yellow-400">Sithem</h2>
            <p className="text-sm text-blue-100 opacity-90">Asisten Digital Humas</p>
            <div className="mt-4 flex gap-2 justify-center mb-6">
               <span className="px-3 py-1 bg-white/10 rounded-full text-xs backdrop-blur-sm border border-white/20 shadow-inner">Gratis</span>
               <span className="px-3 py-1 bg-white/10 rounded-full text-xs backdrop-blur-sm border border-white/20 shadow-inner">Resmi</span>
            </div>
            
            <button 
              onClick={() => setIsAdminModalOpen(true)}
              className="text-[10px] text-blue-300 hover:text-white underline opacity-50 hover:opacity-100 transition"
            >
              Admin Login
            </button>
          </div>
        </div>

        {/* Mobile Info Drawer (Overlay) */}
        {isMobileInfoOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 md:hidden flex justify-end transition-opacity" onClick={() => setIsMobileInfoOpen(false)}>
            <div 
              className="w-4/5 max-w-xs h-full bg-gradient-to-b from-slate-900 to-blue-900 text-white p-6 shadow-2xl flex flex-col animate-slide-in-right"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg">Tentang Sithem</h2>
                <button onClick={() => setIsMobileInfoOpen(false)} className="text-white/80 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-grow flex flex-col items-center text-center">
                 <div className="w-20 h-20 mb-4 bg-white rounded-full p-2 shadow-lg">
                    <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
                 </div>
                 <Mascot emote={currentEmote} />
                 <h3 className="text-xl font-bold text-yellow-400 mt-4">Sithem</h3>
                 <p className="text-xs text-blue-200 mt-1">Lapas Kelas IIA Kerobokan</p>
                 <div className="mt-6 space-y-3 w-full">
                    <div className="bg-white/10 p-3 rounded-lg text-sm border border-white/5 shadow-md">
                      <span className="block font-bold text-yellow-400 mb-1">Jadwal</span>
                      <div className="flex justify-between text-xs">
                        <span>Pagi</span><span>09.00 - 11.30</span>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span>Siang</span><span>13.00 - 14.30</span>
                      </div>
                    </div>
                 </div>
              </div>
              <div className="mt-auto border-t border-white/10 pt-4 text-center">
                 <button 
                  onClick={() => { setIsMobileInfoOpen(false); setIsAdminModalOpen(true); }}
                  className="text-xs text-blue-300 underline"
                 >
                   Admin Login
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Panel: Chat Interface */}
        <div className="w-full md:w-2/3 flex flex-col bg-slate-50 h-full relative">
          {/* Header Mobile Only */}
          <div className="md:hidden bg-white/90 backdrop-blur-md px-4 py-3 border-b border-gray-100 flex items-center justify-between shadow-sm sticky top-0 z-20">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm p-1">
                  <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
               </div>
               <div>
                <h1 className="font-bold text-slate-800 leading-tight text-sm">Kero-Care</h1>
                <p className="text-[10px] text-slate-500">Lapas Kerobokan</p>
               </div>
            </div>
            <button 
              onClick={() => setIsMobileInfoOpen(true)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </button>
          </div>
          
          {/* Announcement Banner if Active */}
          {announcement && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 text-xs text-orange-800 border-b border-orange-200 flex items-center gap-2">
               <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
               </span>
               <span className="font-bold truncate flex-1">{announcement}</span>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-4 md:p-6 scrollbar-hide space-y-6">
             {messages.map((msg) => (
               <ChatBubble key={msg.id} message={msg} />
             ))}
             {isLoading && (
               <div className="flex justify-start animate-fade-in-up">
                  <div className="flex items-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center p-1 border border-gray-200">
                        <img src={LOGO_URL} alt="Bot" className="w-full h-full object-contain opacity-80" />
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center space-x-1 h-[46px]">
                       <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                       <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                       <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300"></div>
                    </div>
                  </div>
               </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default App;