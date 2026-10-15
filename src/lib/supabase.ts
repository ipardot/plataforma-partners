import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;

/** null mientras no se configuren las variables de entorno (ver README). */
export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;

export type Perfil = {
  email: string;
  nombre: string;
  rol: 'miembro' | 'junta' | 'admin';
  comite: string | null;
  estado: string;
  telefono: string | null;
  cargo: string | null;
  activo: boolean;
};

export type Sesion =
  | { estado: 'sin-config' }
  | { estado: 'anonimo' }
  | { estado: 'no-autorizado'; user: User }
  | { estado: 'ok'; user: User; perfil: Perfil; esJunta: boolean };

export async function obtenerSesion(): Promise<Sesion> {
  if (!supabase) return { estado: 'sin-config' };
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user) return { estado: 'anonimo' };
  const { data: perfil } = await supabase
    .from('miembros')
    .select('*')
    .eq('email', (user.email ?? '').toLowerCase())
    .maybeSingle<Perfil>();
  if (!perfil || !perfil.activo) return { estado: 'no-autorizado', user };
  return { estado: 'ok', user, perfil, esJunta: perfil.rol !== 'miembro' };
}

export const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
