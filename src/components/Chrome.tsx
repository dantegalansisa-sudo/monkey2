import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import credits from '../data/credits.json';
import { EASE } from '../lib/motion';
import { CONTACT, useQuote } from '../lib/quote';
import { Arrow, Close, Insta, Mail, Phone, Whats } from './Icons';
import Magnetic from './Magnetic';
import Wave, { Logo } from './Wave';

export const LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/artistas', label: 'Artistas' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/como-funciona', label: 'Cómo funciona' },
  { to: '/cotizar', label: 'Cotizar' },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { items } = useQuote();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 30);
    setHidden(y > 500 && y > prev + 2 && !open);
    if (y < prev - 2) setHidden(false);
  });
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', open);
  }, [open]);

  return (
    <>
      <motion.header className={`nav ${solid ? 'is-solid' : ''}`} animate={{ y: hidden ? -110 : 0 }} transition={{ duration: 0.4, ease: EASE.smooth }}>
        <div className="nav__inner">
          <Link to="/" className="nav__logo" aria-label="Buquea — inicio">
            <Logo />
          </Link>
          <nav className="nav__links" aria-label="Principal">
            {LINKS.slice(1, 4).map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="nav__right">
            <Magnetic to="/cotizar" className="btn btn--grad btn--sm nav__cta">
              Cotizar evento
              {items.length > 0 && <span className="nav__count">{items.length}</span>}
            </Magnetic>
            <button className={`burger ${open ? 'is-open' : ''}`} onClick={() => setOpen((o) => !o)} aria-label="Menú" aria-expanded={open}>
              <span />
              <span />
            </button>
          </div>
        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE.premium }}
          >
            <Wave className="menu__wave" />
            <nav className="menu__links">
              {LINKS.map((l, i) => (
                <motion.div key={l.to} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.06, duration: 0.6, ease: EASE.premium }}>
                  <NavLink to={l.to} className={({ isActive }) => `menu__link ${isActive ? 'is-active' : ''}`}>
                    <small>0{i + 1}</small>
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="menu__foot">
              <a href={CONTACT.phoneHref}>
                <Phone width={18} /> {CONTACT.phone}
              </a>
              <a href={`mailto:${CONTACT.email}`}>
                <Mail width={18} /> {CONTACT.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Floating quote button: animated wave + item count; doubles as the scroll progress. */
export function QuoteFab() {
  const { items, pulse } = useQuote();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { scrollY, scrollYProgress } = useScroll();
  const ring = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const [show, setShow] = useState(false);
  const [toast, setToast] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => setShow(y > 300 || items.length > 0));
  useEffect(() => {
    if (pulse === 0) return;
    setToast(true);
    const id = setTimeout(() => setToast(false), 2400);
    return () => clearTimeout(id);
  }, [pulse]);

  if (pathname.startsWith('/cotizar')) return null;

  return (
    <AnimatePresence>
      {(show || items.length > 0) && (
        <motion.div className="fab" initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 120, opacity: 0 }} transition={{ duration: 0.5, ease: EASE.bounce }}>
          <AnimatePresence>
            {toast && (
              <motion.span className="fab__toast" initial={{ opacity: 0, x: 20, scale: 0.8 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 10 }}>
                ¡Agregado a tu cotización! 🎉
              </motion.span>
            )}
          </AnimatePresence>
          <button className="fab__btn" onClick={() => navigate('/cotizar')} aria-label={`Ver cotización (${items.length})`}>
            <svg className="fab__ring" viewBox="0 0 60 60" aria-hidden="true">
              <circle cx="30" cy="30" r="27" className="fab__track" />
              <motion.circle cx="30" cy="30" r="27" className="fab__prog" style={{ pathLength: ring }} />
            </svg>
            <Wave className="fab__wave" />
            {items.length > 0 && (
              <motion.span key={items.length} className="fab__count" initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ ease: EASE.bounce }}>
                {items.length}
              </motion.span>
            )}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Preloader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1100);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Timers (not rAF) drive the exit so a throttled or slow phone can never get stuck on the intro.
    const hide = setTimeout(() => {
      setN(100);
      setVis(false);
    }, 1250);
    const fallback = setTimeout(onDone, 2400);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hide);
      clearTimeout(fallback);
    };
  }, [onDone]);
  return (
    <AnimatePresence onExitComplete={onDone}>
      {vis && (
        <motion.div className="preloader" exit={{ y: '-100%' }} transition={{ duration: 0.7, ease: EASE.premium }}>
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: EASE.bounce }}>
            <Wave className="preloader__wave" />
          </motion.div>
          <p className="preloader__tag">No lo dejes en planes, <b>Buquea hoy.</b></p>
          <div className="preloader__bar">
            <span style={{ transform: `scaleX(${n / 100})` }} />
          </div>
          <span className="preloader__n">{String(n).padStart(3, '0')}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Curtain({ label }: { label: string }) {
  return (
    <motion.div className="curtain" initial={{ y: '0%' }} animate={{ y: '-100%' }} transition={{ duration: 0.85, delay: 0.3, ease: EASE.premium }} aria-hidden="true">
      <Wave className="curtain__wave" />
      <span>{label}</span>
    </motion.div>
  );
}

export function FinalCta() {
  return (
    <section className="final">
      <div className="final__glow" aria-hidden="true" />
      <Wave className="final__wave" />
      <motion.h2 className="final__title" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.9, ease: EASE.premium }}>
        No lo dejes en planes, <em>Buquea hoy.</em>
      </motion.h2>
      <p className="final__lead">Dinos la fecha y el tipo de evento. Te enviamos disponibilidad y cotización formal en menos de 24 horas.</p>
      <div className="final__ctas">
        <Magnetic to="/cotizar" className="btn btn--white btn--lg">
          Armar mi cotización <Arrow width={20} />
        </Magnetic>
        <Magnetic href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" className="btn btn--ghost btn--lg">
          <Whats width={20} /> WhatsApp
        </Magnetic>
      </div>
    </section>
  );
}

export function Footer() {
  const [showCredits, setShowCredits] = useState(false);
  const list = Object.entries(credits as Record<string, { author: string; license: string; source: string }>);
  return (
    <footer className="footer">
      <div className="footer__top">
        <div>
          <Logo className="footer__logo" />
          <p>La plataforma de booking de artistas y entretenimiento para empresas, promotores y eventos privados en Puerto Rico.</p>
        </div>
        <div className="footer__col">
          <h3>Explora</h3>
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="footer__col">
          <h3>Géneros</h3>
          {['urbano', 'salsa', 'merengue', 'bachata', 'dj'].map((c) => (
            <Link key={c} to={`/artistas?cat=${c}`}>
              {c === 'dj' ? 'DJs' : c[0].toUpperCase() + c.slice(1)}
            </Link>
          ))}
        </div>
        <div className="footer__col">
          <h3>Booking</h3>
          <a href={CONTACT.phoneHref}>
            <Phone width={16} /> {CONTACT.phone}
          </a>
          <a href={`mailto:${CONTACT.email}`}>
            <Mail width={16} /> {CONTACT.email}
          </a>
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">
            <Insta width={16} /> Instagram
          </a>
        </div>
      </div>
      <div className="footer__giant" aria-hidden="true">
        Buquea<span>.</span>
      </div>
      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} Buquea · Puerto Rico</span>
        <button onClick={() => setShowCredits(true)}>Demo · Créditos de imágenes</button>
      </div>
      <AnimatePresence>
        {showCredits && (
          <motion.div className="credits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCredits(false)}>
            <div className="credits__box" onClick={(e) => e.stopPropagation()}>
              <button className="credits__close" onClick={() => setShowCredits(false)} aria-label="Cerrar">
                <Close />
              </button>
              <h3>Créditos de imágenes</h3>
              <p>Sitio demostrativo. Los artistas y fotos son ejemplos ilustrativos con licencias libres (Wikimedia Commons / Openverse). Videos vía YouTube.</p>
              <ul>
                {list.filter(([k]) => !k.includes('_')).map(([k, c]) => (
                  <li key={k}>
                    <b>{k}</b> — {c.author || 'Autor desconocido'} · {c.license} ·{' '}
                    <a href={c.source} target="_blank" rel="noopener noreferrer">
                      fuente
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
