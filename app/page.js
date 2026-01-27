'use client';
import React, { useState } from 'react';
import { Search, Users, BookOpen, LogOut, X, UserPlus, ClipboardList, Loader2, Save, UserCheck, FileText, MapPin, Printer, Heart } from 'lucide-react';
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
  
  const [formData, setFormData] = useState({ 
    nome_responsavel: '', 
    cpf: '', 
    nis: '', 
    endereco: '',
    narrativa: '' 
  });

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
      setFormData({ nome_responsavel: '', cpf: '', nis: '', endereco: '', narrativa: '' });
      setMensagemSucesso(true);
      setTimeout(() => setMensagemSucesso(false), 3000);
      setBusca(formData.nome_responsavel);
      realizarBusca();
    }
    setLoading(false);
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-t-8 border-blue-700">
          <div className="text-center mb-8">
            <img src="/brasao.sjp.jfif" className="w-20 mx-auto mb-4 bg-white p-1 rounded-lg border" />
            <h1 className="text-2xl font-bold text-blue-900 uppercase">Portal do Gestor</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Usuário" className="w-full p-4 bg-slate-50 border rounded-xl outline-none" required />
            <input type="password" placeholder="Senha" className="w-full p-4 bg-slate-50 border rounded-xl outline-none" required />
            <button type="submit" className="w-full bg-blue-700 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2">
              <UserCheck size={20} /> Acessar Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {mensagemSucesso && (
        <div className="fixed top-10 right-10 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl z-[100] font-bold">
           Registro Salvo!
        </div>
      )}

      <header className="bg-blue-700 text-white p-6 shadow-lg border-b-4 border-yellow-500">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/brasao.sjp.jfif" className="w-16 h-16 bg-white rounded-lg p-1" />
            <h1 className="text-2xl font-bold uppercase italic">CRAS Digital</h1>
          </div>
          <button onClick={() => setAutenticado(false)} className="text-xs font-bold border border-white/40 px-4 py-2 rounded-xl"><LogOut size={16} /></button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full p-6 gap-6">
        {/* MENU LATERAL */}
        <aside className="w-full md:w-64 space-y-2">
          <button onClick={() => setAbaAtiva('busca')} className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold ${abaAtiva === 'busca' ? 'bg-blue-700 text-white' : 'bg-white border'}`}>
            <Search size={20} /> Consulta
          </button>
          <button onClick={() => setAbaAtiva('paif')} className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold ${abaAtiva === 'paif' ? 'bg-blue-700 text-white' : 'bg-white border'}`}>
            <BookOpen size={20} /> PAIF
          </button>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 bg-white rounded-3xl shadow-sm border p-8">
          {abaAtiva === 'busca' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Prontuário</h2>
                <button onClick={() => setMostrarForm(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                  <UserPlus size={18} /> Novo
                </button>
              </div>

              <div className="flex gap-4 mb-10 bg-slate-50 p-2 rounded-2xl border">
                <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar..." className="flex-1 p-4 bg-transparent outline-none" />
                <button onClick={realizarBusca} className="bg-blue-700 text-white px-8 rounded-xl font-bold">
                  {buscando ? "..." : "Filtrar"}
                </button>
              </div>

              <div className="space-y-4">
                {usuariosEncontrados.map((u) => (
                  <div key={u.id} className="p-6 border rounded-2xl flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-slate-800 uppercase">{u.nome_responsavel}</h3>
                    </div>
                    <button onClick={() => setUsuarioSelecionado(u)} className="text-blue-700 font-bold border-2 border-blue-700 px-4 py-2 rounded-lg">Ficha</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL FICHA TÉCNICA (COM ESCUTA) */}
      {usuarioSelecionado && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-[100]">
          <div className="bg-white rounded-[32px] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="bg-blue-700 p-6 text-white flex justify-between">
              <h2 className="text-2xl font-bold uppercase">{usuarioSelecionado.nome_responsavel}</h2>
              <button onClick={() => setUsuarioSelecionado(null)}><X /></button>
            </div>
            <div className="p-8 overflow-y-auto space-y-6">
               <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                  <h3 className="text-rose-800 font-bold flex items-center gap-2 mb-3"><Heart size={18} className="fill-rose-600"/> Narrativa da Coordenadoria</h3>
                  <p className="italic text-slate-700">{usuarioSelecionado.narrativa || "Sem registro humano ainda."}</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* FORMULÁRIO NOVO (COM O CAMPO QUE VOCÊ QUER VER) */}
      {mostrarForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-[32px] w-full max-w-lg p-8 shadow-2xl">
            <div className="flex justify-between mb-6">
              <h2 className="font-bold uppercase text-xl">Novo Cadastro</h2>
              <button onClick={() => setMostrarForm(false)}><X /></button>
            </div>
            <form onSubmit={salvarCadastro} className="space-y-4">
              <input placeholder="Nome" className="w-full p-4 border rounded-xl" required onChange={e => setFormData({...formData, nome_responsavel: e.target.value})} />
              <input placeholder="CPF" className="w-full p-4 border rounded-xl" required onChange={e => setFormData({...formData, cpf: e.target.value})} />
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-rose-500 uppercase flex items-center gap-1">
                  <Heart size={12} fill="currentColor"/> Escuta Ativa (Humanizado)
                </label>
                <textarea 
                  placeholder="Conte a história da família aqui..." 
                  className="w-full p-4 bg-rose-50/50 border border-rose-100 rounded-xl min-h-[100px]" 
                  onChange={e => setFormData({...formData, narrativa: e.target.value})}
                />
              </div>

              <button className="w-full bg-blue-700 text-white p-4 rounded-xl font-bold uppercase">Salvar Registro</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}