import { useAuthStore } from '../../../store/auth.store';

export default function EncargadoDashboard() {
  const { usuario } = useAuthStore();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Bienvenido, {usuario?.nombre} {usuario?.apellido}
        </h1>
        <p className="text-gray-500 text-sm mt-1">Panel de Encargado de Piso</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Laboratorios a cargo', valor: 0, color: 'bg-teal-500' },
          { label: 'Ocupados ahora', valor: 0, color: 'bg-red-500' },
          { label: 'Disponibles', valor: 0, color: 'bg-green-500' },
        ].map((t) => (
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

      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Estado de laboratorios</h2>
        <p className="text-gray-400 text-sm">No hay laboratorios asignados a tu piso.</p>
      </div>
    </div>
  );
}