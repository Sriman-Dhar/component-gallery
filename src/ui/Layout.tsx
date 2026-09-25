import { Link, Outlet } from 'react-router-dom';

/** Placeholder shell. The real design lands in plan item 2. */
export default function Layout() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200 px-6 py-4">
        <Link to="/" className="font-semibold">
          Sriman Gallery
        </Link>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
