import { useState, useCallback, useRef } from 'react';
import { supabase } from '../../../lib/supabase';

interface ClientResult {
  id: string;
  name: string;
  phone: string;
}

type SearchState =
  | { type: 'idle' }
  | { type: 'searching' }
  | { type: 'results'; items: ClientResult[] }
  | { type: 'registering' }
  | { type: 'phone_conflict'; existing: ClientResult }
  | { type: 'selected'; client: ClientResult };

export interface SelectedClient {
  id: string;
  name: string;
  phone: string;
}

export function useClientSearch(onSelect: (client: SelectedClient) => void) {
  const [query, setQuery] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState<SearchState>({ type: 'idle' });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((value: string) => {
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setState({ type: 'idle' });
      return;
    }

    setState({ type: 'searching' });

    debounceRef.current = setTimeout(async () => {
      const { data } = await supabase
        .from('clients')
        .select('id, name, phone')
        .or(`name.ilike.%${value}%,phone.ilike.%${value}%`)
        .limit(6);

      const items = data ?? [];
      if (items.length > 0) {
        setState({ type: 'results', items });
      } else {
        setState({ type: 'registering' });
      }
    }, 300);
  }, []);

  const selectClient = useCallback((client: ClientResult) => {
    setQuery(client.name);
    setState({ type: 'selected', client });
    onSelect(client);
  }, [onSelect]);

  const checkPhone = useCallback(async (value: string) => {
    setPhone(value);

    if (value.replace(/\D/g, '').length < 10) return;

    const { data } = await supabase
      .from('clients')
      .select('id, name, phone')
      .eq('phone', value)
      .maybeSingle();

    if (data) {
      setState({ type: 'phone_conflict', existing: data });
      return;
    }

    // Telefone válido e sem conflito → auto-seleciona como novo cliente
    const newClient = { id: '__new__', name: query.trim(), phone: value };
    setState({ type: 'selected', client: newClient });
    onSelect(newClient);
  }, [query, onSelect]);

  const clear = useCallback(() => {
    setQuery('');
    setPhone('');
    setState({ type: 'idle' });
  }, []);

  return { query, phone, state, search, selectClient, checkPhone, clear };
}
