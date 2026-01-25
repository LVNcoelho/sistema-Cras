'use client';
import React, { useState, useEffect } from 'react';
import { Search, Users, BookOpen, LogOut, X, UserPlus, ClipboardList, Loader2, Save, UserCheck, FileText, MapPin, Calendar, Printer } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SistemaCRAS() {
  const [autenticado, setAutenticado] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('busca');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [busca, setBusca] = useState('');
  const [usuariosEncontrados, setUsuariosEncontrados] = useState([]);
  const [mensagemSucesso, setMensagemSucesso] = useState(false);
  const [formData, setFormData] = useState({ nome_responsavel: '', cpf: '', nis: '', endereco: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    setAutenticado(true);
  };

  async function realizarBusca() {
    if (!busca) return;
    setBuscando(true);
    const { data, error } = await supabase.from('familias').select('*').ilike('nome_responsavel', `%${busca}%`);
    if (!error) setUsuariosEncontrados(data);
    setBuscando(false);
  }

  async function salvarCadastro(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('familias').insert([formData]);
    if (!error) {
      setMostrarForm(false);
      setFormData({ nome_responsavel: '', cpf: '', nis: '', endereco: '' });
      setMensagemSucesso(true);
      setTimeout(() => setMensagemSucesso(false), 3000);
      setBusca(formData.nome_responsavel);
      realizarBusca();
    }
    setLoading(false);
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans text-slate-900">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-t-8 border-blue-700">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-blue-900 uppercase">Portal do Gestor</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">São João da Ponta - PA</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Usuário" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-700" required />
            <input type="password" placeholder="Senha" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-700" required />
            <button type="submit" className="w-full bg-blue-700 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-100">
              <UserCheck size={20} /> Entrar no Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-900">
      {mensagemSucesso && (
        <div className="fixed top-10 right-10 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl z-[100] animate-bounce font-bold flex items-center gap-2">
           <Save size={20} /> Registro Salvo com Sucesso!
        </div>
      )}

      <header className="bg-blue-700 text-white p-6 shadow-lg border-b-4 border-yellow-500 font-serif">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold uppercase italic">CRAS Digital</h1>
          <button onClick={() => setAutenticado(false)} className="flex items-center gap-2 text-xs font-bold uppercase border-2 border-blue-400 px-4 py-2 rounded-xl hover:bg-blue-800"><LogOut size={16} /> Sair</button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full p-6 gap-6">
        <aside className="w-full md:w-64 space-y-2">
          <button onClick={() => setAbaAtiva('busca')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all font-bold ${abaAtiva === 'busca' ? 'bg-blue-700 text-white shadow-lg' : 'bg-white border text-slate-600 hover:bg-blue-50'}`}>
            <Search size={20} /> Consulta
          </button>
        </aside>

        <main className="flex-1 bg-white rounded-3xl shadow-sm border p-8 min-h-[550px]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><ClipboardList className="text-blue-700" /> Prontuário</h2>
            <button onClick={() => setMostrarForm(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-green-700 flex items-center gap-2"><UserPlus size={18} /> Novo</button>
          </div>
          
          <div className="flex gap-4 mb-10 bg-slate-50 p-2 rounded-2xl border">
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar..." className="flex-1 p-4 bg-transparent outline-none font-medium text-slate-700" />
            <button onClick={realizarBusca} className="bg-blue-700 text-white px-8 rounded-xl font-bold">{buscando ? <Loader2 className="animate-spin" /> : "Filtrar"}</button>
          </div>

          <div className="space-y-4">
            {usuariosEncontrados.map((u) => (
              <div key={u.id} className="p-6 border rounded-2xl flex justify-between items-center bg-white hover:border-blue-400 transition-all shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800 uppercase">{u.nome_responsavel}</h3>
                  <p className="text-sm text-slate-500 font-medium">CPF: {u.cpf}</p>
                </div>
                <button onClick={() => setUsuarioSelecionado(u)} className="text-blue-700 font-bold text-sm border-2 border-blue-700 px-4 py-2 rounded-lg hover:bg-blue-700 hover:text-white transition-all">
                  Ver Ficha Técnica
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* MODAL DA FICHA - O que você quer testar agora */}
      {usuarioSelecionado && (
        <div className="fixed inset-0 bg-slate-900/90 flex items-center justify-center p-6 z-[150] backdrop-blur-md">
          <div className="bg-white rounded-[40px] w-full max-w-4xl shadow-2xl flex flex-col animate-in zoom-in">
            <div className="bg-blue-700 p-8 text-white flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold uppercase">{usuarioSelecionado.nome_responsavel}</h2>
                <p className="opacity-80">Prontuário SUAS SJP-PA</p>
              </div>
              <button onClick={() => setUsuarioSelecionado(null)} className="bg-white/10 p-2 rounded-full"><X size={24} /></button>
            </div>
            <div className="p-10 space-y-8 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-6 font-bold text-slate-700">
                <div className="p-4 bg-slate-50 rounded-xl border">CPF: {usuarioSelecionado.cpf}</div>
                <div className="p-4 bg-slate-50 rounded-xl border">NIS: {usuarioSelecionado.nis || '---'}</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-blue-800 italic">
                Endereço: {usuarioSelecionado.endereco || "Não Informado"}
              </div>
              <div className="flex gap-4">
                <button onClick={() => alert("Simulando impressão...")} className="flex-1 bg-slate-100 p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200"><Printer size={18} /> Imprimir</button>
                <button onClick={() => alert("Vinculado ao PAIF!")} className="flex-1 bg-blue-700 text-white p-4 rounded-xl font-bold hover:bg-blue-800 shadow-lg shadow-blue-200 uppercase">Vincular ao PAIF</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORMULÁRIO DE CADASTRO */}
      {mostrarForm && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-[100] backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in zoom-in">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-slate-800 uppercase italic">Novo Cadastro</h2>
              <button onClick={() => setMostrarForm(false)} className="text-slate-400"><X size={24} /></button>
            </div>
            <form onSubmit={salvarCadastro} className="space-y-4">
              <input placeholder="Nome" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-700 font-medium" required onChange={e => setFormData({...formData, nome_responsavel: e.target.value})} />
              <input placeholder="CPF" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-700 font-medium" required onChange={e => setFormData({...formData, cpf: e.target.value})} />
              <input placeholder="NIS" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-700 font-medium" onChange={e => setFormData({...formData, nis: e.target.value})} />
              <textarea placeholder="Endereço" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-700 font-medium" rows="2" onChange={e => setFormData({...formData, endereco: e.target.value})}></textarea>
              <button disabled={loading} className="w-full bg-blue-700 text-white p-4 rounded-xl font-bold hover:bg-blue-800 shadow-xl">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Gravar Dados"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}