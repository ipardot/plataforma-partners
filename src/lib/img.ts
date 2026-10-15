// Optimiza fotos con el CDN de imágenes de Netlify: redimensiona y entrega
// AVIF/WebP según el navegador. En desarrollo usa el archivo original.
// https://docs.netlify.com/image-cdn/overview/

const enNetlify = import.meta.env.PROD;

export function cdn(src: string, ancho: number, calidad = 72): string {
  if (!enNetlify || !src || !src.startsWith('/')) return src;
  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${ancho}&q=${calidad}`;
}

export function srcset(src: string, anchos: number[] = [480, 800, 1200, 1600]): string | undefined {
  if (!enNetlify || !src || !src.startsWith('/')) return undefined;
  return anchos.map((w) => `${cdn(src, w)} ${w}w`).join(', ');
}

/** Para fondos CSS (background-image), que no admiten srcset. */
export const fondo = (src: string, ancho = 900) => `background-image:url(${cdn(src, ancho)})`;
