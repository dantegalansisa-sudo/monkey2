import { useState } from 'react';
import { ytThumb } from '../data/artists';
import { Play } from './Icons';

/** Brand duotone: photos are tinted with the genre colour and reveal full colour on hover. */
export function Duo({ src, color, alt = '', className = '', eager = false }: { src: string; color: string; alt?: string; className?: string; eager?: boolean }) {
  return (
    <span className={`duo ${className}`} style={{ ['--c' as string]: color }}>
      <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </span>
  );
}

/** Lightweight YouTube embed: shows the thumbnail until clicked. */
export function YouTube({ id, title, className = '' }: { id: string; title: string; className?: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className={`yt ${className}`}>
      {on ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button className="yt__poster" onClick={() => setOn(true)} aria-label={`Reproducir ${title}`}>
          <img src={ytThumb(id, 'hq')} alt="" loading="lazy" />
          <span className="yt__play">
            <Play width={26} />
          </span>
          <span className="yt__title">{title}</span>
        </button>
      )}
    </div>
  );
}
