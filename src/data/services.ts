export type Service = {
  id: string;
  name: string;
  group: 'Música' | 'Barra' | 'Producción' | 'Experiencias';
  desc: string;
  includes: string[];
  img: string;
  icon: IconName;
};

export type IconName = 'disc' | 'mic' | 'glass' | 'floor' | 'stage' | 'light' | 'speaker' | 'screen' | 'camera' | 'spark' | 'clip';

export const SERVICES: Service[] = [
  { id: 'dj', name: 'DJ + sonido', group: 'Música', icon: 'disc', img: '/img/s/svc-sound.webp', desc: 'DJ residente con equipo de sonido, micrófono y lectura de pista.', includes: ['4–6 horas', 'Sonido hasta 300 pax', 'Micrófono inalámbrico'] },
  { id: 'mc', name: 'MC / Animador', group: 'Música', icon: 'mic', img: '/img/s/svc-singer.webp', desc: 'Conducción, protocolo, dinámicas y anuncios durante el evento.', includes: ['Guion del evento', 'Dinámicas', 'Protocolo'] },
  { id: 'bartender', name: 'Bartender & mixología', group: 'Barra', icon: 'glass', img: '/img/s/svc-bartender.webp', desc: 'Barra móvil con bartenders certificados y menú de cócteles a la medida.', includes: ['Barra móvil iluminada', 'Bartenders', 'Menú de cócteles'] },
  { id: 'pista', name: 'Pista LED', group: 'Producción', icon: 'floor', img: '/img/s/svc-ledfloor.webp', desc: 'Pista de baile iluminada con colores programables y efectos.', includes: ['Desde 12×12 pies', 'Colores programables', 'Montaje incluido'] },
  { id: 'tarima', name: 'Tarima', group: 'Producción', icon: 'stage', img: '/img/s/svc-stage2.webp', desc: 'Tarimas modulares con faldón y escaleras para artistas y orquestas.', includes: ['Desde 16×12 pies', 'Faldón y escaleras', 'Techo (opcional)'] },
  { id: 'luces', name: 'Iluminación', group: 'Producción', icon: 'light', img: '/img/s/svc-stage.webp', desc: 'Cabezas móviles, wash, láser y humo para crear ambiente de show.', includes: ['Cabezas móviles', 'Truss', 'Operador de luces'] },
  { id: 'sonido', name: 'Sonido line array', group: 'Producción', icon: 'speaker', img: '/img/s/svc-crowd.webp', desc: 'Sonido profesional para conciertos, festivales y eventos masivos.', includes: ['Line array', 'Monitores', 'Ingeniero de sonido'] },
  { id: 'pantalla', name: 'Pantalla LED', group: 'Producción', icon: 'screen', img: '/img/s/svc-rays.webp', desc: 'Pantallas LED para visuales, marcas y transmisión en vivo.', includes: ['Módulos P3.9', 'Visuales', 'Operador'] },
  { id: 'booth', name: 'Photo booth 360', group: 'Experiencias', icon: 'camera', img: '/img/s/svc-confetti.webp', desc: 'Cabina 360 con videos al instante para compartir en redes.', includes: ['Videos 360', 'Props', 'Galería digital'] },
  { id: 'horaloca', name: 'Hora loca', group: 'Experiencias', icon: 'spark', img: '/img/s/svc-club.webp', desc: 'Show de animación con personajes, zanqueros, props y CO₂.', includes: ['Animadores', 'Props y pelucas', 'Cañones de CO₂'] },
  { id: 'produccion', name: 'Producción del evento', group: 'Experiencias', icon: 'clip', img: '/img/s/svc-champagne.webp', desc: 'Coordinación completa: logística, horarios, proveedores y día del evento.', includes: ['Coordinador', 'Run of show', 'Logística de artistas'] },
];

export const svcById = (id: string) => SERVICES.find((s) => s.id === id);

export type Pack = { id: string; name: string; tag: string; desc: string; items: string[]; color: string };

export const PACKS: Pack[] = [
  { id: 'esencial', name: 'Fiesta Esencial', tag: 'Privados · Hasta 150 pax', desc: 'Lo básico para una fiesta que nadie olvida.', items: ['dj', 'luces', 'pista'], color: '#3FA0EF' },
  { id: 'corporativo', name: 'Corporativo Pro', tag: 'Empresas · Galas', desc: 'Imagen, protocolo y entretenimiento de primera.', items: ['dj', 'mc', 'bartender', 'pantalla', 'luces'], color: '#5B1AF5' },
  { id: 'festival', name: 'Festival Full', tag: 'Municipios · Promotores', desc: 'Producción completa para tarimas grandes y artistas estelares.', items: ['tarima', 'sonido', 'luces', 'pantalla', 'produccion'], color: '#FF3D9A' },
];

export const packById = (id: string) => PACKS.find((p) => p.id === id);
