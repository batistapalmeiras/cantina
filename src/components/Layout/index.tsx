import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserCircle, ChevronDown, LogOut, User, Settings, ShoppingBag, ClipboardList, ChefHat } from 'lucide-react';
import { fadeUp, fadeDown } from '../../styles/animations';
import styled from 'styled-components';
import icon from '../../assets/icon.png';
import { useAuthCtx } from '../../hooks/useAuth';
import { useSessionCtx } from '../../hooks/useSession';
import { AppRoute } from '../../routes/paths';

interface LayoutProps {
  children: React.ReactNode;
}

/* ── Header ────────────────────────────────────────────── */

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${({ theme }) => theme.colors.canvas};
  border-bottom: 1px solid ${({ theme }) => theme.colors.hairline};
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing.xl};

  @media (max-width: 744px) {
    padding: 0 ${({ theme }) => theme.spacing.base};
  }
`;

const HeaderInner = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  text-decoration: none;
  flex-shrink: 0;
`;

const BrandLogo = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
`;

const BrandName = styled.span`
  font-size: ${({ theme }) => theme.typography.titleMd.fontSize};
  font-weight: ${({ theme }) => theme.typography.titleMd.fontWeight};
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};

  @media (max-width: 480px) {
    display: none;
  }
`;

/* ── Desktop nav ───────────────────────────────────────── */

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  @media (max-width: 744px) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.rounded.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.navLink.fontSize};
  font-weight: ${({ theme }) => theme.typography.navLink.fontWeight};
  color: ${({ theme, $active }) => ($active ? theme.colors.ink : theme.colors.muted)};
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: ${({ theme }) => theme.spacing.md};
    right: ${({ theme }) => theme.spacing.md};
    height: 2px;
    background: ${({ theme, $active }) => ($active ? theme.colors.ink : 'transparent')};
    border-radius: 1px;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceSoft};
    color: ${({ theme }) => theme.colors.ink};
  }
`;

/* ── User dropdown ─────────────────────────────────────── */


const UserArea = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const UserBtn = styled.button`
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

const Dropdown = styled.div<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? 'block' : 'none')};
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  background: ${({ theme }) => theme.colors.canvas};
  border-radius: ${({ theme }) => theme.rounded.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.hairlineSoft};
  overflow: hidden;
  z-index: 200;
  animation: ${fadeDown} 0.15s ease;
`;

const DropdownHeader = styled.div`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.base}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.hairlineSoft};
`;

const DropdownName = styled.p`
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.caption.fontWeight};
  color: ${({ theme }) => theme.colors.ink};
`;

const DropdownRole = styled.p`
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 2px;
`;

const DropdownItem = styled.button`
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

const DropdownDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.hairlineSoft};
`;


/* ── Mobile bottom tab bar ─────────────────────────────── */

const BottomBar = styled.nav`
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

const BottomTab = styled(Link)<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 12px 0 10px;
  text-decoration: none;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : '#b0b0b0')};
  transition: color 0.2s;

  svg {
    stroke-width: ${({ $active }) => ($active ? 2 : 1.5)};
    fill: ${({ theme, $active }) => ($active ? theme.colors.primary : 'none')};
    fill-opacity: ${({ $active }) => ($active ? 0.12 : 0)};
  }
`;

const BottomTabLabel = styled.span<{ $active: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 10px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  line-height: 1;
  letter-spacing: 0.2px;
`;

/* ── Main ──────────────────────────────────────────────── */

const Main = styled.main`
  min-height: calc(100vh - 64px);
  background: ${({ theme }) => theme.colors.canvas};

  @media (max-width: 744px) {
    padding-bottom: calc(56px + env(safe-area-inset-bottom));
  }
`;

const MainInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  animation: ${fadeUp} 0.25s ease;

  @media (max-width: 744px) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.base};
  }
`;

/* ══════════════════════════════════════════════════════════
   Component
══════════════════════════════════════════════════════════ */

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthCtx();
  const { session, pendingSession } = useSessionCtx();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'admin';
  const hasOpenSession = session?.isOpen === true;
  const hasActiveSession = hasOpenSession || !!pendingSession;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    window.location.href = AppRoute.Login;
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const showSetup   = isAdmin;
  const showCashier = hasOpenSession;
  const showOrders  = hasActiveSession;
  const showKitchen = hasActiveSession;

  return (
    <>
      <Header>
        <HeaderInner>
          <Brand to={isAdmin ? AppRoute.Setup : AppRoute.Cashier}>
            <BrandLogo src={icon} alt="Cantina Batista Palmeiras" />
            <BrandName>Cantina Batista Palmeiras</BrandName>
          </Brand>

          {/* Desktop nav */}
          <Nav>
            {showSetup && (
              <NavLink to={AppRoute.Setup} $active={isActive(AppRoute.Setup)}>
                Configurar
              </NavLink>
            )}
            {showCashier && (
              <NavLink to={AppRoute.Cashier} $active={isActive(AppRoute.Cashier)}>
                Caixa
              </NavLink>
            )}
            {showOrders && (
              <NavLink to={AppRoute.Orders} $active={isActive(AppRoute.Orders)}>
                Pedidos
              </NavLink>
            )}
            {showKitchen && (
              <NavLink to={AppRoute.Kitchen} $active={isActive(AppRoute.Kitchen)}>
                Cozinha
              </NavLink>
            )}
          </Nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <UserArea ref={ref}>
              <UserBtn onClick={() => setOpen(v => !v)}>
                <UserCircle size={20} />
                <span>{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </UserBtn>

              <Dropdown $open={open}>
                <DropdownHeader>
                  <DropdownName>{user?.name}</DropdownName>
                  <DropdownRole>{isAdmin ? 'Administrador' : 'Operador'}</DropdownRole>
                </DropdownHeader>
                <DropdownItem onClick={() => { setOpen(false); navigate(AppRoute.Profile); }}>
                  <User size={16} />
                  Meu perfil
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem className="danger" onClick={handleLogout}>
                  <LogOut size={16} />
                  Sair
                </DropdownItem>
              </Dropdown>
            </UserArea>
          </div>
        </HeaderInner>
      </Header>

      <Main>
        <MainInner>{children}</MainInner>
      </Main>

      {/* Mobile bottom tab bar — só aparece se a rota atual é uma das abas */}
      {(isActive(AppRoute.Setup) || isActive(AppRoute.Cashier) || isActive(AppRoute.Orders) || isActive(AppRoute.Kitchen)) && (
        <BottomBar>
          {showSetup && (
            <BottomTab to={AppRoute.Setup} $active={isActive(AppRoute.Setup)}>
              <Settings size={22} />
              <BottomTabLabel $active={isActive(AppRoute.Setup)}>Configurar</BottomTabLabel>
            </BottomTab>
          )}
          {showCashier && (
            <BottomTab to={AppRoute.Cashier} $active={isActive(AppRoute.Cashier)}>
              <ShoppingBag size={22} />
              <BottomTabLabel $active={isActive(AppRoute.Cashier)}>Caixa</BottomTabLabel>
            </BottomTab>
          )}
          {showOrders && (
            <BottomTab to={AppRoute.Orders} $active={isActive(AppRoute.Orders)}>
              <ClipboardList size={22} />
              <BottomTabLabel $active={isActive(AppRoute.Orders)}>Pedidos</BottomTabLabel>
            </BottomTab>
          )}
          {showKitchen && (
            <BottomTab to={AppRoute.Kitchen} $active={isActive(AppRoute.Kitchen)}>
              <ChefHat size={22} />
              <BottomTabLabel $active={isActive(AppRoute.Kitchen)}>Cozinha</BottomTabLabel>
            </BottomTab>
          )}
        </BottomBar>
      )}
    </>
  );
}
