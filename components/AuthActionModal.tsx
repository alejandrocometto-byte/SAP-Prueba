import React, { useState, useEffect } from 'react';
import { Lock, X } from 'lucide-react';

interface AuthActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  title: string;
  description: string;
  error?: string;
}

const AuthActionModal: React.FC<AuthActionModalProps> = ({ isOpen, onClose, onConfirm, title, description, error }) => {
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPassword('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-gray-400 mt-2">{description}</p>
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
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-coral-red text-center">{error}</p>}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-gray-300 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-white bg-electric-blue rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthActionModal;
