import api from './api';

export interface LoginResponse {
  access_token: string;
  usuario: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    cedula: string;
    roles: string[];
  };
}

export const authService = {
  async login(identificador: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', {
      identificador,
      password,
    });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  getUsuario() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  },

  getRoles(): string[] {
    const usuario = this.getUsuario();
    return usuario?.roles ?? [];
  },

  tieneRol(rol: string): boolean {
    return this.getRoles().includes(rol);
  },

  async recuperar(email: string) {
    const response = await api.post('/auth/recuperar', { email });
    return response.data;
  },
};