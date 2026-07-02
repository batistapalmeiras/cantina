// React
import { useState } from 'react';
// Components
import { Button } from 'bp-ui';
import { ModalActions,ModalTitle } from 'bp-ui';
import { maskPhone } from 'bp-ui';
import { EditFieldWrap, EditInput,Label } from '../styles';

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
      <EditFieldWrap>
        <Label>Nome completo</Label>
        <EditInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
        />
      </EditFieldWrap>
      <EditFieldWrap>
        <Label>Telefone (WhatsApp)</Label>
        <EditInput
          value={phone}
          onChange={(e) => setPhone(maskPhone(e.target.value))}
          placeholder="(11) 99999-0000"
          inputMode="numeric"
        />
      </EditFieldWrap>
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
