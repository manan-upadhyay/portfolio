import { useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useThemeStore } from '../store/useThemeStore';
import { useVoiceStore } from '../store/useVoiceStore';
import { useSmoothScroll, getLenis } from '../lib/smoothScroll';
import { useActiveSection } from '../hooks/useActiveSection';
import { useEngagementAnalytics } from '../hooks/useEngagementAnalytics';
import { useVisitStore } from '../hooks/useExpedition';
import { sound } from '../lib/sound';
import { track, trackOnce, registerContext } from '../lib/analytics';
import { readVisitor } from '../lib/visitor';
import { useSoundStore } from '../store/useSoundStore'; // rehydrate sound prefs into the engine at boot
import Cursor from './Cursor';
import SkyControl from './SkyControl';
import ControlCluster from './ControlCluster';
import EasterEggListener from './EasterEggListener';
import VoiceTransition from './VoiceTransition';
import VoiceHall from './VoiceHall';

/**
 * On every route change, settle the scroll. The Chronicle restores its own
 * remembered position on mount (see Chronicle.jsx); any other destination — the
 * Atelier, or a fresh deep-link — should simply open at the top.
 */
const ScrollManager = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === '/') return; // Chronicle handles its own restore
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/**
 * The persistent shell shared by every route: smooth scroll, the global
 * controls (sky / voice / sound), the boot side-effects, and the footer. Route
 * content renders through <Outlet/>; the live `activeId` is handed down so the
 * Chronicle's SideRail + map and the voice "entice" note stay scroll-aware.
 */
const Layout = () => {
  const { t } = useTranslation();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  const { pathname } = useLocation();
  useSmoothScroll();
  const activeId = useActiveSection();
  useEngagementAnalytics(activeId, pathname); // section_view + scroll_depth

  // Sound engine boot: arm the first-gesture unlock + preload the optional raven
  // sample (degrades to a synthesized flight if the file is absent).
  useEffect(() => {
    sound.arm();
    sound.loadRaven();
    sound.loadBeds(); // preload the optional astrolabe + arsenal loop samples
    useVisitStore.getState().bump(); // count this visit (local tally for the recap)

    // Analytics — "did they ever hear the site?" (fire-once on first unlock).
    sound.onUnlock(() => track('sound_first_play'));

    // Super properties — attached to EVERY event (incl. autocaptured clicks) so
    // every chart/funnel can be sliced by device + initial prefs. Uses only the
    // SYNCHRONOUS device snapshot (readVisitor) — no IP/geolocation call (PostHog
    // derives country server-side). Voice/theme are kept fresh by their stores.
    const v = readVisitor();
    registerContext({
      device_os: v.os,
      device_browser: v.browser,
      device_gpu: v.gpu,
      device_cores: v.cores,
      device_touch: v.touch,
      screen_w: v.screen?.w ?? null,
      screen_h: v.screen?.h ?? null,
      language: v.language,
      returning_visitor: useVisitStore.getState().visits > 1,
      sound_enabled: useSoundStore.getState().enabled,
      reduced_motion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      voice: useVoiceStore.getState().voice,
    });
  }, []);

  // Keep the resolved theme as a live super-property so every event/heatmap can
  // be split by dark vs light.
  useEffect(() => { registerContext({ theme: resolvedTheme }); }, [resolvedTheme]);

  // ⇧⌘V (⇧⌃V) — summon the Voice Hall. Global to every route.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        trackOnce('shortcut:hall', 'shortcut_used', { combo: 'shift+cmd+v' }); // keyboard power-user
        const { hallOpen, openHall, closeHall } = useVoiceStore.getState();
        (hallOpen ? closeHall : openHall)();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="relative z-0 min-h-screen transition-colors duration-500"
      style={{ background: isDark ? 'var(--color-primary)' : 'var(--gradient-hero)' }}>
      <div className={isDark ? 'aurora-bg' : 'sunrise-bg'} />

      {/* persistent chrome — present on every route */}
      <Cursor />
      <div className="fixed top-5 right-5 z-40"><SkyControl /></div>
      <ControlCluster activeId={activeId} />
      <EasterEggListener />
      <VoiceTransition />
      <VoiceHall />
      <ScrollManager />

      <Outlet context={{ activeId }} />

      <footer className="py-10 text-center border-t" style={{ borderColor: 'var(--color-card-border)' }}>
        {/* The quiet, always-reachable doorway to the Atelier (hidden while there). */}
        {pathname !== '/making-of' && (
          <Link to="/making-of" data-cursor="hover"
            className="atelier-footer-link font-chronicle italic text-[15px] inline-block mb-4 transition-colors"
            style={{ color: 'var(--color-text-muted)' }}>
            {t('footer.atelierLink')}
          </Link>
        )}
        <p className="font-chronicle italic text-[17px]" style={{ color: 'var(--color-text-muted)' }}>
          {t('footer.quote')}
        </p>
        <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
          {t('footer.credit', { year: new Date().getFullYear() })}
        </p>
      </footer>

      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default Layout;
