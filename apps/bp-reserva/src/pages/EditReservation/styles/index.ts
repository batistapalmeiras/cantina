import styled from 'styled-components';

export * from './EditReservation';

export const BottomSpacer = styled.div`
  display: none;

  @media (max-width: 744px) {
    display: block;
    height: 140px;
  }
`;
