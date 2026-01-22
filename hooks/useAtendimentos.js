import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import Dexie from 'dexie';

// Banco de dados local (Browser)
const db = new Dexie('CrasOfflineDB');
db.version(1).stores({
  atendimentos: '++id, membro_id, descricao, status' 
});

export function useCriarAtendimento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (novoAtendimento) => {
      if (!navigator.onLine) {
        // Se estiver offline, salva no IndexedDB
        return await db.atendimentos.add({ ...novoAtendimento, status: 'pendente' });
      }
      // Se estiver online, manda para o Supabase
      const { data, error } = await supabase.from('prontuario_atendimentos').insert([novoAtendimento]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['atendimentos']);
    }
  });
}
