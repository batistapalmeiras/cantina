import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useSessionCtx } from '../../../hooks/useSession';
import { AppRoute } from '../../../routes/paths';
import { sessionFormSchema, type SessionFormValues } from '../../../components/SessionForm';
import { createDefaultDishes } from '../domain';
import { SessionMode } from '../types';

const PIX_KEY = 'ibc.palmeiras@pix.com.br';

export function useSessionForm(mode: SessionMode) {
  const { session, openSession, updateSession } = useSessionCtx();
  const navigate = useNavigate();

  const isEdit = mode === 'edit';

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: isEdit && session
      ? { ministry: session.ministry, dishes: session.dishes }
      : { ministry: 'Jovens', dishes: createDefaultDishes() },
  });

  const submit = form.handleSubmit(async (data) => {
    if (isEdit) {
      await updateSession({ ministry: data.ministry, dishes: data.dishes });
    } else {
      await openSession({
        date: new Date().toISOString(),
        ministry: data.ministry,
        pixKey: PIX_KEY,
        isOpen: true,
        status: 'open',
        dishes: data.dishes,
      });
    }
    navigate(AppRoute.Setup);
  });

  const cancel = () => navigate(AppRoute.Setup);

  return {
    session,
    isEdit,
    control: form.control,
    isSubmitting: form.formState.isSubmitting,
    submit,
    cancel,
  };
}
