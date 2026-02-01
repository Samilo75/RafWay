import React from 'react';
import { UserProfile } from '../types';

interface LoginProps {
  onLogin: () => void;
  isLoading: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isLoading }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Abstract Shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent-start/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent-end/10 rounded-full blur-3xl"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="mx-auto h-20 w-20 bg-gradient-to-br from-accent-start to-accent-end rounded-2xl shadow-xl flex items-center justify-center text-white text-4xl mb-8 transform rotate-3 hover:rotate-0 transition-all duration-500">
            <i className="fas fa-compass"></i>
        </div>
        <h2 className="text-4xl font-extrabold text-primary tracking-tight mb-2">
          Raf Way
        </h2>
        <p className="mt-2 text-base text-gray-500 max-w-xs mx-auto">
          L'avenir s'écrit maintenant. L'IA au service de ton orientation.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-10 px-8 shadow-2xl shadow-gray-200/50 sm:rounded-3xl border border-gray-100">
            <div className="space-y-8">
                <div>
                    <button
                        onClick={onLogin}
                        disabled={isLoading}
                        className="w-full flex justify-center items-center gap-3 py-4 px-6 border border-gray-200 rounded-full shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-start transition-all duration-300 group"
                    >
                        {isLoading ? (
                            <i className="fas fa-circle-notch fa-spin text-accent-start"></i>
                        ) : (
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" />
                        )}
                        <span>Continuer avec Google</span>
                    </button>
                </div>
                
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-400 font-medium">
                            Fonctionnalités
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-indigo-50/50 transition-colors border border-transparent hover:border-indigo-100">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                             <i className="fas fa-brain"></i>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">IA Cognitive</h4>
                            <p className="text-xs text-gray-500">Analyse tes passions en profondeur.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-green-50/50 transition-colors border border-transparent hover:border-green-100">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                             <i className="fas fa-school"></i>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">Matching Écoles</h4>
                            <p className="text-xs text-gray-500">Trouve l'établissement parfait.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;