// Components
import { formatCurrency } from '../../utils/mask';
import { Button } from '../Button';
// Local
import { Card, Label, Row, Info, Items, Total, ItemDetail, ItemDetailName, ItemDetailPrice, Divider, ButtonRow } from './styles';
import type { SummaryCardProps } from './types';

export function SummaryCard({
  label = 'Resumo',
  items,
  total,
  onConfirm,
  confirmText = 'Confirmar',
  loading = false,
  disabled = false,
  buttons,
  emptyMessage = 'Nenhum item selecionado',
  bottomOffset,
}: SummaryCardProps) {
  const hasSubtotals = items.some((item) => item.subtotal !== undefined);
  const itemsText = items.map((item) => `${item.qty}× ${item.name}`).join(', ');
  const isEmpty = items.length === 0;

  return (
    <Card $bottomOffset={bottomOffset}>
      <Label style={{ marginBottom: 0 }}>{label}</Label>

      {isEmpty ? (
        <Items style={{ textAlign: 'center', color: 'var(--color-muted)' }}>
          {emptyMessage}
        </Items>
      ) : hasSubtotals ? (
        <div>
          {items.map((item) => (
            <ItemDetail key={item.name}>
              <ItemDetailName>{item.qty}× {item.name}</ItemDetailName>
              {item.subtotal !== undefined && (
                <ItemDetailPrice>{formatCurrency(item.subtotal)}</ItemDetailPrice>
              )}
            </ItemDetail>
          ))}
        </div>
      ) : (
        <Row>
          <Items>{itemsText}</Items>
          <Total>{formatCurrency(total)}</Total>
        </Row>
      )}

      {!isEmpty && hasSubtotals && (
        <>
          <Divider />
          <Row>
            <Info>
              <Total>{formatCurrency(total)}</Total>
            </Info>
          </Row>
        </>
      )}

      {buttons && buttons.length > 0 ? (
        <ButtonRow>
          {buttons.map((btn, idx) => (
            <Button
              key={idx}
              variant={btn.variant || 'primary'}
              size="lg"
              fullWidth
              onClick={btn.onClick}
              disabled={btn.disabled || btn.loading}
            >
              {btn.loading ? `${btn.text}...` : btn.text}
            </Button>
          ))}
        </ButtonRow>
      ) : onConfirm ? (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onConfirm}
          disabled={disabled || loading || isEmpty}
        >
          {loading ? `${confirmText}...` : confirmText}
        </Button>
      ) : null}
    </Card>
  );
}
