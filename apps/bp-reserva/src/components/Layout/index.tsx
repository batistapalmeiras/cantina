// React
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// Libs
import { Brand, Card, Skeleton, Tab, TabBar } from 'bp-ui';
import { ChevronDown, ClipboardList, History as HistoryIcon, LogOut, User, UserCircle } from 'lucide-react';
// Components
import icon from '../../assets/icon.png';
import { AppRoute } from '../../routes/paths';
// Local
import { useLayout } from './hooks';
import {
  BottomTab,
  BottomTabBar,
  BottomTabLabel,
  Container,
  DesktopTabBarWrap,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  Header,
  Page,
  UserArea,
  UserBtn,
} from './styles';

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props) {
  const { client, clientLoading, navigate, open, setOpen, ref, handleLogout, isActive } = useLayout();
  const location = useLocation();
  const isEditingReservation = location.pathname.startsWith('/reserva/editar');
  const isConfirmedReservation = location.pathname === '/reserva-confirmada';

  if (clientLoading) {
    return (
      <Page>
        <Container>
          <Header>
            <Brand
              icon={icon}
              alt="Cantina Batista Palmeiras"
              name="Cantina Batista Palmeiras"
            />
          </Header>
          <Card>
            <Skeleton $h="20px" $w="55%" />
            <Skeleton $h="13px" $w="35%" style={{ marginTop: 8 }} />
          </Card>
          <Card>
            <Skeleton $h="13px" $w="30%" style={{ marginBottom: 16 }} />
            <Skeleton $h="72px" />
          </Card>
        </Container>
      </Page>
    );
  }

  if (!client) return <Navigate to={AppRoute.Identify} replace />;

  const onProfile = isActive(AppRoute.Profile);

  return (
    <Page>
      <Container>
        <Header>
          <Brand
            icon={icon}
            alt="Cantina Batista Palmeiras"
            name="Cantina Batista Palmeiras"
          />
          <UserArea ref={ref}>
            <UserBtn onClick={() => setOpen((v) => !v)}>
              <UserCircle size={18} />
              <span>{client.name.split(' ')[0]}</span>
              <ChevronDown size={14} />
            </UserBtn>

            <Dropdown $open={open}>
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
              <DropdownItem className="danger" onClick={handleLogout}>
                <LogOut size={16} />
                Sair
              </DropdownItem>
            </Dropdown>
          </UserArea>
        </Header>

        {!onProfile && !isEditingReservation && !isConfirmedReservation && (
          <DesktopTabBarWrap>
            <TabBar>
              <Tab
                $active={isActive(AppRoute.Reservation) && !isActive(AppRoute.History)}
                onClick={() => navigate(AppRoute.Reservation)}
              >
                Reserva
              </Tab>
              <Tab $active={isActive(AppRoute.History)} onClick={() => navigate(AppRoute.History)}>
                Histórico
              </Tab>
            </TabBar>
          </DesktopTabBarWrap>
        )}

        {children}
      </Container>

      {!onProfile && !isEditingReservation && !isConfirmedReservation && (
        <BottomTabBar>
          <BottomTab to={AppRoute.Reservation} $active={isActive(AppRoute.Reservation) && !isActive(AppRoute.History)}>
            <ClipboardList size={22} />
            <BottomTabLabel $active={isActive(AppRoute.Reservation)}>Reserva</BottomTabLabel>
          </BottomTab>
          <BottomTab to={AppRoute.History} $active={isActive(AppRoute.History)}>
            <HistoryIcon size={22} />
            <BottomTabLabel $active={isActive(AppRoute.History)}>Histórico</BottomTabLabel>
          </BottomTab>
        </BottomTabBar>
      )}
    </Page>
  );
}
