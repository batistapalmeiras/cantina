// React
import { useEffect, useMemo, useState } from 'react';
// Libs
import { supabase } from 'bp-core';

/** Sentinel client id meaning "register a new client on sale confirmation". */
export const NEW_CLIENT_ID = '__new__';

/** Só busca a partir daqui — poucos dígitos demais devolveria clientes demais para caber na lista. */
const MIN_SEARCH_DIGITS = 4;

interface ClientResult {
  id: string;
  name: string;
  phone: string;
}

type LookupState =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'results'; clients: ClientResult[] }
  | { type: 'selected'; client: ClientResult }
  | { type: 'not_found' };

const onlyDigits = (value: string) => value.replace(/\D/g, '');

/**
 * Busca incremental por telefone: a partir de MIN_SEARCH_DIGITS dígitos, filtra
 * a lista de clientes (carregada uma única vez) por prefixo, para o caixa tocar
 * no resultado em vez de digitar o telefone inteiro a cada venda.
 */
export function useClientSearch(phone: string) {
  const [allClients, setAllClients] = useState<ClientResult[] | null>(null);
  const [override, setOverride] = useState<ClientResult | null>(null);

  useEffect(() => {
    let ignore = false;
    supabase
      .from('clients')
      .select('id, name, phone')
      .limit(2000)
      .then(({ data }) => {
        if (!ignore) setAllClients(data ?? []);
      });
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (override && override.phone !== phone) setOverride(null);
  }, [phone, override]);

  const digits = onlyDigits(phone);

  const state: LookupState = useMemo(() => {
    if (override) return { type: 'selected', client: override };
    if (digits.length < MIN_SEARCH_DIGITS) return { type: 'idle' };
    if (allClients === null) return { type: 'loading' };

    const matches = allClients.filter((c) => onlyDigits(c.phone).startsWith(digits));
    const exact = digits.length >= 11 ? matches.find((c) => onlyDigits(c.phone) === digits) : undefined;
    if (exact) return { type: 'selected', client: exact };
    if (digits.length >= 11 && matches.length === 0) return { type: 'not_found' };
    return { type: 'results', clients: matches.slice(0, 8) };
  }, [override, digits, allClients]);

  const selectClient = (client: ClientResult) => setOverride(client);
  const markNewClient = (name: string) => setOverride({ id: NEW_CLIENT_ID, name, phone });

  return { state, selectClient, markNewClient };
}
