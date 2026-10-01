/**
 * Text split for the letter rise: each word is its own clipping box (so lines still wrap between words),
 * each letter a `.letter` span that GSAP lifts in. Hidden from screen readers; the parent carries the
 * plain text as its accessible name. The box reserves room past the advance on every side but the top
 * (0.12em under the baseline for descenders, 0.06em at the ends for serif tails such as the y's), with a
 * matching negative margin at the ends so the reserve never moves the text.
 */
export default function RiseText({ text, letterClass = '' }: { text: string; letterClass?: string }) {
  const words = text.split(' ');
  return (
    <span aria-hidden="true">
      {words.map((word, w) => (
        <span key={w}>
          <span className="-mx-[0.06em] inline-block overflow-hidden px-[0.06em] pb-[0.12em] align-bottom">
            {[...word].map((char, i) => (
              <span key={i} className={`letter inline-block ${letterClass}`}>
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
