
import React, { useState, useEffect } from 'react';
import { Norm, User, UserRole } from './types';
import { MOCK_NORMS } from './data';
import NormsList from './components/NormsList';
import NormDetailView from './components/NormDetailView';
import LoginModal from './components/LoginModal';
import Chatbot from './components/Chatbot';
import { UserIcon } from './components/icons';

const Navbar: React.FC<{ user: User | null; onLoginClick: () => void; onLogoutClick: () => void }> = ({ user, onLoginClick, onLogoutClick }) => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800 dark:text-white">
          Lex <span className="text-blue-500">Dinámica</span>
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-sm">
                <UserIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" /> 
                {user.username} ({user.role})
              </span>
              <button onClick={onLogoutClick} className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors">
                Salir
              </button>
            </div>
          ) : (
            <button onClick={onLoginClick} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [norms, setNorms] = useState<Norm[]>(MOCK_NORMS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedNorm, setSelectedNorm] = useState<Norm | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSelectNorm = (norm: Norm) => {
    setSelectedNorm(norm);
  };

  const handleBackToList = () => {
    setSelectedNorm(null);
  };

  const updateNorm = (updatedNorm: Norm) => {
      setNorms(prevNorms => prevNorms.map(n => n.id === updatedNorm.id ? updatedNorm : n));
      setSelectedNorm(updatedNorm);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar
        user={currentUser}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogoutClick={handleLogout}
      />
      <main className="flex-grow">
        {selectedNorm ? (
          <NormDetailView norm={selectedNorm} user={currentUser} onBack={handleBackToList} updateNorm={updateNorm} />
        ) : (
          <NormsList norms={norms} onSelectNorm={handleSelectNorm} user={currentUser} />
        )}
      </main>
      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLogin}
        />
      )}
      <Chatbot />
      <footer className="bg-white dark:bg-gray-800 text-center py-4 border-t dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} Lex Dinámica. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default App;
