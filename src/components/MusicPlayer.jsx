import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume1 } from 'lucide-react';

// Ambient track. To use a file from src/assets, import it and set TRACK to that
// import, e.g. `import ambient from '../assets/ambient.mp3'`. Until then this
// points at public/ and degrades gracefully if the file is absent.
const TRACK = '/chronicle/ambient.mp3';

const JELLY = { type: 'spring', stiffness: 320, damping: 24, mass: 0.7 };
const COLLAPSED = 48;
const EXPANDED = 256;
const DEFAULT_VOLUME = 0.2; // start quiet — never blast the visitor

/**
 * Ambient music control (bottom-right). Collapsed it's a single circular
 * play button; on hover it springs open to reveal play/pause + a volume
 * slider. Starts paused at 20% volume and only plays on an explicit click
 * (no autoplay). Degrades to idle if the track file is absent.
 */
const MusicPlayer = () => {
  const audioRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);

  useEffect(() => {
    const a = new Audio(TRACK);
    a.loop = true;
    a.preload = 'none';
    a.volume = DEFAULT_VOLUME;
    a.addEventListener('error', () => setAvailable(false));
    audioRef.current = a;
    return () => { a.pause(); audioRef.current = null; };
  }, []);

  const onVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      try {
        a.volume = volume;
        await a.play();
        setPlaying(true);
      } catch {
        setAvailable(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="fixed bottom-5 right-5 z-40"
    >
      <motion.div
        animate={{ width: expanded ? EXPANDED : COLLAPSED }}
        transition={JELLY}
        className="h-12 flex flex-row-reverse items-center overflow-hidden rounded-full"
        style={{
          background: 'var(--color-card-bg)',
          border: '1px solid var(--color-card-border)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* play / pause — always visible (anchored right) */}
        <motion.button
          onClick={toggle}
          data-cursor="hover"
          whileTap={{ scale: 0.88 }}
          transition={JELLY}
          aria-label={playing ? 'Pause ambience' : 'Play ambience'}
          className="grid place-items-center flex-shrink-0 w-12 h-12"
        >
          <span
            className="grid place-items-center w-9 h-9 rounded-full"
            style={{ background: 'rgba(var(--color-ember-rgb),0.16)', color: 'var(--color-ember)' }}
          >
            {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </span>
        </motion.button>

        {/* revealed controls (left of the button, clipped when collapsed) */}
        <motion.div
          animate={{ opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.2, delay: expanded ? 0.06 : 0 }}
          className="flex items-center gap-2.5 pl-4 pr-1 flex-shrink-0"
          style={{ width: EXPANDED - COLLAPSED }}
        >
          {playing ? (
            <span className="flex items-end gap-[3px] h-3.5" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="w-[3px] rounded-full"
                  style={{ background: 'var(--color-ember)', animation: `eqbar 0.9s ease-in-out ${i * 0.15}s infinite` }} />
              ))}
            </span>
          ) : (
            <span className="text-[10px] tracking-[0.18em] uppercase font-medium whitespace-nowrap"
              style={{ color: 'var(--color-text-muted)' }}>
              {available ? 'Ambience' : 'No track'}
            </span>
          )}

          <Volume1 size={15} className="flex-shrink-0" style={{ color: 'var(--color-text-muted)' }} />
          <input
            type="range" min={0} max={1} step={0.01} value={volume}
            onChange={onVolume} aria-label="Ambience volume"
            className="vol-slider" style={{ width: 84 }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MusicPlayer;
