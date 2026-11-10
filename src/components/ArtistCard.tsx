import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { catById, TIER_LABEL, type Artist } from '../data/artists';
import { fmtDate, nextFree } from '../data/availability';
import { useQuote } from '../lib/quote';
import { Check, Plus } from './Icons';
import { Duo } from './Media';

export default function ArtistCard({ a, size = 'md' }: { a: Artist; size?: 'md' | 'lg' }) {
  const cat = catById(a.cat);
  const { has, toggle } = useQuote();
  const inQuote = has('artist', a.slug);
  const free = nextFree(a.slug);

  return (
    <motion.article className={`acard acard--${size}`} style={{ ['--c' as string]: cat.color, ['--ci' as string]: cat.ink }} whileHover={{ y: -6 }} transition={{ duration: 0.3 }}>
      <Link to={`/artistas/${a.slug}`} className="acard__link" aria-label={`Ver perfil de ${a.name}`}>
        <Duo src={a.img} color={cat.color} alt={a.name} className="acard__img" />
        <span className="acard__cat">{cat.name}</span>
        <span className="acard__tier">{TIER_LABEL[a.tier]}</span>
        <div className="acard__body">
          <h3>{a.name}</h3>
          <p>{a.tagline}</p>
          <span className="acard__free">
            <i /> {free ? `Próx. fecha libre · ${fmtDate(free, { day: 'numeric', month: 'short' })}` : 'Consultar fechas'}
          </span>
        </div>
      </Link>
      <button
        className={`acard__add ${inQuote ? 'is-on' : ''}`}
        onClick={() => toggle({ kind: 'artist', id: a.slug })}
        aria-pressed={inQuote}
        aria-label={inQuote ? `Quitar a ${a.name} de la cotización` : `Agregar a ${a.name} a la cotización`}
      >
        {inQuote ? <Check width={18} /> : <Plus width={18} />}
        <span>{inQuote ? 'En cotización' : 'Cotizar'}</span>
      </button>
    </motion.article>
  );
}
