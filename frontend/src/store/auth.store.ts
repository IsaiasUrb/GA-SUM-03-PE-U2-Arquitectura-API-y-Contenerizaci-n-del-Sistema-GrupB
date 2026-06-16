import { create } from 'zustand';

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  roles: string[];
}

interface AuthStore {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (usuario: Usuario, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  usuario: null,
  token: null,
  isAuthenticated: false,

  setAuth: (usuario, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    set({ usuario, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    set({ usuario: null, token: null, isAuthenticated: false });
  },
}));

export const inicializarAuth = () => {
  const token = localStorage.getItem('token');
  const usuarioStr = localStorage.getItem('usuario');
  if (token && usuarioStr) {
    const usuario = JSON.parse(usuarioStr) as AuthStore['usuario'];
    useAuthStore.setState({ usuario, token, isAuthenticated: true });
  }
};