import React from 'react';
import { Message, Sender } from '../types';
import { LOGO_URL } from '../App';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.USER;

  // Simple formatter to handle bold text from markdown (**text**)
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`flex w-full gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fade-in-up group`}>
      
      {/* Avatar */}
      <div className="flex-shrink-0 flex flex-col justify-end">
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm overflow-hidden border ${isUser ? 'bg-blue-100 border-blue-200' : 'bg-white border-gray-200'}`}>
          {isUser ? (
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-blue-600">
               <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
             </svg>
          ) : (
             <img src={LOGO_URL} alt="Bot" className="w-full h-full object-contain p-0.5" />
          )}
        </div>
      </div>

      {/* Bubble */}
      <div
        className={`relative max-w-[80%] md:max-w-[70%] rounded-2xl px-5 py-3.5 shadow-sm text-sm md:text-base leading-relaxed transition-transform duration-200 hover:-translate-y-0.5 ${
          isUser
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none shadow-blue-200/50'
            : 'bg-white text-slate-700 border border-gray-100 rounded-tl-none shadow-gray-200/50'
        }`}
      >
        <p className="whitespace-pre-wrap tracking-wide">{formatText(message.text)}</p>
        
        {/* Timestamp & Info */}
        <div className={`flex items-center gap-1 mt-1.5 ${isUser ? 'justify-end text-blue-100/80' : 'justify-start text-gray-400'}`}>
           <span className="text-[10px] font-medium">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
           </span>
           {isUser && (
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
             </svg>
           )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;