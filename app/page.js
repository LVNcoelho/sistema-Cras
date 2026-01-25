'use client';
import React, { useState } from 'react';
import { Search, Users, BookOpen, Lock, LogOut, Save, X, UserPlus, ClipboardList } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SistemaCRAS() {
  const [autenticado, setAutenticado] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('busca');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [formData, setFormData] = useState({ nome: '', cpf: '', nis: '', endereco: '' });

  // FUNÇÃO DE CADASTRO REAL
  async function salvarCadastro(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('familias').insert([
      { 
        nome_responsavel: formData.nome, 
        cpf: formData.cpf, 
        nis: formData.nis, 
        endereco: formData.endereco 
      }
    ]);
    if (error) {
      alert("Erro técnico: " + error.message);
    } else {
      alert("Prontuário técnico criado com sucesso!");
      setMostrarForm(false);
      setFormData({ nome: '', cpf: '', nis: '', endereco: '' });
    }
    setLoading(false);
  }

  // TELA DE LOGIN
  if (!autenticado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-t-8 border-blue-700">
          <div className="text-center mb-8">
            <img src="/brasao.sjp.jfif" className="w-20 mx-auto mb-4 bg-white p-1 rounded-lg shadow-sm" />
            <h1 className="text-2xl font-bold text-blue-900 uppercase tracking-tight">Portal do Gestor SUAS</h1>
            <p className="text-slate-500 text-sm">São João da Ponta - PA</p>
          </div>
          <div className="space-y-4">
            <input type="text" placeholder="ID de Técnico" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-600" />
            <input type="password" placeholder="Senha de Acesso" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-600" />
            <button onClick={() => setAutenticado(true)} className="w-full bg-blue-700 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-all">
              <Lock size={18} /> Entrar no Sistema
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* CABEÇALHO OFICIAL */}
      <header className="bg-blue-700 text-white p-6 shadow-lg border-b-4 border-yellow-500">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/brasao.sjp.jfif" className="w-16 h-16 bg-white rounded-lg p-1" />
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-tight">CRAS Digital</h1>
              <p className="text-sm opacity-90 font-medium tracking-wide">Prefeitura de São João da Ponta - PA</p>
            </div>
          </div>
          <button onClick={() => setAutenticado(false)} className="flex items-center gap-2 text-xs font-bold uppercase hover:bg-blue-900 px-4 py-2 rounded-lg border border-blue-400 transition-all">
            <LogOut size={16} /> Encerrar Sessão
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full p-6 gap-6">
        {/* SIDEBAR TÉCNICO */}
        <aside className="w-full md:w-64 space-y-2">
          <button onClick={() => setAbaAtiva('busca')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${abaAtiva === 'busca' ? 'bg-blue-700 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-blue-50 border'}`}>
            <Search size={20} /> Consulta de Usuários
          </button>
          <button onClick={() => setAbaAtiva('paif')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${abaAtiva === 'paif' ? 'bg-blue-700 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-blue-50 border'}`}>
            <BookOpen size={20} /> Gestão do PAIF
          </button>
          <button onClick={() => setAbaAtiva('scfv')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${abaAtiva === 'scfv' ? 'bg-blue-700 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-blue-50 border'}`}>
            <Users size={20} /> Oficinas SCFV
          </button>
        </aside>

        {/* ÁREA DE CONTEÚDO */}
        <main className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[550px]">
          {abaAtiva === 'busca' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <ClipboardList className="text-blue-700" /> Prontuário de Usuários
                </h2>
                <button 
                  onClick={() => setMostrarForm(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-green-700 transition-all flex items-center gap-2"
                >
                  <UserPlus size={20} /> Novo Registro Técnico
                </button>
              </div>

              <div className="flex gap-4 mb-10 bg-slate-50 p-2 rounded-2xl border">
                <input 
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Localizar por Nome, CPF ou NIS..." 
                  className="flex-1 p-4 bg-transparent outline-none font-medium" 
                />
                <button className="bg-blue-700 text-white px-8 rounded-xl font-bold hover:bg-blue-800 shadow-md transition-all">
                  Filtrar
                </button>
              </div>

              <div className="border-2 border-dashed border-gray-100 rounded-[40px] p-20 text-center">
                <Users size={64} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-medium italic">Aguardando inserção de dados para consulta na base SUAS.</p>
              </div>
            </div>
          )}

          {abaAtiva === 'paif' && (
             <div className="p-10 text-center">
                <BookOpen size={64} className="mx-auto text-blue-100 mb-4" />
                <h2 className="text-xl font-bold text-slate-700">Módulo PAIF em Processamento</h2>
                <p className="text-slate-400 mt-2 italic text-sm text-balance">Esta seção gerencia o acompanhamento familiar particularizado de São João da Ponta.</p>
             </div>
          )}

          {abaAtiva === 'scfv' && (
             <div className="p-10 text-center">
                <Users size={64} className="mx-auto text-green-100 mb-4" />
                <h2 className="text-xl font-bold text-slate-700">Módulo SCFV em Processamento</h2>
                <p className="text-slate-400 mt-2 italic text-sm text-balance">Controle de grupos, oficinas e frequência dos usuários do Serviço de Convivência.</p>
             </div>
          )}
        </main>
      </div>

      {/* FORMULÁRIO TÉCNICO (MODAL) */}
      {mostrarForm && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <div className="bg-white rounded-[32px] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-700"><UserPlus size={24}/></div>
                <h2 className="text-xl font-bold text-slate-800">Nova Ficha de Usuário</h2>
              </div>
              <button onClick={() => setMostrarForm(false)} className="bg-slate-100 p-2 rounded-full text-slate-400 hover:text-red-500 transition-colors"><X /></button>
            </div>
            
            <form onSubmit={salvarCadastro} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome Completo</label>
                <input className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" required onChange={e => setFormData({...formData, nome: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">CPF</label>
                  <input className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" required onChange={e => setFormData({...formData, cpf: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">NIS</label>
                  <input className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setFormData({...formData, nis: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Endereço Residencial</label>
                <textarea className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" rows="3" onChange={e => setFormData({...formData, endereco: e.target.value})}></textarea>
              </div>
              <button disabled={loading} className="w-full bg-blue-700 text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-800 shadow-xl shadow-blue-200 transition-all">
                {loading ? "Registrando..." : <><Save size={22} /> Confirmar Cadastro Técnico</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}