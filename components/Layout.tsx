import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar Desktop - Midnight Blue Theme */}
      <aside className="w-72 bg-primary text-white hidden md:flex flex-col shadow-2xl z-20">
        <div className="p-8 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-start to-accent-end flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i className="fas fa-compass text-white text-lg"></i>
          </div>
          <span className="font-bold text-2xl tracking-tight">Raf Way</span>
        </div>

        <nav className="flex-1 p-6 space-y-3">
          {user && (
            <>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">Menu</p>
              
              <Link
                to="/chat"
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive('/chat')
                    ? 'bg-gradient-to-r from-accent-start to-accent-end text-white shadow-lg shadow-indigo-900/50'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <i className={`fas fa-comments w-5 transition-transform group-hover:scale-110 ${isActive('/chat') ? '' : 'text-gray-500 group-hover:text-white'}`}></i>
                <span className="font-medium tracking-wide">Discussion IA</span>
              </Link>

              {user.isPremium ? (
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    isActive('/dashboard')
                      ? 'bg-gradient-to-r from-accent-start to-accent-end text-white shadow-lg shadow-indigo-900/50'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <i className={`fas fa-chart-pie w-5 transition-transform group-hover:scale-110 ${isActive('/dashboard') ? '' : 'text-gray-500 group-hover:text-white'}`}></i>
                  <span className="font-medium tracking-wide">Espace Parent</span>
                </Link>
              ) : (
                <div className="mt-8 p-5 bg-gradient-to-b from-white/10 to-transparent rounded-3xl border border-white/10 backdrop-blur-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-accent-start rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <div className="flex items-center gap-2 text-white font-bold mb-2 relative z-10">
                    <i className="fas fa-crown text-yellow-400"></i>
                    <span>Premium</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4 leading-relaxed relative z-10">
                    Accédez au dashboard parent et aux outils avancés.
                  </p>
                  <button className="w-full py-2.5 bg-white text-primary text-xs font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 relative z-10">
                    Débloquer
                  </button>
                </div>
              )}
            </>
          )}
        </nav>

        {user && (
          <div className="p-6 border-t border-white/10 bg-black/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <img
                  src={user.photoURL || "https://picsum.photos/40"}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full border-2 border-accent-start shadow-lg object-cover"
                />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-primary ${user.isPremium ? 'bg-yellow-400' : 'bg-gray-400'}`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {user.displayName || "Utilisateur"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user.isPremium ? "Membre Premium" : "Compte Gratuit"}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors duration-300"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>Déconnexion</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background">
        {/* Mobile Header - Glassmorphism */}
        <header className="md:hidden h-16 glass fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-5">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-start to-accent-end flex items-center justify-center shadow-md">
                <i className="fas fa-compass text-white text-xs"></i>
             </div>
            <span>Raf Way</span>
          </div>
          {user && (
            <div className="flex items-center gap-2">
               {user.isPremium && <Link to="/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"><i className="fas fa-chart-pie"></i></Link>}
               <button onClick={onLogout} className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"><i className="fas fa-sign-out-alt"></i></button>
            </div>
          )}
        </header>

        {/* Content Wrapper with padding for mobile header */}
        <div className="flex-1 overflow-auto md:pt-0 pt-16">
          {children}
        </div>
        
        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around p-3 z-30 pb-safe">
            <Link to="/chat" className={`flex flex-col items-center gap-1 ${isActive('/chat') ? 'text-accent-start' : 'text-gray-400'}`}>
                <i className="fas fa-comments text-xl"></i>
                <span className="text-[10px] font-medium">Chat</span>
            </Link>
            <Link to="/dashboard" className={`flex flex-col items-center gap-1 ${isActive('/dashboard') ? 'text-accent-start' : 'text-gray-400'}`}>
                <i className="fas fa-chart-pie text-xl"></i>
                <span className="text-[10px] font-medium">Parent</span>
            </Link>
        </div>
      </main>
    </div>
  );
};

export default Layout;