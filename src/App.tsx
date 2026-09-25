import { Route, Routes } from 'react-router-dom';
import Layout from './ui/Layout';
import IndexPage from './pages/IndexPage';
import DetailPage from './pages/DetailPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
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
