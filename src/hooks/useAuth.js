import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectIfUserIsLoggedIn } from '../features/auth/authSlice';

export const useAuth = () => {
  const user = useSelector(selectIfUserIsLoggedIn);

  return useMemo(() => user, [user]);
};
