# Buquéalo by JP Events — Demo

Plataforma de booking de artistas y entretenimiento para empresas, promotores y eventos en Puerto Rico.

## Incluye
- Home con hero animado por género, catálogo por categorías, "Arma tu evento" interactivo, proceso de booking, FAQ.
- Catálogo `/artistas` con filtros (género, tipo de evento, nivel, fecha libre, búsqueda).
- Perfil `/artistas/:slug`: fotos, éxitos, video, formatos de show, rider técnico y calendario de disponibilidad.
- Servicios `/servicios`: DJ, bartender, pista LED, tarima, luces, sonido, pantallas, photo booth, hora loca y paquetes.
- Cotización `/cotizar` en 3 pasos que envía la solicitud por WhatsApp o email.

## Stack
React 19 + TypeScript + Vite, Framer Motion, Lenis, React Router.

```bash
npm install
npm run dev
npm run build
```

## Notas de la demo
- Artistas, éxitos y precios por nivel son **datos de ejemplo** en `src/data/artists.ts`; los DJs son ficticios.
- Fotos con licencia libre (Wikimedia Commons / Openverse); créditos en el footer ("Créditos de imágenes") y en `src/data/credits.json`.
- La disponibilidad es simulada (`src/data/availability.ts`) hasta conectar un backend o calendario.
- Contacto de WhatsApp/email en `src/lib/quote.tsx`.

## Vercel
Importa el repo: Vite se detecta solo. `vercel.json` ya tiene las rewrites del SPA.
