// React
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
// Libs
import { Button, PageHeader, TextInput, useToast } from 'bp-ui';
import { useAuthCtx, UserRole } from 'bp-core';
// Local
import { Actions,Identity, Name, RoleLabel, Section, SectionTitle, Wrap } from './styles';
import { ProfileFormValues,profileSchema } from './validators/schema';

export function ProfilePage() {
  const { user, userEmail, updateProfile } = useAuthCtx();
  const navigate = useNavigate();

  const { show: showToast, toast } = useToast();

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', email: userEmail },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    const err = await updateProfile(data.name, data.email);
    showToast(err ?? 'Perfil atualizado com sucesso.');
  };

  return (
    <div>
      <PageHeader title="Meu perfil" back />

      <Wrap>
        <Identity>
          <Name>{user?.name ?? '—'}</Name>
          <RoleLabel>{user?.role === UserRole.Admin ? 'Administrador' : 'Operador'}</RoleLabel>
        </Identity>

        <Section>
          <SectionTitle>Informações pessoais</SectionTitle>
          <TextInput
            label="Nome completo"
            control={control}
            name="name"
            placeholder="Nome e sobrenome"
          />
          <TextInput
            label="E-mail de acesso"
            control={control}
            name="email"
            type="email"
            placeholder="seu@email.com"
          />
        </Section>

        <Actions>
          <Button variant="secondary" size="md" onClick={() => navigate(-1)}>Cancelar</Button>
          <Button variant="primary" size="md" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </Actions>
      </Wrap>
      {toast}
    </div>
  );
}
