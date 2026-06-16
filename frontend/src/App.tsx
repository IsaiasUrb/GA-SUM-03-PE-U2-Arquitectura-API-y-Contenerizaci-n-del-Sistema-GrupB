import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { inicializarAuth } from './store/auth.store';
import LoginPage from './modules/auth/LoginPage';
import PrivateRoute from './shared/PrivateRoute';

import SuperAdminLayout from './modules/superadmin/SuperAdminLayout';
import SuperAdminDashboard from './modules/superadmin/pages/SuperAdminDashboard';
import UsuariosPage from './modules/superadmin/pages/UsuariosPage';

import AdminLayout from './modules/admin/AdminLayout';
import AdminDashboard from './modules/admin/pages/AdminDashboard';

import DocenteLayout from './modules/docente/DocenteLayout';
import DocenteDashboard from './modules/docente/pages/DocenteDashboard';

import CoordinadorLayout from './modules/coordinador/CoordinadorLayout';
import CoordinadorDashboard from './modules/coordinador/pages/CoordinadorDashboard';

import EstudianteLayout from './modules/estudiante/EstudianteLayout';
import EstudianteDashboard from './modules/estudiante/pages/EstudianteDashboard';

import TrabajadorLayout from './modules/trabajador/TrabajadorLayout';
import TrabajadorDashboard from './modules/trabajador/pages/TrabajadorDashboard';

import EncargadoLayout from './modules/encargado/EncargadoLayout';
import EncargadoDashboard from './modules/encargado/pages/EncargadoDashboard';

export default function App() {
  useEffect(() => {
    inicializarAuth();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Super Admin */}
        <Route path="/superadmin" element={
          <PrivateRoute roles={['super_admin']}>
            <SuperAdminLayout />
          </PrivateRoute>
        }>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="roles" element={<div className="p-6"><h1 className="text-2xl font-bold">Gestión de Roles</h1></div>} />
          <Route path="pisos" element={<div className="p-6"><h1 className="text-2xl font-bold">Gestión de Pisos</h1></div>} />
          <Route path="laboratorios" element={<div className="p-6"><h1 className="text-2xl font-bold">Gestión de Laboratorios</h1></div>} />
          <Route path="equipos" element={<div className="p-6"><h1 className="text-2xl font-bold">Gestión de Equipos</h1></div>} />
          <Route path="reservas" element={<div className="p-6"><h1 className="text-2xl font-bold">Gestión de Reservas</h1></div>} />
          <Route path="reportes" element={<div className="p-6"><h1 className="text-2xl font-bold">Reportes</h1></div>} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={
          <PrivateRoute roles={['admin', 'super_admin']}>
            <AdminLayout />
          </PrivateRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="laboratorios" element={<div className="p-6"><h1 className="text-2xl font-bold">Laboratorios</h1></div>} />
          <Route path="reservas" element={<div className="p-6"><h1 className="text-2xl font-bold">Reservas</h1></div>} />
          <Route path="reportes" element={<div className="p-6"><h1 className="text-2xl font-bold">Reportes</h1></div>} />
        </Route>

        {/* Coordinador */}
        <Route path="/coordinador" element={
          <PrivateRoute roles={['coordinador', 'super_admin']}>
            <CoordinadorLayout />
          </PrivateRoute>
        }>
          <Route index element={<CoordinadorDashboard />} />
          <Route path="laboratorios" element={<div className="p-6"><h1 className="text-2xl font-bold">Laboratorios</h1></div>} />
          <Route path="horarios" element={<div className="p-6"><h1 className="text-2xl font-bold">Horarios</h1></div>} />
          <Route path="reportes" element={<div className="p-6"><h1 className="text-2xl font-bold">Reportes</h1></div>} />
        </Route>

        {/* Docente */}
        <Route path="/docente" element={
          <PrivateRoute roles={['docente', 'super_admin']}>
            <DocenteLayout />
          </PrivateRoute>
        }>
          <Route index element={<DocenteDashboard />} />
          <Route path="horarios" element={<div className="p-6"><h1 className="text-2xl font-bold">Mis Horarios</h1></div>} />
          <Route path="reservas" element={<div className="p-6"><h1 className="text-2xl font-bold">Reservas</h1></div>} />
          <Route path="incidencias" element={<div className="p-6"><h1 className="text-2xl font-bold">Reportar Incidencia</h1></div>} />
        </Route>

        {/* Estudiante */}
        <Route path="/estudiante" element={
          <PrivateRoute roles={['estudiante', 'super_admin']}>
            <EstudianteLayout />
          </PrivateRoute>
        }>
          <Route index element={<EstudianteDashboard />} />
          <Route path="reservas" element={<div className="p-6"><h1 className="text-2xl font-bold">Reservar Laboratorio</h1></div>} />
          <Route path="historial" element={<div className="p-6"><h1 className="text-2xl font-bold">Mi Historial</h1></div>} />
        </Route>

        {/* Trabajador */}
        <Route path="/trabajador" element={
          <PrivateRoute roles={['trabajador', 'super_admin']}>
            <TrabajadorLayout />
          </PrivateRoute>
        }>
          <Route index element={<TrabajadorDashboard />} />
          <Route path="incidencias" element={<div className="p-6"><h1 className="text-2xl font-bold">Incidencias</h1></div>} />
          <Route path="equipos" element={<div className="p-6"><h1 className="text-2xl font-bold">Equipos</h1></div>} />
        </Route>

        {/* Encargado de piso */}
        <Route path="/encargado" element={
          <PrivateRoute roles={['encargado_piso', 'super_admin']}>
            <EncargadoLayout />
          </PrivateRoute>
        }>
          <Route index element={<EncargadoDashboard />} />
          <Route path="piso" element={<div className="p-6"><h1 className="text-2xl font-bold">Mi Piso</h1></div>} />
          <Route path="laboratorios" element={<div className="p-6"><h1 className="text-2xl font-bold">Laboratorios</h1></div>} />
          <Route path="incidencias" element={<div className="p-6"><h1 className="text-2xl font-bold">Incidencias</h1></div>} />
        </Route>

        <Route path="/sin-permiso" element={
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-red-500 text-xl">Sin permisos para acceder</p>
          </div>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}