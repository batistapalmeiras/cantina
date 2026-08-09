// React
import { useEffect, useState } from 'react';
// Libs
import { PHONE_PLACEHOLDER, useClient } from 'bp-core';
import { Button, PageHeader, maskPhone, text } from 'bp-kit';
// Local
import { EditFieldWrap, EditInput, Label } from './styles';

export function ProfilePage() {
  const { client, updateClient } = useClient();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (client) {
      setName(client.name);
      setPhone(client.phone);
    }
  }, [client]);

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) return;
    setSaving(true);
    try {
      await updateClient(name.trim(), phone);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        back
        title="Meu perfil"
        subtitle="Atualize seus dados pessoais."
      />
      <EditFieldWrap>
        <Label>{text.fields.fullName}</Label>
        <EditInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
      </EditFieldWrap>
      <EditFieldWrap>
        <Label>Telefone (WhatsApp)</Label>
        <EditInput
          value={phone}
          onChange={(e) => setPhone(maskPhone(e.target.value))}
          placeholder={PHONE_PLACEHOLDER}
          inputMode="numeric"
        />
      </EditFieldWrap>
      <Button
        variant="primary"
        size="md"
        fullWidth
        onClick={handleSave}
        disabled={saving || !name.trim() || !phone.trim()}
      >
        {saving ? 'Salvando...' : 'Salvar alterações'}
      </Button>
    </>
  );
}
