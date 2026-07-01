import { useState, useMemo } from 'react';
import { Order, OrderStatus, PaymentMethod } from '../types';

const PAGE_SIZE = 10;

interface Options {
  pageSize?: number;
  nameFilter?: boolean;
}

export function useOrdersList(allOrders: Order[], { pageSize = PAGE_SIZE, nameFilter: enableNameFilter = false }: Options = {}) {
  const [page, setPage] = useState(1);
  const [nameFilter, setNameFilter] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | null>(null);
  const [filterPayment, setFilterPayment] = useState<PaymentMethod | null>(null);

  const filtered = useMemo(() => {
    const name = nameFilter.trim().toLowerCase();
    return allOrders
      .filter((o) => !enableNameFilter || !name || o.customerName.toLowerCase().includes(name))
      .filter((o) => !filterStatus || o.status === filterStatus)
      .filter((o) => !filterPayment || o.paymentMethod === filterPayment);
  }, [allOrders, nameFilter, filterStatus, filterPayment, enableNameFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const orders = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handleNameFilter = (v: string) => { setNameFilter(v); setPage(1); };
  const handleFilterStatus = (s: OrderStatus | null) => { setFilterStatus(s); setPage(1); };
  const handleFilterPayment = (p: PaymentMethod | null) => { setFilterPayment(p); setPage(1); };

  return {
    orders,
    page: safePage,
    setPage,
    totalPages,
    nameFilter,
    handleNameFilter,
    filterStatus,
    filterPayment,
    handleFilterStatus,
    handleFilterPayment,
    hasFilter: !!(nameFilter.trim() || filterStatus || filterPayment),
  };
}
