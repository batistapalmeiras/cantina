// React
import { useMemo, useState } from 'react';
// Components
import { Order } from 'bp-core';

const PAGE_SIZE = 10;

interface Options {
  pageSize?: number;
}

export function useOrdersList(allOrders: Order[], { pageSize = PAGE_SIZE }: Options = {}) {
  const [page, setPage] = useState(1);
  const [nameFilter, setNameFilter] = useState('');

  const filtered = useMemo(() => {
    const name = nameFilter.trim().toLowerCase();
    if (!name) return allOrders;
    return allOrders.filter((o) => o.customerName.toLowerCase().includes(name));
  }, [allOrders, nameFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const orders = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleNameFilter = (v: string) => { setNameFilter(v); setPage(1); };

  return {
    orders,
    page: safePage,
    setPage,
    totalPages,
    nameFilter,
    handleNameFilter,
    hasFilter: !!nameFilter.trim(),
  };
}
