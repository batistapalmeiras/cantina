// React
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Libs
import { Client, useClient } from 'bp-core';
// Components
import { AppRoute } from '../../../routes/paths';

export function useIdentify() {
  const { client, findClientByPhone, loginWithClient, loginClient } = useClient();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<'phone' | 'name'>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [checking, setChecking] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (client) navigate(AppRoute.Reservation, { replace: true });
  }, [client, navigate]);

  const handleCheckPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setChecking(true);
    try {
      const found: Client | null = await findClientByPhone(phone);
      if (found) {
        loginWithClient(found);
      } else {
        setPhase('name');
      }
    } finally {
      setChecking(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setRegistering(true);
    try {
      await loginClient(name.trim(), phone);
    } finally {
      setRegistering(false);
    }
  };

  const handleBack = () => setPhase('phone');

  return {
    phase,
    phone,
    setPhone,
    name,
    setName,
    checking,
    registering,
    handleCheckPhone,
    handleRegister,
    handleBack,
  };
}
