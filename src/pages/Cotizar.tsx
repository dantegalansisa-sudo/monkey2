import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Arrow, Check, Close, Mail, Plus, SvcIcon, Whats } from '../components/Icons';
import { Duo } from '../components/Media';
import Wave from '../components/Wave';
import { bySlug, catById, FORMATS } from '../data/artists';
import { fmtDate } from '../data/availability';
import { packById, PACKS, SERVICES, svcById } from '../data/services';
import { EASE } from '../lib/motion';
import { CONTACT, useQuote, waLink } from '../lib/quote';

const EVENT_TYPES = ['Corporativo', 'Boda', 'Quinceañero', 'Cumpleaños', 'Festival', 'Fiestas patronales', 'Discoteca / club', 'Concierto', 'Otro'];
const TOWNS = ['San Juan', 'Bayamón', 'Carolina', 'Guaynabo', 'Caguas', 'Ponce', 'Mayagüez', 'Arecibo', 'Humacao', 'Dorado', 'Fajardo', 'Rincón', 'Aguadilla', 'Toa Baja', 'Trujillo Alto', 'Vega Baja', 'Otro'];
const BUDGETS = ['Menos de $5K', '$5K – $15K', '$15K – $50K', '$50K – $100K', 'Más de $100K', 'Por definir'];
const STEPS = ['Selección', 'Evento', 'Contacto'];

export default function Cotizar() {
  const { items, remove, add, has, clear } = useQuote();
  const [step, setStep] = useState(0);
  const [ev, setEv] = useState({ type: '', date: (items.find((i) => i.kind === 'artist' && 'date' in i && i.date) as { date?: string } | undefined)?.date ?? '', time: '20:00', hours: '4', town: '', venue: '', place: 'Interior', guests: 200, budget: '' });
  const [ct, setCt] = useState({ company: '', name: '', role: '', email: '', phone: '', notes: '' });
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  const artists = items.filter((i) => i.kind === 'artist') as { kind: 'artist'; id: string; date?: string; format?: string }[];
  const services = items.filter((i) => i.kind === 'service');
  const packs = items.filter((i) => i.kind === 'pack');

  const okStep = [items.length > 0, !!ev.type && !!ev.date && !!ev.town, ct.name.trim().length > 1 && ct.phone.trim().length > 6 && /@/.test(ct.email)];

  const next = () => {
    setTouched(true);
    if (!okStep[step]) return;
    setTouched(false);
    setStep((s) => Math.min(2, s + 1));
    window.__lenis?.scrollTo(0, { duration: 0.8 });
  };

  const ref = useMemo(() => `BQ-${Math.floor(1000 + Math.random() * 9000)}`, []);

  const message = () =>
    [
      `¡Hola JP Events! Quiero cotizar un evento con Buquéalo 🎶 (Ref. ${ref})`,
      '',
      artists.length ? '🎤 Artistas:' : '',
      ...artists.map((a) => `• ${bySlug(a.id)?.name}${a.format ? ` — ${a.format}` : ''}${a.date ? ` — ${a.date}` : ''}`),
      services.length || packs.length ? '🎛️ Servicios:' : '',
      ...packs.map((p) => `• Paquete ${packById(p.id)?.name}`),
      ...services.map((s) => `• ${svcById(s.id)?.name}`),
      '',
      `📅 ${ev.type} · ${ev.date} · ${ev.time} · ${ev.hours} h`,
      `📍 ${ev.town}${ev.venue ? ` — ${ev.venue}` : ''} (${ev.place}) · ${ev.guests} personas`,
      ev.budget && `💰 Presupuesto: ${ev.budget}`,
      '',
      `👤 ${ct.name}${ct.role ? `, ${ct.role}` : ''}${ct.company ? ` — ${ct.company}` : ''}`,
      `📞 ${ct.phone} · ✉️ ${ct.email}`,
      ct.notes && `📝 ${ct.notes}`,
    ]
      .filter((l): l is string => typeof l === 'string')
      .join('\n')
      .replace(/\n{3,}/g, '\n\n');

  const submit = (via: 'wa' | 'mail') => {
    setTouched(true);
    if (!okStep[2]) return;
    const url = via === 'wa' ? waLink(message()) : `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Cotización Buquéalo ${ref}`)}&body=${encodeURIComponent(message())}`;
    window.open(url, '_blank', 'noopener');
    setSent(ref);
  };

  const fieldE = (k: keyof typeof ev) => ({ value: ev[k] as string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setEv({ ...ev, [k]: e.target.value }) });
  const fieldC = (k: keyof typeof ct) => ({ value: ct[k], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setCt({ ...ct, [k]: e.target.value }) });
  const err = (cond: boolean) => (touched && cond ? 'is-err' : '');

  if (sent) {
    return (
      <div className="quote quote--done">
        <motion.div className="done" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ease: EASE.bounce, duration: 0.7 }}>
          <Wave className="done__wave" />
          <span className="done__check">
            <Check width={30} />
          </span>
          <h1 className="h-lg">¡Solicitud lista!</h1>
          <p>
            Tu referencia es <b>{sent}</b>. Termina de enviarla en la ventana que se abrió y un booking agent te contactará en menos de 24 horas.
          </p>
          <ol className="done__next">
            <li><b>1</b> Verificamos disponibilidad con cada artista</li>
            <li><b>2</b> Te enviamos la cotización formal</li>
            <li><b>3</b> Contrato, depósito y fecha confirmada</li>
          </ol>
          <div className="done__ctas">
            <button className="btn btn--grad" onClick={() => setSent(null)}>Volver a mi cotización</button>
            <Link to="/artistas" className="btn btn--ghost" onClick={() => clear()}>
              Nueva cotización
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="quote">
      <header className="quote__head">
        <p className="eyebrow">( Cotizar evento )</p>
        <h1 className="h-hero">
          Tu <em>cotización.</em>
        </h1>
        <div className="steps" aria-label="Pasos">
          {STEPS.map((s, i) => (
            <button key={s} className={`steps__item ${i === step ? 'is-on' : ''} ${i < step ? 'is-done' : ''}`} onClick={() => i < step && setStep(i)}>
              <span>{i < step ? <Check width={14} /> : i + 1}</span> {s}
            </button>
          ))}
        </div>
      </header>

      <div className="quote__grid">
        <div className="quote__main">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }}>
                <div className="qcard">
                  <h2>Artistas</h2>
                  {artists.length === 0 && (
                    <p className="qcard__empty">
                      Aún no has agregado artistas. <Link to="/artistas">Explorar catálogo →</Link>
                    </p>
                  )}
                  {artists.map((it) => {
                    const a = bySlug(it.id);
                    if (!a) return null;
                    const c = catById(a.cat);
                    return (
                      <div key={it.id} className="qitem" style={{ ['--c' as string]: c.color }}>
                        <Duo src={a.img} color={c.color} className="qitem__img" />
                        <div className="qitem__info">
                          <b>{a.name}</b>
                          <small>{c.name}</small>
                          <div className="qitem__opts">
                            <select value={it.format ?? FORMATS[a.cat][0].name} onChange={(e) => add({ ...it, format: e.target.value })} aria-label="Formato">
                              {FORMATS[a.cat].map((f) => (
                                <option key={f.name}>{f.name}</option>
                              ))}
                            </select>
                            <input type="date" value={it.date ?? ''} onChange={(e) => add({ ...it, date: e.target.value })} aria-label="Fecha" />
                          </div>
                        </div>
                        <button className="qitem__x" onClick={() => remove('artist', it.id)} aria-label={`Quitar ${a.name}`}>
                          <Close width={18} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="qcard">
                  <h2>Servicios de entretenimiento</h2>
                  <div className="qsvc">
                    {PACKS.map((p) => (
                      <button key={p.id} className={`qsvc__item is-pack ${has('pack', p.id) ? 'is-on' : ''}`} onClick={() => (has('pack', p.id) ? remove('pack', p.id) : add({ kind: 'pack', id: p.id }))} style={{ ['--c' as string]: p.color }}>
                        {has('pack', p.id) ? <Check width={16} /> : <Plus width={16} />} Paquete {p.name}
                      </button>
                    ))}
                    {SERVICES.map((s) => (
                      <button key={s.id} className={`qsvc__item ${has('service', s.id) ? 'is-on' : ''}`} onClick={() => (has('service', s.id) ? remove('service', s.id) : add({ kind: 'service', id: s.id }))}>
                        <SvcIcon name={s.icon} width={16} /> {s.name}
                      </button>
                    ))}
                  </div>
                </div>
                {touched && !okStep[0] && <p className="qerr">Agrega al menos un artista o servicio.</p>}
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" className="qcard" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }}>
                <h2>Detalles del evento</h2>
                <div className="qform">
                  <label className={`is-wide ${err(!ev.type)}`}>
                    <span>Tipo de evento *</span>
                    <div className="qchips">
                      {EVENT_TYPES.map((t) => (
                        <button key={t} type="button" className={`chip ${ev.type === t ? 'is-on' : ''}`} onClick={() => setEv({ ...ev, type: t })}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </label>
                  <label className={err(!ev.date)}>
                    <span>Fecha *</span>
                    <input type="date" {...fieldE('date')} />
                  </label>
                  <label>
                    <span>Hora de inicio</span>
                    <input type="time" {...fieldE('time')} />
                  </label>
                  <label>
                    <span>Duración (horas)</span>
                    <select {...fieldE('hours')}>
                      {['2', '3', '4', '5', '6', '8', '10+'].map((h) => (
                        <option key={h}>{h}</option>
                      ))}
                    </select>
                  </label>
                  <label className={err(!ev.town)}>
                    <span>Municipio *</span>
                    <select {...fieldE('town')}>
                      <option value="">Selecciona</option>
                      {TOWNS.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                  <label className="is-wide">
                    <span>Lugar / venue</span>
                    <input type="text" placeholder="Hotel, salón, plaza pública…" {...fieldE('venue')} />
                  </label>
                  <label>
                    <span>Espacio</span>
                    <select {...fieldE('place')}>
                      <option>Interior</option>
                      <option>Exterior</option>
                      <option>Mixto</option>
                    </select>
                  </label>
                  <label>
                    <span>Presupuesto estimado</span>
                    <select {...fieldE('budget')}>
                      <option value="">Prefiero no decir</option>
                      {BUDGETS.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  </label>
                  <label className="is-wide">
                    <span>Asistentes: <b>{ev.guests}</b></span>
                    <input type="range" min={30} max={5000} step={10} value={ev.guests} onChange={(e) => setEv({ ...ev, guests: Number(e.target.value) })} />
                  </label>
                </div>
                {touched && !okStep[1] && <p className="qerr">Completa tipo de evento, fecha y municipio.</p>}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" className="qcard" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }}>
                <h2>Tus datos</h2>
                <div className="qform">
                  <label>
                    <span>Empresa / organización</span>
                    <input type="text" autoComplete="organization" {...fieldC('company')} />
                  </label>
                  <label>
                    <span>Cargo</span>
                    <input type="text" placeholder="Promotor, gerente de mercadeo…" {...fieldC('role')} />
                  </label>
                  <label className={err(ct.name.trim().length < 2)}>
                    <span>Nombre *</span>
                    <input type="text" autoComplete="name" {...fieldC('name')} />
                  </label>
                  <label className={err(ct.phone.trim().length < 7)}>
                    <span>Teléfono / WhatsApp *</span>
                    <input type="tel" autoComplete="tel" {...fieldC('phone')} />
                  </label>
                  <label className={`is-wide ${err(!/@/.test(ct.email))}`}>
                    <span>Email *</span>
                    <input type="email" autoComplete="email" {...fieldC('email')} />
                  </label>
                  <label className="is-wide">
                    <span>Notas para el booking agent</span>
                    <textarea rows={3} placeholder="Horario del show, temática, artistas alternos…" {...fieldC('notes')} />
                  </label>
                </div>
                {touched && !okStep[2] && <p className="qerr">Completa nombre, teléfono y un email válido.</p>}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="quote__nav">
            {step > 0 && (
              <button className="btn btn--ghost" onClick={() => setStep(step - 1)}>
                ← Atrás
              </button>
            )}
            {step < 2 ? (
              <button className="btn btn--grad" onClick={next}>
                Continuar <Arrow width={18} />
              </button>
            ) : (
              <>
                <button className="btn btn--grad" onClick={() => submit('wa')}>
                  <Whats width={18} /> Enviar por WhatsApp
                </button>
                <button className="btn btn--ghost" onClick={() => submit('mail')}>
                  <Mail width={18} /> Enviar por email
                </button>
              </>
            )}
          </div>
        </div>

        <aside className="qsum">
          <div className="qsum__top">
            <Wave className="qsum__wave" />
            <div>
              <small>Buquéalo · {ref}</small>
              <strong>Resumen</strong>
            </div>
          </div>
          <dl>
            <div>
              <dt>Artistas</dt>
              <dd>{artists.length ? artists.map((a) => bySlug(a.id)?.name).join(', ') : '—'}</dd>
            </div>
            <div>
              <dt>Servicios</dt>
              <dd>{services.length + packs.length ? [...packs.map((p) => packById(p.id)?.name), ...services.map((s) => svcById(s.id)?.name)].join(', ') : '—'}</dd>
            </div>
            <div>
              <dt>Evento</dt>
              <dd>{ev.type || '—'}</dd>
            </div>
            <div>
              <dt>Fecha</dt>
              <dd>{ev.date ? fmtDate(new Date(`${ev.date}T12:00:00`), { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</dd>
            </div>
            <div>
              <dt>Lugar</dt>
              <dd>{ev.town || '—'}</dd>
            </div>
            <div>
              <dt>Asistentes</dt>
              <dd>{ev.guests}</dd>
            </div>
          </dl>
          <p className="qsum__fine">Sin compromiso. La cotización formal llega en menos de 24 h con honorarios, producción y logística desglosados.</p>
        </aside>
      </div>
    </div>
  );
}
