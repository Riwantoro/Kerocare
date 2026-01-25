import React, { useState, useEffect, useRef } from 'react';
import { Message, Sender, EmoteType } from './types';
import { initializeChat, sendMessageToGemini } from './services/geminiService';
import ChatBubble from './components/ChatBubble';
import InputArea from './components/InputArea';
import Mascot from './components/Mascot';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmote, setCurrentEmote] = useState<EmoteType>(EmoteType.SMILE);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    initializeChat();
    setMessages([
      {
        id: 'init-1',
        text: "**Om Swastiastu!**\nSelamat datang di layanan Kero-Care Lapas Kelas IIA Kerobokan.\n\nSaya **Bli Semut**, siap membantu Bli & Gek untuk informasi kunjungan, remisi, pembebasan bersyarat, atau melihat hasil karya warga binaan.\n\nAda yang bisa Bli bantu hari ini?",
        sender: Sender.BOT,
        timestamp: new Date(),
      }
    ]);
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: Sender.USER,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setCurrentEmote(EmoteType.NEUTRAL); // Thinking face?

    // Call API
    const response = await sendMessageToGemini(text);

    // Add bot message
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
    <div className="flex h-screen w-full bg-slate-50 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto h-full z-10 shadow-2xl bg-white overflow-hidden md:rounded-2xl md:my-4 md:border md:border-gray-200">
        
        {/* Left Panel: Identity & Mascot */}
        <div className="w-full md:w-1/3 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white flex flex-col items-center justify-between p-6 relative overflow-hidden">
          {/* Subtle Batik Pattern Overlay CSS logic could go here, simplified for now */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/batik-ramp.png')]"></div>
          
          <div className="z-10 w-full flex flex-col items-center mt-4">
            <h1 className="text-2xl font-bold font-sans tracking-tight mb-1">KERO-CARE</h1>
            <p className="text-blue-200 text-sm font-light tracking-widest uppercase">Lapas Kelas IIA Kerobokan</p>
            <div className="w-16 h-1 bg-yellow-400 mt-4 rounded-full"></div>
          </div>

          <div className="z-10 flex-grow flex items-center justify-center py-4">
            <Mascot emote={currentEmote} />
          </div>

          <div className="z-10 text-center mb-4">
            <h2 className="text-xl font-bold text-yellow-400">Bli Semut</h2>
            <p className="text-sm text-blue-100 opacity-90">Asisten Digital Humas</p>
            <div className="mt-4 flex gap-2 justify-center">
               <span className="px-3 py-1 bg-white/10 rounded-full text-xs backdrop-blur-sm border border-white/10">Gratis</span>
               <span className="px-3 py-1 bg-white/10 rounded-full text-xs backdrop-blur-sm border border-white/10">Resmi</span>
               <span className="px-3 py-1 bg-white/10 rounded-full text-xs backdrop-blur-sm border border-white/10">Ramah</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Chat Interface */}
        <div className="w-full md:w-2/3 flex flex-col bg-slate-50 h-full">
          {/* Header Mobile Only */}
          <div className="md:hidden bg-white p-3 border-b flex items-center justify-between shadow-sm sticky top-0 z-20">
            <div>
              <h1 className="font-bold text-slate-800">Kero-Care</h1>
              <p className="text-xs text-slate-500">Bli Semut Online</p>
            </div>
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></div>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-4 md:p-6 scrollbar-hide space-y-4">
             {messages.map((msg) => (
               <ChatBubble key={msg.id} message={msg} />
             ))}
             {isLoading && (
               <div className="flex justify-start animate-pulse">
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex items-center space-x-2">
                     <span className="text-xs text-slate-400 font-medium">Bli Semut sedang mengetik...</span>
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