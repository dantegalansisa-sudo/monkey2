import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ArtistCard from '../components/ArtistCard';
import { Search } from '../components/Icons';
import Reveal from '../components/Reveal';
import { ARTISTS, CATEGORIES, EVENT_TYPES, TIER_LABEL, type CatId } from '../data/artists';
import { dayStatus } from '../data/availability';
import { EASE } from '../lib/motion';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function Artistas() {
  const [params, setParams] = useSearchParams();
  const cat = (params.get('cat') as CatId | null) ?? null;
  const q = params.get('q') ?? '';
  const ev = params.get('evento') ?? '';
  const date = params.get('fecha') ?? '';
  const tier = params.get('nivel') ?? '';

  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
  };

  const list = useMemo(() => {
    const d = date ? new Date(`${date}T12:00:00`) : null;
    return ARTISTS.filter((a) => {
      if (cat && a.cat !== cat) return false;
      if (ev && !a.eventTypes.includes(ev)) return false;
      if (tier && String(a.tier) !== tier) return false;
      if (q) {
        const hay = norm([a.name, a.tagline, a.cat, ...a.hits].join(' '));
        if (!hay.includes(norm(q))) return false;
      }
      if (d && dayStatus(a.slug, d) !== 'libre') return false;
      return true;
    });
  }, [cat, q, ev, date, tier]);

  const current = cat ? CATEGORIES.find((c) => c.id === cat) : null;
  const color = current?.color ?? '#5B1AF5';

  return (
    <div className="catalog" style={{ ['--c' as string]: color }}>
      <header className="catalog__head">
        <div className="catalog__glow" aria-hidden="true" />
        <p className="eyebrow">( Catálogo de artistas )</p>
        <Reveal as="h1" animateNow delay={0.5} className="h-hero" lines={[current ? current.name : 'Todos los', <em key="e">{current ? 'en agenda.' : 'artistas.'}</em>]} />
        <p className="catalog__lead">{current ? current.desc : 'Urbano, salsa, merengue, bachata y DJs. Filtra por tipo de evento o por la fecha que necesitas y arma tu cotización.'}</p>
      </header>

      <div className="filters">
        <div className="filters__cats" role="tablist" aria-label="Géneros">
          <button className={`chip ${!cat ? 'is-on' : ''}`} onClick={() => set('cat', '')}>
            Todos <small>{ARTISTS.length}</small>
          </button>
          {CATEGORIES.map((c) => (
            <button key={c.id} className={`chip ${cat === c.id ? 'is-on' : ''}`} onClick={() => set('cat', c.id)} style={{ ['--cc' as string]: c.color }}>
              <i /> {c.name} <small>{ARTISTS.filter((a) => a.cat === c.id).length}</small>
            </button>
          ))}
        </div>
        <div className="filters__row">
          <label className="field field--search">
            <Search width={18} />
            <input value={q} onChange={(e) => set('q', e.target.value)} placeholder="Artista, canción o estilo" aria-label="Buscar" />
          </label>
          <label className="field">
            <span>Evento</span>
            <select value={ev} onChange={(e) => set('evento', e.target.value)}>
              <option value="">Cualquiera</option>
              {EVENT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Nivel</span>
            <select value={tier} onChange={(e) => set('nivel', e.target.value)}>
              <option value="">Todos</option>
              {([1, 2, 3, 4] as const).map((t) => (
                <option key={t} value={t}>
                  {TIER_LABEL[t]}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Libre el</span>
            <input type="date" value={date} onChange={(e) => set('fecha', e.target.value)} />
          </label>
        </div>
      </div>

      <p className="catalog__count">
        {list.length} {list.length === 1 ? 'resultado' : 'resultados'}
        {date && ' disponibles en esa fecha'}
      </p>

      <motion.div className="catalog__grid" layout>
        <AnimatePresence mode="popLayout">
          {list.map((a) => (
            <motion.div key={a.slug} layout initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.45, ease: EASE.smooth }}>
              <ArtistCard a={a} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && (
        <div className="catalog__empty">
          <p>No encontramos artistas con esos filtros.</p>
          <button className="btn btn--grad btn--sm" onClick={() => setParams({}, { replace: true })}>
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
