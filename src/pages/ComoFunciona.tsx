import { motion } from 'framer-motion';
import { FinalCta } from '../components/Chrome';
import { Check } from '../components/Icons';
import Reveal from '../components/Reveal';
import { EASE } from '../lib/motion';
import { Audiences, Faq, Process } from '../sections/HomeSections';

const TERMS = [
  { t: 'Cotización formal', d: 'Honorarios del artista, producción, transporte e impuestos desglosados.' },
  { t: 'Retención de fecha', d: 'Podemos poner la fecha "en espera" mientras tu equipo aprueba el presupuesto.' },
  { t: 'Contrato', d: 'Contrato oficial con el artista o su management, con condiciones claras.' },
  { t: 'Depósito', d: 'Generalmente 50% para confirmar; el balance antes del evento.' },
  { t: 'Rider y hospitalidad', d: 'Validamos tarima, sonido, camerino, transporte y seguridad.' },
  { t: 'Día del evento', d: 'Coordinador de Buquea en sitio: llegada, prueba de sonido y show a tiempo.' },
];

export default function ComoFunciona() {
  return (
    <>
      <header className="pagehead">
        <div className="pagehead__glow" aria-hidden="true" />
        <p className="eyebrow">( Cómo funciona )</p>
        <Reveal as="h1" animateNow delay={0.5} className="h-hero" lines={['Buquear es', <em key="f">fácil.</em>]} />
        <p className="pagehead__lead">Un proceso claro, pensado para empresas y promotores: sabes qué pasa en cada paso, desde la cotización hasta que el artista baja de la tarima.</p>
      </header>
      <Process />
      <section className="terms">
        <header className="sec-head">
          <p className="eyebrow">( Condiciones de booking )</p>
          <Reveal className="h-xl" lines={['Claro desde', <em key="d">el día uno.</em>]} />
        </header>
        <div className="terms__grid">
          {TERMS.map((t, i) => (
            <motion.div key={t.t} className="terms__item" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.6, ease: EASE.smooth }}>
              <span className="terms__n">0{i + 1}</span>
              <h3>{t.t}</h3>
              <p>
                <Check width={15} /> {t.d}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
      <Audiences />
      <Faq />
      <FinalCta />
    </>
  );
}
