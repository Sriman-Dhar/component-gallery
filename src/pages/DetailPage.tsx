import { useParams } from 'react-router-dom';
import { findShipped, shipped } from '../lib/catalogue';
import { weekOf } from '../lib/ruler';
import { pageTitle, useDocumentTitle } from '../lib/useDocumentTitle';
import AskSection from '../shell/detail/AskSection';
import CodeSection from '../shell/detail/CodeSection';
import DetailHeader from '../shell/detail/DetailHeader';
import PrevNext from '../shell/detail/PrevNext';
import Stage from '../shell/detail/Stage';
import LightRail from '../shell/rail/LightRail';
import NotFoundPage, { NOT_FOUND_TITLE } from './NotFoundPage';

const marks = shipped.map(({ meta }) => ({ slug: meta.slug, date: meta.date }));

/**
 * Detail: header rail, compact light rail with this week blooming, stage, the ask, the code, prev / next.
 * Published components only: the week 0 placeholder and unknown slugs render the 404.
 */
export default function DetailPage() {
  const { slug = '' } = useParams();
  const entry = findShipped(slug);
  // Set here, before the early return: a parent effect runs after its child's and would win.
  useDocumentTitle(entry ? pageTitle(entry.meta.name) : NOT_FOUND_TITLE);
  if (!entry) return <NotFoundPage />;

  const { meta } = entry;
  const litWeek = weekOf(meta.date);
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
