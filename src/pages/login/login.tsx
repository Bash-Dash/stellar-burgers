import { FC, useState, useEffect } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  loginUser,
  selectUser,
  selectLoginRequest,
  selectUserError
} from '../../services/slices/userSlice';
import { Preloader } from '../../components/ui/preloader';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(selectUser);
  const loading = useSelector(selectLoginRequest);
  const error = useSelector(selectUserError);

  useEffect(() => {
    if (user) {
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) return;

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      console.log('Login successful:', result);

      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      errorText={error || ''}
    />
  );
};
