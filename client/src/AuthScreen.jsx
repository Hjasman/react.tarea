import { useState } from 'react';
import { ArrowRight, Layers3, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { api } from './api.js';
import { useAuth } from './AuthContext.jsx';

export default function AuthScreen() {
  const { signIn } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isRegister = mode === 'register';

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await api.register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      }
      await signIn({ email: form.email.trim(), password: form.password });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-art" aria-label="Taskflow">
        <div className="auth-art-top">
          <a className="brand brand-light" href="#inicio">
            <span className="brand-mark"><Layers3 size={20} strokeWidth={2.2} /></span>
            <span>taskflow</span>
          </a>
          <span className="art-edition">WORKSPACE / 01</span>
        </div>
        <div className="auth-art-copy">
          <p className="eyebrow eyebrow-light">ORDENA EL TRABAJO</p>
          <h1>El siguiente paso,<br />siempre claro.</h1>
          <p className="art-description">Proyectos en marcha, tareas bajo control y espacio para hacer buen trabajo.</p>
        </div>
        <div className="art-bottom">
          <div className="art-progress"><span /></div>
          <div className="art-caption"><span>PLANIFICA</span><span>AVANZA</span><span>TERMINA</span></div>
          <div className="art-index"><span>01</span><span className="index-line" /><span>03</span></div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-panel-top"><span>ESPACIO PERSONAL</span><span>01 — 02</span></div>
        <div className="auth-form-wrap">
          <div className="auth-heading">
            <span className="auth-icon"><LockKeyhole size={18} /></span>
            <p className="eyebrow">{isRegister ? 'NUEVO ESPACIO' : 'QUÉ BUENO VERTE'}</p>
            <h2>{isRegister ? 'Crea tu cuenta' : 'Inicia sesión'}</h2>
            <p>{isRegister ? 'Empieza a organizar el trabajo de tu equipo.' : 'Entra para continuar donde lo dejaste.'}</p>
          </div>
          <form className="auth-form" onSubmit={submit}>
            {isRegister && (
              <label className="field">
                <span>Nombre</span>
                <span className="input-wrap"><UserRound size={17} /><input name="name" autoComplete="name" value={form.name} onChange={update} placeholder="Tu nombre" required /></span>
              </label>
            )}
            <label className="field">
              <span>Correo electrónico</span>
              <span className="input-wrap"><Mail size={17} /><input name="email" type="email" autoComplete="email" value={form.email} onChange={update} placeholder="nombre@correo.com" required /></span>
            </label>
            <label className="field">
              <span>Contraseña</span>
              <span className="input-wrap"><LockKeyhole size={17} /><input name="password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} minLength={isRegister ? 6 : undefined} value={form.password} onChange={update} placeholder="••••••••" required /></span>
              {isRegister && <small>Mínimo 6 caracteres</small>}
            </label>
            {error && <div className="form-error" role="alert">{error}</div>}
            <button className="button button-primary auth-submit" type="submit" disabled={loading}>
              {loading ? 'Un momento…' : isRegister ? 'Crear cuenta' : 'Entrar'}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>
          <p className="auth-switch">
            {isRegister ? '¿Ya tienes cuenta?' : '¿Primera vez por aquí?'}{' '}
            <button type="button" onClick={() => { setMode(isRegister ? 'login' : 'register'); setError(''); }}>
              {isRegister ? 'Inicia sesión' : 'Crea una cuenta'}
            </button>
          </p>
        </div>
        <div className="auth-footer"><span>PROJECT TASK FLOW</span><span>HECHO PARA AVANZAR</span></div>
      </section>
    </main>
  );
}