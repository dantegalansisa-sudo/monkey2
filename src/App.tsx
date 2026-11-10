import Lenis from 'lenis';
import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { Curtain, Footer, LINKS, Nav, Preloader, QuoteFab } from './components/Chrome';
import { bySlug } from './data/artists';
import { QuoteProvider } from './lib/quote';
import Home from './pages/Home';

const Artistas = lazy(() => import('./pages/Artistas'));
const ComoFunciona = lazy(() => import('./pages/ComoFunciona'));
const Cotizar = lazy(() => import('./pages/Cotizar'));
const Perfil = lazy(() => import('./pages/Perfil'));
const Servicios = lazy(() => import('./pages/Servicios'));

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    window.__lenis = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const mo = new MutationObserver(() => (document.documentElement.classList.contains('is-locked') ? lenis.stop() : lenis.start()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      lenis.destroy();
    };
  }, []);
}

function useRouteScroll() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const lenis = window.__lenis;
    if (hash) {
      const id = setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) (lenis ? lenis.scrollTo(el as HTMLElement, { offset: -90 }) : el.scrollIntoView());
      }, 700);
      return () => clearTimeout(id);
    }
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a || !window.__lenis) return;
      const el = document.querySelector(a.getAttribute('href')!);
      if (!el) return;
      e.preventDefault();
      window.__lenis.scrollTo(el as HTMLElement, { offset: -90 });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}

function PerfilRoute() {
  const { slug = '' } = useParams();
  return <Perfil key={slug} />;
}

export default function App() {
  const location = useLocation();
  const [ready, setReady] = useState(() => {
    try {
      return sessionStorage.getItem('bq-intro') === '1';
    } catch {
      return false;
    }
  });
  useSmoothScroll();
  useRouteScroll();

  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', !ready);
  }, [ready]);

  const done = useCallback(() => {
    try {
      sessionStorage.setItem('bq-intro', '1');
    } catch {
      /* storage unavailable */
    }
    setReady(true);
  }, []);

  const label = location.pathname.startsWith('/artistas/')
    ? bySlug(location.pathname.split('/')[2])?.name ?? 'Artista'
    : LINKS.find((l) => l.to === location.pathname)?.label ?? 'Buquéalo';

  return (
    <QuoteProvider>
      {!ready && <Preloader onDone={done} />}
      {ready && location.key !== 'default' && <Curtain key={location.pathname} label={label} />}
      <Nav />
      <main>
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
        <Routes>
          <Route path="/" element={<Home ready={ready} />} />
          <Route path="/artistas" element={<Artistas />} />
          <Route path="/artistas/:slug" element={<PerfilRoute />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/como-funciona" element={<ComoFunciona />} />
          <Route path="/cotizar" element={<Cotizar />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </main>
      <Footer />
      <QuoteFab />
    </QuoteProvider>
  );
}
