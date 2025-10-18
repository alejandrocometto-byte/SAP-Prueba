
import React, { useState } from 'react';
import { BarChart3, Lock } from 'lucide-react';

interface LoginModalProps {
  onLogin: (password: string) => boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError('Clave de acceso incorrecta. Intente de nuevo.');
      setPassword('');
    } else {
      setError('');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <BarChart3 size={48} className="text-electric-blue" />
          </div>
          <h1 className="text-2xl font-bold text-white">AdminTrack Dashboard</h1>
          <p className="text-gray-400">Por favor, ingrese la clave de acceso para continuar.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Clave de Acceso"
              className="bg-gray-700 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-electric-blue"
              required
            />
          </div>
          {error && <p className="text-sm text-coral-red text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-semibold text-white bg-electric-blue rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-electric-blue transition-colors duration-200"
            >
              Acceder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
