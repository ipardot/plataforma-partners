import { obtenerSesion, supabase, esc, type Sesion } from './supabase';

type Ok = Extract<Sesion, { estado: 'ok' }>;

/**
 * Protege una página del área privada: muestra el mensaje adecuado en #gate
 * y devuelve la sesión solo si el usuario es un miembro autorizado.
 * La seguridad real está en las políticas RLS de Supabase (supabase/schema.sql).
 */
export async function proteger(opts: { junta?: boolean } = {}): Promise<Ok | null> {
  const gate = document.getElementById('gate')!;
  const app = document.getElementById('app')!;
  const s = await obtenerSesion();
  const volver = encodeURIComponent(location.pathname);

  const mostrar = (html: string) => {
    gate.innerHTML = `<div class="tarjeta aviso-gate">${html}</div>`;
    gate.hidden = false;
    app.hidden = true;
  };

  if (s.estado === 'sin-config') {
    mostrar(
      '<h2>Área privada en configuración</h2><p>Falta conectar Supabase (variables <code>PUBLIC_SUPABASE_URL</code> y <code>PUBLIC_SUPABASE_ANON_KEY</code>). Revisa el README del repositorio.</p>',
    );
    return null;
  }
  if (s.estado === 'anonimo') {
    mostrar(`<h2>Ingresa para continuar</h2><p>Este contenido es solo para integrantes de Partners.</p><a class="btn btn--primario" href="/miembros?volver=${volver}">Ingresar</a>`);
    return null;
  }
  if (s.estado === 'no-autorizado') {
    mostrar(
      `<h2>Tu correo aún no está autorizado</h2><p>Ingresaste como <strong>${esc(s.user.email)}</strong>, pero no aparece en la lista de miembros activos. Pídele a Gestión Humana o a la Junta que te agregue.</p><button class="btn btn--borde" data-salir>Cerrar sesión</button>`,
    );
    return null;
  }
  if (opts.junta && !s.esJunta) {
    mostrar('<h2>Solo para la Junta Directiva</h2><p>Esta sección es para los integrantes autorizados de la Junta.</p><a class="btn btn--primario" href="/miembros">Volver al área privada</a>');
    return null;
  }
  gate.hidden = true;
  app.hidden = false;
  document.querySelectorAll<HTMLElement>('[data-solo-junta]').forEach((el) => (el.hidden = !s.esJunta));
  return s;
}

document.addEventListener('click', async (e) => {
  if ((e.target as Element).closest('[data-salir]')) {
    await supabase?.auth.signOut();
    location.href = '/miembros';
  }
});
