import yt from './yt.json';

export type CatId = 'urbano' | 'salsa' | 'merengue' | 'bachata' | 'dj';

export type Category = {
  id: CatId;
  name: string;
  short: string;
  color: string;
  ink: string;
  desc: string;
  img: string;
  family: 'Urbano' | 'Tropical' | 'DJs';
};

export const CATEGORIES: Category[] = [
  { id: 'urbano', name: 'Urbano', short: 'Reggaetón · Trap', color: '#5B1AF5', ink: '#fff', family: 'Urbano', img: '/img/a/myke-towers.webp', desc: 'Reggaetón, trap y dembow para encender cualquier tarima.' },
  { id: 'salsa', name: 'Salsa', short: 'Salsa · Orquesta', color: '#FF4B3E', ink: '#fff', family: 'Tropical', img: '/img/a/gilberto-santa-rosa.webp', desc: 'Soneros y orquestas que llenan la pista de principio a fin.' },
  { id: 'merengue', name: 'Merengue', short: 'Merengue · Típico', color: '#FFB21E', ink: '#0B131E', family: 'Tropical', img: '/img/a/olga-tanon.webp', desc: 'Los clásicos que todo el mundo baila, en vivo y con banda.' },
  { id: 'bachata', name: 'Bachata', short: 'Bachata · Romántica', color: '#FF3D9A', ink: '#fff', family: 'Tropical', img: '/img/a/romeo-santos.webp', desc: 'Romance y sabor para bodas, galas y noches especiales.' },
  { id: 'dj', name: 'DJs', short: 'Open format · Hora loca', color: '#3FA0EF', ink: '#0B131E', family: 'DJs', img: '/img/a/dj-1.webp', desc: 'DJs residentes Buquea con equipo, luces y lectura de pista.' },
];

export const catById = (id: CatId) => CATEGORIES.find((c) => c.id === id)!;

export type ShowFormat = { name: string; duration: string; desc: string };

export const FORMATS: Record<CatId, ShowFormat[]> = {
  urbano: [
    { name: 'Show en vivo', duration: '45–60 min', desc: 'Presentación completa con DJ oficial, hype man y sus éxitos.' },
    { name: 'Showcase club', duration: '20–30 min', desc: 'Entrada explosiva para discotecas y after parties.' },
    { name: 'Show + Meet & Greet', duration: '60 min + 30', desc: 'Presentación y sesión de fotos con invitados o clientes VIP.' },
  ],
  salsa: [
    { name: 'Show con orquesta', duration: '75–90 min', desc: 'Orquesta completa en vivo: metales, percusión y coros.' },
    { name: 'Show con pista', duration: '45–60 min', desc: 'Formato ligero para eventos corporativos y espacios pequeños.' },
    { name: 'Concierto / Festival', duration: '90–120 min', desc: 'Repertorio extendido para tarimas grandes y municipios.' },
  ],
  merengue: [
    { name: 'Show con banda', duration: '75–90 min', desc: 'Banda completa, bailarines y todos los clásicos.' },
    { name: 'Show con pista', duration: '45 min', desc: 'Ideal para bodas, galas y eventos privados.' },
    { name: 'Concierto / Festival', duration: '90–120 min', desc: 'Formato de gran tarima para fiestas patronales.' },
  ],
  bachata: [
    { name: 'Show con banda', duration: '60–90 min', desc: 'Guitarras, güira y bongó en vivo para un show íntimo o masivo.' },
    { name: 'Serenata / Acústico', duration: '20–30 min', desc: 'Momento especial para bodas, aniversarios y galas.' },
    { name: 'Concierto / Festival', duration: '90–120 min', desc: 'Repertorio completo para grandes tarimas.' },
  ],
  dj: [
    { name: 'Open format', duration: '4–6 horas', desc: 'Urbano, tropical, pop y clásicos leyendo la pista en todo momento.' },
    { name: 'Hora loca', duration: '45–60 min', desc: 'Pico de energía con animación, props y efectos.' },
    { name: 'DJ + MC', duration: '4–6 horas', desc: 'Conducción del evento, protocolo y anuncios incluidos.' },
  ],
};

export const RIDER: Record<CatId, string[]> = {
  urbano: ['Tarima mínima 24×16 pies', 'Sonido line array + monitores', 'Camerino privado con hospitalidad', 'Transporte terrestre y seguridad'],
  salsa: ['Tarima para orquesta (12–14 músicos)', 'Backline: congas, timbal, piano', 'Sonido line array + 8 monitores', 'Camerino y hospitalidad para el grupo'],
  merengue: ['Tarima para banda y bailarines', 'Backline: tambora, güira, teclado', 'Sonido line array + monitores', 'Camerino y hospitalidad para el grupo'],
  bachata: ['Tarima para banda (6–8 músicos)', 'Backline: guitarras, bongó, bajo', 'Sonido line array + monitores', 'Camerino privado con hospitalidad'],
  dj: ['Espacio de cabina 8×4 pies', 'Toma eléctrica dedicada 110V', 'Equipo de sonido incluido (hasta 300 personas)', 'Montaje 2 horas antes'],
};

export type Artist = {
  slug: string;
  name: string;
  cat: CatId;
  origin: string;
  tagline: string;
  bio: string;
  hits: string[];
  tier: 1 | 2 | 3 | 4;
  eventTypes: string[];
  img: string;
  cut?: string;
  extra?: string[];
  featured?: boolean;
  video?: string;
};

const A = (a: Omit<Artist, 'img' | 'video'> & { img?: string }): Artist => ({
  ...a,
  img: a.img ?? `/img/a/${a.slug}.webp`,
  video: (yt as Record<string, string>)[a.slug],
});

export const ARTISTS: Artist[] = [
  // URBANO
  A({ slug: 'arcangel', name: 'Arcángel', cat: 'urbano', origin: 'Puerto Rico', tagline: 'La Maravilla', bio: 'Uno de los pilares del género urbano. Su voz y su estilo marcaron generaciones; un show que conecta desde el primer verso.', hits: ['Me Prefieres a Mí', 'Hace Mucho Tiempo', 'La Jumpa', 'Tú No Vive Así'], tier: 4, eventTypes: ['Festival', 'Discoteca', 'Privado'], cut: '/img/cut/arcangel.webp', featured: true }),
  A({ slug: 'myke-towers', name: 'Myke Towers', cat: 'urbano', origin: 'Puerto Rico', tagline: 'Young Kingz', bio: 'Rapero y cantante de flow inconfundible. Sus canciones dominan las plataformas y las discotecas de toda Latinoamérica.', hits: ['Diosa', 'Bandido', 'Lala', 'Experimento'], tier: 4, eventTypes: ['Festival', 'Discoteca', 'Corporativo'], cut: '/img/cut/myke-towers.webp', featured: true }),
  A({ slug: 'rauw-alejandro', name: 'Rauw Alejandro', cat: 'urbano', origin: 'Puerto Rico', tagline: 'El Zorro', bio: 'Cantante, bailarín y showman. Mezcla reggaetón, R&B y pop con una producción de show de primer nivel.', hits: ['Todo de Ti', 'Desesperados', 'Baby Hello', 'Te Felicito'], tier: 4, eventTypes: ['Festival', 'Concierto'] }),
  A({ slug: 'farruko', name: 'Farruko', cat: 'urbano', origin: 'Puerto Rico', tagline: 'El Talento del Bloque', bio: 'Energía pura en tarima. Sus himnos convierten cualquier evento en una fiesta masiva.', hits: ['Pepas', 'Calma (Remix)', '6 AM', 'Chillax'], tier: 4, eventTypes: ['Festival', 'Discoteca', 'Privado'], cut: '/img/cut/farruko.webp', featured: true }),
  A({ slug: 'de-la-ghetto', name: 'De La Ghetto', cat: 'urbano', origin: 'Puerto Rico', tagline: 'Mr. Romántico', bio: 'Pionero del reggaetón romántico con una carrera llena de colaboraciones históricas.', hits: ['Sensación del Bloque', 'Caliente', 'Acércate'], tier: 3, eventTypes: ['Discoteca', 'Privado', 'Festival'], cut: '/img/cut/de-la-ghetto.webp' }),
  A({ slug: 'ivy-queen', name: 'Ivy Queen', cat: 'urbano', origin: 'Puerto Rico', tagline: 'La Caballota', bio: 'La Reina del Reggaetón. Un show icónico, lleno de actitud y de los clásicos que todos cantan.', hits: ['Yo Quiero Bailar', 'Te He Querido, Te He Llorado', 'La Vida Es Así', 'Quiero Saber'], tier: 3, eventTypes: ['Festival', 'Corporativo', 'Privado'], cut: '/img/cut/ivy-queen.webp' }),
  // SALSA
  A({ slug: 'marc-anthony', name: 'Marc Anthony', cat: 'salsa', origin: 'Nueva York / PR', tagline: 'El Rey de la Salsa', bio: 'La voz más reconocida de la salsa en el mundo. Una producción de concierto inolvidable.', hits: ['Vivir Mi Vida', 'Valió la Pena', 'Tu Amor Me Hace Bien', 'Flor Pálida'], tier: 4, eventTypes: ['Concierto', 'Festival'], cut: '/img/cut/marc-anthony.webp', featured: true }),
  A({ slug: 'gilberto-santa-rosa', name: 'Gilberto Santa Rosa', cat: 'salsa', origin: 'Puerto Rico', tagline: 'El Caballero de la Salsa', bio: 'Elegancia, sabor y una orquesta impecable. Perfecto para galas, aniversarios y grandes celebraciones.', hits: ['Conciencia', 'Que Alguien Me Diga', 'Perdóname'], tier: 3, eventTypes: ['Corporativo', 'Boda', 'Festival'] }),
  A({ slug: 'victor-manuelle', name: 'Víctor Manuelle', cat: 'salsa', origin: 'Puerto Rico', tagline: 'El Sonero de la Juventud', bio: 'Sonero de raza con un repertorio lleno de éxitos para cantar y bailar toda la noche.', hits: ['Tengo Ganas', 'He Tratado', 'Si Tú Me Besas', 'Ella lo que quiere es salsa'], tier: 3, eventTypes: ['Festival', 'Corporativo', 'Privado'] }),
  A({ slug: 'jerry-rivera', name: 'Jerry Rivera', cat: 'salsa', origin: 'Puerto Rico', tagline: 'El Bebé de la Salsa', bio: 'Salsa romántica de oro. Sus éxitos son parte del soundtrack de varias generaciones.', hits: ['Cuenta Conmigo', 'Amores Como el Nuestro', 'Casi un Hechizo'], tier: 3, eventTypes: ['Boda', 'Corporativo', 'Festival'], extra: ['/img/a/jerry-rivera-2.webp'], featured: true }),
  A({ slug: 'tito-nieves', name: 'Tito Nieves', cat: 'salsa', origin: 'Puerto Rico', tagline: 'El Pavarotti de la Salsa', bio: 'Una voz potente y un show que hace bailar a todos. Clásicos garantizados.', hits: ['Fabricando Fantasías', 'I Like It Like That', 'Le Gusta Que La Vean'], tier: 2, eventTypes: ['Privado', 'Corporativo', 'Festival'] }),
  // MERENGUE
  A({ slug: 'elvis-crespo', name: 'Elvis Crespo', cat: 'merengue', origin: 'Puerto Rico', tagline: 'Suavemente', bio: 'El merenguero que puso al mundo a bailar con "Suavemente". Fiesta asegurada para cualquier público.', hits: ['Suavemente', 'Tu Sonrisa', 'Píntame', 'Linda Eh'], tier: 3, eventTypes: ['Festival', 'Boda', 'Corporativo'], featured: true }),
  A({ slug: 'olga-tanon', name: 'Olga Tañón', cat: 'merengue', origin: 'Puerto Rico', tagline: 'La Mujer de Fuego', bio: 'La Reina del Merengue. Energía, voz y una conexión total con el público.', hits: ['Es Mentiroso', 'Muchacho Malo', 'Así Es la Vida'], tier: 3, eventTypes: ['Festival', 'Concierto', 'Corporativo'], cut: '/img/cut/olga-tanon.webp', featured: true }),
  A({ slug: 'grupo-mania', name: 'Grupo Manía', cat: 'merengue', origin: 'Puerto Rico', tagline: 'Merengue urbano', bio: 'El grupo que revolucionó el merengue con coreografías y un sonido moderno.', hits: ['Linda Eh', 'Me Miras y Te Miro'], tier: 2, eventTypes: ['Festival', 'Boda', 'Privado'] }),
  A({ slug: 'proyecto-uno', name: 'Proyecto Uno', cat: 'merengue', origin: 'Nueva York / RD', tagline: 'Merengue house', bio: 'Pioneros del merengue house y el hip hop latino. Los himnos que nunca fallan en la pista.', hits: ['El Tiburón', 'Latinos', 'Está Pegao'], tier: 2, eventTypes: ['Festival', 'Discoteca', 'Corporativo'] }),
  A({ slug: 'sergio-vargas', name: 'Sergio Vargas', cat: 'merengue', origin: 'República Dominicana', tagline: 'El Negrito de Villa', bio: 'Leyenda del merengue con décadas de éxitos y una tarima llena de sabor.', hits: ['La Quiero a Morir', 'La Ventanita'], tier: 2, eventTypes: ['Festival', 'Privado'], cut: '/img/cut/sergio-vargas.webp' }),
  // BACHATA
  A({ slug: 'romeo-santos', name: 'Romeo Santos', cat: 'bachata', origin: 'Nueva York / RD', tagline: 'El Rey de la Bachata', bio: 'El artista que llevó la bachata a los estadios. Una producción de concierto de clase mundial.', hits: ['Propuesta Indecente', 'Eres Mía', 'Promise', 'Imitadora'], tier: 4, eventTypes: ['Concierto', 'Festival'], cut: '/img/cut/romeo-santos.webp', featured: true }),
  A({ slug: 'prince-royce', name: 'Prince Royce', cat: 'bachata', origin: 'Nueva York / RD', tagline: 'Bachata moderna', bio: 'Bachata con aire pop y una voz que enamora. Ideal para eventos de alto perfil.', hits: ['Stand By Me', 'Darte un Beso', 'Corazón Sin Cara', 'Las Cosas Pequeñas'], tier: 4, eventTypes: ['Concierto', 'Boda', 'Festival'], cut: '/img/cut/prince-royce.webp' }),
  A({ slug: 'frank-reyes', name: 'Frank Reyes', cat: 'bachata', origin: 'República Dominicana', tagline: 'El Príncipe de la Bachata', bio: 'Bachata tradicional con un repertorio enorme de éxitos que todos cantan.', hits: ['Quién Eres Tú', 'Princesa', 'Nada de Nada'], tier: 2, eventTypes: ['Privado', 'Festival', 'Boda'], cut: '/img/cut/frank-reyes.webp' }),
  A({ slug: 'raulin-rodriguez', name: 'Raulín Rodríguez', cat: 'bachata', origin: 'República Dominicana', tagline: 'El Cacique de la Bachata', bio: 'Uno de los grandes de la bachata clásica, con un show auténtico y bailable.', hits: ['Medicina de Amor', 'Nereyda', 'La Loca'], tier: 2, eventTypes: ['Privado', 'Festival'] }),
  A({ slug: 'zacarias-ferreira', name: 'Zacarías Ferreira', cat: 'bachata', origin: 'República Dominicana', tagline: 'El Sentimiento de la Bachata', bio: 'Bachata romántica con sentimiento. Perfecto para bodas y noches de gala.', hits: ['La Asesina', 'El Triste'], tier: 2, eventTypes: ['Boda', 'Privado'] }),
  // DJs (residentes Buquea, ficticios)
  A({ slug: 'dj-kairo', name: 'DJ Kairo', cat: 'dj', origin: 'San Juan, PR', tagline: 'Open format · Urbano', bio: 'Residente Buquea. Domina la transición del reggaetón al tropical sin perder la pista ni un segundo.', hits: ['Sets urbanos', 'Hora loca', 'Remixes tropicales'], tier: 1, eventTypes: ['Discoteca', 'Privado', 'Corporativo'], img: '/img/a/dj-4.webp', extra: ['/img/a/dj-3.webp'], featured: true }),
  A({ slug: 'dj-nova', name: 'DJ Nova', cat: 'dj', origin: 'Bayamón, PR', tagline: 'House · Pop · Latin', bio: 'Residente Buquea. Sets elegantes para eventos corporativos, lanzamientos y cócteles.', hits: ['Sets de cóctel', 'Latin house', 'Pop en español'], tier: 1, eventTypes: ['Corporativo', 'Privado'], img: '/img/a/dj-2.webp' }),
  A({ slug: 'dj-blaze', name: 'DJ Blaze', cat: 'dj', origin: 'Carolina, PR', tagline: 'Reggaetón old school', bio: 'Residente Buquea. El rey del perreo clásico y los mixes que hacen gritar a la pista.', hits: ['Perreo old school', 'Dembow', 'Clásicos 2000s'], tier: 1, eventTypes: ['Discoteca', 'Privado', 'Festival'], img: '/img/a/dj-1.webp', cut: '/img/cut/dj-1.webp' }),
  A({ slug: 'dj-luna', name: 'DJ Luna', cat: 'dj', origin: 'Ponce, PR', tagline: 'Bodas · Galas', bio: 'Residente Buquea. Especialista en bodas y quinceañeros: protocolo, momentos clave y pista llena.', hits: ['Sets de boda', 'Salsa y merengue', 'Hora loca'], tier: 1, eventTypes: ['Boda', 'Privado'], img: '/img/a/dj-6.webp', extra: ['/img/a/dj-7.webp'] }),
  A({ slug: 'dj-marte', name: 'DJ Marte', cat: 'dj', origin: 'Caguas, PR', tagline: 'Festival · EDM latino', bio: 'Residente Buquea. Energía de festival, drops y visuales para tarimas grandes.', hits: ['Festival sets', 'EDM latino', 'Remixes urbanos'], tier: 1, eventTypes: ['Festival', 'Discoteca'], img: '/img/a/dj-5.webp' }),
];

export const bySlug = (s: string) => ARTISTS.find((a) => a.slug === s);
export const byCat = (c: CatId) => ARTISTS.filter((a) => a.cat === c);

export const TIER_LABEL: Record<Artist['tier'], string> = {
  1: 'Accesible',
  2: 'Medio',
  3: 'Premium',
  4: 'Estelar',
};

export const EVENT_TYPES = ['Corporativo', 'Boda', 'Festival', 'Discoteca', 'Privado', 'Concierto'];

export const ytThumb = (id: string, q: 'hq' | 'maxres' = 'hq') => `https://i.ytimg.com/vi/${id}/${q}default.jpg`;
