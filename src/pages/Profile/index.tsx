import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuthCtx } from '../../hooks/useAuth';
import { profileSchema, ProfileFormValues } from './validators/schema';
import { TextInput } from '../../components/Inputs';
import { Button } from '../../components/Button';
import { PageHeader } from '../../components/PageHeader';
import { useToast } from '../../components/Toast';
import { Wrap, Identity, Name, RoleLabel, Section, SectionTitle, Actions } from './styles';

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
          <RoleLabel>{user?.role === 'admin' ? 'Administrador' : 'Operador'}</RoleLabel>
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
