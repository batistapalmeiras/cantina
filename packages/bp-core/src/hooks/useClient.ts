// React
import { useEffect,useState } from 'react';
// Components
import type { Database } from '../lib/database.types';
import { supabase } from '../lib/supabase';
import { Client } from '../types';

type ClientRow = Database['public']['Tables']['clients']['Row'];

function mapClient(raw: ClientRow): Client {
  return { id: raw.id, name: raw.name, phone: raw.phone };
}

const CLIENT_STORAGE_KEY = 'cantina_client_session';

export function useClient() {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(CLIENT_STORAGE_KEY);
    if (stored) {
      try {
        setClient(JSON.parse(stored));
      } catch {
        localStorage.removeItem(CLIENT_STORAGE_KEY);
      }
    }
    setLoading(false);

    // Clientes convidados (bp-reserva) não têm sessão de auth no Supabase —
    // só renova/limpa quando uma sessão de auth realmente existe.
    const refreshAuthSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;

      const { error } = await supabase.auth.refreshSession();
      if (error) {
        console.warn('Falha ao renovar sessão, limpando dados do cliente');
        localStorage.removeItem(CLIENT_STORAGE_KEY);
        setClient(null);
      }
    };

    const refreshInterval = setInterval(refreshAuthSession, 50 * 60 * 1000);

    const handleVisibilityChange = () => {
      if (!document.hidden) refreshAuthSession();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(refreshInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const findClientByPhone = async (phone: string): Promise<Client | null> => {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('phone', phone)
      .single();

    return data ? mapClient(data) : null;
  };

  const loginWithClient = (clientData: Client) => {
    localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(clientData));
    setClient(clientData);
  };

  const loginClient = async (name: string, phone: string): Promise<Client> => {
    const { data: existing } = await supabase
      .from('clients')
      .select('*')
      .eq('phone', phone)
      .single();

    let clientData: Client;

    if (existing) {
      // Atualiza nome se mudou
      if (existing.name !== name) {
        await supabase
          .from('clients')
          .update({ name, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
      }
      clientData = { id: existing.id, name, phone };
    } else {
      // Cria novo cliente
      const { data: newClient, error } = await supabase
        .from('clients')
        .insert({ name, phone })
        .select()
        .single();

      if (error) throw error;
      clientData = mapClient(newClient);
    }

    localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(clientData));
    setClient(clientData);
    return clientData;
  };

  const logoutClient = () => {
    localStorage.removeItem(CLIENT_STORAGE_KEY);
    setClient(null);
  };

  const updateClientName = async (name: string): Promise<void> => {
    if (!client) return;

    await supabase
      .from('clients')
      .update({ name, updated_at: new Date().toISOString() })
      .eq('id', client.id);

    const updated = { ...client, name };
    localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(updated));
    setClient(updated);
  };

  const updateClient = async (name: string, phone: string): Promise<void> => {
    if (!client) return;
    await supabase
      .from('clients')
      .update({ name, phone, updated_at: new Date().toISOString() })
      .eq('id', client.id);
    const updated = { ...client, name, phone };
    localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(updated));
    setClient(updated);
  };

  return {
    client,
    loading,
    findClientByPhone,
    loginWithClient,
    loginClient,
    logoutClient,
    updateClientName,
    updateClient,
  };
}
