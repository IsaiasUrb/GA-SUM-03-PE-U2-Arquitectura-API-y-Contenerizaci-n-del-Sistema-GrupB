import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

interface Props {
  children: React.ReactNode;
  roles?: string[];
}

export default function PrivateRoute({ children, roles }: Props) {
  const { isAuthenticated, usuario } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.some((r) => usuario?.roles.includes(r))) {
    return <Navigate to="/sin-permiso" replace />;
  }

  return <>{children}</>;
}