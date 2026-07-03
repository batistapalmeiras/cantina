// React
import React from 'react';
// Libs
import { Brand } from 'bp-ui';
import { ChefHat, ChevronDown, ClipboardList, LogOut, Settings, ShoppingBag, User, UserCircle } from 'lucide-react';
// Components
import icon from '../../assets/icon.png';
import { AppRoute } from '../../routes/paths';
// Local
import { useLayout } from './hooks';
import {
  BottomBar,
  BottomTab,
  BottomTabLabel,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownName,
  DropdownRole,
  Header,
  HeaderInner,
  Main,
  MainInner,
  Nav,
  NavLink,
  UserArea,
  UserBtn,
} from './styles';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const {
    user,
    navigate,
    open,
    setOpen,
    ref,
    isAdmin,
    handleLogout,
    isActive,
    showSetup,
    showCashier,
    showOrders,
    showKitchen,
  } = useLayout();

  const visibleTabs = [showSetup, showCashier, showOrders, showKitchen].filter(Boolean).length;
  const shouldShowBottomBar = visibleTabs > 1;

  return (
    <>
      <Header>
        <HeaderInner>
          <Brand
            to={isAdmin ? AppRoute.Setup : AppRoute.Cashier}
            icon={icon}
            alt="Cantina Batista Palmeiras"
            name="Cantina Batista Palmeiras"
          />

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
              <UserBtn onClick={() => setOpen((v) => !v)}>
                <UserCircle size={20} />
                <span>{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </UserBtn>

              <Dropdown $open={open}>
                <DropdownHeader>
                  <DropdownName>{user?.name}</DropdownName>
                  <DropdownRole>
                    {user?.role === 'admin' ? 'Administrador' : user?.role === 'kitchen' ? 'Cozinha' : 'Operador'}
                  </DropdownRole>
                </DropdownHeader>
                {user?.role !== 'kitchen' && (
                  <>
                    <DropdownItem
                      onClick={() => {
                        setOpen(false);
                        navigate(AppRoute.Profile);
                      }}
                    >
                      <User size={16} />
                      Meu perfil
                    </DropdownItem>
                    <DropdownDivider />
                  </>
                )}
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

      {shouldShowBottomBar && (
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
