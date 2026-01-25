'use client';
import React, { useState } from 'react';
import { Search, Users, BookOpen, Group, Lock, LogOut, CheckCircle } from 'lucide-react';

export default function SistemaCRAS() {
  const [autenticado, setAutenticado] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('busca');

  // TELA DE LOGIN (Confiabilidade)
  if (!autenticado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-t-8 border-blue-700">
          <div className="text-center mb-8">
            <img src="/brasao.sjp.jfif" className="w-20 mx-auto mb-4 bg-white p-1 rounded-lg" />
            <h1 className="text-2xl font-bold text-blue-900 uppercase tracking-tight">Portal do Gestor SUAS</h1>
            <p className="text-slate-500 text-sm">São João da Ponta - PA</p>
          </div>
          <div className="space-y-4">
            <input type="text" placeholder="Usuário / CPF" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-600" />
            <input type="password" placeholder="Senha" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-600" />
            <button onClick={() => setAutenticado(true)} className="w-full bg-blue-700 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg">
              <Lock size={18} /> Acessar Portal Técnico
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* CABEÇALHO (Mantendo as cores da imagem 6e80ef) */}
      <header className="bg-blue-700 text-white p-6 shadow-lg border-b-4 border-yellow-500">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/brasao.sjp.jfif" className="w-16 h-16 bg-white rounded-lg p-1" />
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-tight">CRAS Digital</h1>
              <p className="text-sm opacity-90 font-medium">São João da Ponta - Pará</p>
            </div>
          </div>
          <button onClick={() => setAutenticado(false)} className="flex items-center gap-2 text-xs font-bold uppercase hover:bg-blue-800 p-2 rounded-lg transition-all">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full p-6 gap-6">
        {/* MENU TÉCNICO LATERAL */}
        <aside className="w-full md:w-64 space-y-2">
          <button onClick={() => setAbaAtiva('busca')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${abaAtiva === 'busca' ? 'bg-blue-700 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-blue-50'}`}>
            <Search size={20} /> Consulta de Usuários
          </button>
          <button onClick={() => setAbaAtiva('paif')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${abaAtiva === 'paif' ? 'bg-blue-700 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-blue-50'}`}>
            <BookOpen size={20} /> Gestão do PAIF
          </button>
          <button onClick={() => setAbaAtiva('scfv')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${abaAtiva === 'scfv' ? 'bg-blue-700 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-blue-50'}`}>
            <Users size={20} /> Oficinas SCFV
          </button>
        </aside>

        {/* ÁREA DE TRABALHO DINÂMICA */}
        <main className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
          {abaAtiva === 'busca' && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Search className="text-blue-700" /> Prontuário de Usuários
              </h2>
              <div className="flex gap-4 mb-10">
                <input placeholder="Buscar por Nome, CPF ou NIS..." className="flex-1 p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-700" />
                <button className="bg-blue-700 text-white px-8 rounded-2xl font-bold hover:bg-blue-800 shadow-md transition-all">Filtrar</button>
              </div>
              <div className="border-2 border-dashed border-gray-100 rounded-3xl p-20 text-center">
                <Users size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-medium italic">Utilize os filtros acima para acessar o prontuário eletrônico do usuário.</p>
              </div>
            </div>
          )}

          {abaAtiva === 'paif' && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Acompanhamento Particularizado (PAIF)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-blue-50 rounded-2xl border-l-4 border-blue-700">
                  <p className="text-xs font-bold text-blue-700 uppercase">Usuários em Acompanhamento</p>
                  <p className="text-4xl font-black text-blue-900 mt-2">124</p>
                </div>
                <div className="p-6 bg-green-50 rounded-2xl border-l-4 border-green-600">
                  <p className="text-xs font-bold text-green-700 uppercase">Metas do Plano Individual</p>
                  <p className="text-4xl font-black text-green-900 mt-2">87%</p>
                </div>
              </div>
            </div>
          )}

          {abaAtiva === 'scfv' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Grupos e Oficinas Coletivas</h2>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm">+ Novo Grupo</button>
              </div>
              <div className="overflow-hidden border rounded-2xl">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-widest">
                    <tr>
                      <th className="p-4 border-b">Nome do Grupo</th>
                      <th className="p-4 border-b">Público</th>
                      <th className="p-4 border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 border-b font-semibold text-slate-700">Idosos em Movimento</td>
                      <td className="p-4 border-b">Terceira Idade</td>
                      <td className="p-4 border-b"><span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase">Ativo</span></td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 border-b font-semibold text-slate-700">Juventude SJP</td>
                      <td className="p-4 border-b">15 a 17 anos</td>
                      <td className="p-4 border-b"><span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase">Em Planejamento</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="p-6 text-center text-gray-400 text-[10px] uppercase tracking-widest font-bold">
        Secretaria de Assistência Social • Sistema de Gestão Digital Unificada
      </footer>
    </div>
  );
}