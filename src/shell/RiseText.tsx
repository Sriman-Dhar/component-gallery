/**
 * Text split for the letter rise: each word is its own clipping box (so lines still wrap between words),
 * each letter a `.letter` span that GSAP lifts in. Hidden from screen readers; the parent carries the
 * plain text as its accessible name.
 */
export default function RiseText({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <span aria-hidden="true">
      {words.map((word, w) => (
        <span key={w}>
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            {[...word].map((char, i) => (
              <span key={i} className="letter inline-block">
                {char}
              </span>
            ))}
          </span>
          {w < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  );
}
