import api from './api';

export interface Usuario {
  id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  celular1?: string;
  celular2?: string;
  activo: boolean;
  created_at: string;
  roles: string[];
}

export interface CrearUsuarioData {
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  celular1?: string;
  celular2?: string;
  roles?: string[];
}

export const usuariosService = {
  async listar(): Promise<Usuario[]> {
    const response = await api.get<Usuario[]>('/usuarios');
    return response.data;
  },

  async buscarPorId(id: string): Promise<Usuario> {
    const response = await api.get<Usuario>(`/usuarios/${id}`);
    return response.data;
  },

  async crear(data: CrearUsuarioData): Promise<Usuario> {
    const response = await api.post<Usuario>('/usuarios', data);
    return response.data;
  },

  async actualizar(id: string, data: Partial<CrearUsuarioData>): Promise<Usuario> {
    const response = await api.put<Usuario>(`/usuarios/${id}`, data);
    return response.data;
  },

  async eliminar(id: string): Promise<{ mensaje: string }> {
    const response = await api.delete<{ mensaje: string }>(`/usuarios/${id}`);
    return response.data;
  },

  async listarRoles(): Promise<{ id: string; nombre: string }[]> {
    const response = await api.get('/usuarios/roles');
    return response.data;
  },
};
