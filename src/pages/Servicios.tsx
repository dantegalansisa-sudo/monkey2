import { motion } from 'framer-motion';
import { FinalCta } from '../components/Chrome';
import { Check, Plus, SvcIcon } from '../components/Icons';
import { Duo } from '../components/Media';
import Reveal from '../components/Reveal';
import { PACKS, SERVICES, svcById } from '../data/services';
import { EASE } from '../lib/motion';
import { useQuote } from '../lib/quote';
import { EventBuilder } from '../sections/HomeSections';

const GROUP_COLOR: Record<string, string> = { Música: '#5B1AF5', Barra: '#FF3D9A', Producción: '#3FA0EF', Experiencias: '#FFB21E' };

export default function Servicios() {
  const { has, toggle } = useQuote();
  const groups = [...new Set(SERVICES.map((s) => s.group))];
  return (
    <>
      <header className="pagehead">
        <div className="pagehead__glow" aria-hidden="true" />
        <p className="eyebrow">( Servicios )</p>
        <Reveal as="h1" animateNow delay={0.5} className="h-hero" lines={['Entretenimiento', <em key="f">full.</em>]} />
        <p className="pagehead__lead">Todo lo que tu evento necesita además del artista: DJ, barra, pista LED, tarima, luces, sonido, pantallas y producción. Un solo proveedor, un solo contrato.</p>
      </header>

      <section className="packs">
        <header className="sec-head">
          <p className="eyebrow eyebrow--ink">( Paquetes )</p>
          <Reveal className="h-xl" lines={['Listos para', <em key="p">encender.</em>]} />
        </header>
        <div className="packs__grid">
          {PACKS.map((p, i) => {
            const on = has('pack', p.id);
            return (
              <motion.article key={p.id} className={`pack ${on ? 'is-on' : ''}`} style={{ ['--c' as string]: p.color }} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7, ease: EASE.premium }}>
                <span className="pack__tag">{p.tag}</span>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <ul>
                  {p.items.map((id) => (
                    <li key={id}>
                      <Check width={16} /> {svcById(id)?.name}
                    </li>
                  ))}
                </ul>
                <button className={`btn ${on ? 'btn--white' : 'btn--grad'} btn--block`} onClick={() => toggle({ kind: 'pack', id: p.id })}>
                  {on ? <Check width={18} /> : <Plus width={18} />} {on ? 'En tu cotización' : 'Cotizar paquete'}
                </button>
              </motion.article>
            );
          })}
        </div>
      </section>

      {groups.map((g) => (
        <section key={g} className="svcgroup" style={{ ['--c' as string]: GROUP_COLOR[g] }}>
          <h2 className="svcgroup__title">
            <span>{g}</span>
          </h2>
          <div className="svcgroup__grid">
            {SERVICES.filter((s) => s.group === g).map((s, i) => {
              const on = has('service', s.id);
              return (
                <motion.article key={s.id} className="svc" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: i * 0.08, duration: 0.6, ease: EASE.smooth }}>
                  <Duo src={s.img} color={GROUP_COLOR[g]} alt={s.name} className="svc__img" />
                  <div className="svc__body">
                    <span className="svc__icon">
                      <SvcIcon name={s.icon} width={22} />
                    </span>
                    <h3>{s.name}</h3>
                    <p>{s.desc}</p>
                    <div className="tags">
                      {s.includes.map((x) => (
                        <span key={x} className="tag">
                          {x}
                        </span>
                      ))}
                    </div>
                    <button className={`svc__add ${on ? 'is-on' : ''}`} onClick={() => toggle({ kind: 'service', id: s.id })} aria-pressed={on}>
                      {on ? <Check width={16} /> : <Plus width={16} />} {on ? 'Agregado' : 'Agregar a cotización'}
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>
      ))}
      <EventBuilder />
      <FinalCta />
    </>
  );
}
