export type NavLink = { href: string; label: string; desc?: string; icono?: string };
export type NavGroup = { label: string; links: NavLink[] };

const st = (n: number) => `/marca/sticker-${n}.webp`;

export const NAV: NavGroup[] = [
  {
    label: 'Conoce Partners',
    links: [
      { href: '/conoce', label: '¿Qué es Partners?', desc: 'Identidad, pilares y cómo funcionamos', icono: st(8) },
      { href: '/junta', label: 'Junta Directiva', desc: 'Quién es quién y a quién acudir', icono: st(3) },
      { href: '/comites', label: 'Comités', desc: 'Encuentra tu lugar', icono: st(6) },
      { href: '/capitulos', label: 'Red de capítulos', desc: 'Partners of the Americas', icono: st(4) },
    ],
  },
  {
    label: 'Eventos',
    links: [
      { href: '/eventos', label: 'Eventos y actividades', desc: 'LANI, VPUD y más', icono: st(7) },
      { href: '/calendario', label: 'Calendario', desc: 'Todo el año, mes a mes', icono: st(4) },
      { href: '/memoria', label: 'Galería y memoria', desc: 'Fotos, cifras y reconocimientos', icono: st(2) },
    ],
  },
  {
    label: 'Para miembros',
    links: [
      { href: '/vida-interna', label: 'Vida interna', desc: 'Documentos, permanencia y preguntas', icono: st(1) },
      { href: '/oportunidades', label: 'Oportunidades', desc: 'Roles de liderazgo y programas', icono: st(5) },
      { href: '/miembros', label: 'Área privada', desc: 'Biblioteca, directorio y participación', icono: st(3) },
    ],
  },
];

export const COMITE_LABEL: Record<string, string> = {
  internacional: 'Internacional',
  social: 'Social',
  logistica: 'Logística',
  mercadeo: 'Mercadeo',
  rrpp: 'RRPP',
  gh: 'Gestión Humana',
  junta: 'Junta Directiva',
  general: 'Todo el grupo',
};

export const TIPO_LABEL: Record<string, string> = {
  asamblea: 'Asamblea',
  comite: 'Reunión de comité',
  macroevento: 'Macroevento',
  evento: 'Evento',
  voluntariado: 'Voluntariado',
  integracion: 'Integración',
  formacion: 'Formación',
  convocatoria: 'Convocatoria / fecha límite',
  'red-internacional': 'Red internacional',
};

export const PARTICIPACION_LABEL: Record<string, string> = {
  obligatoria: 'Obligatoria',
  opcional: 'Opcional',
  equipos: 'Solo equipos asignados',
};

export const CATEGORIA_OPORTUNIDAD: Record<string, string> = {
  liderazgo: 'Liderazgo',
  internacional: 'Internacional',
  'partners-americas': 'Partners of the Americas',
};

const fmt = new Intl.DateTimeFormat('es-CO', {
  timeZone: 'America/Bogota',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const fmtHora = new Intl.DateTimeFormat('es-CO', {
  timeZone: 'America/Bogota',
  hour: 'numeric',
  minute: '2-digit',
});

export const fecha = (d: Date) => fmt.format(d);
export const hora = (d: Date) => fmtHora.format(d);
