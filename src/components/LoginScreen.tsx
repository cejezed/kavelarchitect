
import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simpele hardcoded check voor MVP. 
    // In productie zou je dit via de backend/Supabase Auth doen.
    if (password === 'brikx2024') {
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={32} />
        </div>
        
        <h1 className="text-2xl font-serif font-bold text-slate-900 mb-2">Brikx Dashboard</h1>
        <p className="text-slate-500 mb-8">Beveiligde omgeving voor beheerders.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="password" 
              autoFocus
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${error ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-slate-50'}`}
              placeholder="Wachtwoord invoeren..." 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
            />
            {error && <p className="text-red-500 text-xs mt-2 text-left">Onjuist wachtwoord</p>}
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Inloggen
          </button>
        </form>
        
        <p className="text-xs text-slate-300 mt-8">v1.0.4 • KavelArchitect System</p>
      </div>
    </div>
  );
};
