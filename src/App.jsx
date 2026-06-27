import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Chronicle from './pages/Chronicle';
import MakingOf from './pages/MakingOf';

/**
 * Two routes share one shell (Layout): the scroll-directed Chronicle at `/` and
 * the Atelier — "the making-of" — at `/making-of`. Layout owns the smooth
 * scroll, the global controls, and the footer; each route owns its own chrome.
 */
const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Chronicle />} />
        <Route path="making-of" element={<MakingOf />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
