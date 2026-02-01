import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Chat from './pages/Chat';
import ParentDashboard from './pages/ParentDashboard';
import { UserProfile } from './types';
import { mockUser, isDemoMode } from './firebaseConfig';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulation du check auth Firebase
    // Dans le vrai code: onAuthStateChanged(auth, (u) => { ... })
    const checkAuth = async () => {
        // Simulation de délai
        await new Promise(r => setTimeout(r, 800));
        
        // On check le localStorage pour la persistance de la démo
        const storedUser = localStorage.getItem('raf_way_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
      // Simulation Login Google
      setLoading(true);
      setTimeout(() => {
          const newUser = { ...mockUser, createdAt: Date.now() };
          setUser(newUser);
          localStorage.setItem('raf_way_user', JSON.stringify(newUser));
          setLoading(false);
      }, 1000);
  };

  const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('raf_way_user');
  };

  const updateUserStats = (newMessageCount: number, isPremium?: boolean) => {
      if (!user) return;
      const updatedUser = { 
          ...user, 
          messageCount: newMessageCount,
          isPremium: isPremium !== undefined ? isPremium : user.isPremium
      };
      setUser(updatedUser);
      localStorage.setItem('raf_way_user', JSON.stringify(updatedUser));
  };

  if (loading && !user) {
      return (
          <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
              <i className="fas fa-compass fa-spin text-4xl text-primary"></i>
          </div>
      );
  }

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login onLogin={handleLogin} isLoading={loading} /> : <Navigate to="/chat" />} 
        />
        
        <Route
          path="/chat"
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout}>
                <Chat user={user} updateUserStats={updateUserStats} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout}>
                <ParentDashboard user={user} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="/" element={<Navigate to={user ? "/chat" : "/login"} />} />
      </Routes>
    </HashRouter>
  );
};

export default App;