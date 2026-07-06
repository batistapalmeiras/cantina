// React
import { Link } from 'react-router-dom';
// Libs
import { fadeDown } from 'bp-ui';
import styled from 'styled-components';

export const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.canvas};

  @media (max-width: 744px) {
    padding-bottom: calc(56px + env(safe-area-inset-bottom));
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.base};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.base} 0;
`;

export const DesktopTabBarWrap = styled.div`
  display: none;

  @media (min-width: 745px) {
    display: block;
  }
`;

export const UserArea = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const UserBtn = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.full};
  background: ${({ theme }) => theme.colors.canvas};
  color: ${({ theme }) => theme.colors.ink};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: 500;
  cursor: pointer;
  transition: box-shadow 0.2s;

  &:hover { box-shadow: ${({ theme }) => theme.shadows.md}; }
`;

export const Dropdown = styled.div<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? 'block' : 'none')};
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background: ${({ theme }) => theme.colors.canvas};
  border-radius: ${({ theme }) => theme.rounded.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.hairlineSoft};
  overflow: hidden;
  z-index: 200;
  animation: ${fadeDown} 0.15s ease;
`;

export const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.base}`};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.ink};
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;

  &:hover { background: ${({ theme }) => theme.colors.surfaceSoft}; }
  &.danger { color: ${({ theme }) => theme.colors.primaryErrorText}; }
`;

export const DropdownDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.hairlineSoft};
`;

export const BottomTabBar = styled.nav`
  display: none;

  @media (max-width: 744px) {
    display: flex;
    justify-content: center;
    gap: 40px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    padding-bottom: env(safe-area-inset-bottom);
  }
`;

export const BottomTab = styled(Link)<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 12px 0 10px;
  text-decoration: none;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.mutedSoft)};
  transition: color 0.2s;

  svg {
    stroke-width: ${({ $active }) => ($active ? 2 : 1.5)};
    fill: ${({ theme, $active }) => ($active ? theme.colors.primary : 'none')};
    fill-opacity: ${({ $active }) => ($active ? 0.12 : 0)};
  }
`;

export const BottomTabLabel = styled.span<{ $active: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 10px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  line-height: 1;
  letter-spacing: 0.2px;
`;

