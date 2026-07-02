// React
import React from 'react';
import { Navigate } from 'react-router-dom';
// Libs
import { Skeleton, Tab, TabBar } from 'bp-ui';
import { ChevronDown, ClipboardList, History as HistoryIcon, LogOut, User, UserCircle } from 'lucide-react';
// Components
import icon from '../../assets/icon.png';
import { AppRoute } from '../../routes/paths';
// Local
import { useReservaLayout } from './hooks';
import {
  BottomTab,
  BottomTabBar,
  BottomTabLabel,
  BrandLogo,
  BrandName,
  BrandRow,
  Card,
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

export function ReservaLayout({ children }: Props) {
  const { client, clientLoading, navigate, open, setOpen, ref, handleLogout, isActive } = useReservaLayout();

  const brand = (
    <BrandRow>
      <BrandLogo src={icon} alt="Cantina IBC" />
      <div>
        <BrandName>Cantina IBC</BrandName>
      </div>
    </BrandRow>
  );

  if (clientLoading) {
    return (
      <Page>
        <Container>
          <Header>{brand}</Header>
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
          {brand}

          <UserArea ref={ref}>
            <UserBtn onClick={() => setOpen((v) => !v)}>
              <UserCircle size={18} />
              <span>Olá, {client.name.split(' ')[0]}!</span>
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

        {!onProfile && (
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

      {!onProfile && (
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
