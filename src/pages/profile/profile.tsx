import { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { ProfileUI } from '@ui-pages';
import { Preloader } from '@ui';
import {
  getUser,
  selectUser,
  selectUserLoading,
  selectUserError,
  updateUserProfile,
  resetError
} from '../../services/slices/userSlice';

interface ProfileFormState {
  name: string;
  email: string;
  password: string;
}

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  const [formValue, setFormValue] = useState<ProfileFormState>({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });
  const [isFormChanged, setIsFormChanged] = useState(false);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  useEffect(() => {
    const hasChanges =
      formValue.name !== user?.name ||
      formValue.email !== user?.email ||
      formValue.password !== '';
    setIsFormChanged(hasChanges);
  }, [formValue, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormChanged || !formValue.name || !formValue.email) return;

    try {
      dispatch(resetError());

      await dispatch(
        updateUserProfile({
          name: formValue.name,
          email: formValue.email,
          ...(formValue.password && { password: formValue.password })
        })
      ).unwrap();

      setFormValue((prev) => ({ ...prev, password: '' }));
      setIsFormChanged(false);
    } catch (error) {}
  };

  const handleCancel = () => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
    setIsFormChanged(false);
    dispatch(resetError());
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
    />
  );
};
