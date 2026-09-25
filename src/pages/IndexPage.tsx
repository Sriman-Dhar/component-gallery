import { Link } from 'react-router-dom';
import { registry } from '../lib/registry';
import TypeLabel from '../ui/TypeLabel';

export default function IndexPage() {
  return (
    <section>
      <h1 className="mb-6 text-2xl font-semibold">Components</h1>
      <ul className="divide-y divide-gray-200 border-y border-gray-200">
        {registry.map(({ meta }) => (
          <li key={meta.slug} className="flex flex-wrap items-center gap-3 py-3">
            <Link to={`/components/${meta.slug}`} className="font-medium underline">
              {meta.name}
            </Link>
            <TypeLabel type={meta.type} />
            <span className="text-sm text-gray-500">Week {meta.week}</span>
            <span className="text-sm text-gray-500">/components/{meta.slug}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
