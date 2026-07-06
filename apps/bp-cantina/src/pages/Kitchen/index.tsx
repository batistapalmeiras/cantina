// React
import { useState } from 'react';
// Libs
import { Check, Undo2 } from 'lucide-react';
import { IconButton, PageHeader, Tab, TabBadge, TabBar, Typography } from 'bp-ui';
// Local
import { groupTicketsByDish } from './domain';
import { useKitchen } from './hooks';
import {
  Card,
  CardTop,
  CustomerName,
  Empty,
  EmptyHint,
  Grid,
  ItemAddons,
  ItemList,
  ItemQty,
  ItemRow,
} from './styles';
import { KitchenTab } from './types';

export function KitchenPage() {
  const { session, pending, delivered, toggleDelivered } = useKitchen();
  const [tab, setTab] = useState<KitchenTab>(KitchenTab.Pending);

  if (!session) {
    return (
      <Empty>
        <Typography type="h3">Nenhuma sessão disponível</Typography>
        <Typography type="p">Aguarde o administrador abrir uma sessão</Typography>
      </Empty>
    );
  }

  const orders = tab === KitchenTab.Pending ? pending : delivered;

  return (
    <>
      <PageHeader
        title="Cozinha"
        subtitle={`${session.ministry} · ${new Date(session.date).toLocaleDateString('pt-BR')}`}
      />

      <TabBar>
        <Tab $active={tab === KitchenTab.Pending} onClick={() => setTab(KitchenTab.Pending)}>
          Para preparar
          {pending.length > 0 && <TabBadge>{pending.length}</TabBadge>}
        </Tab>
        <Tab $active={tab === KitchenTab.Delivered} onClick={() => setTab(KitchenTab.Delivered)}>
          Entregues
          {delivered.length > 0 && <TabBadge>{delivered.length}</TabBadge>}
        </Tab>
      </TabBar>

      {orders.length === 0 ? (
        <EmptyHint>
          {tab === KitchenTab.Pending ? 'Nenhum pedido pendente de momento.' : 'Nenhum pedido entregue ainda.'}
        </EmptyHint>
      ) : (
        <Grid>
          {orders.map((order) => (
            <Card key={order.id} $done={tab === KitchenTab.Delivered}>
              <CardTop>
                <CustomerName>{order.customerName}</CustomerName>
              </CardTop>

              <ItemList>
                {groupTicketsByDish(order).map((g, i) => (
                  <ItemRow key={i}>
                    <ItemQty>{g.count}×</ItemQty>
                    <span>
                      {g.name}
                      {g.addons && <ItemAddons> · {g.addons}</ItemAddons>}
                    </span>
                  </ItemRow>
                ))}
              </ItemList>

              {tab === KitchenTab.Pending ? (
                <IconButton
                  size="xs"
                  variant="primary"
                  icon={<Check />}
                  iconPosition="left"
                  style={{ alignSelf: 'flex-end' }}
                  onClick={() => toggleDelivered(order.id, true)}
                >
                  Pronto
                </IconButton>
              ) : (
                <IconButton
                  size="xs"
                  variant="secondary"
                  icon={<Undo2 />}
                  iconPosition="left"
                  style={{ alignSelf: 'flex-end' }}
                  onClick={() => toggleDelivered(order.id, false)}
                >
                  Desfazer
                </IconButton>
              )}
            </Card>
          ))}
        </Grid>
      )}
    </>
  );
}
