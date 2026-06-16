import { useState, useEffect, useCallback } from 'react';
import type { Usuario, CrearUsuarioData } from '../../../services/usuarios.service';
import { usuariosService } from '../../../services/usuarios.service';

const ROLES_DISPONIBLES = [
  'admin',
  'coordinador',
  'docente',
  'estudiante',
  'trabajador',
  'encargado_piso',
];

const FORM_INICIAL: CrearUsuarioData = {
  cedula: '',
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  celular1: '',
  celular2: '',
  roles: [],
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [form, setForm] = useState<CrearUsuarioData>(FORM_INICIAL);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [confirmEliminar, setConfirmEliminar] = useState<Usuario | null>(null);

  const cargarUsuarios = useCallback(async () => {
  setLoading(true);
  try {
    const data = await usuariosService.listar();
    setUsuarios(data);
  } finally {
    setLoading(false);
  }
}, []);


 useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  void cargarUsuarios();
}, [cargarUsuarios]);

  const abrirCrear = () => {
    setEditando(null);
    setForm(FORM_INICIAL);
    setError('');
    setModalAbierto(true);
  };

  const abrirEditar = (usuario: Usuario) => {
    setEditando(usuario);
    setForm({
      cedula: usuario.cedula,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      password: '',
      celular1: usuario.celular1 ?? '',
      celular2: usuario.celular2 ?? '',
      roles: usuario.roles,
    });
    setError('');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditando(null);
    setForm(FORM_INICIAL);
    setError('');
  };

  const toggleRol = (rol: string) => {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles?.includes(rol)
        ? prev.roles.filter((r) => r !== rol)
        : [...(prev.roles ?? []), rol],
    }));
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      if (editando) {
        const data: Partial<CrearUsuarioData> = { ...form };
        if (!data.password) delete data.password;
        await usuariosService.actualizar(editando.id, data);
      } else {
        await usuariosService.crear(form);
      }
      await cargarUsuarios();
      cerrarModal();
    } catch (err: unknown) {
      const mensaje =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Error al guardar usuario';
      setError(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (usuario: Usuario) => {
    try {
      await usuariosService.eliminar(usuario.id);
      await cargarUsuarios();
      setConfirmEliminar(null);
    } catch {
      setError('Error al eliminar usuario');
    }
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.cedula.includes(busqueda) ||
      (u.username ?? '').toLowerCase().includes(busqueda.toLowerCase()),
  );

  const colorRol: Record<string, string> = {
    super_admin: 'bg-red-100 text-red-700',
    admin: 'bg-purple-100 text-purple-700',
    coordinador: 'bg-blue-100 text-blue-700',
    docente: 'bg-green-100 text-green-700',
    estudiante: 'bg-yellow-100 text-yellow-700',
    trabajador: 'bg-orange-100 text-orange-700',
    encargado_piso: 'bg-teal-100 text-teal-700',
  };

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <p className="text-gray-500 text-sm mt-1">{usuarios.length} usuarios registrados</p>
        </div>
        <button
          onClick={abrirCrear}
          className="bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo usuario
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, cédula, email o usuario..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full sm:w-96 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400">Cargando usuarios...</div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No se encontraron usuarios</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Usuario</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Cédula</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Username</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Email</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Celular</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Roles</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {usuariosFiltrados.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">
                          {u.nombre.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{u.nombre} {u.apellido}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.cedula}</td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">{u.username}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 text-gray-600">{u.celular1 ?? '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((rol) => (
                          <span
                            key={rol}
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorRol[rol] ?? 'bg-gray-100 text-gray-600'}`}
                          >
                            {rol}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirEditar(u)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setConfirmEliminar(u)}
                          className="text-red-500 hover:text-red-700 p-1 rounded"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal crear/editar */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">
                {editando ? 'Editar usuario' : 'Nuevo usuario'}
              </h2>
            </div>
            <form onSubmit={handleGuardar} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre(s)</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Harold Nicolás"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido(s)</label>
                  <input
                    type="text"
                    value={form.apellido}
                    onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Vinueza Sánchez"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cédula</label>
                <input
                  type="text"
                  value={form.cedula}
                  onChange={(e) => setForm({ ...form, cedula: e.target.value })}
                  required
                  maxLength={10}
                  disabled={!!editando}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                  placeholder="1207933357"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="correo@uteq.edu.ec"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña{' '}
                  {editando && (
                    <span className="text-gray-400 font-normal">(dejar vacío para no cambiar)</span>
                  )}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editando}
                  minLength={8}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Celular 1</label>
                  <input
                    type="text"
                    value={form.celular1}
                    onChange={(e) => setForm({ ...form, celular1: e.target.value })}
                    maxLength={10}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0993784365"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Celular 2</label>
                  <input
                    type="text"
                    value={form.celular2}
                    onChange={(e) => setForm({ ...form, celular2: e.target.value })}
                    maxLength={10}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Opcional"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
                <div className="flex flex-wrap gap-2">
                  {ROLES_DISPONIBLES.map((rol) => (
                    <button
                      key={rol}
                      type="button"
                      onClick={() => toggleRol(rol)}
                      className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                        form.roles?.includes(rol)
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {rol}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="flex-1 bg-green-600 text-white py-2 rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50"
                >
                  {guardando ? 'Guardando...' : editando ? 'Actualizar' : 'Crear usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal confirmar eliminar */}
      {confirmEliminar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-2">¿Eliminar usuario?</h2>
            <p className="text-gray-500 text-sm mb-6">
              ¿Estás seguro de desactivar a{' '}
              <strong>{confirmEliminar.nombre} {confirmEliminar.apellido}</strong>? Esta acción se puede revertir.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmEliminar(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => void handleEliminar(confirmEliminar)}
                className="flex-1 bg-red-500 text-white py-2 rounded-xl font-medium hover:bg-red-600 transition"
              >
                Desactivar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
