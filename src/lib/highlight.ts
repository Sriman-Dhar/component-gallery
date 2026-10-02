/**
 * A small TSX tokenizer for the code panels: comments, strings, numbers, keywords, types and calls, enough
 * to give the code its shape without a highlighter dependency. Pure, so it is unit-tested directly.
 */
export type TokenKind = 'c' | 's' | 'n' | 'k' | 't' | 'f' | 'p';
export interface Token {
  kind: TokenKind;
  text: string;
}

const KEYWORDS = new Set(
  'import export from default as const let var function return if else for while do switch case break continue new typeof instanceof in of void delete throw try catch finally class extends interface type enum async await yield null undefined true false this super readonly keyof satisfies'.split(
    ' ',
  ),
);

const RULES: [TokenKind | 'w', RegExp][] = [
  ['c', /\/\*[\s\S]*?\*\/|\/\/[^\n]*/y],
  ['s', /`(?:\\[\s\S]|[^\\`])*`|'(?:\\.|[^\\'\n])*'|"(?:\\.|[^\\"\n])*"/y],
  ['n', /\b\d[\d_]*(?:\.\d+)?\b/y],
  ['w', /[A-Za-z_$][\w$]*/y],
  ['p', /\s+|[^\sA-Za-z_$\d'"`/]+|\//y],
];

function wordKind(word: string, rest: string): TokenKind {
  if (KEYWORDS.has(word)) return 'k';
  if (/^[A-Z]/.test(word)) return 't';
  return /^\s*\(/.test(rest) ? 'f' : 'p';
}

/** The whole source as lines of tokens (a token that spans lines, a block comment, splits at each break). */
export function highlight(code: string): Token[][] {
  const lines: Token[][] = [[]];
  const push = (kind: TokenKind, text: string) => {
    text.split('\n').forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ kind, text: part });
    });
  };
  let at = 0;
  while (at < code.length) {
    for (const [kind, re] of RULES) {
      re.lastIndex = at;
      const match = re.exec(code);
      if (!match) continue;
      const text = match[0];
      push(kind === 'w' ? wordKind(text, code.slice(at + text.length, at + text.length + 4)) : kind, text);
      at += text.length;
      break;
    }
  }
  return lines;
}
