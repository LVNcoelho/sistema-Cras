'use client';
import React, { useState } from 'react';
import { Search, Users, BookOpen, LogOut, X, UserPlus, ClipboardList, Loader2, Save, UserCheck, FileText, MapPin, Calendar, Printer, Database, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SistemaCRAS() {
  const [autenticado, setAutenticado] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('busca');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null); // Para abrir a ficha do João
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
          
          {/* ADIÇÕES PARA O EDITAL */}
          <button onClick={() => setAbaAtiva('creas')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all font-bold ${abaAtiva === 'creas' ? 'bg-red-700 text-white shadow-lg' : 'bg-white border text-slate-600 hover:bg-red-50'}`}><Users size={20} /> Unidade CREAS</button>
          <button onClick={() => setAbaAtiva('scfv')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all font-bold ${abaAtiva === 'scfv' ? 'bg-orange-600 text-white shadow-lg' : 'bg-white border text-slate-600 hover:bg-orange-50'}`}><Users size={20} /> SCFV / Oficinas</button>
          <button onClick={() => setAbaAtiva('semas')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all font-bold ${abaAtiva === 'semas' ? 'bg-teal-700 text-white shadow-lg' : 'bg-white border text-slate-600 hover:bg-teal-50'}`}><Globe size={20} /> SEMAS / Integração</button>
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

          {/* NOVAS ABAS PARA O EDITAL */}
          {abaAtiva === 'creas' && (
            <div className="animate-in fade-in space-y-6">
              <h2 className="text-2xl font-bold text-red-800">Painel CREAS / PAEFI</h2>
              <div className="p-6 bg-red-50 rounded-2xl border border-red-200">
                <p className="text-xs font-bold text-red-700 uppercase mb-4 tracking-widest">Violação de Direitos em Acompanhamento</p>
                <div className="bg-white p-4 rounded-xl border flex justify-between">
                   <span className="font-bold">Casos Médio Risco</span>
                   <span className="text-red-700 font-black">12</span>
                </div>
              </div>
            </div>
          )}

          {abaAtiva === 'scfv' && (
            <div className="animate-in fade-in space-y-6">
              <h2 className="text-2xl font-bold text-orange-800">SCFV - Grupos e Oficinas</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-orange-50 rounded-2xl border border-orange-200">
                  <p className="text-xs font-bold text-orange-700 uppercase">Grupo Idosos</p>
                  <p className="text-3xl font-black">24 Integrantes</p>
                </div>
                <div className="p-6 bg-orange-50 rounded-2xl border border-orange-200">
                  <p className="text-xs font-bold text-orange-700 uppercase">Crianças (0-6)</p>
                  <p className="text-3xl font-black">18 Integrantes</p>
                </div>
              </div>
            </div>
          )}

          {abaAtiva === 'semas' && (
            <div className="animate-in fade-in space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-2xl font-bold text-teal-800 uppercase">Gestão SEMAS</h2>
                <button 
                  onClick={() => alert("Sincronizando prontuários com o RMA/Governo Federal...")}
                  className="bg-teal-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-teal-800"
                >
                  <Database size={18} /> Integrar SUAS
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border rounded-xl text-center">
                   <p className="text-[10px] font-bold text-slate-400">STATUS API</p>
                   <p className="text-green-600 font-bold">ONLINE</p>
                </div>
                <div className="p-4 bg-slate-50 border rounded-xl text-center">
                   <p className="text-[10px] font-bold text-slate-400">LGPD</p>
                   <p className="text-slate-700 font-bold uppercase">Ativa</p>
                </div>
                <div className="p-4 bg-slate-50 border rounded-xl text-center">
                   <p className="text-[10px] font-bold text-slate-400">GEORREFEREN.</p>
                   <p className="text-blue-700 font-bold uppercase">Mapeado</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL DA FICHA DO JOÃO COELHO (PRONTUÁRIO TÉCNICO) */}
      {usuarioSelecionado && (
        <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center p-6 z-[100] backdrop-blur-sm">
          <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in duration-300">
            {/* Header da Ficha */}
            <div className="bg-blue-700 p-8 text-white flex justify-between items-start">
              <div className="flex gap-4">
                <div className="bg-white p-3 rounded-2xl text-blue-700">
                  <FileText size={40} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold uppercase leading-none">{usuarioSelecionado.nome_responsavel}</h2>
                  <p className="opacity-80 mt-1 font-medium tracking-widest">PRONTUÁRIO DIGITAL SUAS Nº {usuarioSelecionado.id.toString().padStart(5, '0')}</p>
                </div>
              </div>
              <button onClick={() => setUsuarioSelecionado(null)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all"><X size={24} /></button>
            </div>

            {/* Conteúdo da Ficha */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8">
              <div className="grid grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 rounded-2xl border">
                  <p className="text-[10px] font-black text-slate-400 uppercase">CPF do Responsável</p>
                  <p className="font-bold text-slate-700">{usuarioSelecionado.cpf}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Número do NIS</p>
                  <p className="font-bold text-slate-700">{usuarioSelecionado.nis || 'Não Informado'}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border text-green-600 border-green-100">
                  <p className="text-[10px] font-black uppercase">Status do Cadastro</p>
                  <p className="font-bold flex items-center gap-1"><Save size={14} /> Ativo no Sistema</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-2"><MapPin size={18} className="text-blue-700"/> Localização Residencial</h3>
                <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border border-dashed font-medium italic">
                  {usuarioSelecionado.endereco || "Endereço cadastrado no setor central de São João da Ponta - PA."}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b pb-2"><Calendar size={18} className="text-blue-700"/> Evolução e Atendimentos Técnicos</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="text-xs font-bold text-green-700 bg-white px-2 py-1 rounded-md border border-green-200">HOJE</div>
                    <p className="text-sm font-medium text-green-800">Abertura de Prontuário Eletrônico realizada via Gestão Digital.</p>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border text-slate-400 italic">
                    <div className="text-xs font-bold px-2 py-1">--/--</div>
                    <p className="text-sm font-medium">Nenhum histórico de visita domiciliar registrado para este exercício.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rodapé da Ficha */}
            <div className="p-8 bg-slate-50 border-t flex justify-end gap-4">
               <button className="flex items-center gap-2 text-slate-600 font-bold px-6 py-3 rounded-xl border-2 border-slate-200 hover:bg-slate-200 transition-all">
                  <Printer size={18} /> Gerar PDF
               </button>
               <button onClick={() => alert("João Coelho vinculado ao PAIF com sucesso!")} className="flex items-center gap-2 bg-blue-700 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-800 shadow-lg transition-all">
                  Vincular ao PAIF
               </button>
            </div>
          </div>
        </div>
      )}

      {/* FORMULÁRIO DE CADASTRO (EXISTENTE) */}
      {mostrarForm && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in zoom-in">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-slate-800 uppercase">Novo Prontuário</h2>
              <button onClick={() => setMostrarForm(false)} className="text-slate-400"><X size={24} /></button>
            </div>
            <form onSubmit={salvarCadastro} className="space-y-4">
              <input placeholder="Nome do Responsável" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-700 font-medium" required onChange={e => setFormData({...formData, nome_responsavel: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="CPF" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-700 font-medium" required onChange={e => setFormData({...formData, cpf: e.target.value})} />
                <input placeholder="NIS" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-700 font-medium" onChange={e => setFormData({...formData, nis: e.target.value})} />
              </div>
              <textarea placeholder="Endereço" className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-700 font-medium" rows="2" onChange={e => setFormData({...formData, endereco: e.target.value})}></textarea>
              <button disabled={loading} className="w-full bg-blue-700 text-white p-4 rounded-xl font-bold hover:bg-blue-800 transition-all">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Confirmar Registro Técnico"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}