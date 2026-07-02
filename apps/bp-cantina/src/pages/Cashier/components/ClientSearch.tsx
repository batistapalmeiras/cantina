// React
import { useEffect,useRef } from 'react';
// Libs
import { Search, X } from 'lucide-react';
import styled from 'styled-components';
// Components
import { Button } from 'bp-ui';
import { maskPhone } from 'bp-ui';
import { SelectedClient } from '../domain';
import { useClientSearch } from '../hooks/useClientSearch';

interface Props {
  onSelect: (client: SelectedClient) => void;
  onClear: () => void;
}

const Wrap = styled.div`
  position: relative;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  height: 56px;
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.sm};
  background: ${({ theme }) => theme.colors.canvas};
  padding: 0 ${({ theme }) => theme.spacing.sm};
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryDisabled};
  }

  svg { color: ${({ theme }) => theme.colors.muted}; flex-shrink: 0; }
`;

const Input = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodyMd.fontSize};
  color: ${({ theme }) => theme.colors.ink};

  &::placeholder { color: ${({ theme }) => theme.colors.muted}; }
`;

const ClearBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: ${({ theme }) => theme.colors.surfaceStrong};
  border-radius: ${({ theme }) => theme.rounded.full};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.muted};
  flex-shrink: 0;
  &:hover { background: ${({ theme }) => theme.colors.hairline}; }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.canvas};
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.sm};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
  z-index: 200;
`;

const DropdownItem = styled.button`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  text-align: left;
  background: none;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.hairlineSoft};
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  transition: background 0.12s;

  &:last-child { border-bottom: none; }
  &:hover { background: ${({ theme }) => theme.colors.surfaceSoft}; }
`;

const ItemName = styled.span`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.ink};
`;

const ItemPhone = styled.span`
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 2px;
`;

const DropdownMsg = styled.div`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.md}`};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
`;

const RegisterBox = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceSoft};
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.sm};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const RegisterLabel = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const PhoneInput = styled.input`
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.canvas};
  outline: none;
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryDisabled};
  }
  &::placeholder { color: ${({ theme }) => theme.colors.muted}; }
`;

const ConflictBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: ${({ theme }) => theme.rounded.sm};
`;

const ConflictText = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  color: #92400e;
  line-height: 1.4;

  strong { font-weight: 600; }
`;

export function ClientSearch({ onSelect, onClear }: Props) {
  const phoneRef = useRef<HTMLInputElement>(null);
  const { query, phone, state, search, selectClient, checkPhone, clear } =
    useClientSearch(onSelect);

  useEffect(() => {
    if (state.type === 'registering') phoneRef.current?.focus();
  }, [state.type]);

  const handleClear = () => {
    clear();
    onClear();
  };

  const isSelected = state.type === 'selected';

  return (
    <Wrap>
      <InputRow>
        <Search size={16} />
        <Input
          value={query}
          onChange={(e) => { if (!isSelected) search(e.target.value); }}
          placeholder="Buscar por nome ou telefone"
          readOnly={isSelected}
        />
        {query && (
          <ClearBtn type="button" onClick={handleClear}>
            <X size={12} />
          </ClearBtn>
        )}
      </InputRow>

      {state.type === 'results' && (
        <Dropdown>
          {state.items.map((client) => (
            <DropdownItem key={client.id} type="button" onClick={() => selectClient(client)}>
              <ItemName>{client.name}</ItemName>
              <ItemPhone>{client.phone}</ItemPhone>
            </DropdownItem>
          ))}
        </Dropdown>
      )}

      {state.type === 'searching' && (
        <Dropdown>
          <DropdownMsg>Buscando...</DropdownMsg>
        </Dropdown>
      )}

      {state.type === 'registering' && (
        <RegisterBox>
          <RegisterLabel>Cliente não encontrado — informe o telefone para cadastrar</RegisterLabel>
          <PhoneInput
            ref={phoneRef}
            value={phone}
            onChange={(e) => checkPhone(maskPhone(e.target.value))}
            placeholder="(00) 00000-0000"
          />
        </RegisterBox>
      )}

      {state.type === 'phone_conflict' && (
        <RegisterBox>
          <RegisterLabel>Cliente não encontrado — informe o telefone para cadastrar</RegisterLabel>
          <PhoneInput value={phone} readOnly />
          <ConflictBox>
            <ConflictText>
              Este telefone pertence a <strong>{state.existing.name}</strong>.
            </ConflictText>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => selectClient(state.existing)}
            >
              Usar este cliente
            </Button>
          </ConflictBox>
        </RegisterBox>
      )}
    </Wrap>
  );
}
