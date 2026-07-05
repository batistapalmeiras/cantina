import styled from 'styled-components';
import { fadeUp } from 'bp-ui';

export const BottomBarInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const BottomBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.canvas};
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.base};
  margin-top: ${({ theme }) => theme.spacing.base};

  @media (max-width: 744px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 90;
    margin-top: 0;
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.hairline};
    border-radius: 0;
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
    padding-bottom: calc(${({ theme }) => theme.spacing.md} + env(safe-area-inset-bottom));
    animation: ${fadeUp} 0.2s ease;
  }
`;

export const BottomBarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.base};
`;

export const BottomBarItems = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  flex: 1;
  display: block;
`;

export const BottomBarTotal = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.displaySm.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
  margin-left: auto;
  display: inline-block;
`;

export const BottomSpacer = styled.div`
  display: none;

  @media (max-width: 744px) {
    display: block;
    height: 140px;
  }
`;

export const BottomWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.base};
  background: white;
  z-index: 80;

  @media (max-width: 744px) {
    bottom: 80px;
    padding-bottom: calc(${({ theme }) => theme.spacing.md} + env(safe-area-inset-bottom));
  }
`;
