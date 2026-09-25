import { useParams } from 'react-router-dom';
import { findEntry } from '../lib/registry';
import CodePanel from '../ui/CodePanel';
import DemoPanel from '../ui/DemoPanel';
import PromptPanel from '../ui/PromptPanel';
import Tabs from '../ui/Tabs';
import TypeLabel from '../ui/TypeLabel';
import NotFoundPage from './NotFoundPage';

export default function DetailPage() {
  const { slug = '' } = useParams();
  const entry = findEntry(slug);
  if (!entry) return <NotFoundPage />;

  const { meta } = entry;
  return (
    <article>
      <header className="mb-6 space-y-2">
        <h1 className="text-2xl font-semibold">{meta.name}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <TypeLabel type={meta.type} />
          <span>Week {meta.week}</span>
          <span>{meta.date}</span>
        </div>
        <p className="text-gray-700">{meta.summary}</p>
      </header>
      <Tabs
        items={[
          { id: 'demo', label: 'Demo', content: <DemoPanel entry={entry} /> },
          { id: 'code', label: 'Code', content: <CodePanel entry={entry} /> },
          { id: 'prompt', label: 'Prompt', content: <PromptPanel prompt={meta.prompt} /> },
        ]}
      />
    </article>
  );
}
