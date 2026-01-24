'use client';
import React, { useState } from 'react';
import { PlusCircle, FileText, Save, X, Users, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [formData, setFormData] = useState({ nome: '', cpf: '', nis: '', endereco: '' });

  // Função para salvar no banco de dados que você criou
  async function salvarCadastro(e) {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase
      .from('familias')
      .insert([{ 
        nome_responsavel: formData.nome, 
        cpf: formData.cpf, 
        nis: formData.nis, 
        endereco: formData.endereco 
      }]);

    if (error) {
      alert("Erro ao salvar: " + error.message);
    } else {
      alert("Família cadastrada com sucesso!");
      setMostrarForm(false);
      setFormData({ nome: '', cpf: '', nis: '', endereco: '' });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      {/* CABEÇALHO */}
      <header className="bg-blue-800 text-white p-6 shadow-md border-b-4 border-yellow-500">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="bg-white p-1 rounded-lg shadow-lg">
            <img src="/brasao.sjp.jfif" alt="Brasão" className="w-16 h-16 object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tighter">CRAS Digital</h1>
            <p className="text-sm opacity-90 font-medium italic">São João da Ponta - Pará</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold">Olá, Assistente Social</h2>
          <p className="text-gray-500 text-sm">O que deseja fazer hoje?</p>
        </div>

        {/* BUSCA */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Buscar família por Nome ou CPF..."
            className="w-full p-4 pl-12 rounded-xl border-none shadow-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <Search className="absolute left-4 top-4 text-gray-400" />
        </div>

        {/* BOTÕES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button 
            onClick={() => setMostrarForm(true)}
            className="flex items-center justify-center gap-4 bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border-b-4 border-blue-600 group"
          >
            <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-600 transition-colors">
              <PlusCircle className="text-blue-600 group-hover:text-white" size={32} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg text-blue-900">Novo Cadastro</h3>
              <p className="text-xs text-gray-400">Registrar família ou membro</p>
            </div>
          </button>

          <button className="flex items-center justify-center gap-4 bg-white p-8 rounded-2xl shadow-sm border-b-4 border-green-600 opacity-50 cursor-not-allowed">
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="text-green-600" size={32} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg text-green-900">Novo Atendimento</h3>
              <p className="text-xs text-gray-400">Em breve no sistema</p>
            </div>
          </button>
        </div>

        {/* FORMULÁRIO DE CADASTRO (MODAL) */}
        {mostrarForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                    <Users className="text-blue-600" /> Cadastrar Família
                </h2>
                <button onClick={() => setMostrarForm(false)} className="text-gray-400 hover:text-red-500"><X /></button>
              </div>
              
              <form onSubmit={salvarCadastro} className="space-y-4">
                <input 
                  placeholder="Nome do Responsável" 
                  className="w-full p-3 border rounded-lg"
                  required
                  onChange={e => setFormData({...formData, nome: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    placeholder="CPF" 
                    className="w-full p-3 border rounded-lg"
                    required
                    onChange={e => setFormData({...formData, cpf: e.target.value})}
                  />
                  <input 
                    placeholder="NIS" 
                    className="w-full p-3 border rounded-lg"
                    onChange={e => setFormData({...formData, nis: e.target.value})}
                  />
                </div>
                <textarea 
                  placeholder="Endereço Completo" 
                  className="w-full p-3 border rounded-lg"
                  onChange={e => setFormData({...formData, endereco: e.target.value})}
                ></textarea>
                <button 
                  disabled={loading}
                  className="w-full bg-blue-700 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800"
                >
                  {loading ? "Salvando..." : <><Save size={20} /> Finalizar Cadastro</>}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}