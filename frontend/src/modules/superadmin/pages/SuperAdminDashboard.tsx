import { useAuthStore } from '../../../store/auth.store';

const tarjetas = [
  { label: 'Usuarios registrados', valor: 0, color: 'bg-blue-500' },
  { label: 'Laboratorios activos', valor: 0, color: 'bg-green-500' },
  { label: 'Equipos registrados', valor: 0, color: 'bg-purple-500' },
  { label: 'Reservas hoy', valor: 0, color: 'bg-amber-500' },
  { label: 'Incidencias abiertas', valor: 0, color: 'bg-red-500' },
  { label: 'Pisos registrados', valor: 0, color: 'bg-teal-500' },
];

export default function SuperAdminDashboard() {
  const { usuario } = useAuthStore();

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Bienvenido, {usuario?.nombre} {usuario?.apellido}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Panel de control — Sistema de Control de Laboratorio Informático
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {tarjetas.map((t) => (
          <div key={t.label} className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
            <div className={`${t.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
              <span className="text-white text-xl font-bold">{t.valor}</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">{t.label}</p>
              <p className="text-gray-800 font-semibold text-lg">{t.valor}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Accesos rápidos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Nuevo usuario', color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { label: 'Nuevo laboratorio', color: 'bg-green-50 text-green-700 border-green-200' },
            { label: 'Registrar equipo', color: 'bg-purple-50 text-purple-700 border-purple-200' },
            { label: 'Ver reportes', color: 'bg-amber-50 text-amber-700 border-amber-200' },
          ].map((a) => (
            <button
              key={a.label}
              className={`${a.color} border rounded-xl py-4 px-3 text-sm font-medium hover:shadow-md transition text-center`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Info del sistema */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Estado del sistema</h2>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-600 text-sm font-medium">Sistema operativo</span>
        </div>
        <p className="text-gray-400 text-xs mt-2">
          Todos los servicios funcionando correctamente
        </p>
      </div>
    </div>
  );
}