/** Buquea's disco ball rebuilt as SVG mirror tiles so it can twinkle; plus the real logo lockup. */
const R = 46;
const STEP = 15;
const PALETTE = ['#5B1AF5', '#7B4DFF', '#3FA0EF', '#22D3EE', '#C9CEDF', '#8D93A8', '#2A2F45', '#141830', '#B56BFF', '#EEF1FF'];
const rad = (d: number) => (d * Math.PI) / 180;
const pt = (lon: number, lat: number) => `${(50 + R * Math.cos(rad(lat)) * Math.sin(rad(lon))).toFixed(2)},${(50 - R * Math.sin(rad(lat))).toFixed(2)}`;

const TILES: { d: string; fill: string; tw: boolean; delay: number }[] = [];
for (let lat = -90, r = 0; lat < 90; lat += STEP, r++) {
  for (let lon = -90, c = 0; lon < 90; lon += STEP, c++) {
    const h = (r * 7 + c * 13 + ((r * c) % 5) * 3) % PALETTE.length;
    TILES.push({
      d: `${pt(lon, lat)} ${pt(lon + STEP, lat)} ${pt(lon + STEP, lat + STEP)} ${pt(lon, lat + STEP)}`,
      fill: PALETTE[h],
      tw: (r * 5 + c * 3) % 4 === 0,
      delay: ((r * 37 + c * 53) % 24) / 10,
    });
  }
}

export default function Wave({ className = '', animated = true }: { className?: string; animated?: boolean; mono?: boolean }) {
  return (
    <svg className={`disco ${animated ? 'is-anim' : ''} ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id="disco-shade" cx="34%" cy="28%" r="78%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#05060c" stopOpacity="0.72" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r={R} fill="#0a0c18" />
      <g transform="rotate(-14 50 50)" stroke="#0a0c18" strokeWidth="0.7" strokeLinejoin="round">
        {TILES.map((t, i) => (
          <polygon key={i} points={t.d} fill={t.fill} className={t.tw ? 'disco__tw' : undefined} style={t.tw ? { animationDelay: `${t.delay}s` } : undefined} />
        ))}
      </g>
      <circle cx="50" cy="50" r={R} fill="url(#disco-shade)" />
      <g className="disco__sparks" fill="#fff">
        <path d="M22 16 l1.6 5 5 1.6 -5 1.6 -1.6 5 -1.6 -5 -5 -1.6 5 -1.6z" style={{ animationDelay: '0.2s' }} />
        <path d="M82 30 l1.2 3.6 3.6 1.2 -3.6 1.2 -1.2 3.6 -1.2 -3.6 -3.6 -1.2 3.6 -1.2z" style={{ animationDelay: '1.1s' }} />
        <path d="M70 84 l1 3 3 1 -3 1 -1 3 -1 -3 -3 -1 3 -1z" style={{ animationDelay: '1.9s' }} />
      </g>
    </svg>
  );
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`logo ${className}`}>
      <img src="/brand/buquea-logo.webp" alt="Buquea" width={767} height={345} />
    </span>
  );
}
