import { useParams } from 'react-router-dom';
import { shipped } from '../lib/catalogue';
import { findEntry } from '../lib/registry';
import { weekOf } from '../lib/ruler';
import AskSection from '../shell/detail/AskSection';
import CodeSection from '../shell/detail/CodeSection';
import DetailHeader from '../shell/detail/DetailHeader';
import PrevNext from '../shell/detail/PrevNext';
import Stage from '../shell/detail/Stage';
import LightRail from '../shell/rail/LightRail';
import NotFoundPage from './NotFoundPage';

const marks = shipped.map(({ meta }) => ({ slug: meta.slug, date: meta.date }));

/** Detail: header rail, compact light rail with this week blooming, stage, the ask, the code, prev / next. */
export default function DetailPage() {
  const { slug = '' } = useParams();
  const entry = findEntry(slug);
  if (!entry) return <NotFoundPage />;

  const { meta } = entry;
  const litWeek = meta.week > 0 ? weekOf(meta.date) : undefined;
  return (
    <article key={meta.slug} className="space-y-14">
      <div>
        <DetailHeader meta={meta} />
        <LightRail variant="compact" marks={marks} litWeek={litWeek} />
      </div>
      <Stage entry={entry} />
      <AskSection prompt={meta.prompt} />
      <CodeSection entry={entry} />
      <PrevNext slug={meta.slug} />
    </article>
  );
}
