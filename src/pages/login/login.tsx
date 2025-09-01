import { FC, useEffect } from 'react';
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
import { useForm } from '../../components/hooks/useForm';

export const Login: FC = () => {
  const { values, handleChange } = useForm({
    email: '',
    password: ''
  });

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
    if (!values.email || !values.password) return;

    try {
      const result = await dispatch(
        loginUser({ email: values.email, password: values.password })
      ).unwrap();

      if (result) {
        navigate('/');
      }
    } catch (err) {}
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      email={values.email}
      setEmail={(value) =>
        handleChange({ target: { name: 'email', value } } as any)
      }
      password={values.password}
      setPassword={(value) =>
        handleChange({ target: { name: 'password', value } } as any)
      }
      handleSubmit={handleSubmit}
      errorText={error || ''}
    />
  );
};
