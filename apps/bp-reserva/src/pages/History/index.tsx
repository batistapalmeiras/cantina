// Libs
import { ORDER_STATUS_LABEL, PAYMENT_METHOD_LABEL, useClient, useSessionCtx } from 'bp-core';
import { formatCurrency, PageHeader, Skeleton } from 'bp-ui';
// Local
import { useClientHistory } from './hooks';
import { uniqueDishesText } from './domain';
import {
  HistoryEmpty,
  HistoryItem,
  HistoryItemHeader,
  HistoryItemMeta,
  HistoryItemSession,
  HistoryList,
  StatusBadge,
} from './styles';

export function HistoryPage() {
  const { client } = useClient();
  const { session } = useSessionCtx();
  const { history, loading } = useClientHistory(client?.phone, session?.id);

  return (
    <>
      <PageHeader
        title="Histórico de pedidos"
        subtitle="Veja seu histórico de pedidos."
      />

      {loading ? (
        <HistoryList>
          {[1, 2, 3].map((i) => (
            <HistoryItem key={i}>
              <HistoryItemHeader>
                <div style={{ flex: 1 }}>
                  <Skeleton $h="14px" $w="45%" />
                  <Skeleton $h="12px" $w="70%" style={{ marginTop: 6 }} />
                </div>
                <Skeleton $h="20px" $w="70px" />
              </HistoryItemHeader>
            </HistoryItem>
          ))}
        </HistoryList>
      ) : history.length === 0 ? (
        <HistoryEmpty>Sem pedidos anteriores.</HistoryEmpty>
      ) : (
        <HistoryList>
          {history.map((o) => (
            <HistoryItem key={o.id}>
              <HistoryItemHeader>
                <div>
                  <HistoryItemSession>
                    {new Date(o.sessionDate).toLocaleDateString('pt-BR')}
                  </HistoryItemSession>
                  <HistoryItemMeta>
                    {uniqueDishesText(o.dishes)}
                    {' · '}{formatCurrency(o.total)} · {PAYMENT_METHOD_LABEL[o.paymentMethod]}
                  </HistoryItemMeta>
                </div>
                <StatusBadge $status={o.status}>{ORDER_STATUS_LABEL[o.status]}</StatusBadge>
              </HistoryItemHeader>
            </HistoryItem>
          ))}
        </HistoryList>
      )}
    </>
  );
}
