import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Not found</h1>
      <p className="text-gray-700">There is no component at this address.</p>
      <Link to="/" className="underline">
        Back to all components
      </Link>
    </section>
  );
}
