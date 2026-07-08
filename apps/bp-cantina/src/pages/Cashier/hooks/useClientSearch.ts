// React
import { useEffect, useState } from 'react';
// Libs
import { supabase } from 'bp-core';

/** Sentinel client id meaning "register a new client on sale confirmation". */
export const NEW_CLIENT_ID = '__new__';

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
    // Só busca com o telefone 100% preenchido: (31) 99669-6719 = 11 dígitos.
    if (digits.length !== 11) {
      setState({ type: 'idle' });
      return;
    }

    setState({ type: 'searching' });

    let ignore = false;
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('clients')
        .select('id, name, phone')
        .eq('phone', phone)
        .maybeSingle();

      // Guard against an out-of-order response overwriting a newer search.
      if (ignore) return;
      setState(data ? { type: 'found', client: data } : { type: 'not_found' });
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [phone]);

  const markNewClient = (name: string) => {
    setState({ type: 'found', client: { id: NEW_CLIENT_ID, name, phone } });
  };

  return { state, markNewClient };
}
