import React from 'react';
import { Message, Sender } from '../types';

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
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in-up`}>
      <div
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3 shadow-sm text-sm md:text-base leading-relaxed ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-white text-slate-700 border border-gray-100 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{formatText(message.text)}</p>
        <span className={`text-[10px] block mt-1 ${isUser ? 'text-blue-200' : 'text-gray-400'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ChatBubble;