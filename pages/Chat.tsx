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
      text: `Salut ${user.displayName?.split(' ')[0] || 'l\'ami'} ! 👋 Je suis Raf, ton coach d'orientation.\nDis-moi, qu'est-ce qui te passionne dans la vie ou quelles matières tu préfères à l'école ?`,
      sender: 'bot',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  // Scroll automatique vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

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
        text: "Oups, j'ai eu un petit bug de connexion. Réessaie stp !",
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
      // Simulation Paiement
      alert("Simulation : Paiement réussi ! Bienvenue dans Raf Way Premium.");
      updateUserStats(user.messageCount, true);
      setShowPaywall(false);
  };

  return (
    <div className="flex flex-col h-full relative bg-background">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent-start/5 rounded-full mix-blend-multiply filter blur-[80px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent-end/5 rounded-full mix-blend-multiply filter blur-[80px] animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Zone de Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-32 scrollbar-hide">
        <div className="flex flex-col space-y-6">
            {messages.map((msg, index) => (
            <div
                key={msg.id}
                className={`flex w-full animate-fade-in-up ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{ animationDelay: `${index * 0.05}s` }}
            >
                {msg.sender === 'bot' && (
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mr-3 mt-1 flex-shrink-0 text-accent-start relative group">
                        <i className="fas fa-robot text-lg group-hover:scale-110 transition-transform"></i>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                )}
                
                <div
                className={`max-w-[85%] sm:max-w-[70%] px-6 py-4 shadow-sm text-[15px] leading-relaxed relative transition-all duration-300 hover:shadow-md ${
                    msg.sender === 'user'
                    ? 'bg-gradient-to-r from-accent-start to-accent-end text-white rounded-[20px] rounded-tr-sm'
                    : 'bg-white border border-gray-100 text-gray-800 rounded-[20px] rounded-tl-sm'
                }`}
                >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
                
                {msg.sender === 'user' && (
                    <img 
                        src={user.photoURL || "https://picsum.photos/40"} 
                        className="w-10 h-10 rounded-full ml-3 mt-1 shadow-sm border-2 border-white object-cover" 
                        alt="Me" 
                    />
                )}
            </div>
            ))}
            
            {isLoading && (
            <div className="flex justify-start w-full animate-fade-in-up">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mr-3 mt-1">
                    <i className="fas fa-robot text-lg text-accent-start animate-pulse"></i>
                </div>
                <div className="bg-white border border-gray-100 rounded-[20px] rounded-tl-sm px-6 py-4 flex items-center gap-2 shadow-sm">
                <div className="w-2 h-2 bg-accent-start rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-accent-start rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-accent-start rounded-full animate-bounce delay-150"></div>
                </div>
            </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Paywall Overlay (Glassmorphism) */}
      {showPaywall && !user.isPremium && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-xl z-20 flex flex-col items-center justify-center p-6 text-center animate-fade-in-up">
          <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl shadow-indigo-900/10 max-w-md border border-white/50 transform transition-all hover:scale-105 duration-500">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-white">
              <i className="fas fa-crown text-4xl text-yellow-500"></i>
            </div>
            <h3 className="text-3xl font-bold text-primary mb-3 tracking-tight">Raf Way Premium</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Tu as atteint la limite de la version gratuite. Libère tout le potentiel de ton avenir avec l'IA illimitée.
            </p>
            
            <div className="space-y-3 mb-8 text-left">
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span>Chat illimité avec l'Expert IA</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span>Liste d'écoles & Dashboard Parent</span>
                </div>
            </div>

            <button 
                onClick={handleUpgrade}
                className="w-full py-4 bg-primary text-white font-bold text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-2xl hover:bg-gray-900 transition-all transform active:scale-95 group"
            >
              <span>Débloquer maintenant</span>
              <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
            </button>
            <p className="text-xs text-gray-400 mt-4">Paiement sécurisé • Satisfait ou remboursé</p>
          </div>
        </div>
      )}

      {/* Floating Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-background via-background/95 to-transparent z-10">
        <div className="max-w-4xl mx-auto relative flex flex-col gap-2">
          
          <div className={`relative flex items-center bg-white/80 backdrop-blur-md border border-white/50 rounded-full shadow-lg shadow-gray-200/50 transition-all duration-300 focus-within:ring-2 focus-within:ring-accent-start/30 focus-within:border-accent-start focus-within:shadow-xl ${showPaywall && !user.isPremium ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
             <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading || (showPaywall && !user.isPremium)}
                placeholder="Pose ta question à Raf..."
                className="flex-1 bg-transparent text-gray-800 text-base px-6 py-4 rounded-full focus:outline-none placeholder-gray-400"
             />
             <div className="pr-2">
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="w-12 h-12 bg-gradient-to-r from-accent-start to-accent-end text-white rounded-full hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all flex items-center justify-center transform active:scale-95"
                >
                    <i className="fas fa-paper-plane text-sm"></i>
                </button>
             </div>
          </div>
          
          {!user.isPremium && !showPaywall && (
            <div className="text-center animate-fade-in-up">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 bg-white/80 px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                    {MAX_FREE_MESSAGES - user.messageCount} messages gratuits
                </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;