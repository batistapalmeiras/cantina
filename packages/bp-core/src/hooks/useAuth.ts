// React
import { useCallback, useContext, useEffect,useState } from 'react';
// Components
import { AuthContext, AuthContextValue } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export async function fetchProfile(userId: string): Promise<User | null> {
  const { data } = await supabase
    .from('profiles')
    .select('id, name, role')
    .eq('id', userId);

  if (!data || data.length === 0) return null;
  return { id: data[0].id, name: data[0].name, role: data[0].role };
}

export function useAuth(): AuthContextValue {
  const [user, setUser] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        const profile = await fetchProfile(data.session.user.id);
        setUser(profile);
        setUserEmail(data.session.user.email ?? '');
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setUser(profile);
        setUserEmail(session.user.email ?? '');
      } else {
        setUser(null);
        setUserEmail('');
      }
    });

    const refreshInterval = setInterval(async () => {
      const { error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Erro ao renovar token:', error);
        setUser(null);
        setUserEmail('');
      }
    }, 15 * 60 * 1000);

    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        const { error } = await supabase.auth.refreshSession();
        if (error) {
          setUser(null);
          setUserEmail('');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(refreshInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      listener?.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return 'E-mail ou senha incorretos.';
    return null;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserEmail('');
  }, []);

  const updateProfile = useCallback(async (name: string, email: string): Promise<string | null> => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return 'Usuário não autenticado.';

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ name: name.trim() })
      .eq('id', authUser.id);
    if (profileError) return 'Erro ao atualizar nome.';

    if (email !== userEmail) {
      const { error: emailError } = await supabase.auth.updateUser({ email });
      if (emailError) return 'Erro ao atualizar e-mail.';
    }

    setUser((u) => u ? { ...u, name: name.trim() } : u);
    return null;
  }, [userEmail]);

  return { user, userEmail, loading, login, logout, updateProfile };
}

export function useAuthCtx() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
