'use client';
import React, { useState } from 'react';
import { Search, Users, BookOpen, Lock, LogOut, Save, X, UserPlus, ClipboardList, Loader2, Calendar, AlertCircle, BarChart3, UserCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SistemaCRAS() {
  const [autenticado, setAutenticado] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('busca');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [busca, setBusca] = useState('');
  const [usuariosEncontrados, setUsuariosEncontrados] = useState([]);
  const [formData, setFormData] = useState({ nome_responsavel: '', cpf: '', nis: '', endereco: '' });

  // Login Simulado
  const handleLogin = (e) => {
    e.preventDefault();
    setAutenticado(true);
  };

  async function realizarBusca() {
    if (!busca) return;
    setBuscando(true);
    const { data, error } = await supabase.from('familias').select('*').ilike('nome_responsavel', `%${busca}%`);
    if (error) alert("Erro: " + error.message);
    else setUsuariosEncontrados(data);
    setBuscando(false);
  }

  async function salvarCadastro(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('familias').insert([formData]);
    if (error) alert("Erro: " + error.message);
    else {
      alert("Usuário cadastrado com sucesso!");
      setMostrarForm(false);
      setFormData({ nome_responsavel: '', cpf: '', nis: '', endereco: '' });
      realizarBusca();
    }
    setLoading(false);
  }

  // TELA DE LOGIN (COM USUÁRIO E SENHA)
  if (!autenticado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-t-8 border-blue-700 animate-in fade-in zoom-in duration-300">
          <div className="text-center mb-8">
            <img src="/brasao.sjp.jfif" className="w-20 mx-auto mb-4 bg-white p-1 rounded-lg shadow-sm border" />
            <h1 className="text-2xl font-bold text-blue-900 uppercase tracking-tight">Portal do Gestor</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">São João da Ponta - PA</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Identificação / CPF</label>
              <input type="text" placeholder="000.000.000-00" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-700 transition-all font-medium" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Senha de Acesso</label>
              <input type="password" placeholder="••••••••" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-700 transition-all font-medium" required />
            </div>
            <button type="submit" className="w-full bg-blue-700 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-100">
              <UserCheck size={20} /> Autenticar No Sistema
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-400 mt-8 uppercase font-bold tracking-tighter italic text-balance px-4 text-center">Acesso restrito a técnicos da Assistência Social municipal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-blue-700 text-white p-6 shadow-lg border-b-4 border-yellow-500">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/brasao.sjp.jfif" className="w-16 h-16 bg-white rounded-lg p-1 shadow-inner" />
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-tight italic">CRAS Digital</h1>
              <p className="text-sm opacity-90 font-medium">São João da Ponta - PA</p>
            </div>
          </div>
          <button onClick={() => setAutenticado(false)} className="flex items-center gap-2 text-xs font-bold uppercase border-2 border-blue-400 px-4 py-2 rounded-xl hover:bg-blue-800 transition-all">
            <LogOut size={16} /> Encerrar Sessão
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full p-6 gap-6">
        <aside className="w-full md:w-64 space-y-2">
          <button onClick={() => setAbaAtiva('busca')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all font-bold ${abaAtiva === 'busca' ? 'bg-blue-700 text-white shadow-lg' : 'bg-white border text-slate-600 hover:bg-blue-50'}`}>
            <Search size={20} /> Consulta de Usuários
          </button>
          <button onClick={() => setAbaAtiva('paif')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all font-bold ${abaAtiva === 'paif' ? 'bg-blue-700 text-white shadow-lg' : 'bg-white border text-slate-600 hover:bg-blue-50'}`}>
            <BookOpen size={20} /> Gestão do PAIF
          </button>
          <button onClick={() => setAbaAtiva('scfv')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all font-bold ${abaAtiva === 'scfv' ? 'bg-blue-700 text-white shadow-lg' : 'bg-white border text-slate-600 hover:bg-blue-50'}`}>
            <Users size={20} /> Oficinas SCFV
          </button>
        </aside>

        <main className="flex-1 bg-white rounded-3xl shadow-sm border p-8 min-h-[550px]">
          {abaAtiva === 'busca' && (
            <div className="animate-in fade-in">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><ClipboardList className="text-blue-700" /> Prontuário Eletrônico</h2>
                <button onClick={() => setMostrarForm(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-green-700 flex items-center gap-2 transition-all"><UserPlus size={18} /> Novo Registro</button>
              </div>
              <div className="flex gap-4 mb-10 bg-slate-50 p-2 rounded-2xl border">
                <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar por Nome ou CPF..." className="flex-1 p-4 bg-transparent outline-none font-medium" />
                <button onClick={realizarBusca} className="bg-blue-700 text-white px-8 rounded-xl font-bold hover:bg-blue-800 transition-all">{buscando ? <Loader2 className="animate-spin" /> : "Filtrar"}</button>
              </div>
              <div className="space-y-4">
                {usuariosEncontrados.map((u) => (
                  <div key={u.id} className="p-6 border rounded-2xl flex justify-between items-center bg-white hover:border-blue-400 transition-all">
                    <div>
                      <h3 className="font-bold text-slate-800 uppercase">{u.nome_responsavel}</h3>
                      <p className="text-sm text-slate-500 font-medium">CPF: {u.cpf} | NIS: {u.nis || '---'}</p>
                    </div>
                    <button className="text-blue-700 font-bold text-sm border-2 border-blue-700 px-4 py-2 rounded-lg hover:bg-blue-700 hover:text-white transition-all">Ver Ficha Técnica</button>
                  </div>
                ))}
                {usuariosEncontrados.length === 0 && !buscando && (
                  <div className="border-2 border-dashed border-gray-100 rounded-[40px] p-20 text-center">
                    <Users size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 font-medium italic">Localize um usuário na base técnica para exibir o prontuário.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {abaAtiva === 'paif' && (
            <div className="animate-in fade-in space-y-8">
              <h2 className="text-2xl font-bold text-slate-800 border-b pb-4">Indicadores Técnicos (PAIF)</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-50 rounded-2xl border-b-4 border-blue-700 shadow-sm">
                  <p className="text-xs font-bold text-blue-800 uppercase mb-2">Famílias Ativas</p>
                  <p className="text-4xl font-black text-blue-900">128</p>
                </div>
                <div className="p-6 bg-red-50 rounded-2xl border-b-4 border-red-600 shadow-sm">
                  <p className="text-xs font-bold text-red-800 uppercase mb-2">Em Vulnerabilidade</p>
                  <p className="text-4xl font-black text-red-700">12</p>
                </div>
              </div>
            </div>
          )}

          {abaAtiva === 'scfv' && (
            <div className="animate-in fade-in space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 border-b pb-4">Grupos SCFV</h2>
              <div className="p-10 border-2 border-dashed rounded-3xl text-center bg-slate-50">
                <Users size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-medium italic">Dados do Serviço de Convivência sendo processados...</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* FORMULÁRIO DE CADASTRO TÉCNICO */}
      {mostrarForm && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-slate-800 italic uppercase">Novo Prontuário</h2>
              <button onClick={() => setMostrarForm(false)} className="text-slate-400"><X size={24} /></button>
            </div>
            <form onSubmit={salvarCadastro} className="space-y-4">
              <input placeholder="Nome do Responsável" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-700 font-medium" required onChange={e => setFormData({...formData, nome_responsavel: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="CPF" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-700 font-medium" required onChange={e => setFormData({...formData, cpf: e.target.value})} />
                <input placeholder="NIS" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-700 font-medium" onChange={e => setFormData({...formData, nis: e.target.value})} />
              </div>
              <textarea placeholder="Endereço da Residência" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-700 font-medium" rows="3" onChange={e => setFormData({...formData, endereco: e.target.value})}></textarea>
              <button disabled={loading} className="w-full bg-blue-700 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-blue-800 transition-all shadow-xl shadow-blue-100">
                {loading ? "Gravando..." : "Confirmar Cadastro Governamental"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}