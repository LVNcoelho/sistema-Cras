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
  
  // Adicionado 'narrativa' ao estado inicial
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
            <input type="text" placeholder="Usuário" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-700" required />
            <input type="password" placeholder="Senha" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-700" required />
            <button type="submit" className="w-full bg-blue-700 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg">
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

      <header className="bg-blue-700 text-white p-6 shadow-lg border-b-4 border-yellow-500">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/brasao.sjp.jfif" className="w-16 h-16 bg-white rounded-lg p-1" />
            <h1 className="text-2xl font-bold uppercase italic">CRAS Digital</h1>
          </div>
          <button onClick={() => setAutenticado(false)} className="flex items-center gap-2 text-xs font-bold uppercase border-2 border-blue-400 px-4 py-2 rounded-xl hover:bg-blue-800 transition-all"><LogOut size={16} /> Sair</button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full p-6 gap-6">
        <aside className="w-full md:w-64 space-y-2">
          <button onClick={() => setAbaAtiva('busca')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all font-bold ${abaAtiva === 'busca' ? 'bg-blue-700 text-white shadow-lg' : 'bg-white border text-slate-600 hover:bg-blue-50'}`}><Search size={20} /> Consulta de Usuários</button>
          <button onClick={() => setAbaAtiva('paif')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all font-bold ${abaAtiva === 'paif' ? 'bg-blue-700 text-white shadow-lg' : 'bg-white border text-slate-600 hover:bg-blue-50'}`}><BookOpen size={20} /> Gestão do PAIF</button>
        </aside>

        <main className="flex-1 bg-white rounded-3xl shadow-sm border p-8">
          {abaAtiva === 'busca' && (
            <div className="animate-in fade-in">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><ClipboardList className="text-blue-700" /> Prontuário Eletrônico</h2>
                <button onClick={() => setMostrarForm(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-green-700 flex items-center gap-2 transition-all"><UserPlus size={18} /> Novo Registro</button>
              </div>
              <div className="flex gap-4 mb-10 bg-slate-50 p-2 rounded-2xl border">
                <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Pesquisar nome..." className="flex-1 p-4 bg-transparent outline-none font-medium" />
                <button onClick={realizarBusca} className="bg-blue-700 text-white px-8 rounded-xl font-bold hover:bg-blue-800 transition-all">{buscando ? <Loader2 className="animate-spin" /> : "Filtrar"}</button>
              </div>
              <div className="space-y-4">
                {usuariosEncontrados.map((u) => (
                  <div key={u.id} className="p-6 border rounded-2xl flex justify-between items-center bg-white hover:border-blue-400 transition-all shadow-sm">
                    <div>
                      <h3 className="font-bold text-slate-800 uppercase">{u.nome_responsavel}</h3>
                      <p className="text-sm text-slate-500">CPF: {u.cpf} | NIS: {u.nis || '---'}</p>
                    </div>
                    <button 
                      onClick={() => setUsuarioSelecionado(u)}
                      className="text-blue-700 font-bold text-sm border-2 border-blue-700 px-4 py-2 rounded-lg hover:bg-blue-700 hover:text-white transition-all"
                    >
                      Ver Ficha Técnica
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {abaAtiva === 'paif' && (
            <div className="animate-in fade-in space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">Painel PAIF</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-blue-50 rounded-2xl border-b-4 border-blue-700">
                  <p className="text-xs font-bold text-blue-800 uppercase">Acompanhamentos Ativos</p>
                  <p className="text-4xl font-black text-blue-900">84</p>
                </div>
                <div className="p-6 bg-orange-50 rounded-2xl border-b-4 border-orange-500">
                  <p className="text-xs font-bold text-orange-800 uppercase">Visitas Pendentes</p>
                  <p className="text-4xl font-black text-orange-900">07</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL DA FICHA TÉCNICA HUMANIZADA */}
      {usuarioSelecionado && (
        <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center p-6 z-[100] backdrop-blur-sm">
          <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in duration-300">
            <div className="bg-blue-700 p-8 text-white flex justify-between items-start">
              <div className="flex gap-4">
                <div className="bg-white p-3 rounded-2xl text-blue-700 shadow-lg">
                  <FileText size={40} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold uppercase leading-none">{usuarioSelecionado.nome_responsavel}</h2>
                  <p className="opacity-80 mt-1 font-medium tracking-widest uppercase text-[10px]">Prontuário Digital CRAS #{usuarioSelecionado.id}</p>
                </div>
              </div>
              <button onClick={() => setUsuarioSelecionado(null)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-8">
              <div className="grid grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 rounded-2xl border">
                  <p className="text-[10px] font-black text-slate-400 uppercase">CPF</p>
                  <p className="font-bold text-slate-700">{usuarioSelecionado.cpf}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border">
                  <p className="text-[10px] font-black text-slate-400 uppercase">NIS</p>
                  <p className="font-bold text-slate-700">{usuarioSelecionado.nis || '---'}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-2xl border border-green-100 text-green-700">
                  <p className="text-[10px] font-black uppercase tracking-tighter">Status Social</p>
                  <p className="font-bold flex items-center gap-1 text-xs">IDENTIFICADO NO TERRITÓRIO</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-2"><MapPin size={18} className="text-blue-700"/> Endereço de Referência</h3>
                <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border border-dashed font-medium">
                  {usuarioSelecionado.endereco || "Não informado."}
                </p>
              </div>

              {/* SEÇÃO DA ESCUTA QUALIFICADA */}
              <div className="space-y-6 bg-rose-50/50 p-6 rounded-[32px] border border-rose-100">
                <h3 className="text-lg font-bold text-rose-800 flex items-center gap-2">
                  <Heart size={20} className="text-rose-600 fill-rose-600"/> Diário de Escuta Ativa
                </h3>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100 min-h-[120px]">
                  <p className="text-[10px] font-black text-rose-400 uppercase mb-3 tracking-widest">Narrativa da Situação Familiar</p>
                  <p className="text-sm text-slate-700 leading-relaxed italic">
                    {usuarioSelecionado.narrativa || "Nenhuma narrativa humanizada registada para este prontuário ainda."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/60 p-4 rounded-xl border flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Família com Vínculo Preservado</span>
                   </div>
                   <div className="bg-white/60 p-4 rounded-xl border flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Potencial de Autonomia</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t flex justify-end gap-4">
               <button className="flex items-center gap-2 text-slate-600 font-bold px-6 py-3 rounded-xl border-2 border-slate-200 hover:bg-slate-200 transition-all"><Printer size={18} /> PDF</button>
               <button onClick={() => alert("Acompanhamento iniciado!")} className="flex items-center gap-2 bg-blue-700 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-800 shadow-lg">Vincular ao PAIF</button>
            </div>
          </div>
        </div>
      )}

      {/* FORMULÁRIO COM O NOVO CAMPO DE ESCUTA HUMANA */}
      {mostrarForm && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <div className="bg-white rounded-[40px] w-full max-w-2xl p-10 shadow-2xl animate-in zoom-in">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tighter">Abertura de Prontuário</h2>
                <p className="text-xs text-slate-400 font-medium">Preencha os dados técnicos e a narrativa social.</p>
              </div>
              <button onClick={() => setMostrarForm(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-all"><X size={24} /></button>
            </div>
            
            <form onSubmit={salvarCadastro} className="space-y-4">
              <input placeholder="Nome Completo do Responsável" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-700 font-medium text-slate-700" required onChange={e => setFormData({...formData, nome_responsavel: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="CPF" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-700 font-medium text-slate-700" required onChange={e => setFormData({...formData, cpf: e.target.value})} />
                <input placeholder="NIS (Se houver)" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-700 font-medium text-slate-700" onChange={e => setFormData({...formData, nis: e.target.value})} />
              </div>

              <input placeholder="Endereço / Referência de Localização" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-700 font-medium text-slate-700" onChange={e => setFormData({...formData, endereco: e.target.value})} />
              
              {/* O NOVO CAMPO DA COORDENADORA */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-black text-rose-500 uppercase ml-1 flex items-center gap-1">
                  <Heart size={12} fill="currentColor"/> Escuta Ativa / Narrativa Social (Opcional)
                </label>
                <textarea 
                  placeholder="Descreva aqui a situação da família de forma humanizada (História, sentimentos, potencialidades...)" 
                  className="w-full p-5 bg-rose-50/30 border border-rose-100 rounded-2xl outline-none focus:ring-2 focus:ring-rose-400 font-medium text-slate-700 min-h-[120px] placeholder:text-rose-300" 
                  onChange={e => setFormData({...formData, narrativa: e.target.value})}
                />
              </div>

              <button disabled={loading} className="w-full bg-blue-700 text-white p-5 rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-lg flex items-center justify-center gap-2 mt-4 uppercase tracking-widest">
                {loading ? <Loader2 className="animate-spin" /> : <><Save size={20}/> Finalizar Registo Técnico</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}