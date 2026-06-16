import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface Props {
  menuItems: MenuItem[];
  titulo: string;
  colorActivo: string;
  colorHover: string;
  colorBorde: string;
  colorFondo: string;
  colorTexto: string;
  colorSubtexto: string;
  colorAvatar: string;
}

export default function RoleLayout({
  menuItems,
  titulo,
  colorActivo,
  colorHover,
  colorBorde,
  colorFondo,
  colorTexto,
  colorSubtexto,
  colorAvatar,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside
        className={`h-screen ${colorFondo} text-white flex flex-col transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        } fixed top-0 left-0 z-40`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-4 border-b ${colorBorde}`}>
          {!collapsed && (
            <div>
              <p className={`${colorTexto} font-bold text-lg`}>SCLI</p>
              <p className={`${colorSubtexto} text-xs`}>{titulo}</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`${colorSubtexto} hover:text-white p-1 rounded transition-colors`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={collapsed ? 'M13 5l7 7-7 7M5 5l7 7-7 7' : 'M11 19l-7-7 7-7m8 14l-7-7 7-7'} />
            </svg>
          </button>
        </div>

        {/* Usuario */}
        {!collapsed && (
          <div className={`px-4 py-3 border-b ${colorBorde}`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 ${colorAvatar} rounded-full flex items-center justify-center text-sm font-bold shrink-0`}>
                {usuario?.nombre.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate text-white">
                  {usuario?.nombre} {usuario?.apellido}
                </p>
                <p className={`text-xs ${colorTexto}`}>{titulo}</p>
              </div>
            </div>
          </div>
        )}

        {/* Menú */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {menuItems.map((item) => {
            const activo = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  activo
                    ? `${colorActivo} text-white font-medium`
                    : `${colorSubtexto} ${colorHover} hover:text-white`
                }`}
                title={collapsed ? item.label : ''}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Cerrar sesión */}
        <div className={`border-t ${colorBorde} p-4`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 ${colorSubtexto} hover:text-red-400 transition-colors text-sm`}
            title={collapsed ? 'Cerrar sesión' : ''}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          collapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
