import { useEffect, useState } from 'react';
import type { GalleryEntry, SourceFile } from '../lib/types';
import CopyButton from './CopyButton';

export default function CodePanel({ entry }: { entry: GalleryEntry }) {
  const [files, setFiles] = useState<SourceFile[] | null>(null);

  useEffect(() => {
    let live = true;
    entry.loadSources().then((loaded) => live && setFiles(loaded));
    return () => {
      live = false;
    };
  }, [entry]);

  if (!files) return <p className="text-sm text-gray-500">Loading code</p>;

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <div key={file.fileName} className="rounded border border-gray-200">
          <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
            <span className="text-xs text-gray-700">{file.fileName}</span>
            <CopyButton text={file.code} />
          </div>
          <pre className="overflow-x-auto p-3 text-xs">
            <code>{file.code}</code>
          </pre>
        </div>
      ))}
    </div>
  );
}
