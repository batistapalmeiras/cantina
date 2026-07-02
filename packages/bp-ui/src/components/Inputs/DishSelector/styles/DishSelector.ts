// Libs
import styled from 'styled-components';

export const DishCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.md};
  overflow: hidden;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

export const DishHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.base};
`;

export const DishInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const DishName = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.titleMd.fontSize};
  font-weight: ${({ theme }) => theme.typography.titleMd.fontWeight};
  color: ${({ theme }) => theme.colors.ink};
`;

export const DishMeta = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
`;

export const Stepper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StepBtn = styled.button<{ $disabled?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.rounded.full};
  border: 1px solid ${({ theme, $disabled }) => ($disabled ? theme.colors.hairline : theme.colors.borderStrong)};
  background: ${({ theme }) => theme.colors.canvas};
  color: ${({ theme, $disabled }) => ($disabled ? theme.colors.hairline : theme.colors.ink)};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: box-shadow 0.15s, border-color 0.15s;
  flex-shrink: 0;

  &:hover:not([disabled]) {
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

export const StepCount = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.titleMd.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink};
  min-width: 20px;
  text-align: center;
`;

export const TicketList = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.hairlineSoft};
  background: ${({ theme }) => theme.colors.surfaceSoft};
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

export const TicketRow = styled.div`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.base}`};
  background: ${({ theme }) => theme.colors.surfaceSoft};
`;

export const TicketLabel = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const TicketQuestion = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const SoldOut = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.badge.fontSize};
  font-weight: ${({ theme }) => theme.typography.badge.fontWeight};
  color: ${({ theme }) => theme.colors.muted};
  background: ${({ theme }) => theme.colors.surfaceStrong};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.rounded.full};
`;
