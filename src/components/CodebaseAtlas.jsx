import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Folder, FolderOpen, FileCode, Braces, Globe, BarChart3, AudioLines, Waypoints,
  Boxes, Layers, Component as ComponentIcon, Route, Palette, Server, FileText,
  Image as ImageIcon, Settings, Github, ChevronRight,
} from 'lucide-react';
import { atelier } from '../constants';
import { playCue } from '../lib/sound';

/**
 * CodebaseAtlas — a cinematic, collapsible, VS-Code-flavoured tree over a curated,
 * annotated subset of the real repo (constants.atelier.atlas — NOT the filesystem).
 * It shows a CTO *how* the codebase is organised and *why* — selecting a node
 * reveals its rationale (`blurb` + senior `signal`), never its source. A hotspots
 * rail jumps to the "marvels"; a button links the public repo.
 *
 * Data-driven, theme-token only, keyboard-navigable (`role="tree"`), reduced-motion
 * + touch safe. The optional expand/select cue reuses lib/sound (intent, not motion).
 */
const GLYPHS = {
  folder: Folder, braces: Braces, globe: Globe, filecode: FileCode, chart: BarChart3,
  audio: AudioLines, scroll: Waypoints, boxes: Boxes, layers: Layers,
  component: ComponentIcon, route: Route, palette: Palette, server: Server,
  doc: FileText, image: ImageIcon, settings: Settings,
};

/* Flatten the tree once into id→node + id→ancestor-chain lookups (for hotspots). */
const buildIndex = (tree) => {
  const byId = {};
  const parents = {};
  const walk = (nodes, chain) => nodes.forEach((n) => {
    byId[n.id] = n;
    parents[n.id] = chain;
    if (n.children) walk(n.children, [...chain, n.id]);
  });
  walk(tree, []);
  return { byId, parents };
};

const CodebaseAtlas = () => {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const { tree, hotspots, repo } = atelier.atlas;
  const { byId, parents } = useMemo(() => buildIndex(tree), [tree]);

  // src/ (and its engine room) start open — the tree should land full, not as a
  // single collapsed folder over a sea of empty space.
  const [expanded, setExpanded] = useState(() => new Set(['src', 'lib']));
  const [selected, setSelected] = useState(null);
  const rowRefs = useRef(new Map());
  const treeRef = useRef(null);

  /* Boundary-aware scroll chaining — keep the wheel inside the tree while it can
     still scroll that way; once it hits the top/bottom edge, hand the wheel back
     to Lenis (drop data-lenis-prevent) so the page keeps moving. No more trap.
     This fires before Lenis reads the attribute (React's root listener bubbles
     ahead of Lenis's window listener), so the page never stalls for a frame. */
  const onTreeWheel = useCallback((e) => {
    const el = treeRef.current;
    if (!el) return;
    const atTop = el.scrollTop <= 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    const pastEdge = (e.deltaY > 0 && atBottom) || (e.deltaY < 0 && atTop);
    el.toggleAttribute('data-lenis-prevent', !pastEdge);
  }, []);

  /* The visible rows, in display order, respecting which dirs are open. */
  const rows = useMemo(() => {
    const out = [];
    const walk = (nodes, depth, parentId) => nodes.forEach((n) => {
      out.push({ node: n, depth, parentId });
      if (n.children && expanded.has(n.id)) walk(n.children, depth + 1, n.id);
    });
    walk(tree, 0, null);
    return out;
  }, [tree, expanded]);

  const toggle = useCallback((id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const focusRow = (id) => rowRefs.current.get(id)?.focus();

  const activate = (node) => {
    setSelected(node.id);
    if (node.children) toggle(node.id);
    playCue('blip');
  };

  const jumpTo = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      (parents[id] || []).forEach((p) => next.add(p));
      if (byId[id]?.children) next.add(id);
      return next;
    });
    setSelected(id);
    playCue('blip');
    requestAnimationFrame(() => {
      const el = rowRefs.current.get(id);
      if (el) {
        el.focus();
        el.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
      }
    });
  };

  const onKeyDown = (e, row, i) => {
    const { node } = row;
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); if (rows[i + 1]) focusRow(rows[i + 1].node.id); break;
      case 'ArrowUp': e.preventDefault(); if (rows[i - 1]) focusRow(rows[i - 1].node.id); break;
      case 'ArrowRight':
        e.preventDefault();
        if (node.children) {
          if (!expanded.has(node.id)) toggle(node.id);
          else if (rows[i + 1]) focusRow(rows[i + 1].node.id);
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (node.children && expanded.has(node.id)) toggle(node.id);
        else if (row.parentId) focusRow(row.parentId);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        activate(node);
        break;
      default: break;
    }
  };

  const activeNode = selected ? byId[selected] : null;

  return (
    <div className="atlas">
      {/* the tree — curated, annotated, src/ open by default. data-lenis-prevent
          lets this nested column scroll natively (Lenis owns the page wheel); it's
          toggled off at the top/bottom edge (onTreeWheel) so the page chains on. */}
      <div ref={treeRef} onWheel={onTreeWheel} className="atlas__tree exp-mono" role="tree" aria-label={t('atelier.atlas.title')} data-lenis-prevent>
        {rows.map((row, i) => {
          const { node, depth } = row;
          const isDir = !!node.children;
          const isOpen = expanded.has(node.id);
          const isSel = selected === node.id;
          const Glyph = isDir ? (isOpen ? FolderOpen : Folder) : (GLYPHS[node.glyph] || FileCode);
          return (
            <motion.button
              key={node.id}
              ref={(el) => { if (el) rowRefs.current.set(node.id, el); else rowRefs.current.delete(node.id); }}
              type="button"
              role="treeitem"
              aria-level={depth + 1}
              aria-expanded={isDir ? isOpen : undefined}
              aria-selected={isSel}
              tabIndex={i === 0 ? 0 : -1}
              data-cursor="hover"
              className={`atlas__row${isSel ? ' is-selected' : ''}${node.hotspot ? ' is-hotspot' : ''}`}
              style={{ paddingLeft: `${10 + depth * 18}px` }}
              onClick={() => activate(node)}
              onKeyDown={(e) => onKeyDown(e, row, i)}
              initial={reduce ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <span className="atlas__chevron" aria-hidden="true">
                {isDir ? <ChevronRight size={13} className={isOpen ? 'is-open' : ''} /> : null}
              </span>
              <Glyph size={14} strokeWidth={1.6} className="atlas__glyph" aria-hidden="true" />
              <span className="atlas__name">{node.name}</span>
              {node.hotspot ? <span className="atlas__star" aria-hidden="true" /> : null}
            </motion.button>
          );
        })}
      </div>

      {/* the side column — the live detail + the hotspots rail + the repo link */}
      <aside className="atlas__side">
        <div className="atlas__detail" aria-live="polite">
          {activeNode ? (
            <>
              <span className="atlas__detail-path exp-mono">{activeNode.name}</span>
              <p className="atlas__detail-blurb">{activeNode.blurb}</p>
              {activeNode.signal ? (
                <div className="atlas__signal">
                  <span className="atlas__signal-label">{t('atelier.atlas.why')}</span>
                  <p className="atlas__signal-text">{activeNode.signal}</p>
                </div>
              ) : null}
            </>
          ) : (
            <p className="atlas__prompt">{t('atelier.atlas.prompt')}</p>
          )}
        </div>

        <div className="atlas__rail">
          <span className="atlas__rail-label">{t('atelier.atlas.hotspots')}</span>
          <ul className="atlas__hotspots">
            {hotspots.map((id) => {
              const node = byId[id];
              if (!node) return null;
              const Glyph = GLYPHS[node.glyph] || FileCode;
              return (
                <li key={id}>
                  <button type="button" className="atlas__hotspot" data-cursor="hover" onClick={() => jumpTo(id)}>
                    <Glyph size={13} strokeWidth={1.7} aria-hidden="true" />
                    <span>{node.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <a className="atlas__repo" href={repo} target="_blank" rel="noopener noreferrer" data-cursor="hover">
            <Github size={15} strokeWidth={1.7} aria-hidden="true" />
            <span>{t('atelier.atlas.repoCta')}</span>
          </a>
        </div>
      </aside>
    </div>
  );
};

export default CodebaseAtlas;
