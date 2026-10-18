# Plataforma Partners Campus EAFIT

Una plataforma para **conocer, vivir y construir Partners**: identidad, Junta, comités, macroeventos, calendario, Ruta del nuevo Partner, vida interna, oportunidades, memoria, contacto y un área privada para miembros.

| Pieza | Herramienta | Costo |
| --- | --- | --- |
| Sitio web | [Astro](https://astro.build) (sitio estático, rápido y accesible) | Gratis |
| Publicación | [Netlify](https://netlify.com) | Gratis |
| Edición de contenido sin programar | [Decap CMS](https://decapcms.org) en `/admin` | Gratis |
| Formularios (contacto, ideas, encuestas) | Netlify Forms | Gratis hasta 100 envíos/mes |
| Área privada (login, biblioteca, directorio, participación) | [Supabase](https://supabase.com) | Gratis |

---

## 1. Trabajar en Visual Studio Code

Requisitos: [Node.js 22+](https://nodejs.org), [Git](https://git-scm.com) y VS Code.

```bash
git clone https://github.com/ipardot/plataforma-partners.git
cd plataforma-partners
npm install
npm run dev
```

Abre <http://localhost:4321>. Al abrir la carpeta, VS Code te sugerirá instalar las extensiones recomendadas (Astro, Prettier, YAML).

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor local con recarga automática |
| `npm run build` | Genera el sitio final en `dist/` |
| `npm run preview` | Sirve la versión construida |
| `npm run cms` | Permite usar el CMS en local: con `npm run dev` abierto, entra a `http://localhost:4321/admin/index.html` |

## 2. Dónde está cada cosa

```
src/
  content/           ← contenido editable desde el CMS (Markdown)
    junta/           ← un archivo por cargo de la Junta
    comites/         ← un archivo por comité
    eventos/         ← macroeventos y otras actividades
    agenda/          ← actividades del calendario
    oportunidades/   ← convocatorias
  data/              ← datos generales (JSON): sitio, FAQ, canales, documentos, capítulos, memoria
  pages/             ← una página por ruta (/conoce, /junta, /calendario…)
    miembros/        ← área privada (Supabase)
    en/              ← contenido en inglés
  components/ layouts/ styles/ lib/
public/
  marca/             ← logos, isotipo y stickers del Manual de marca 2026
  uploads/           ← fotos que se suben desde el CMS
  documentos/        ← documentos públicos (Estatutos)
  admin/             ← configuración del CMS
supabase/schema.sql  ← base de datos y permisos del área privada
```

Los textos marcados como **`[PENDIENTE: …]`** o **`[EJEMPLO]`** aparecen resaltados en amarillo al trabajar en local (`npm run dev`): son los que la Junta debe completar o reemplazar.

## 3. Publicar en Netlify (una sola vez)

1. Entra a [app.netlify.com](https://app.netlify.com) con la cuenta institucional del grupo → **Add new site → Import an existing project → GitHub** → elige `plataforma-partners`.
2. Netlify detecta la configuración de `netlify.toml`. Pulsa **Deploy**.
3. En **Site configuration → Environment variables** agrega `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY` (paso 5) y vuelve a desplegar.
4. En **Forms** activa la detección de formularios. Configura en **Forms → Notifications** el correo `partnerscampus@eafit.edu.co` para recibir los envíos.
5. Cambia el nombre del sitio o conecta un dominio propio y actualiza `site` en `astro.config.mjs` y `site_url` en `public/admin/config.yml`.

## 4. Activar el CMS para la Junta

El CMS guarda cada cambio como un commit en GitHub; Netlify publica la nueva versión en 1–2 minutos.

1. En GitHub: **Settings → Developer settings → OAuth Apps → New OAuth App**
   - Homepage URL: la URL del sitio en Netlify
   - Authorization callback URL: `https://api.netlify.com/auth/done`
2. Copia el *Client ID* y genera un *Client secret*.
3. En Netlify: **Site configuration → Access & security → OAuth → Install provider → GitHub** y pega ambos valores.
4. Cada integrante de la Junta que vaya a editar necesita una cuenta de GitHub y ser agregado como colaborador del repositorio (**Settings → Collaborators**).
5. Entran a `https://<sitio>/admin/` → **Login with GitHub**.

## 5. Activar el área privada (Supabase)

1. Crea un proyecto en [supabase.com](https://supabase.com) con la cuenta institucional del grupo (región: São Paulo o US East).
2. **SQL Editor → New query**: pega todo el contenido de `supabase/schema.sql` y ejecútalo.
3. En la misma consola, crea el primer administrador (cambia el correo):
   ```sql
   insert into public.miembros (email, nombre, rol, cargo)
   values ('correo@eafit.edu.co', 'Nombre Apellido', 'admin', 'Presidencia');
   ```
4. **Authentication → URL Configuration**: en *Site URL* pon la URL del sitio y agrégala también en *Redirect URLs* (más `http://localhost:4321/**` para pruebas).
5. **Project Settings → API**: copia *Project URL* y *anon public key* a Netlify (paso 3.3) y a un archivo `.env` local (usa `.env.example` como guía).
6. Desde `/miembros/admin` la Junta agrega a los demás miembros. Solo los correos activos de esa lista pueden ver la biblioteca, el directorio y su participación.

> La *anon key* es pública por diseño. La protección real está en las políticas RLS del archivo `schema.sql`: sin un correo autorizado, la base de datos no devuelve nada. **Nunca** pongas la *service_role key* en el sitio ni en el repositorio.

## 6. Qué es público y qué es privado

- **Público (en el repositorio y en la web):** todo lo que está en `src/` y `public/`, incluidos los Estatutos 2026.
- **Privado (solo en Supabase):** Reglamento Interno, tabla de permanencia, manual de marca descargable, actas, formatos, directorio de miembros y enlaces de grupos internos.
- El repositorio es **público**: no subas datos personales, teléfonos, enlaces de WhatsApp ni documentos internos a `src/` o `public/`.

## 7. Entrega entre Juntas

Antes de terminar el periodo, la Junta saliente debe:

1. Agregar a la Junta entrante como colaboradores del repositorio de GitHub y como miembros del equipo en Netlify y Supabase.
2. Cambiar los roles en `/miembros/admin` (Junta entrante → `junta`/`admin`; saliente → `miembro`).
3. Actualizar desde el CMS: Junta Directiva, directores de comités y calendario.
4. Transferir la propiedad del repositorio a una organización o cuenta institucional del grupo cuando exista (GitHub → Settings → Transfer ownership).
5. Descargar una copia de seguridad de Supabase (**Database → Backups**) y del repositorio.

## 8. Fases del brief

- **Fase 1 – Plataforma esencial:** inicio, identidad, pilares, valores, Junta, comités, macroeventos, Ruta del nuevo Partner, calendario, documentos oficiales y FAQ. ✅
- **Fase 2 – Herramientas para miembros:** biblioteca interna, formularios, inscripciones (enlaces en calendario y oportunidades), archivo histórico, oportunidades, reconocimientos y recursos por comité. ✅
- **Fase 3 – Integración y crecimiento:** directorio de capítulos, oportunidades internacionales, seguimiento de participación, herramientas de gestión interna y contenidos en inglés (`/en`). ✅

Antes de publicar, valida los permisos para usar la identidad de Partners of the Americas y los elementos institucionales de EAFIT.
