import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ArtistCard from '../components/ArtistCard';
import { Arrow, Check, Clock, Pin, Play, Plus, Users } from '../components/Icons';
import { Duo, YouTube } from '../components/Media';
import MonthCalendar from '../components/MonthCalendar';
import Reveal from '../components/Reveal';
import { ARTISTS, bySlug, catById, FORMATS, RIDER, TIER_LABEL, ytThumb } from '../data/artists';
import { dayKey, fmtDate, nextFree } from '../data/availability';
import { EASE } from '../lib/motion';
import { useQuote } from '../lib/quote';

export default function Perfil() {
  const { slug = '' } = useParams();
  const a = bySlug(slug);
  const { items, add, remove, has } = useQuote();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const nameX = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const saved = items.find((i) => i.kind === 'artist' && i.id === slug) as { date?: string; format?: string } | undefined;
  const [date, setDate] = useState<string | undefined>(saved?.date);
  const [format, setFormat] = useState<string>(saved?.format ?? '');

  if (!a) return <Navigate to="/artistas" replace />;
  const cat = catById(a.cat);
  const formats = FORMATS[a.cat];
  const fmt = format || formats[0].name;
  const inQuote = has('artist', a.slug);
  const free = nextFree(a.slug);
  const similar = ARTISTS.filter((x) => x.cat === a.cat && x.slug !== a.slug).slice(0, 4);
  const gallery = ([a.img, ...(a.extra ?? []), a.video ? ytThumb(a.video, 'hq') : null, ...(a.cat === 'dj' ? ['/img/s/svc-club.webp', '/img/s/svc-ledfloor.webp'] : ['/img/s/svc-crowd.webp', '/img/s/svc-confetti.webp'])].filter(Boolean) as string[]).slice(0, 4);

  const commit = () => add({ kind: 'artist', id: a.slug, date, format: fmt });

  return (
    <div className="profile" style={{ ['--c' as string]: cat.color, ['--ci' as string]: cat.ink }}>
      <section className="phero" ref={ref}>
        <div className="phero__flood" aria-hidden="true" />
        <motion.p className="phero__name" style={{ x: nameX }} aria-hidden="true">
          {a.name} · {a.name} ·
        </motion.p>
        <motion.div className="phero__img" style={{ y }}>
          <motion.img src={a.cut ?? a.img} alt={a.name} className={a.cut ? 'is-cut' : 'is-photo'} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.5, ease: EASE.premium }} />
        </motion.div>
        <div className="phero__info">
          <Link to={`/artistas?cat=${a.cat}`} className="phero__back">
            ← {cat.name}
          </Link>
          <Reveal as="h1" animateNow delay={0.55} className="phero__title" lines={[a.name]} />
          <p className="phero__tag">{a.tagline}</p>
          <div className="phero__meta">
            <span><Pin width={16} /> {a.origin}</span>
            <span>{TIER_LABEL[a.tier]}</span>
            <span>{a.eventTypes.join(' · ')}</span>
          </div>
          <div className="phero__ctas">
            <button className={`btn ${inQuote ? 'btn--white' : 'btn--grad'}`} onClick={() => (inQuote ? remove('artist', a.slug) : commit())}>
              {inQuote ? <Check width={18} /> : <Plus width={18} />} {inQuote ? 'En tu cotización' : 'Agregar a cotización'}
            </button>
            <a href="#agenda" className="btn btn--ghost">
              Ver disponibilidad
            </a>
          </div>
          <span className="phero__free">
            <i /> {free ? `Próxima fecha libre de fin de semana: ${fmtDate(free, { weekday: 'long', day: 'numeric', month: 'long' })}` : 'Consultar fechas'}
          </span>
        </div>
      </section>

      <section className="pbody">
        <div className="pbody__main">
          <div className="pblock">
            <p className="eyebrow eyebrow--ink">( Sobre {a.cat === 'dj' ? 'el DJ' : 'el artista'} )</p>
            <p className="pblock__bio">{a.bio}</p>
          </div>

          {a.video && (
            <div className="pblock">
              <h2 className="pblock__h">Video destacado</h2>
              <YouTube id={a.video} title={`${a.name} — ${a.hits[0]}`} className="pblock__video" />
            </div>
          )}

          <div className="pblock">
            <h2 className="pblock__h">{a.cat === 'dj' ? 'Especialidades' : 'Éxitos'}</h2>
            <ol className="hits">
              {a.hits.map((h, i) => (
                <motion.li key={h} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <span className="hits__n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="hits__t">{h}</span>
                  <a className="hits__play" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${a.name} ${h}`)}`} target="_blank" rel="noopener noreferrer" aria-label={`Escuchar ${h}`}>
                    <Play width={14} />
                  </a>
                </motion.li>
              ))}
            </ol>
          </div>

          <div className="pblock">
            <h2 className="pblock__h">Galería</h2>
            <div className="gallery">
              {gallery.map((g, i) => (
                <motion.div key={g} className={`gallery__item g${i}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <Duo src={g} color={cat.color} alt={`${a.name} foto ${i + 1}`} />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="pblock">
            <h2 className="pblock__h">Formatos de show</h2>
            <div className="formats">
              {formats.map((f) => (
                <button key={f.name} className={`format ${fmt === f.name ? 'is-on' : ''}`} onClick={() => setFormat(f.name)} aria-pressed={fmt === f.name}>
                  <span className="format__dur">
                    <Clock width={15} /> {f.duration}
                  </span>
                  <strong>{f.name}</strong>
                  <p>{f.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="pblock">
            <h2 className="pblock__h">Rider técnico</h2>
            <ul className="rider">
              {RIDER[a.cat].map((r) => (
                <li key={r}>
                  <Check width={16} /> {r}
                </li>
              ))}
            </ul>
            <p className="pblock__note">¿No tienes tarima o sonido? Agrégalos en la cotización y nosotros lo producimos.</p>
          </div>
        </div>

        <aside className="pbook" id="agenda">
          <h2>Reserva una fecha</h2>
          <MonthCalendar slug={a.slug} value={date} onPick={(d) => setDate(dayKey(d))} />
          <div className="pbook__sum">
            <span>
              <Users width={16} /> {fmt}
            </span>
            <span>{date ? fmtDate(new Date(`${date}T12:00:00`), { weekday: 'long', day: 'numeric', month: 'long' }) : 'Escoge una fecha'}</span>
          </div>
          <button className="btn btn--grad btn--block" onClick={commit}>
            {inQuote ? 'Actualizar cotización' : 'Solicitar esta fecha'} <Arrow width={18} />
          </button>
          <Link to="/cotizar" className="pbook__go">
            Ir a mi cotización ({items.length})
          </Link>
          <p className="pbook__fine">Las fechas &quot;en espera&quot; tienen una oferta pendiente; aún puedes solicitarlas como segunda opción.</p>
        </aside>
      </section>

      {similar.length > 0 && (
        <section className="similar">
          <h2 className="h-lg">Más de {cat.name}</h2>
          <div className="similar__grid">
            {similar.map((s) => (
              <ArtistCard key={s.slug} a={s} />
            ))}
          </div>
        </section>
      )}

      <div className="pbar">
        <span>
          <b>{a.name}</b>
          <small>{date ? fmtDate(new Date(`${date}T12:00:00`)) : 'Sin fecha'}</small>
        </span>
        <button className="btn btn--grad btn--sm" onClick={commit}>
          {inQuote ? 'Actualizar' : 'Cotizar'} <Arrow width={16} />
        </button>
      </div>
    </div>
  );
}
