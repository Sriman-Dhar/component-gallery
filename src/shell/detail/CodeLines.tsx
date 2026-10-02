import { useMemo } from 'react';
import { highlight } from '../../lib/highlight';

/** Lines of highlighted source, numbered in the gutter (CSS counters, never copied with the code). */
export default function CodeLines({ code, limit }: { code: string; limit?: number }) {
  const lines = useMemo(() => highlight(code.replace(/\n$/, '')), [code]);
  return (
    <code className="code-lines block">
      {lines.slice(0, limit).map((tokens, i) => (
        <span key={i} className="code-line block min-h-[20px]">
          {tokens.map((token, j) =>
            token.kind === 'p' ? token.text : (
              <span key={j} className={`tok-${token.kind}`}>
                {token.text}
              </span>
            ),
          )}
        </span>
      ))}
    </code>
  );
}
