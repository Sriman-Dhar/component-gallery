import { REPO_URL } from '../lib/site';
import { FOCUS_RING } from './focus';

interface Props {
  /** Link text once the repo is public. */
  label: string;
  /** Plain note shown while REPO_URL is null, so there is never a dead link. */
  pending: string;
  className: string;
}

/** The repo link, driven by the one REPO_URL setting: a real link, or a quiet non-link note. */
export default function RepoLink({ label, pending, className }: Props) {
  if (!REPO_URL) return <span className="font-mono text-meta text-text-2">{pending}</span>;
  return (
    <a href={REPO_URL} className={`rounded-control font-mono text-meta ${className} ${FOCUS_RING}`}>
      {label}
    </a>
  );
}
