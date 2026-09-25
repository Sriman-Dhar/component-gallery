import { useEffect, useState } from 'react';
import type { GalleryEntry, SourceFile } from '../../lib/types';
import CodeFile from './CodeFile';

/** "The code": every source file of the component, stacked, never behind a tab. */
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
    <section aria-labelledby="the-code" className="grid grid-cols-1 gap-y-4 border-t border-line pt-10 lg:grid-cols-12 lg:gap-x-8">
      <h2 id="the-code" className="text-h2 font-semibold text-text lg:col-span-3">
        The code
      </h2>
      <div className="min-w-0 space-y-6 lg:col-span-9">
        {failed ? <p className="text-text-2">The source could not be loaded. Reload the page to try again.</p> : null}
        {!files && !failed ? <p className="font-mono text-small text-text-2">Loading code</p> : null}
        {files?.map((file) => <CodeFile key={file.fileName} file={file} />)}
      </div>
    </section>
  );
}
