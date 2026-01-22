export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Sistema de Gestão CRAS</h1>
        <div className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full ${navigator.onLine ? 'bg-green-500' : 'bg-amber-500'}`}></span>
          <span className="text-sm font-medium text-slate-600">
            {navigator.onLine ? 'Online' : 'Modo Offline Ativo'}
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <label className="block text-sm font-medium text-slate-700 mb-2">Busca de Famílias</label>
          <input 
            type="text" 
            placeholder="Digite nome ou CPF para buscar..." 
            className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        
        {/* Lista de Resultados e Cards aqui */}
      </div>
    </div>
  );
}
