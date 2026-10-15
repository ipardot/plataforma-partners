import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Las colecciones se editan desde el CMS (/admin). Cada campo aquí
// debe coincidir con public/admin/config.yml.

export const COMITES = ['internacional', 'social', 'logistica', 'mercadeo', 'rrpp', 'gh', 'junta', 'general'] as const;

const junta = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/junta' }),
  schema: z.object({
    nombre: z.string(),
    cargo: z.string(),
    comite: z.enum(COMITES).optional(),
    foto: z.string().optional(),
    correo: z.string().optional(),
    resumen: z.string(),
    trabajaCon: z.array(z.string()).default([]),
    orden: z.number().default(99),
  }),
});

const comites = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/comites' }),
  schema: z.object({
    nombre: z.string(),
    sigla: z.string().optional(),
    proposito: z.string(),
    icono: z.string().default('/marca/sticker-1.png'),
    color: z.enum(['confianza', 'inspiracion', 'salmon', 'rojo']).default('confianza'),
    director: z.string().optional(),
    funciones: z.array(z.string()).default([]),
    responsabilidades: z.array(z.string()).default([]),
    eventos: z.array(z.string()).default([]),
    habilidades: z.array(z.string()).default([]),
    relaciones: z.string().optional(),
    canales: z.string().optional(),
    ingreso: z.string().optional(),
    orden: z.number().default(99),
  }),
});

const eventos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/eventos' }),
  schema: z.object({
    nombre: z.string(),
    sigla: z.string().optional(),
    tipo: z.enum(['macroevento', 'actividad']).default('actividad'),
    resumen: z.string(),
    portada: z.string().optional(),
    pilar: z.string().optional(),
    organiza: z.string().optional(),
    dirigidoA: z.string().optional(),
    comoParticipar: z.string().optional(),
    galeria: z
      .array(z.object({ imagen: z.string(), pie: z.string().optional() }))
      .default([]),
    ediciones: z
      .array(z.object({ anio: z.number(), tema: z.string(), resultado: z.string().optional() }))
      .default([]),
    orden: z.number().default(99),
  }),
});

const agenda = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/agenda' }),
  schema: z.object({
    titulo: z.string(),
    inicio: z.coerce.date(),
    fin: z.coerce.date().optional(),
    lugar: z.string().optional(),
    modalidad: z.enum(['presencial', 'virtual', 'hibrida']).default('presencial'),
    comite: z.enum(COMITES).default('general'),
    tipo: z.enum(['asamblea', 'comite', 'macroevento', 'voluntariado', 'integracion', 'formacion', 'convocatoria', 'red-internacional']),
    participacion: z.enum(['obligatoria', 'opcional', 'equipos']).default('opcional'),
    inscripcion: z.string().optional(),
  }),
});

const oportunidades = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/oportunidades' }),
  schema: z.object({
    titulo: z.string(),
    categoria: z.enum(['comites', 'assessment', 'liderazgo', 'formacion', 'voluntariado', 'internacional', 'travel-grant', 'capitulos', 'reconocimiento']),
    quien: z.string(),
    requisitos: z.array(z.string()).default([]),
    abre: z.coerce.date().optional(),
    cierra: z.coerce.date().optional(),
    enlace: z.string().optional(),
    activa: z.boolean().default(true),
  }),
});

export const collections = { junta, comites, eventos, agenda, oportunidades };
