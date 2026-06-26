import { useEffect, useState } from 'react';
import { readVisitor, fetchGeo, getNetwork, measureRefreshRate } from '../lib/visitor';

/**
 * Resolves the visitor "reading" for the expedition recap: the synchronous
 * device snapshot (`readVisitor`) merged with the async signals (IP/city, battery,
 * refresh rate) as they arrive. The IP-derived city/coords take precedence over
 * the timezone guess when available; everything degrades to the sync reading.
 *
 * `measureHz` should be true only while the card is on screen — the refresh-rate
 * probe runs a short burst of frames, so we don't want it firing at boot.
 */
export const useVisitor = (measureHz = false) => {
  const base = readVisitor(); // sync + cached
  const [geo, setGeo] = useState(null);
  const [hz, setHz] = useState(null);
  const network = getNetwork(); // sync

  useEffect(() => {
    let alive = true;
    fetchGeo().then((g) => { if (alive) setGeo(g); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!measureHz || hz) return undefined;
    let alive = true;
    measureRefreshRate().then((v) => { if (alive) setHz(v); });
    return () => { alive = false; };
  }, [measureHz, hz]);

  const coords = geo ? { lat: geo.lat, lng: geo.lng } : base.coords;

  return {
    ...base,
    coords,
    region: geo?.city || base.region,
    area: geo?.country || base.area,
    geo,
    hz,
    network,
  };
};
