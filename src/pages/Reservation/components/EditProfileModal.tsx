import { useState } from 'react';
import styled from 'styled-components';
import { ModalTitle, ModalActions } from '../../../components/Modal';
import { Button } from '../../../components/Button';

const formatPhone = (val: string) => {
  const d = val.replace(/\D/g, '').slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.ink};
`;

const Input = styled.input`
  height: 48px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodyMd.fontSize};
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.canvas};
  outline: none;
  box-sizing: border-box;
  width: 100%;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.ink};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.hairlineSoft};
  }
`;

interface Props {
  name: string;
  phone: string;
  close: () => void;
  onSave: (name: string, phone: string) => Promise<void>;
}

export function EditProfileModal({ name: initialName, phone: initialPhone, close, onSave }: Props) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) return;
    setSaving(true);
    try {
      await onSave(name.trim(), phone);
      close();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <ModalTitle>Editar dados</ModalTitle>
      <FieldWrap>
        <Label>Nome completo</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
        />
      </FieldWrap>
      <FieldWrap>
        <Label>Telefone (WhatsApp)</Label>
        <Input
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          placeholder="(11) 99999-0000"
          inputMode="numeric"
        />
      </FieldWrap>
      <ModalActions>
        <Button variant="secondary" size="md" onClick={close}>Cancelar</Button>
        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          disabled={saving || !name.trim() || !phone.trim()}
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </ModalActions>
    </div>
  );
}
