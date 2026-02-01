import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface ChatProps {
  user: UserProfile;
  updateUserStats: (newCount: number, isPremium?: boolean) => void;
}

const MAX_FREE_MESSAGES = 5;

const Chat: React.FC<ChatProps> = ({ user, updateUserStats }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: `Salut ${user.displayName?.split(' ')[0]} ! 👋 Je suis Raf, ton coach d'orientation.\nDis-moi, qu'est-ce qui te passionne dans la vie ou quelles matières tu préfères à l'école ?`,
      sender: 'bot',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user.isPremium && user.messageCount >= MAX_FREE_MESSAGES) {
      setShowPaywall(true);
    }
  }, [user.messageCount, user.isPremium]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!user.isPremium && user.messageCount >= MAX_FREE_MESSAGES) {
      setShowPaywall(true);
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const newCount = user.messageCount + 1;
    updateUserStats(newCount);

    try {
      const responseText = await sendMessageToGemini(messages, userMsg.text);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Oups, j'ai eu un petit bug. Réessaie stp !",
        sender: 'bot',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleUpgrade = () => {
      alert("Simulation : Paiement réussi ! Bienvenue dans Raf Way Premium.");
      updateUserStats(user.messageCount, true);
      setShowPaywall(false);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Background Gradient Blob */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Zone de Chat */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 pb-32">
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`flex w-full animate-fade-in-up ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-accent-start">
                    <i className="fas fa-robot text-sm"></i>
                </div>
            )}
            
            <div
              className={`max-w-[85%] sm:max-w-[70%] px-6 py-4 shadow-sm text-[15px] leading-relaxed relative group transition-all hover:shadow-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-accent-start to-accent-end text-white rounded-2xl rounded-tr-sm'
                  : 'bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-tl-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
            
            {msg.sender === 'user' && (
                <img src={user.photoURL || "https://picsum.photos/40"} className="w-8 h-8 rounded-full ml-3 mt-1 shadow-sm border border-white" alt="Me" />
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start w-full animate-fade-in-up">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mr-3 mt-1">
                <i className="fas fa-robot text-sm text-accent-start"></i>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2 shadow-sm">
              <div className="w-2 h-2 bg-accent-start rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-accent-start rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-accent-start rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Paywall Overlay */}
      {showPaywall && !user.isPremium && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center animate-fade-in-up">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md border border-gray-100 transform transition-all hover:scale-105">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <i className="fas fa-crown text-3xl text-yellow-500"></i>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Passe au niveau supérieur</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Tu as utilisé tes 5 messages gratuits. Débloque l'IA illimitée et tous les outils d'orientation maintenant.
            </p>
            <button 
                onClick={handleUpgrade}
                className="w-full py-4 bg-primary text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:bg-gray-900 transition-all transform active:scale-95"
            >
              Débloquer Premium (9.99€)
            </button>
            <p className="text-xs text-gray-400 mt-4">Sans engagement • Annulable à tout moment</p>
          </div>
        </div>
      )}

      {/* Input Flottant */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-background via-background to-transparent z-0">
        <div className="max-w-4xl mx-auto relative flex items-center gap-3">
          <div className={`flex-1 bg-white border border-gray-200 rounded-full shadow-lg flex items-center p-2 pr-2 transition-all focus-within:ring-2 focus-within:ring-accent-start/50 focus-within:border-accent-start ${showPaywall && !user.isPremium ? 'opacity-50 pointer-events-none' : ''}`}>
             <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading || (showPaywall && !user.isPremium)}
                placeholder="Pose ta question à Raf..."
                className="flex-1 bg-transparent text-gray-800 text-base px-4 py-2 focus:outline-none"
             />
             <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 bg-gradient-to-r from-accent-start to-accent-end text-white rounded-full hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center transform active:scale-95"
             >
                <i className="fas fa-arrow-up text-sm"></i>
             </button>
          </div>
        </div>
        {!user.isPremium && (
            <div className="text-center mt-2">
                <span className="text-xs font-medium text-gray-400 bg-white/50 px-3 py-1 rounded-full border border-gray-100">
                    {MAX_FREE_MESSAGES - user.messageCount} messages gratuits restants
                </span>
            </div>
        )}
      </div>
    </div>
  );
};

export default Chat;