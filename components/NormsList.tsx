
import React, { useState, useMemo } from 'react';
import { Norm, User, UserRole } from '../types';
import { BookOpenIcon, LockClosedIcon } from './icons';

interface NormCardProps {
  norm: Norm;
  onSelect: (norm: Norm) => void;
  user: User | null;
}

const NormCard: React.FC<NormCardProps> = ({ norm, onSelect, user }) => {
  const canView = !norm.isConfidential || user?.role === UserRole.ADMIN || user?.role === UserRole.DIRECTIVO;
  const latestVersion = norm.versions[norm.versions.length - 1];

  return (
    <div 
      onClick={() => onSelect(norm)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{norm.title}</h3>
            {norm.isConfidential && <LockClosedIcon className="h-5 w-5 text-yellow-500 flex-shrink-0 ml-2" />}
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">{norm.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
            {norm.tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full font-medium">
                    #{tag}
                </span>
            ))}
        </div>
      </div>
      <div className="mt-6 border-t dark:border-gray-700 pt-4 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center">
        <span>Última act: {new Date(latestVersion.date).toLocaleDateString()}</span>
        <span className={`font-semibold ${canView ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {canView ? 'Accesible' : 'Restringido'}
        </span>
      </div>
    </div>
  );
};

interface NormsListProps {
  norms: Norm[];
  onSelectNorm: (norm: Norm) => void;
  user: User | null;
}

const NormsList: React.FC<NormsListProps> = ({ norms, onSelectNorm, user }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredNorms = useMemo(() => {
        return norms.filter(norm => {
            const lowerSearch = searchTerm.toLowerCase();
            return (
                norm.title.toLowerCase().includes(lowerSearch) ||
                norm.description.toLowerCase().includes(lowerSearch) ||
                norm.tags.some(tag => tag.toLowerCase().includes(lowerSearch))
            );
        });
    }, [norms, searchTerm]);


    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="text-center mb-12">
                <BookOpenIcon className="h-16 w-16 mx-auto text-blue-500 mb-4" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100">Repositorio Normativo</h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Busque, explore y consulte la normativa consolidada de la universidad.
                </p>
            </div>
            
            <div className="mb-8 max-w-2xl mx-auto">
                <input 
                    type="text"
                    placeholder="Buscar por título, descripción o etiqueta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNorms.map(norm => (
                    <NormCard key={norm.id} norm={norm} onSelect={onSelectNorm} user={user} />
                ))}
            </div>
        </div>
    );
};

export default NormsList;
