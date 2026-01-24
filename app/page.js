'use client';
import React, { useState, useEffect } from 'react';
import { PlusCircle, FileText, Save, X, Users, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mostrarAtendimento, setMostrarAtendimento] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ nome: '', cpf: '', nis: '', endereco: '' });
  const [atendimentoData, setAtendimentoData] = useState({ descricao: '', tecnico: '' });

  async function salvarCadastro(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('familias').insert([
      { nome_responsavel: formData.nome, cpf: formData.cpf, nis: formData.nis, endereco: formData.endereco }
    ]);
    if (error) alert("Erro: " + error.message);
    else {
      alert("Família cadastrada!");
      setMostrarForm(false);
    }
    setLoading(false);
  }

  async function salvarAtendimento(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('atendimentos').insert([
      { descricao: atendimentoData.descricao, tecnico_responsavel: atendimentoData.tecnico }
    ]);
    if (error) alert("Erro: " + error.message);
    else {
      alert("Atendimento registrado!");
      setMostrarAtendimento(false);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-blue-800 text-white p-6 shadow-lg border-b-4 border-yellow-500">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <img src="/brasao.sjp.jfif" className="w-16 h-16 bg-white rounded-lg p-1" />
          <div>
            <h1 className="text-2xl font-bold uppercase">CRAS Digital</h1>
            <p className="text-sm opacity-90">São João da Ponta - Pará</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* BOTÃO CADASTRO */}
          <button onClick={() => setMostrarForm(true)} className="flex items-center gap-4 bg-white p-8 rounded-2xl shadow-sm border-b-4 border-blue-600 hover:bg-blue-50 transition-all text-left">
            <PlusCircle className="text-blue-600" size={32} />
            <div>
              <h3 className="font-bold text-lg">Novo Cadastro</h3>
              <p className="text-xs text-gray-400">Registrar família no sistema</p>
            </div>
          </button>

          {/* BOTÃO ATENDIMENTO - AGORA ATIVADO */}
          <button onClick={() => setMostrarAtendimento(true)} className="flex items-center gap-4 bg-white p-8 rounded-2xl shadow-sm border-b-4 border-green-600 hover:bg-green-50 transition-all text-left">
            <FileText className="text-green-600" size={32} />
            <div>
              <h3 className="font-bold text-lg text-green-700">Novo Atendimento</h3>
              <p className="text-xs text-gray-400">Registrar evolução ou visita</p>
            </div>
          </button>
        </div>

        {/* MODAL ATENDIMENTO */}
        {mostrarAtendimento && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-green-800 flex items-center gap-2">
                    <MessageSquare size={24} /> Novo Atendimento
                </h2>
                <button onClick={() => setMostrarAtendimento(false)}><X /></button>
              </div>
              <form onSubmit={salvarAtendimento} className="space-y-4">
                <input placeholder="Nome do Técnico" className="w-full p-3 border rounded-lg" required onChange={e => setAtendimentoData({...atendimentoData, tecnico: e.target.value})} />
                <textarea placeholder="Descrição do Atendimento (O que foi feito?)" className="w-full p-3 border rounded-lg" rows="4" required onChange={e => setAtendimentoData({...atendimentoData, descricao: e.target.value})} />
                <button disabled={loading} className="w-full bg-green-700 text-white p-4 rounded-xl font-bold hover:bg-green-800 transition-all shadow-lg shadow-green-200">
                  {loading ? "Salvando..." : "Registrar Atendimento"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL CADASTRO (O QUE JÁ FUNCIONAVA) */}
        {mostrarForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2"><Users size={24} /> Cadastrar Família</h2>
                <button onClick={() => setMostrarForm(false)}><X /></button>
              </div>
              <form onSubmit={salvarCadastro} className="space-y-4">
                <input placeholder="Nome do Responsável" className="w-full p-3 border rounded-lg" required onChange={e => setFormData({...formData, nome: e.target.value})} />
                <input placeholder="CPF" className="w-full p-3 border rounded-lg" required onChange={e => setFormData({...formData, cpf: e.target.value})} />
                <button disabled={loading} className="w-full bg-blue-700 text-white p-4 rounded-xl font-bold hover:bg-blue-800">
                  {loading ? "Processando..." : "Finalizar Cadastro"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}