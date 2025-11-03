
import React, { useState } from 'react';
import { Norm, User, UserRole, Version } from '../types';
import { MOCK_NORMS } from '../data';
import { BookOpenIcon, ClockIcon, UserIcon, LockClosedIcon, WandIcon } from './icons';
import { summarizeChange } from '../services/geminiService';

interface NormDetailViewProps {
  norm: Norm;
  user: User | null;
  onBack: () => void;
  updateNorm: (updatedNorm: Norm) => void;
}

const VersionHistory: React.FC<{ versions: Version[], onSelectVersion: (version: Version) => void, selectedVersion: Version }> = ({ versions, onSelectVersion, selectedVersion }) => {
  return (
    <div className="w-full lg:w-1/4 xl:w-1/5 space-y-4">
      <h3 className="text-xl font-bold mb-2">Historial de Versiones</h3>
      <div className="relative border-l-2 border-blue-500 ml-2">
        {versions.slice().reverse().map((v) => (
          <div key={v.version} className="mb-8 ml-6 cursor-pointer" onClick={() => onSelectVersion(v)}>
            <span className={`absolute -left-[11px] flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-white dark:ring-gray-800 ${selectedVersion.version === v.version ? 'bg-blue-600' : 'bg-gray-400'}`}></span>
            <h4 className={`font-semibold ${selectedVersion.version === v.version ? 'text-blue-600 dark:text-blue-400' : ''}`}>Versión {v.version}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(v.date).toLocaleDateString()}</p>
            {v.modification && (
              <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                Modificado por: {v.modification.modifyingNormTitle}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ApplyModificationModal: React.FC<{
  targetNorm: Norm,
  user: User,
  onClose: () => void,
  updateNorm: (updatedNorm: Norm) => void
}> = ({ targetNorm, user, onClose, updateNorm }) => {
    const [modifyingNormId, setModifyingNormId] = useState('');
    const [newContent, setNewContent] = useState(targetNorm.versions[targetNorm.versions.length - 1].content);
    const [summary, setSummary] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = async () => {
        const modifyingNorm = MOCK_NORMS.find(n => n.id === modifyingNormId);
        if (!modifyingNorm) {
            alert('Norma modificatoria no encontrada.');
            return;
        }
        setIsAnalyzing(true);
        const generatedSummary = await summarizeChange(
            targetNorm.versions[targetNorm.versions.length - 1].content,
            modifyingNorm.versions[0].content
        );
        setSummary(generatedSummary);
        setIsAnalyzing(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const modifyingNorm = MOCK_NORMS.find(n => n.id === modifyingNormId);
        if (!modifyingNorm || !summary) {
            alert('Por favor, complete todos los campos y genere un resumen.');
            return;
        }

        const newVersion: Version = {
            version: targetNorm.versions.length + 1,
            content: newContent,
            date: new Date().toISOString(),
            modification: {
                modifyingNormId: modifyingNorm.id,
                modifyingNormTitle: modifyingNorm.title,
                summary: summary,
                appliedBy: user.id,
                appliedAt: new Date().toISOString(),
            }
        };

        const updatedNorm: Norm = {
            ...targetNorm,
            versions: [...targetNorm.versions, newVersion]
        };
        
        updateNorm(updatedNorm);
        onClose();
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-3xl m-4 h-[90vh] flex flex-col">
                <h2 className="text-2xl font-bold mb-4">Aplicar Modificación a "{targetNorm.title}"</h2>
                <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden">
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">ID de Norma Modificatoria</label>
                        <select
                            value={modifyingNormId}
                            onChange={(e) => setModifyingNormId(e.target.value)}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                        >
                            <option value="">Seleccione una norma</option>
                            {MOCK_NORMS.filter(n => n.id !== targetNorm.id).map(n => (
                                <option key={n.id} value={n.id}>{n.id} - {n.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4 flex-grow flex flex-col">
                        <label className="block text-sm font-medium mb-1">Nuevo Contenido Consolidado</label>
                        <textarea
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            className="w-full p-2 border rounded flex-grow dark:bg-gray-700 dark:border-gray-600 font-mono text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <button type="button" onClick={handleAnalyze} disabled={isAnalyzing || !modifyingNormId} className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-purple-400">
                           {isAnalyzing ? 'Analizando...' : <><WandIcon className="w-5 h-5"/> Generar Resumen con IA</>}
                        </button>
                    </div>
                    <div className="mb-4">
                         <label className="block text-sm font-medium mb-1">Resumen del Cambio</label>
                        <textarea
                            value={summary}
                            readOnly
                            placeholder="El resumen generado por IA aparecerá aquí..."
                            className="w-full p-2 border rounded h-24 dark:bg-gray-600 dark:border-gray-500"
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Guardar Cambio</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const NormDetailView: React.FC<NormDetailViewProps> = ({ norm, user, onBack, updateNorm }) => {
  const latestVersion = norm.versions[norm.versions.length - 1];
  const [selectedVersion, setSelectedVersion] = useState<Version>(latestVersion);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canView = !norm.isConfidential || user?.role === UserRole.ADMIN || user?.role === UserRole.DIRECTIVO;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <button onClick={onBack} className="mb-6 text-blue-600 dark:text-blue-400 hover:underline">
        &larr; Volver a la lista
      </button>

      <header className="mb-8">
        <div className="flex items-center gap-4">
          <BookOpenIcon className="h-12 w-12 text-blue-500" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{norm.title}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">{norm.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
            {norm.tags.map(tag => <span key={tag} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-xs font-medium">#{tag}</span>)}
            {norm.isConfidential && <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400"><LockClosedIcon className="w-4 h-4" /> Confidencial</span>}
        </div>
      </header>

      {user?.role === UserRole.ADMIN && (
        <div className="my-6 p-4 bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 rounded-r-lg">
            <h3 className="font-bold text-yellow-800 dark:text-yellow-200">Panel de Administrador</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">Como administrador, puede aplicar modificaciones a esta norma.</p>
            <button onClick={() => setIsModalOpen(true)} className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm font-semibold">
                Aplicar Modificación
            </button>
        </div>
      )}

      {!canView ? (
        <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <LockClosedIcon className="h-16 w-16 mx-auto text-yellow-500" />
            <h2 className="mt-4 text-2xl font-bold">Acceso Restringido</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Esta norma es confidencial. Por favor, inicie sesión con una cuenta autorizada para ver su contenido.</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
            <main className="flex-grow bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4 pb-4 border-b dark:border-gray-700">
                    <div>
                      <h2 className="text-2xl font-bold">Versión Consolidada {selectedVersion.version}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Mostrando contenido al {new Date(selectedVersion.date).toLocaleString()}</p>
                    </div>
                </div>

                {selectedVersion.modification && (
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <h4 className="font-bold text-blue-800 dark:text-blue-200">Resumen del Cambio:</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 italic">"{selectedVersion.modification.summary}"</p>
                        <div className="text-xs mt-3 text-blue-600 dark:text-blue-400 flex flex-wrap gap-x-4 gap-y-1">
                            <span className="flex items-center gap-1"><BookOpenIcon className="w-3 h-3"/> {selectedVersion.modification.modifyingNormTitle}</span>
                            <span className="flex items-center gap-1"><UserIcon className="w-3 h-3"/> Aplicado por: {selectedVersion.modification.appliedBy}</span>
                            <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3"/> {new Date(selectedVersion.modification.appliedAt).toLocaleString()}</span>
                        </div>
                    </div>
                )}
                
                <article className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedVersion.content.replace(/\n/g, '<br />') }} />
            </main>
            <VersionHistory versions={norm.versions} onSelectVersion={setSelectedVersion} selectedVersion={selectedVersion} />
        </div>
      )}

      {isModalOpen && user && user.role === UserRole.ADMIN && (
        <ApplyModificationModal 
            targetNorm={norm}
            user={user}
            onClose={() => setIsModalOpen(false)}
            updateNorm={updateNorm}
        />
      )}
    </div>
  );
};

export default NormDetailView;
