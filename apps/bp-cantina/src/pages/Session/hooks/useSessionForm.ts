// React
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
// Libs
import { useSessionCtx } from 'bp-core';
// Components
import { AppRoute } from '../../../routes/paths';
import { createDefaultDishes } from '../domain';
import { SessionMode } from '../types';
import { sessionFormSchema, type SessionFormValues } from '../validators';

export function useSessionForm(mode: SessionMode) {
  const { session, openSession, updateSession } = useSessionCtx();
  const navigate = useNavigate();

  const isEdit = mode === 'edit';

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: isEdit && session
      ? { ministry: session.ministry, dishes: session.dishes }
      : { ministry: '', dishes: createDefaultDishes() },
  });

  const submit = form.handleSubmit(async (data) => {
    if (isEdit) {
      await updateSession({ ministry: data.ministry, dishes: data.dishes });
    } else {
      await openSession({
        date: new Date().toISOString(),
        ministry: data.ministry,
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
