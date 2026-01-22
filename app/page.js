'use client';
import React, { useState, useEffect } from 'react';
import { Search, Users, FileText, PlusCircle, MapPin, Wifi, WifiOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [busca, setBusca] = useState('');
  const [isOnline, setIsOnline] = useState(true);

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
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      {/* CABEÇALHO OFICIAL */}
      <header className="bg-blue-800 text-white p-6 shadow-md border-b-4 border-yellow-500">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Espaço do Brasão Oficial */}
            <div className="bg-white p-1 rounded-lg shadow-lg">
              <img 
                src="/brasao.sjp.jfif" 
                alt="Brasão São João da Ponta" 
                className="w-16 h-16 object-contain"
                onError={(e) => { e.target.src = "https://via.placeholder.com/64?text=CRAS"; }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-tighter">CRAS Digital</h1>
              <p className="text-sm opacity-90 font-medium italic">São João da Ponta - Pará</p>
            </div>
          </div>

          {/* Status da Conexão */}
          <div className="flex items-center gap-2 text-xs font-bold uppercase px-3 py-1 rounded-full bg-blue-900 border border-blue-400">
            {isOnline ? (
              <><Wifi size={14} className="text-green-400" /> Sistema Online</>
            ) : (
              <><WifiOff size={14} className="text-red-400" /> Modo Offline</>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* BOAS VINDAS */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold">Olá, Assistente Social</h2>
          <p className="text-gray-500 text-sm">O que deseja fazer hoje?</p>
        </div>

        {/* BARRA DE BUSCA */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Buscar família por Nome ou CPF..."
            className="w-full p-4 pl-12 rounded-xl border-none shadow-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <Search className="absolute left-4 top-4 text-gray-400" />
        </div>

        {/* BOTÕES DE AÇÃO PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button className="flex items-center justify-center gap-4 bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border-b-4 border-blue-600 group">
            <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-600 transition-colors">
              <PlusCircle className="text-blue-600 group-hover:text-white" size={32} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg text-blue-900">Novo Cadastro</h3>
              <p className="text-xs text-gray-400">Registrar família ou membro</p>
            </div>
          </button>

          <button className="flex items-center justify-center gap-4 bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border-b-4 border-green-600 group">
            <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-600 transition-colors">
              <FileText className="text-green-600 group-hover:text-white" size={32} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg text-green-900">Novo Atendimento</h3>
              <p className="text-xs text-gray-400">Registrar evolução no prontuário</p>
            </div>
          </button>
        </div>

        {/* PAINEL DE RESUMO */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6 border-b pb-4">
            <Users size={20} className="text-blue-800" />
            <h2 className="font-bold text-gray-700">Resumo da Unidade</h2>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-3xl font-black text-blue-800 leading-none">0</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-2 font-bold">Famílias Cadastradas</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-lg font-bold text-green-700 leading-none italic">Sincronizado</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-2 font-bold">Banco de Dados</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 text-center pb-8">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
          Sistema de Gestão de Assistência Social
        </p>
      </footer>
    </div>
  );
}