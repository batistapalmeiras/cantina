// Libs
import styled from 'styled-components';
// Components
import { fadeUp } from '../../../styles/animations';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding-bottom: 96px;
  }
`;

export const StickyAside = styled.div`
  position: sticky;
  top: 80px;

  @media (max-width: 900px) {
    display: none;
  }
`;

export const BottomSummary = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    position: fixed;
    bottom: calc(64px + env(safe-area-inset-bottom));
    left: 0;
    right: 0;
    z-index: 90;
    background: ${({ theme }) => theme.colors.canvas};
    border-top: 1px solid ${({ theme }) => theme.colors.hairline};
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.base};
    animation: ${fadeUp} 0.2s ease;
  }
`;

export const BottomSummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.base};
`;

export const BottomSummaryInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const BottomSummaryItems = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
`;

export const BottomSummaryTotal = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.displaySm.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;
