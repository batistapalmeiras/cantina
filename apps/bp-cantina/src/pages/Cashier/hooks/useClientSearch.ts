// React
import { useEffect, useState } from 'react';
// Libs
import { supabase } from 'bp-core';

interface ClientResult {
  id: string;
  name: string;
  phone: string;
}

type LookupState =
  | { type: 'idle' }
  | { type: 'searching' }
  | { type: 'found'; client: ClientResult }
  | { type: 'not_found' };

export function useClientSearch(phone: string) {
  const [state, setState] = useState<LookupState>({ type: 'idle' });

  useEffect(() => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setState({ type: 'idle' });
      return;
    }

    setState({ type: 'searching' });

    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('clients')
        .select('id, name, phone')
        .eq('phone', phone)
        .maybeSingle();

      setState(data ? { type: 'found', client: data } : { type: 'not_found' });
    }, 300);

    return () => clearTimeout(timer);
  }, [phone]);

  const markNewClient = (name: string) => {
    setState({ type: 'found', client: { id: '__new__', name, phone } });
  };

  return { state, markNewClient };
}
