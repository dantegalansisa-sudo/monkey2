import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Arrow, Check, Plus, Search } from '../components/Icons';
import Magnetic from '../components/Magnetic';
import Wave from '../components/Wave';
import { bySlug, catById, type CatId } from '../data/artists';
import { fmtDate, nextFree } from '../data/availability';
import { EASE } from '../lib/motion';
import { useQuote } from '../lib/quote';

const SLIDES: { cat: CatId; slug: string }[] = [
  { cat: 'urbano', slug: 'arcangel' },
  { cat: 'salsa', slug: 'marc-anthony' },
  { cat: 'merengue', slug: 'olga-tanon' },
  { cat: 'bachata', slug: 'romeo-santos' },
  { cat: 'dj', slug: 'dj-blaze' },
];
const DURATION = 4200;

export default function Hero({ ready }: { ready: boolean }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const { has, toggle } = useQuote();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const wordY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const cutY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const cutS = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    if (!ready || paused) return;
    const id = setTimeout(() => setI((n) => (n + 1) % SLIDES.length), DURATION);
    return () => clearTimeout(id);
  }, [i, ready, paused]);

  useEffect(() => {
    const n = bySlug(SLIDES[(i + 1) % SLIDES.length].slug)!;
    const img = new Image();
    img.src = n.cut ?? n.img;
  }, [i]);

  const s = SLIDES[i];
  const a = bySlug(s.slug)!;
  const cat = catById(s.cat);
  const free = nextFree(a.slug);
  const inQuote = has('artist', a.slug);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/artistas${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`);
  };

  return (
    <section className="hero" ref={ref} style={{ ['--c' as string]: cat.color }}>
      <div className="hero__bg" aria-hidden="true">
        <span className="hero__blob hero__blob--a" />
        <span className="hero__blob hero__blob--b" />
        <span className="hero__grain" />
      </div>

      <div className="hero__stage">
      <motion.div className="hero__word" style={{ y: wordY }} aria-hidden="true">
        <motion.span initial={{ y: '40%', opacity: 0 }} animate={ready ? { y: '0%', opacity: 1 } : {}} transition={{ duration: 1.1, ease: EASE.premium, delay: 0.1 }}>
          Buquea
        </motion.span>
      </motion.div>

      <motion.div className="hero__cut" style={{ y: cutY, scale: cutS }}>
        <AnimatePresence mode="popLayout">
          <motion.img
            key={a.slug}
            src={a.cut ?? a.img}
            alt={a.name}
            decoding="async"
            initial={{ y: 70, opacity: 0, scale: 0.95 }}
            animate={ready ? { y: 0, opacity: 1, scale: 1 } : {}}
            exit={{ y: -24, opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.9, ease: EASE.premium }}
          />
        </AnimatePresence>
      </motion.div>

      <div className="hero__word hero__word--outline" aria-hidden="true">
        <motion.span style={{ y: wordY }} initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}>
          Buquea
        </motion.span>
      </div>
      </div>

      <motion.div className="hero__copy" style={{ opacity: fade }}>
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 14 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}>
          <span className="dot-live" /> Booking de artistas · Puerto Rico
        </motion.p>
        <motion.h1 className="hero__title" initial={{ opacity: 0, y: 30 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, delay: 0.35, ease: EASE.premium }}>
          No lo dejes en planes, <em>Buquea hoy.</em>
        </motion.h1>
        <motion.form className="hero__search" onSubmit={search} initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.55 }}>
          <Search width={20} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busca un artista, género o DJ…" aria-label="Buscar artistas" />
          <button type="submit" className="btn btn--grad btn--sm">
            Buscar
          </button>
        </motion.form>
      </motion.div>

      <motion.aside
        className="hero__card"
        initial={{ opacity: 0, x: 30 }}
        animate={ready ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.8, duration: 0.8, ease: EASE.premium }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div key={a.slug} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
            <span className="hero__cardcat">{cat.name}</span>
            <h2>{a.name}</h2>
            <p>{a.tagline}</p>
            <span className="hero__free">
              <i /> {free ? `Libre ${fmtDate(free)}` : 'Consultar fechas'}
            </span>
            <div className="hero__cardactions">
              <Link to={`/artistas/${a.slug}`} className="btn btn--white btn--sm">
                Ver perfil <Arrow width={16} />
              </Link>
              <button className={`iconbtn ${inQuote ? 'is-on' : ''}`} onClick={() => toggle({ kind: 'artist', id: a.slug })} aria-label="Agregar a cotización">
                {inQuote ? <Check width={18} /> : <Plus width={18} />}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.aside>

      <motion.div className="hero__bottom" initial={{ opacity: 0, y: 30 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.9 }}>
        <div className="hero__mini">
          <span>
            <b>{a.name}</b>
            <small>
              {cat.name} · {free ? `libre ${fmtDate(free, { day: 'numeric', month: 'short' })}` : 'consultar'}
            </small>
          </span>
          <Link to={`/artistas/${a.slug}`} className="btn btn--white btn--sm">
            Ver perfil
          </Link>
        </div>
        <div className="hero__tabs" role="tablist" aria-label="Géneros">
          {SLIDES.map((sl, k) => {
            const c = catById(sl.cat);
            return (
              <button key={sl.cat} role="tab" aria-selected={k === i} className={`hero__tab ${k === i ? 'is-on' : ''}`} onClick={() => setI(k)} style={{ ['--tc' as string]: c.color }}>
                <span className="hero__tabbar">
                  <span style={{ animationDuration: `${DURATION}ms`, animationPlayState: paused ? 'paused' : 'running' }} />
                </span>
                <span className="hero__tabname">{c.name}</span>
              </button>
            );
          })}
        </div>
        <div className="hero__ctas">
          <Magnetic to="/cotizar" className="btn btn--grad">
            Cotizar evento <Arrow width={18} />
          </Magnetic>
          <Link to="/artistas" className="textlink">
            Ver catálogo
          </Link>
        </div>
      </motion.div>

      <Wave className="hero__wave" />
    </section>
  );
}
