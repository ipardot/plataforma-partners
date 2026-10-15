export type NavLink = { href: string; label: string; desc?: string };
export type NavGroup = { label: string; links: NavLink[] };

export const NAV: NavGroup[] = [
  {
    label: 'Conoce Partners',
    links: [
      { href: '/conoce', label: '¿Qué es Partners?', desc: 'Identidad, pilares, valores e historia' },
      { href: '/junta', label: 'Junta Directiva', desc: 'Quién es quién y a quién acudir' },
      { href: '/comites', label: 'Comités', desc: 'Encuentra tu lugar' },
      { href: '/capitulos', label: 'Red de capítulos', desc: 'Partners of the Americas' },
    ],
  },
  {
    label: 'Eventos',
    links: [
      { href: '/eventos', label: 'Macroeventos y actividades', desc: 'LANI, VPUD, Hono y más' },
      { href: '/calendario', label: 'Calendario', desc: 'Agenda de todo el grupo' },
      { href: '/memoria', label: 'Memoria e impacto', desc: 'Galerías, cifras y reconocimientos' },
    ],
  },
  {
    label: 'Para miembros',
    links: [
      { href: '/ruta', label: 'Ruta del nuevo Partner', desc: 'Tus primeras semanas, paso a paso' },
      { href: '/vida-interna', label: 'Vida interna', desc: 'Documentos, permanencia, asambleas y FAQ' },
      { href: '/oportunidades', label: 'Oportunidades', desc: 'Convocatorias, liderazgo y red' },
      { href: '/miembros', label: 'Área privada', desc: 'Biblioteca, directorio y participación' },
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
  comites: 'Ingreso a comités',
  assessment: 'Selección y Assessment',
  liderazgo: 'Liderazgo',
  formacion: 'Formación',
  voluntariado: 'Voluntariado',
  internacional: 'Internacional',
  'travel-grant': 'Travel Grants',
  capitulos: 'Red de capítulos',
  reconocimiento: 'Reconocimientos',
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
