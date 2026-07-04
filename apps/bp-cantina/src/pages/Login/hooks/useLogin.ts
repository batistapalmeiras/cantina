// React
import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Components
import { useAuthCtx, UserRole } from 'bp-core';
import { AppRoute } from '../../../routes/paths';
import { LoginFormValues } from '../validators';

export function useLogin() {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, user } = useAuthCtx();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const route = user.role === UserRole.Admin ? AppRoute.Setup : user.role === UserRole.Kitchen ? AppRoute.Kitchen : AppRoute.Cashier;
      navigate(route, { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (data: LoginFormValues) => {
    setSubmitting(true);
    setError('');
    const err = await login(data.email, data.password);
    if (err) {
      setError(err);
      setSubmitting(false);
    }
  };

  return { error, submitting, handleLogin };
}
