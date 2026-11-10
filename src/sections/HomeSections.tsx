import { AnimatePresence, motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ArtistCard from '../components/ArtistCard';
import { Arrow, Calendar, Check, File, Music, Plus, Shield, SvcIcon } from '../components/Icons';
import { Duo, YouTube } from '../components/Media';
import Reveal from '../components/Reveal';
import { ARTISTS, byCat, CATEGORIES } from '../data/artists';
import { SERVICES } from '../data/services';
import { useIsDesktop } from '../lib/hooks';
import { EASE } from '../lib/motion';
import { useQuote } from '../lib/quote';
import yt from '../data/yt.json';

/* ---------------- marquee ---------------- */
export function Marquee({ children, speed = 50, className = '' }: { children: ReactNode; speed?: number; className?: string }) {
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300 });
  const factor = useTransform(vel, [-1500, 0, 1500], [-4, 1, 4]);
  const track = useRef<HTMLDivElement>(null);
  const dir = useRef(1);
  useAnimationFrame((_, dt) => {
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    const half = (track.current?.scrollWidth ?? 2000) / 2;
    let n = x.get() - dir.current * speed * (dt / 1000) * Math.max(1, Math.abs(f));
    if (n <= -half) n += half;
    if (n > 0) n -= half;
    x.set(n);
  });
  return (
    <div className={`marquee ${className}`}>
      <motion.div className="marquee__track" ref={track} style={{ x }}>
        <div className="marquee__group">{children}</div>
        <div className="marquee__group" aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export function NamesBand() {
  return (
    <div className="namesband" aria-hidden="true">
      <Marquee speed={45}>
        {ARTISTS.filter((a) => a.cat !== 'dj').map((a) => (
          <span key={a.slug} className="namesband__item">
            {a.name}
            <i>✦</i>
          </span>
        ))}
      </Marquee>
    </div>
  );
}

/* ---------------- genres ---------------- */
export function Genres() {
  const [open, setOpen] = useState(0);
  const desktop = useIsDesktop();
  return (
    <section className="genres">
      <header className="sec-head">
        <p className="eyebrow eyebrow--ink">( El catálogo )</p>
        <Reveal className="h-xl" lines={['Escoge', <em key="r">el ritmo.</em>]} />
        <p className="sec-lead">Urbano, tropical o DJs. Cada artista con su perfil, sus éxitos, videos y fechas disponibles.</p>
      </header>
      <div className="genres__row">
        {CATEGORIES.map((c, i) => {
          const list = byCat(c.id);
          const isOpen = desktop ? open === i : true;
          return (
            <motion.div
              key={c.id}
              className={`genre ${isOpen ? 'is-open' : ''}`}
              style={{ ['--c' as string]: c.color, ['--ci' as string]: c.ink }}
              onMouseEnter={() => setOpen(i)}
              layout
              transition={{ duration: 0.6, ease: EASE.premium }}
            >
              <Link to={`/artistas?cat=${c.id}`} className="genre__link">
                <Duo src={c.img} color={c.color} alt={c.name} className="genre__img" />
                <span className="genre__num">0{i + 1}</span>
                <span className="genre__vname">{c.name}</span>
                <div className="genre__body">
                  <span className="genre__fam">{c.family}</span>
                  <h3>{c.name}</h3>
                  <p>{c.desc}</p>
                  <span className="genre__names">{list.slice(0, 3).map((a) => a.name).join(' · ')}</span>
                  <span className="genre__go">
                    {list.length} {c.id === 'dj' ? 'DJs' : 'artistas'} <Arrow width={16} />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- featured rail ---------------- */
export function Featured() {
  const rail = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => rail.current?.scrollBy({ left: d * rail.current.clientWidth * 0.8, behavior: 'smooth' });
  return (
    <section className="featured">
      <header className="sec-head sec-head--row">
        <div>
          <p className="eyebrow">( En agenda )</p>
          <Reveal className="h-xl" lines={['Los más', <em key="b">buqueados.</em>]} />
        </div>
        <div className="featured__nav">
          <button onClick={() => scroll(-1)} aria-label="Anterior">‹</button>
          <button onClick={() => scroll(1)} aria-label="Siguiente">›</button>
        </div>
      </header>
      <div className="featured__rail" ref={rail}>
        {ARTISTS.filter((a) => a.featured).map((a, i) => (
          <motion.div key={a.slug} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease: EASE.premium }}>
            <ArtistCard a={a} size="lg" />
          </motion.div>
        ))}
        <Link to="/artistas" className="featured__all">
          <span>Ver los {ARTISTS.length} artistas</span>
          <Arrow width={28} />
        </Link>
      </div>
    </section>
  );
}

/* ---------------- event builder ---------------- */
function Stage({ on }: { on: Set<string> }) {
  const show = (id: string) => ({ initial: false, animate: on.has(id) ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }, transition: { duration: 0.5, ease: EASE.smooth } });
  const tiles = Array.from({ length: 7 * 3 });
  return (
    <svg className="stage" viewBox="0 0 800 460" role="img" aria-label="Vista previa del evento">
      <defs>
        <linearGradient id="st-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#120a3d" />
          <stop offset="1" stopColor="#0B131E" />
        </linearGradient>
        <linearGradient id="st-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="st-screen" x1="0" x2="1">
          <stop offset="0" stopColor="#5B1AF5" />
          <stop offset="0.5" stopColor="#FF3D9A" />
          <stop offset="1" stopColor="#3FA0EF" />
        </linearGradient>
      </defs>
      <rect width="800" height="460" fill="url(#st-sky)" rx="28" />
      {/* screen */}
      <motion.g {...show('pantalla')}>
        <rect x="250" y="70" width="300" height="130" rx="8" fill="url(#st-screen)" className="stage__screen" />
        <text x="400" y="148" textAnchor="middle" className="stage__screentext">BEAT THE PARTY</text>
      </motion.g>
      {/* lights */}
      <motion.g {...show('luces')}>
        <rect x="140" y="36" width="520" height="10" rx="5" fill="#2a2f45" />
        {[180, 260, 340, 460, 540, 620].map((x, k) => (
          <g key={x}>
            <polygon points={`${x - 6},46 ${x + 6},46 ${x + 70 * (k % 2 ? 1 : -1) + 40},420 ${x + 70 * (k % 2 ? 1 : -1) - 40},420`} fill="url(#st-beam)" className="stage__beam" style={{ animationDelay: `${k * 0.4}s`, transformOrigin: `${x}px 46px` }} />
            <rect x={x - 9} y="44" width="18" height="14" rx="3" fill="#cfd6ff" />
          </g>
        ))}
      </motion.g>
      {/* stage */}
      <motion.g {...show('tarima')}>
        <polygon points="190,280 610,280 660,320 140,320" fill="#1d2440" />
        <rect x="140" y="320" width="520" height="22" fill="#141a30" />
      </motion.g>
      {/* speakers */}
      <motion.g {...show('sonido')}>
        {[96, 664].map((x) => (
          <g key={x}>
            <rect x={x} y="150" width="40" height="170" rx="6" fill="#151a2c" stroke="#2c3556" />
            {[175, 215, 255, 295].map((y) => (
              <circle key={y} cx={x + 20} cy={y} r="13" fill="#0B131E" stroke="#3FA0EF" strokeOpacity="0.5" className="stage__cone" />
            ))}
          </g>
        ))}
      </motion.g>
      {/* dj booth */}
      <motion.g {...show('dj')}>
        <rect x="340" y="236" width="120" height="44" rx="6" fill="#0d1120" stroke="#5B1AF5" />
        <circle cx="372" cy="250" r="9" fill="none" stroke="#3FA0EF" className="stage__spin" />
        <circle cx="428" cy="250" r="9" fill="none" stroke="#3FA0EF" className="stage__spin" />
        <circle cx="400" cy="214" r="12" fill="#cfd6ff" />
        <rect x="388" y="224" width="24" height="14" rx="4" fill="#cfd6ff" />
      </motion.g>
      {/* mc */}
      <motion.g {...show('mc')}>
        <line x1="250" y1="230" x2="250" y2="282" stroke="#cfd6ff" strokeWidth="3" />
        <circle cx="250" cy="226" r="6" fill="#FFB21E" />
        <circle cx="236" cy="226" r="12" fill="#cfd6ff" />
        <rect x="226" y="238" width="22" height="42" rx="6" fill="#cfd6ff" />
      </motion.g>
      {/* LED floor */}
      <motion.g {...show('pista')}>
        {tiles.map((_, k) => {
          const r = Math.floor(k / 7);
          const c = k % 7;
          const y = 352 + r * 24;
          const w = 70 + r * 8;
          const x0 = 400 - (7 * w) / 2;
          return <rect key={k} x={x0 + c * w + 2} y={y} width={w - 4} height="20" rx="3" className="stage__tile" style={{ animationDelay: `${((c + r) * 0.18) % 1.6}s` }} />;
        })}
      </motion.g>
      {/* bar */}
      <motion.g {...show('bartender')}>
        <rect x="640" y="360" width="140" height="60" rx="8" fill="#1b1340" stroke="#FF3D9A" />
        {[660, 684, 708, 732, 756].map((x, k) => (
          <rect key={x} x={x} y={336 - (k % 2) * 6} width="10" height={24 + (k % 2) * 6} rx="3" fill={k % 2 ? '#3FA0EF' : '#FFB21E'} opacity="0.9" />
        ))}
      </motion.g>
      {/* photo booth */}
      <motion.g {...show('booth')}>
        <ellipse cx="70" cy="410" rx="50" ry="14" fill="none" stroke="#3FA0EF" strokeWidth="3" className="stage__ring" />
        <rect x="64" y="340" width="12" height="70" fill="#cfd6ff" />
        <rect x="52" y="330" width="36" height="16" rx="4" fill="#FF3D9A" />
      </motion.g>
      {/* confetti */}
      <motion.g {...show('horaloca')}>
        {Array.from({ length: 26 }).map((_, k) => (
          <rect key={k} x={(k * 61) % 780 + 10} y={(k * 37) % 220 + 20} width="6" height="10" fill={['#FFB21E', '#FF3D9A', '#3FA0EF', '#fff'][k % 4]} className="stage__confetti" style={{ animationDelay: `${(k % 7) * 0.3}s` }} />
        ))}
      </motion.g>
      {/* crowd */}
      <g fill="#05070d">
        {Array.from({ length: 22 }).map((_, k) => {
          const x = 20 + k * 36 + (k % 2) * 8;
          const y = 440 - (k % 3) * 6;
          return (
            <g key={k} className="stage__head" style={{ animationDelay: `${(k % 5) * 0.15}s` }}>
              <circle cx={x} cy={y - 26} r="12" />
              <rect x={x - 16} y={y - 14} width="32" height="40" rx="12" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function EventBuilder() {
  const { has, toggle } = useQuote();
  const [local, setLocal] = useState<Set<string>>(new Set(['tarima', 'luces', 'dj']));
  const active = new Set([...local, ...SERVICES.filter((s) => has('service', s.id)).map((s) => s.id)]);

  const flip = (id: string) => {
    const next = new Set(local);
    if (active.has(id)) {
      next.delete(id);
      if (has('service', id)) toggle({ kind: 'service', id });
    } else {
      next.add(id);
    }
    setLocal(next);
  };

  return (
    <section className="builder">
      <header className="sec-head">
        <p className="eyebrow">( Entretenimiento full )</p>
        <Reveal className="h-xl" lines={['Arma tu', <em key="e">evento.</em>]} />
        <p className="sec-lead">Además de artistas: DJ, barra, pista LED, tarima, luces y más. Enciende cada servicio y mira cómo se arma tu fiesta.</p>
      </header>
      <div className="builder__grid">
        <div className="builder__stage">
          <Stage on={active} />
          <span className="builder__count">{active.size} servicios encendidos</span>
        </div>
        <div className="builder__list">
          {SERVICES.map((s) => {
            const on = active.has(s.id);
            const quoted = has('service', s.id);
            return (
              <div key={s.id} className={`switch ${on ? 'is-on' : ''}`}>
                <button className="switch__main" onClick={() => flip(s.id)} aria-pressed={on}>
                  <SvcIcon name={s.icon} width={20} />
                  <span>{s.name}</span>
                  <i className="switch__toggle" />
                </button>
                <button className={`switch__add ${quoted ? 'is-on' : ''}`} onClick={() => { if (!on) flip(s.id); toggle({ kind: 'service', id: s.id }); }} aria-label={`${quoted ? 'Quitar' : 'Agregar'} ${s.name} a la cotización`}>
                  {quoted ? <Check width={16} /> : <Plus width={16} />}
                </button>
              </div>
            );
          })}
          <Link to="/servicios" className="btn btn--white btn--block">
            Ver servicios y paquetes <Arrow width={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- process ---------------- */
export const STEPS = [
  { icon: Music, t: 'Explora', d: 'Navega por género, revisa perfiles, éxitos, videos y fechas libres de cada artista.' },
  { icon: Plus, t: 'Arma tu cotización', d: 'Agrega uno o varios artistas y los servicios de entretenimiento que necesitas.' },
  { icon: Calendar, t: 'Confirmamos fecha', d: 'En menos de 24 h validamos disponibilidad con el artista y te enviamos la cotización formal.' },
  { icon: File, t: 'Contrato y depósito', d: 'Firmas el contrato y reservas la fecha con el depósito. La fecha queda bloqueada para ti.' },
  { icon: Shield, t: 'Producción y show', d: 'Coordinamos rider, logística, transporte y hospitalidad. Tú solo disfrutas el show.' },
];

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.7', 'end 0.6'] });
  const line = useSpring(scrollYProgress, { stiffness: 100, damping: 24 });
  return (
    <section className="process">
      <header className="sec-head">
        <p className="eyebrow eyebrow--ink">( Cómo funciona )</p>
        <Reveal className="h-xl" lines={['Del clic', <em key="t">a la tarima.</em>]} />
      </header>
      <div className="process__list" ref={ref}>
        <motion.span className="process__line" style={{ scaleY: line }} />
        {STEPS.map((s, i) => (
          <motion.div key={s.t} className="process__step" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.7, ease: EASE.premium }}>
            <span className="process__dot">
              <s.icon width={20} />
            </span>
            <div>
              <small>Paso 0{i + 1}</small>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- audiences ---------------- */
const AUD = [
  { t: 'Empresas', d: 'Fiestas de fin de año, lanzamientos y activaciones de marca con factura y contrato.', img: '/img/s/svc-champagne.webp' },
  { t: 'Promotores', d: 'Artistas estelares para conciertos, discotecas y giras con rider y logística resuelta.', img: '/img/s/svc-crowd.webp' },
  { t: 'Municipios', d: 'Fiestas patronales y festivales con producción completa de tarima, sonido y luces.', img: '/img/s/svc-stage2.webp' },
  { t: 'Bodas & privados', d: 'Bodas, quinceañeros y cumpleaños con DJ, hora loca, barra y show en vivo.', img: '/img/s/svc-ledfloor.webp' },
];

export function Audiences() {
  return (
    <section className="aud">
      <header className="sec-head sec-head--row">
        <div>
          <p className="eyebrow">( Para quién )</p>
          <Reveal className="h-xl" lines={['Hecho para', <em key="q">quien produce.</em>]} />
        </div>
        <ul className="aud__perks">
          <li><Check width={16} /> Contrato y factura</li>
          <li><Check width={16} /> Un solo contacto</li>
          <li><Check width={16} /> Respuesta en 24 h</li>
        </ul>
      </header>
      <div className="aud__grid">
        {AUD.map((a, i) => (
          <motion.article key={a.t} className="aud__card" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, delay: i * 0.08, ease: EASE.premium }}>
            <Duo src={a.img} color={['#5B1AF5', '#FF3D9A', '#FFB21E', '#3FA0EF'][i]} className="aud__img" />
            <div>
              <h3>{a.t}</h3>
              <p>{a.d}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* ---------------- beat the party ---------------- */
export function BeatBanner() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const x1 = useTransform(scrollYProgress, [0, 1], ['10%', '-20%']);
  const showcase = (yt as Record<string, string>).showcase;
  return (
    <section className="beat" ref={ref}>
      <motion.div className="beat__img" style={{ y }}>
        <img src="/brand/banner.webp" alt="Beat the party — JP Events" loading="lazy" />
      </motion.div>
      <motion.p className="beat__word" style={{ x: x1 }} aria-hidden="true">
        BEAT THE PARTY · BEAT THE PARTY ·
      </motion.p>
      <div className="beat__inner">
        <div className="beat__copy">
          <p className="eyebrow">( Mira el show )</p>
          <h2 className="h-lg">Así se vive un show que buqueaste.</h2>
          <p>Cada perfil incluye videos de sus éxitos para que tu equipo o tu cliente vea exactamente lo que va a recibir.</p>
          <Link to="/artistas" className="btn btn--white">
            Explorar perfiles <Arrow width={18} />
          </Link>
        </div>
        {showcase && <YouTube id={showcase} title="Elvis Crespo — Suavemente (en vivo)" className="beat__video" />}
      </div>
    </section>
  );
}

/* ---------------- stats ---------------- */
export function Stats() {
  const items = [
    { n: ARTISTS.length, l: 'Artistas y DJs' },
    { n: CATEGORIES.length, l: 'Géneros' },
    { n: SERVICES.length, l: 'Servicios de producción' },
    { n: 24, l: 'Horas para tu cotización', s: 'h' },
  ];
  return (
    <div className="stats">
      {items.map((it, i) => (
        <motion.div key={it.l} className="stats__item" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
          <strong>
            {it.n}
            {it.s ?? '+'}
          </strong>
          <span>{it.l}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------------- faq ---------------- */
export const FAQ = [
  { q: '¿Cómo reservo un artista?', a: 'Agrega el artista a tu cotización, indica fecha, lugar y tipo de evento, y envía la solicitud. Te confirmamos disponibilidad y precio en menos de 24 horas.' },
  { q: '¿Cuánto es el depósito?', a: 'Por lo general se reserva la fecha con un 50% de depósito al firmar el contrato. El balance se salda antes del evento según lo acordado.' },
  { q: '¿Qué es el rider técnico?', a: 'Son los requisitos de tarima, sonido, camerino y hospitalidad del artista. Si no los tienes, nosotros los producimos por ti.' },
  { q: '¿Puedo combinar artistas y servicios?', a: 'Sí. Puedes cotizar varios artistas, DJ, barra, pista, tarima y producción en una sola solicitud.' },
  { q: '¿Trabajan fuera del área metro?', a: 'Sí, producimos eventos en toda la isla. El transporte y la logística se incluyen en la cotización.' },
  { q: '¿Los precios incluyen IVU?', a: 'Cada cotización desglosa honorarios, producción, transporte e impuestos aplicables para tu presupuesto.' },
];

export function Faq({ limit }: { limit?: number }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="faq">
      <header className="sec-head">
        <p className="eyebrow eyebrow--ink">( Preguntas )</p>
        <Reveal className="h-xl" lines={['Antes de', <em key="b">buquear.</em>]} />
      </header>
      <div className="faq__list">
        {FAQ.slice(0, limit).map((f, i) => (
          <div key={f.q} className={`faq__item ${open === i ? 'is-open' : ''}`}>
            <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
              <span>{f.q}</span>
              <Plus width={22} />
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div className="faq__a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE.smooth }}>
                  <p>{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

