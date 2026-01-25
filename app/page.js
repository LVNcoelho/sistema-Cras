'use client';
import React, { useState } from 'react';
import { Search, Users, BookOpen, Lock, LogOut, Save, X, UserPlus, ClipboardList, Loader2, Calendar, AlertCircle, BarChart3 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SistemaCRAS() {
  const [autenticado, setAutenticado] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('busca');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [busca, setBusca] = useState('');
  const [usuariosEncontrados, setUsuariosEncontrados] = useState([]);
  const [formData, setFormData] = useState({ nome: '', cpf: '', nis: '', endereco: '' });

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
      setFormData({ nome: '', cpf: '', nis: '', endereco: '' });
      realizarBusca();
    }
    setLoading(false);
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-t-8 border-blue-700">
          <div className="text-center mb-8">
            <img src="/brasao.sjp.jfif" className="w-20 mx-auto mb-4 bg-white p-1 rounded-lg shadow-sm" />
            <h1 className="text-2xl font-bold text-blue-900 uppercase">Gestor SUAS SJP</h1>
          </div>
          <button onClick={() => setAutenticado(true)} className="w-full bg-blue-700 text-white p-4 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-200">Acessar Portal Técnico</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-blue-700 text-white p-6 shadow-lg border-b-4 border-yellow-500">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/brasao.sjp.jfif" className="w-16 h-16 bg-white rounded-lg p-1" />
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-tight">CRAS Digital</h1>
              <p className="text-sm opacity-90 font-medium">São João da Ponta - PA</p>
            </div>
          </div>
          <button onClick={() => setAutenticado(false)} className="text-xs font-bold uppercase border border-blue-400 px-4 py-2 rounded-lg hover:bg-blue-900 transition-all flex items-center gap-2"><LogOut size={16} /> Sair</button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full p-6 gap-6">
        <aside className="w-full md:w-64 space-y-2">
          <button onClick={() => setAbaAtiva('busca')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${abaAtiva === 'busca' ? 'bg-blue-700 text-white shadow-lg' : 'bg-white border text-slate-600 hover:bg-blue-50'}`}><Search size={20} /> Consulta de Usuários</button>
          <button onClick={() => setAbaAtiva('paif')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${abaAtiva === 'paif' ? 'bg-blue-700 text-white shadow-lg' : 'bg-white border text-slate-600 hover:bg-blue-50'}`}><BookOpen size={20} /> Gestão do PAIF</button>
          <button onClick={() => setAbaAtiva('scfv')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${abaAtiva === 'scfv' ? 'bg-blue-700 text-white shadow-lg' : 'bg-white border text-slate-600 hover:bg-blue-50'}`}><Users size={20} /> Oficinas SCFV</button>
        </aside>

        <main className="flex-1 bg-white rounded-3xl shadow-sm border p-8 min-h-[550px]">
          {abaAtiva === 'busca' && (
            <div className="animate-in fade-in">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><ClipboardList className="text-blue-700" /> Prontuários</h2>
                <button onClick={() => setMostrarForm(true)} className="bg-green-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-green-700 flex items-center gap-2 animate-pulse"><UserPlus size={20} /> Novo Registro</button>
              </div>
              <div className="flex gap-4 mb-10 bg-slate-50 p-2 rounded-2xl border">
                <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Localizar Usuário..." className="flex-1 p-4 bg-transparent outline-none font-medium text-slate-700" />
                <button onClick={realizarBusca} className="bg-blue-700 text-white px-8 rounded-xl font-bold hover:bg-blue-800 transition-all">{buscando ? <Loader2 className="animate-spin" /> : "Filtrar"}</button>
              </div>
              <div className="space-y-4">
                {usuariosEncontrados.map((u) => (
                  <div key={u.id} className="p-6 border rounded-2xl flex justify-between items-center bg-white hover:border-blue-400 transition-all shadow-sm">
                    <div>
                      <h3 className="font-bold text-slate-800 uppercase">{u.nome_responsavel}</h3>
                      <p className="text-sm text-slate-500 font-medium">CPF: {u.cpf} | NIS: {u.nis || '---'}</p>
                    </div>
                    <button className="text-blue-700 font-bold text-sm border-2 border-blue-700 px-4 py-2 rounded-xl hover:bg-blue-700 hover:text-white transition-all">Ver Ficha Técnica</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {abaAtiva === 'paif' && (
            <div className="animate-in fade-in space-y-8">
              <h2 className="text-2xl font-bold text-slate-800 border-b pb-4">Indicadores de Acompanhamento (PAIF)</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-50 rounded-3xl border-b-4 border-blue-700 shadow-sm">
                  <BarChart3 className="text-blue-700 mb-2" size={24} />
                  <p className="text-xs font-bold text-blue-800 uppercase">Famílias Ativas</p>
                  <p className="text-4xl font-black text-blue-900 mt-1">128</p>
                </div>
                <div className="p-6 bg-orange-50 rounded-3xl border-b-4 border-orange-500 shadow-sm">
                  <Calendar className="text-orange-600 mb-2" size={24} />
                  <p className="text-xs font-bold text-orange-800 uppercase">Visitas para Hoje</p>
                  <p className="text-4xl font-black text-orange-700 mt-1">04</p>
                </div>
                <div className="p-6 bg-red-50 rounded-3xl border-b-4 border-red-600 shadow-sm">
                  <AlertCircle className="text-red-600 mb-2" size={24} />
                  <p className="text-xs font-bold text-red-800 uppercase">Vulnerabilidade Alta</p>
                  <p className="text-4xl font-black text-red-700 mt-1">12</p>
                </div>
              </div>
              <div className="mt-8 bg-slate-50 p-6 rounded-3xl border border-slate-200">
                <h4 className="font-bold text-slate-700 mb-4 uppercase text-xs tracking-widest">Agenda Técnica Semanal</h4>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-xl border flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-600">Terça-feira • 09:00</span>
                    <span className="text-sm text-slate-500 italic font-medium tracking-tight">Visita Domiciliar - Bairro Magalhães</span>
                    <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase">Agendado</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {abaAtiva === 'scfv' && (
            <div className="animate-in fade-in space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-2xl font-bold text-slate-800">Oficinas e Grupos SCFV</h2>
                <button className="bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase">+ Novo Grupo</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 border rounded-3xl bg-white shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-green-100 p-3 rounded-2xl text-green-700"><Users size={24}/></div>
                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase italic">Ativo</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">Grupo Reviver (Idosos)</h3>
                  <p className="text-xs text-slate-500 font-medium mb-4 italic">Encontros: Quartas-feiras • 08:30h</p>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 w-[80%] h-full"></div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest text-right">24 / 30 Vagas preenchidas</p>
                </div>

                <div className="p-5 border rounded-3xl bg-white shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-100 p-3 rounded-2xl text-blue-700"><Users size={24}/></div>
                    <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase italic">Inscrições Abertas</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">Juventude SJP (15 a 17 anos)</h3>
                  <p className="text-xs text-slate-500 font-medium mb-4 italic">Encontros: Sextas-feiras • 14:00h</p>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 w-[40%] h-full"></div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest text-right">08 / 20 Vagas preenchidas</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL DE CADASTRO TÉCNICO */}
      {mostrarForm && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-700"><UserPlus size={24}/></div>
                <h2 className="text-xl font-bold text-slate-800">Abertura de Prontuário</h2>
              </div>
              <button onClick={() => setMostrarForm(false)} className="bg-slate-50 p-2 rounded-full text-slate-400 hover:text-red-500 transition-colors"><X /></button>
            </div>
            <form onSubmit={salvarCadastro} className="space-y-5">
              <input placeholder="Nome Completo do Responsável" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-700 transition-all font-medium" required onChange={e => setFormData({...formData, nome_responsavel: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="CPF (Apenas números)" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-700 transition-all font-medium" required onChange={e => setFormData({...formData, cpf: e.target.value})} />
                <input placeholder="NIS" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-700 transition-all font-medium" onChange={e => setFormData({...formData, nis: e.target.value})} />
              </div>
              <textarea placeholder="Endereço da Residência" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-700 transition-all font-medium" rows="3" onChange={e => setFormData({...formData, endereco: e.target.value})}></textarea>
              <button disabled={loading} className="w-full bg-blue-700 text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-800 shadow-xl shadow-blue-200 transition-all active:scale-95">
                {loading ? "Processando..." : <><Save size={22} /> Confirmar Cadastro Governamental</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}