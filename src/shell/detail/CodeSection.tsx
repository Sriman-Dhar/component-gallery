import { useEffect, useState } from 'react';
import type { GalleryEntry, SourceFile } from '../../lib/types';
import CodeFile from './CodeFile';
import SectionHeading from './SectionHeading';

/** "The code": every source file of the component, stacked; the first opens, the rest are one click away. */
export default function CodeSection({ entry }: { entry: GalleryEntry }) {
  const [files, setFiles] = useState<SourceFile[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    entry
      .loadSources()
      .then((loaded) => live && setFiles(loaded))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, [entry]);

  return (
    <section id="code" tabIndex={-1} aria-labelledby="the-code" className="scroll-mt-24 space-y-5 pt-4 outline-none">
      <SectionHeading id="the-code">The code</SectionHeading>
      <div className="min-w-0 space-y-3">
        {failed ? <p className="text-text-2">The source could not be loaded. Reload the page to try again.</p> : null}
        {!files && !failed ? <p className="font-mono text-small text-text-2">Loading code</p> : null}
        {files?.map((file, i) => <CodeFile key={file.fileName} file={file} defaultOpen={i === 0} />)}
      </div>
    </section>
  );
}
