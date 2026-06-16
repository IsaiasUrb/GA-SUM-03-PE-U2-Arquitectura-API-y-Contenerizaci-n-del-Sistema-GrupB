import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../store/auth.store';

const imagenes = [
  'https://images.unsplash.com/photo-1562774053-701939374585?w=1600',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1600',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600',
  'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=1600',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600',
];

type Vista = 'login' | 'recuperar' | 'confirmacion';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagenActual, setImagenActual] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [vista, setVista] = useState<Vista>('login');
  const [emailRecuperar, setEmailRecuperar] = useState('');
  const [mensajeRecuperar, setMensajeRecuperar] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setImagenActual((prev) => (prev + 1) % imagenes.length);
        setFadeIn(true);
      }, 800);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authService.login(identificador, password);
      setAuth(data.usuario, data.access_token);
      const rol = data.usuario.roles[0];
      if (rol === 'super_admin') navigate('/superadmin');
      else if (rol === 'admin') navigate('/admin');
      else if (rol === 'coordinador') navigate('/coordinador');
      else if (rol === 'docente') navigate('/docente');
      else if (rol === 'estudiante') navigate('/estudiante');
      else if (rol === 'trabajador') navigate('/trabajador');
      else if (rol === 'encargado_piso') navigate('/encargado');
      else navigate('/');
    } catch {
      setError('Credenciales incorrectas. Verifica tus datos e intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecuperar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.recuperar(emailRecuperar);
      setVista('confirmacion');
    } catch {
      setMensajeRecuperar('No existe una cuenta con ese correo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-green-50">

      {/* Panel izquierdo — carrusel */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <img
          src={imagenes[imagenActual]}
          alt="Laboratorio"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: fadeIn ? 1 : 0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/75 to-green-800/30" />
        <div className="relative z-10 p-10 flex flex-col justify-between h-full w-full">
          <div>
            <h1 className="text-white text-4xl font-bold leading-tight">
              Sistema de Control
            </h1>
            <p className="text-green-200 text-xl mt-2">
              Laboratorio Informático
            </p>
          </div>
          <div>
            <p className="text-white/80 text-base mb-5">
              Gestión integral de laboratorios, equipos y reservas
            </p>
            <div className="flex gap-2">
              {imagenes.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setImagenActual(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                    i === imagenActual ? 'w-10 bg-white' : 'w-3 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="w-full lg:w-2/5 flex items-center justify-center bg-green-50 px-6 py-10">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4 shadow-sm">
              <svg className="w-9 h-9 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {vista === 'login' && 'Inicio de sesión'}
              {vista === 'recuperar' && 'Recuperar contraseña'}
              {vista === 'confirmacion' && '¡Correo enviado!'}
            </h2>
            <p className="text-green-700 text-sm mt-1 font-medium">
              Laboratorios de Computación
            </p>
          </div>

          {/* LOGIN */}
          {vista === 'login' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Identificación
                </label>
                <input
                  type="text"
                  value={identificador}
                  onChange={(e) => setIdentificador(e.target.value)}
                  required
                  placeholder="Usuario, correo o cédula"
                  className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-800 placeholder-gray-400"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Ej: jperezg · correo@uteq.edu.ec · 0912345678
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={mostrarPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-800 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600"
                  >
                    {mostrarPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setVista('recuperar'); setError(''); }}
                  className="text-sm text-green-600 hover:text-green-800 font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 active:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Ingresando...
                  </span>
                ) : 'Iniciar sesión'}
              </button>
            </form>
          )}

          {/* RECUPERAR */}
          {vista === 'recuperar' && (
            <form onSubmit={handleRecuperar} className="space-y-5">
              <p className="text-gray-500 text-sm text-center">
                Ingresa tu correo institucional y te enviaremos las instrucciones para restablecer tu contraseña.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={emailRecuperar}
                  onChange={(e) => setEmailRecuperar(e.target.value)}
                  required
                  placeholder="correo@uteq.edu.ec"
                  className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-800"
                />
              </div>
              {mensajeRecuperar && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-red-600 text-sm text-center">{mensajeRecuperar}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 shadow-sm"
              >
                {loading ? 'Enviando...' : 'Enviar instrucciones'}
              </button>
              <button
                type="button"
                onClick={() => { setVista('login'); setMensajeRecuperar(''); }}
                className="w-full text-gray-500 text-sm hover:text-gray-700 text-center py-1"
              >
                ← Volver al inicio de sesión
              </button>
            </form>
          )}

          {/* CONFIRMACIÓN */}
          {vista === 'confirmacion' && (
            <div className="text-center space-y-5">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-600 text-sm">
                Si el correo <strong>{emailRecuperar}</strong> está registrado, recibirás las instrucciones en breve.
              </p>
              <button
                onClick={() => { setVista('login'); setEmailRecuperar(''); }}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-sm"
              >
                Volver al inicio de sesión
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}