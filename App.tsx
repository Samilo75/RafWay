import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Chat from './pages/Chat';
import ParentDashboard from './pages/ParentDashboard';
import { UserProfile } from './types';
import { auth, googleProvider, db } from './firebaseConfig';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Écouteur d'état d'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
      
      if (currentUser) {
        // L'utilisateur est connecté, on récupère son profil Firestore
        await fetchOrCreateUserProfile(currentUser);
      } else {
        // Déconnecté
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Récupère ou crée le profil utilisateur dans Firestore
  const fetchOrCreateUserProfile = async (authUser: User) => {
    try {
      const userRef = doc(db, 'users', authUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // Le profil existe déjà
        const data = userSnap.data();
        setUserProfile({
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL,
          isPremium: data.isPremium || false,
          messageCount: data.messageCount || 0,
          createdAt: data.createdAt
        });
      } else {
        // Nouveau utilisateur : Création du profil initial
        const newUser: UserProfile = {
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL,
          isPremium: false, // Par défaut gratuit
          messageCount: 0,
          createdAt: serverTimestamp()
        };
        
        await setDoc(userRef, newUser);
        setUserProfile(newUser);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // La logique de suite est gérée par onAuthStateChanged
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // setUserProfile(null) est géré par onAuthStateChanged
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    }
  };

  // Mise à jour optimiste et locale des stats (pour fluidité UI)
  // Dans une vraie app, cela serait aussi synchronisé avec Firestore
  const updateUserStats = (newMessageCount: number, isPremium?: boolean) => {
    if (!userProfile) return;
    
    const updatedUser = { 
        ...userProfile, 
        messageCount: newMessageCount,
        isPremium: isPremium !== undefined ? isPremium : userProfile.isPremium
    };
    
    setUserProfile(updatedUser);
    
    // Note: La sauvegarde Firestore réelle se ferait ici ou via la Cloud Function
  };

  if (loading) {
      return (
          <div className="h-screen w-screen flex flex-col items-center justify-center bg-background">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-start to-accent-end flex items-center justify-center animate-pulse mb-4 shadow-lg shadow-indigo-500/30">
                  <i className="fas fa-compass text-white text-3xl"></i>
              </div>
              <p className="text-gray-400 text-sm font-medium tracking-wide">Chargement de Raf Way...</p>
          </div>
      );
  }

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!userProfile ? <Login onLogin={handleLogin} isLoading={loading} /> : <Navigate to="/chat" />} 
        />
        
        <Route
          path="/chat"
          element={
            userProfile ? (
              <Layout user={userProfile} onLogout={handleLogout}>
                <Chat user={userProfile} updateUserStats={updateUserStats} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            userProfile ? (
              <Layout user={userProfile} onLogout={handleLogout}>
                <ParentDashboard user={userProfile} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="/" element={<Navigate to={userProfile ? "/chat" : "/login"} />} />
      </Routes>
    </HashRouter>
  );
};

export default App;