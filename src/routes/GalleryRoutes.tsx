import { Navigate, Route, Routes } from 'react-router-dom';
import DetailPage from '../pages/DetailPage';
import IndexPage from '../pages/IndexPage';
import NotFoundPage from '../pages/NotFoundPage';
import Layout from '../shell/Layout';
import { TILES_STATE } from '../shell/tiles/useLandOnTiles';

/** Every route renders the light rail: index (particles), detail (compact, week blooming), 404 (unlit). */
export default function GalleryRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<IndexPage />} />
        {/* A trimmed breadcrumb URL lands on the list it names: the index's tiles. */}
        <Route path="components" element={<Navigate to="/" replace state={TILES_STATE} />} />
        <Route path="components/:slug" element={<DetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
