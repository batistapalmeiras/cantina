// Components
import { ModalTitle } from '../../../components/Modal';
import { ORDER_STATUS_LABEL, PAYMENT_METHOD_LABEL } from '../../../utils';
import { HistoryOrder } from '../domain';
import {
  HistoryEmpty,
  HistoryItem,
  HistoryItemHeader,
  HistoryItemMeta,
  HistoryItemSession,
  HistoryList,
  StatusBadge,
} from '../styles';

interface Props {
  history: HistoryOrder[];
  loading: boolean;
}

export function HistoryModal({ history, loading }: Props) {
  return (
    <div>
      <ModalTitle>Histórico de pedidos</ModalTitle>
      {loading ? (
        <HistoryEmpty>Carregando...</HistoryEmpty>
      ) : history.length === 0 ? (
        <HistoryEmpty>Nenhum pedido em domingos anteriores.</HistoryEmpty>
      ) : (
        <HistoryList>
          {history.map((o) => (
            <HistoryItem key={o.id}>
              <HistoryItemHeader>
                <div>
                  <HistoryItemSession>
                    {o.sessionMinistry} · {new Date(o.sessionDate).toLocaleDateString('pt-BR')}
                  </HistoryItemSession>
                  <HistoryItemMeta>
                    {o.dishes.filter((d, i, arr) => arr.indexOf(d) === i).join(', ')}
                    {' · '}R$ {o.total.toFixed(2)} · {PAYMENT_METHOD_LABEL[o.paymentMethod]}
                  </HistoryItemMeta>
                </div>
                <StatusBadge $status={o.status}>{ORDER_STATUS_LABEL[o.status]}</StatusBadge>
              </HistoryItemHeader>
            </HistoryItem>
          ))}
        </HistoryList>
      )}
    </div>
  );
}
