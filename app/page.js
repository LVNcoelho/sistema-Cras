'use client';
import React, { useState, useEffect } from 'react';
import { Search, Users, FileText, Wifi, WifiOff, PlusCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [busca, setBusca] = useState('');

  // Monitora se a internet caiu ou voltou
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Barra Superior */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Users className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-blue-900">CRAS Digital</h1>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
          {isOnline ? 'SISTEMA ONLINE' : 'MODO OFFLINE ATIVO'}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6">
        {/* Boas-vindas */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">Olá, Assistente Social</h2>
          <p className="text-gray-500">O que deseja fazer hoje?</p>
        </div>

        {/* Barra de Busca Gigante (O diferencial que comentamos) */}
        <div className="relative mb-10">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-lg"
            placeholder="Buscar família por Nome, CPF ou NIS..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* Atalhos Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow group">
            <div className="bg-blue-50 p-4 rounded-full mb-4 group-hover:bg-blue-600 transition-colors">
              <PlusCircle className="text-blue-600 group-hover:text-white" size={32} />
            </div>
            <span className="font-semibold text-gray-700">Novo Cadastro</span>
            <span className="text-xs text-gray-400 mt-1 text-center">Registrar família ou membro</span>
          </button>

          <button className="flex flex-col items-center p-6 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow group">
            <div className="bg-green-50 p-4 rounded-full mb-4 group-hover:bg-green-600 transition-colors">
              <FileText className="text-green-600 group-hover:text-white" size={32} />
            </div>
            <span className="font-semibold text-gray-700">Novo Atendimento</span>
            <span className="text-xs text-gray-400 mt-1 text-center">Registrar evolução no prontuário</span>
          </button>

          <div className="bg-blue-900 p-6 rounded-2xl text-white flex flex-col justify-center">
            <h3 className="text-sm font-light opacity-80">Total de Famílias</h3>
            <span className="text-4xl font-bold">1.240</span>
            <span className="text-xs mt-2 text-blue-300">Sincronizado agora mesmo</span>
          </div>
        </div>
      </main>
    </div>
  );
}
