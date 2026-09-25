import { Route, Routes } from 'react-router-dom';
import DetailPage from '../pages/DetailPage';
import IndexPage from '../pages/IndexPage';
import NotFoundPage from '../pages/NotFoundPage';
import Layout from '../shell/Layout';

/** Every route renders the light rail: index (particles), detail (compact, week blooming), 404 (unlit). */
export default function GalleryRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route path="components/:slug" element={<DetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
