// Libs
import writeXlsxFile, { Cell, Row, SheetData } from 'write-excel-file/browser';
import { ORDER_STATUS_LABEL, Order, OrderStatus, PAYMENT_METHOD_LABEL, Session } from 'bp-core';
// Local
import { computeStats } from './rules';

const CURRENCY_FORMAT = '"R$" #,##0.00';
const WARNING_BG = '#FFFBEB';
const WARNING_TEXT = '#B45309';

function formatDishes(order: Order): string {
  const groups: Record<string, { name: string; addons: string; count: number }> = {};
  for (const t of order.tickets) {
    const addonsLabel = t.addons.map((a) => a.name).join(', ');
    const key = `${t.dishName}__${addonsLabel}`;
    if (!groups[key]) groups[key] = { name: t.dishName, addons: addonsLabel, count: 0 };
    groups[key].count++;
  }
  return Object.values(groups)
    .map((g) => `${g.count}x ${g.name}${g.addons ? ` (${g.addons})` : ''}`)
    .join(' + ');
}

function titleCell(value: string): Cell {
  return { value, fontWeight: 'bold' };
}

function summaryItem(label: string, value: number, { currency = false, highlight = false } = {}): Cell[] {
  const style = highlight ? { backgroundColor: WARNING_BG, textColor: WARNING_TEXT } : {};
  return [
    { value: label, ...style },
    { value, align: 'right', ...(currency ? { format: CURRENCY_FORMAT } : {}), ...style },
  ];
}

function orderToRow(order: Order): Row {
  const isPending = order.status === OrderStatus.Reservation;
  const statusStyle = isPending ? { backgroundColor: WARNING_BG, textColor: WARNING_TEXT } : {};
  return [
    { value: order.customerName },
    { value: order.customerPhone ?? '' },
    { value: order.tickets.length, align: 'right' },
    { value: formatDishes(order) },
    { value: order.total, format: CURRENCY_FORMAT, align: 'right' },
    { value: PAYMENT_METHOD_LABEL[order.paymentMethod] },
    { value: ORDER_STATUS_LABEL[order.status], ...statusStyle },
    { value: new Date(order.createdAt), format: 'dd/mm/yyyy hh:mm', align: 'right' },
  ];
}

export async function downloadReportXlsx(session: Session): Promise<void> {
  const { stats } = computeStats(session);

  const headers: Row = ['Cliente', 'Telefone', 'Fichinhas', 'Pratos', 'Total', 'Pagamento', 'Status', 'Data']
    .map((h) => ({ value: h.toUpperCase(), fontWeight: 'bold' as const }));

  const orderRows = session.orders.map(orderToRow);

  const summary: Cell[][] = [
    [titleCell('RESUMO')],
    summaryItem('Fichinhas vendidas', stats.totalTickets),
    summaryItem('Receita total', stats.revenue, { currency: true }),
    summaryItem('Pedidos confirmados', stats.confirmedOrders),
    summaryItem('Reservas pendentes', stats.pendingReservations, { highlight: stats.pendingReservations > 0 }),
  ];

  const spacer: Cell[] = Array(8).fill(null);

  const data: SheetData = [
    [titleCell('PEDIDOS'), ...spacer.slice(1), null, ...summary[0]],
    [...headers, null, ...summary[1]],
    ...orderRows.map((row, i) => {
      const summaryRow = summary[i + 2];
      return summaryRow ? [...row, null, ...summaryRow] : row;
    }),
    ...summary.slice(orderRows.length + 2).map((s) => [...spacer, null, ...s]),
  ];

  await writeXlsxFile(data, {
    sheet: 'Relatório',
    columns: [
      { width: 32 },
      { width: 18 },
      { width: 11 },
      { width: 32 },
      { width: 13 },
      { width: 12 },
      { width: 12 },
      { width: 18 },
      { width: 3 },
      { width: 22 },
      { width: 14 },
    ],
  }).toFile(buildReportFilename(session));
}

export function buildReportFilename(session: Session): string {
  const ministrySlug = session.ministry.trim().toLowerCase().replace(/\s+/g, '-');
  return `relatorio_${ministrySlug}_${session.date}.xlsx`;
}
