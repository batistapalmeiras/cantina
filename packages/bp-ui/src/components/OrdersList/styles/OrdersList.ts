// Libs
import { OrderStatus } from 'bp-core';
import styled from 'styled-components';

export const TableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.md};

  @media (max-width: 700px) { display: none; }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};

  thead tr { border-bottom: 1px solid ${({ theme }) => theme.colors.hairline}; }

  th {
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.base}`};
    text-align: left;
    font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.muted};
    text-transform: uppercase;
    letter-spacing: 0.4px;
    white-space: nowrap;
  }

  tbody tr {
    border-bottom: 1px solid ${({ theme }) => theme.colors.hairlineSoft};
    transition: background 0.15s;
    &:last-child { border-bottom: none; }
    &:hover { background: ${({ theme }) => theme.colors.surfaceSoft}; }
  }

  td {
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.base}`};
    color: ${({ theme }) => theme.colors.ink};
    vertical-align: middle;
  }
`;

export const StatusBadge = styled.span<{ $status: OrderStatus }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: ${({ theme }) => theme.rounded.full};
  font-size: ${({ theme }) => theme.typography.badge.fontSize};
  font-weight: ${({ theme }) => theme.typography.badge.fontWeight};
  background: ${({ theme, $status }) => ($status === OrderStatus.Sale ? theme.colors.successSurface : theme.colors.warningSurface)};
  color: ${({ theme, $status }) => ($status === OrderStatus.Sale ? theme.colors.success : theme.colors.warning)};
  border: 1px solid ${({ theme, $status }) => ($status === OrderStatus.Sale ? theme.colors.successBorder : theme.colors.warningBorder)};
`;

export const CardList = styled.div`
  display: none;

  @media (max-width: 700px) {
    display: block;
    border: 1px solid ${({ theme }) => theme.colors.hairline};
    border-radius: ${({ theme }) => theme.rounded.md};
    overflow: hidden;
  }
`;

export const OrderCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.base}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.hairlineSoft};

  &:last-child { border-bottom: none; }
`;

export const CardMain = styled.div`
  flex: 1;
  min-width: 0;
`;

export const CardName = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TicketCount = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const CardMeta = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 2px;
`;

export const SheetCustomer = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.titleMd.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
  margin-bottom: 2px;
`;

export const SheetMeta = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const SheetActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  button, a {
    width: 100%;
    justify-content: center;
    height: 48px;
    font-size: ${({ theme }) => theme.typography.buttonMd.fontSize};
  }
`;

export const Empty = styled.div`
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.base};
  text-align: center;
`;

export const Phone = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.mutedSoft};
  margin-top: 1px;
`;
