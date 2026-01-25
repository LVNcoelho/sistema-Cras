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

  // Função para validar o login (simulado para o protótipo)
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

  // TELA DE LOGIN (COM USUÁRIO E SENHA DE VOLTA)
  if (!autenticado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans text-lg">
        <div className="bg-white p-12 rounded-[40px] shadow-2xl w-full max-w-lg border-t-[12px] border-blue-700 animate-in fade-in zoom-in duration-300">
          <div className="text-center mb-10">
            <img src="/brasao.sjp.jfif" className="w-32 mx-auto mb-6 bg-white p-2 rounded-2xl shadow-sm border" />
            <h1 className="text-3xl font-bold text-blue-900 uppercase tracking-tight">Portal do Gestor</h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">São João da Ponta - PA</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase ml-2 tracking-wider">Identificação / CPF</label>
              <input type="text" placeholder="000.000.000-00" className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-blue-700 text-2xl font-medium transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase ml-2 tracking-wider">Senha de Acesso</label>
              <input type="password" placeholder="••••••••" className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-blue-700 text-2xl font-medium transition-all" required />
            </div>
            <button type="submit" className="w-full bg-blue-700 text-white p-7 rounded-[30px] font-bold text-2xl flex items-center justify-center gap-3 hover:bg-blue-800 transition-all shadow-2xl shadow-blue-200 active:scale-95">
              <UserCheck size={28} /> Autenticar No Sistema
            </button>
          </form>
          <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Acesso restrito à rede municipal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-blue-700 text-white p-8 shadow-lg border-b-8 border-yellow-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img src="/brasao.sjp.jfif" className="w-24 h-24 bg-white rounded-2xl p-2 shadow-inner" />
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter italic">CRAS Digital</h1>
              <p className="text-lg opacity-90 font-bold uppercase tracking-widest">São João da Ponta - Pará</p>
            </div>
          </div>
          <button onClick={() => setAutenticado(false)} className="flex items-center gap-3 text-sm font-black uppercase border-4 border-blue-400 px-8 py-4 rounded-2xl hover:bg-blue-800 transition-all">
            <LogOut size={24} /> Sair do Portal
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-8 gap-10">
        <aside className="w-full md:w-80 space-y-4">
          <button onClick={() => setAbaAtiva('busca')} className={`w-full flex items-center gap-4 p-6 rounded-3xl transition-all font-black text-2xl ${abaAtiva === 'busca' ? 'bg-blue-700 text-white shadow-2xl translate-x-2' : 'bg-white border-2 text-slate-400 hover:bg-blue-50'}`}>
            <Search size={28} /> Consulta
          </button>
          <button onClick={() => setAbaAtiva('paif')} className={`w-full flex items-center gap-4 p-6 rounded-3xl transition-all font-black text-2xl ${abaAtiva === 'paif' ? 'bg-blue-700 text-white shadow-2xl translate-x-2' : 'bg-white border-2 text-slate-400 hover:bg-blue-50'}`}>
            <BookOpen size={28} /> Gestão PAIF
          </button>
          <button onClick={() => setAbaAtiva('scfv')} className={`w-full flex items-center gap-4 p-6 rounded-3xl transition-all font-black text-2xl ${abaAtiva === 'scfv' ? 'bg-blue-700 text-white shadow-2xl translate-x-2' : 'bg-white border-2 text-slate-400 hover:bg-blue-50'}`}>
            <Users size={28} /> Grupos SCFV
          </button>
        </aside>

        <main className="flex-1 bg-white rounded-[50px] shadow-sm border-2 p-12 min-h-[600px]">
          {abaAtiva === 'busca' && (
            <div className="animate-in fade-in">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">Prontuário Eletrônico</h2>
                <button onClick={() => setMostrarForm(true)} className="bg-green-600 text-white px-10 py-5 rounded-3xl font-black text-xl shadow-xl hover:bg-green-700 flex items-center gap-3 transition-all active:scale-95"><UserPlus size={28} /> Novo Registro</button>
              </div>
              <div className="flex gap-4 mb-12 bg-slate-50 p-4 rounded-[35px] border-4 border-slate-100 shadow-inner">
                <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar Nome do Usuário..." className="flex-1 p-6 bg-transparent outline-none font-bold text-3xl text-slate-700" />
                <button onClick={realizarBusca} className="bg-blue-700 text-white px-12 rounded-[25px] font-black text-2xl hover:bg-blue-800 transition-all">{buscando ? <Loader2 className="animate-spin" /> : "FILTRAR"}</button>
              </div>
              <div className="space-y-6">
                {usuariosEncontrados.map((u) => (
                  <div key={u.id} className="p-10 border-4 border-slate-50 rounded-[40px] flex justify-between items-center bg-white hover:border-blue-400 transition-all shadow-sm">
                    <div>
                      <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">{u.nome_responsavel}</h3>
                      <p className="text-xl text-slate-400 font-bold mt-2 uppercase tracking-widest">CPF: {u.cpf} | NIS: {u.nis || '---'}</p>
                    </div>
                    <button className="text-blue-700 font-black text-xl border-4 border-blue-700 px-8 py-4 rounded-2xl hover:bg-blue-700 hover:text-white transition-all">ABRIR FICHA</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {abaAtiva === 'paif' && (
            <div className="animate-in fade-in space-y-12">
               <h2 className="text-4xl font-black text-slate-800 border-b-4 pb-8 uppercase tracking-tighter">Indicadores PAIF</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="p-10 bg-blue-50 rounded-[45px] border-b-[12px] border-blue-700 shadow-xl">
                     <p className="text-lg font-black text-blue-800 uppercase mb-4 tracking-widest text-center">Famílias Ativas</p>
                     <p className="text-8xl font-black text-blue-900 tracking-tighter text-center">128</p>
                  </div>
                  <div className="p-10 bg-red-50 rounded-[45px] border-b-[12px] border-red-600 shadow-xl">
                     <p className="text-lg font-black text-red-800 uppercase mb-4 tracking-widest text-center">Em Vulnerabilidade</p>
                     <p className="text-8xl font-black text-red-700 tracking-tighter text-center">12</p>
                  </div>
               </div>
            </div>
          )}

          {abaAtiva === 'scfv' && (
            <div className="animate-in fade-in space-y-8">
              <h2 className="text-4xl font-black text-slate-800 border-b-4 pb-8 uppercase tracking-tighter">Serviço de Convivência</h2>
              <div className="p-20 border-8 border-dotted rounded-[60px] text-center bg-slate-50 border-slate-200">
                <Users size={80} className="mx-auto text-slate-200 mb-6" />
                <p className="text-3xl text-slate-300 font-black uppercase tracking-tighter">Carregando Oficinas...</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* FORMULÁRIO DE CADASTRO TÉCNICO */}
      {mostrarForm && (
        <div className="fixed inset-0 bg-slate-900/70 flex items-center justify-center p-4 z-50 backdrop-blur-lg">
          <div className="bg-white rounded-[50px] w-full max-w-3xl p-14 shadow-2xl animate-in zoom-in duration-300 border-t-[16px] border-blue-700">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter italic">Novo Prontuário</h2>
              <button onClick={() => setMostrarForm(false)} className="text-slate-300 hover:text-red-500 transition-colors"><X size={48} /></button>
            </div>
            <form onSubmit={salvarCadastro} className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-4">Nome Completo do Responsável</label>
                <input className="w-full p-7 bg-slate-50 border-4 border-slate-100 rounded-3xl text-2xl font-bold outline-none focus:border-blue-700 transition-all" required onChange={e => setFormData({...formData, nome_responsavel: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-4">CPF</label>
                  <input className="w-full p-7 bg-slate-50 border-4 border-slate-100 rounded-3xl text-2xl font-bold outline-none focus:border-blue-700" required onChange={e => setFormData({...formData, cpf: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-4">NIS</label>
                  <input className="w-full p-7 bg-slate-50 border-4 border-slate-100 rounded-3xl text-2xl font-bold outline-none focus:border-blue-700" onChange={e => setFormData({...formData, nis: e.target.value})} />
                </div>
              </div>
              <button disabled={loading} className="w-full bg-blue-700 text-white p-8 rounded-[35px] font-black text-3xl hover:bg-blue-800 shadow-2xl transition-all shadow-blue-200">
                {loading ? "PROCESSANDO..." : "CONFIRMAR REGISTRO"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}