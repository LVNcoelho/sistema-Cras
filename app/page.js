'use client';
import React, { useState } from 'react';
import { Search, Users, BookOpen, LogOut, X, UserPlus, ClipboardList, Loader2, Save, UserCheck, FileText, MapPin, Calendar, Printer, Heart } from 'lucide-react';
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
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-t-8 border-blue-600">
          <div className="text-center mb-8">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Bras%C3%A3o_de_S%C3%A3o_Jo%C3%A3o_de_Pirabas.svg/1200px-Bras%C3%A3o_de_S%C3%A3o_Jo%C3%A3o_de_Pirabas.svg.png" className="w-20 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-blue-900 uppercase">Portal do Gestor</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Usuário" className="w-full p-4 bg-slate-50 border rounded-xl outline-none" required />
            <input type="password" placeholder="Senha" className="w-full p-4 bg-slate-50 border rounded-xl outline-none" required />
            <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 uppercase text-sm shadow-lg">
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
        <div className="fixed top-10 right-10 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl z-[100] animate-bounce font-bold flex items-center gap-2">
           <Save size={20} /> Registro Salvo com Sucesso!
        </div>
      )}

      {/* HEADER IDÊNTICO À FOTO */}
      <header className="bg-[#2563eb] text-white p-6 shadow-md border-b-4 border-yellow-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white p-1 rounded-lg">
               <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Bras%C3%A3o_de_S%C3%A3o_Jo%C3%A3o_de_Pirabas.svg/1200px-Bras%C3%A3o_de_S%C3%A3o_Jo%C3%A3o_de_Pirabas.svg.png" className="w-12 h-12 object-contain" />
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-tight italic">CRAS DIGITAL</h1>
          </div>
          <button onClick={() => setAutenticado(false)} className="flex items-center gap-2 text-xs font-bold uppercase border border-white/40 px-4 py-2 rounded-lg hover:bg-white/10 transition-all">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-8 gap-8">
        {/* AS ABAS QUE TINHAM SUMIDO */}
        <aside className="w-full md:w-72 space-y-3">
          <button onClick={() => setAbaAtiva('busca')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all font-bold text-sm ${abaAtiva === 'busca' ? 'bg-[#2563eb] text-white shadow-blue-200 shadow-xl' : 'bg-white border text-slate-600 hover:bg-slate-50'}`}>
            <Search size={20} /> Consulta de Usuários
          </button>
          <button onClick={() => setAbaAtiva('paif')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all font-bold text-sm ${abaAtiva === 'paif' ? 'bg-[#2563eb] text-white shadow-blue-200 shadow-xl' : 'bg-white border text-slate-600 hover:bg-slate-50'}`}>
            <BookOpen size={20} /> Gestão do PAIF
          </button>
        </aside>

        <main className="flex-1 bg-white rounded-[32px] shadow-sm border border-slate-100 p-10">
          {abaAtiva === 'busca' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <ClipboardList className="text-blue-600" size={28} /> Prontuário Eletrônico
                </h2>
                <button onClick={() => setMostrarForm(true)} className="bg-[#22c55e] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-green-100 hover:bg-green-600 flex items-center gap-2 transition-all">
                  <UserPlus size={18} /> Novo Registro
                </button>
              </div>

              <div className="flex gap-4 mb-10 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar nome..." className="flex-1 p-4 bg-transparent outline-none font-medium text-slate-600" />
                <button onClick={realizarBusca} className="bg-[#2563eb] text-white px-10 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg">
                  {buscando ? <Loader2 className="animate-spin" /> : "Filtrar"}
                </button>
              </div>

              <div className="space-y-4">
                {usuariosEncontrados.map((u) => (
                  <div key={u.id} className="p-6 border border-slate-100 rounded-[24px] flex justify-between items-center bg-white hover:border-blue-300 transition-all group shadow-sm">
                    <div>
                      <h3 className="font-bold text-slate-800 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{u.nome_responsavel}</h3>
                      <p className="text-xs text-slate-400 font-medium mt-1 uppercase">CPF: {u.cpf} | NIS: {u.nis || 'Não Informado'}</p>
                    </div>
                    <button onClick={() => setUsuarioSelecionado(u)} className="text-blue-600 font-bold text-xs border-2 border-blue-50 px-5 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                      VER FICHA TÉCNICA
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL DA FICHA (CONFORME A PRIMEIRA IMAGEM) */}
      {usuarioSelecionado && (
        <div className="fixed inset-0 bg-slate-900/70 flex items-center justify-center p-6 z-[100] backdrop-blur-sm">
          <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in">
            <div className="bg-[#2563eb] p-10 text-white flex justify-between items-start">
              <div className="flex gap-5">
                <div className="bg-white p-4 rounded-2xl text-blue-600 shadow-xl"><FileText size={42} /></div>
                <div>
                  <h2 className="text-4xl font-black uppercase leading-none tracking-tight">{usuarioSelecionado.nome_responsavel}</h2>
                  <p className="opacity-70 mt-2 font-bold text-[10px] tracking-[0.2em] uppercase">PRONTUÁRIO DIGITAL SUAS Nº {usuarioSelecionado.id}</p>
                </div>
              </div>
              <button onClick={() => setUsuarioSelecionado(null)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all"><X size={28} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10">
              <div className="grid grid-cols-3 gap-6">
                <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">CPF do Responsável</p>
                  <p className="font-bold text-slate-700 text-lg">{usuarioSelecionado.cpf}</p>
                </div>
                <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Número do NIS</p>
                  <p className="font-bold text-slate-700 text-lg">{usuarioSelecionado.nis || 'Não Informado'}</p>
                </div>
                <div className="p-5 bg-green-50/50 rounded-2xl border border-green-100 text-green-600">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1">Status do Cadastro</p>
                  <p className="font-bold flex items-center gap-2 italic"><Save size={16}/> Ativo no Sistema</p>
                </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><MapPin size={20} className="text-blue-600"/> Localização Residencial</h3>
                 <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 text-slate-500 font-medium italic">
                    {usuarioSelecionado.endereco || "Bacabal Centro"}
                 </div>
              </div>

              {/* NOVA SEÇÃO DE ESCUTA ATIVA SOLICITADA */}
              <div className="space-y-6 bg-rose-50/40 p-8 rounded-[32px] border border-rose-100">
                <h3 className="text-lg font-bold text-rose-800 flex items-center gap-2"><Heart size={22} className="text-rose-600 fill-rose-600"/> Diário de Escuta Ativa</h3>
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-rose-100 italic text-slate-700 leading-relaxed min-h-[100px]">
                  {usuarioSelecionado.narrativa || "Nenhuma narrativa humanizada registrada para esta família ainda."}
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50/80 border-t flex justify-end gap-4">
               <button className="flex items-center gap-2 text-slate-600 font-bold px-8 py-4 rounded-2xl border-2 border-slate-200 hover:bg-slate-200 transition-all text-sm uppercase">
                  <Printer size={18} /> Gerar PDF
               </button>
               <button onClick={() => alert("Vinculado ao PAIF!")} className="flex items-center gap-2 bg-[#2563eb] text-white font-bold px-10 py-4 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all text-sm uppercase tracking-wider">
                  Vincular ao PAIF
               </button>
            </div>
          </div>
        </div>
      )}

      {/* FORMULÁRIO DE CADASTRO COM CAMPO DE ESCUTA */}
      {mostrarForm && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-[100] backdrop-blur-md">
          <div className="bg-white rounded-[40px] w-full max-w-2xl p-10 shadow-2xl animate-in zoom-in border border-white/20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Novo Prontuário Digital</h2>
              <button onClick={() => setMostrarForm(false)} className="text-slate-300 hover:text-slate-500 transition-colors"><X size={32} /></button>
            </div>
            <form onSubmit={salvarCadastro} className="space-y-5">
              <input placeholder="Nome do Responsável Familiar" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-slate-700" required onChange={e => setFormData({...formData, nome_responsavel: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="CPF (Apenas números)" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-slate-700" required onChange={e => setFormData({...formData, cpf: e.target.value})} />
                <input placeholder="NIS" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-slate-700" onChange={e => setFormData({...formData, nis: e.target.value})} />
              </div>
              <input placeholder="Endereço Completo" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-slate-700" onChange={e => setFormData({...formData, endereco: e.target.value})} />
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-rose-500 uppercase flex items-center gap-1 ml-1"><Heart size={14} fill="currentColor"/> Narrativa de Escuta Social (Coordenadoria)</label>
                <textarea 
                  placeholder="Relate a situação da família de forma humanizada..." 
                  className="w-full p-6 bg-rose-50/20 border border-rose-100 rounded-2xl outline-none focus:ring-2 focus:ring-rose-400 font-medium text-slate-700 min-h-[140px] shadow-inner" 
                  onChange={e => setFormData({...formData, narrativa: e.target.value})}
                />
              </div>

              <button disabled={loading} className="w-full bg-[#2563eb] text-white p-6 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 uppercase tracking-widest text-sm mt-4">
                {loading ? <Loader2 className="animate-spin" /> : <><Save size={20}/> Confirmar Registro Técnico</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}