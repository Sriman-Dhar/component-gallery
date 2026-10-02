// ESLint flat config: TypeScript (typescript-eslint), React hooks and Fast Refresh for src/, Node globals for
// the CLI scripts and config files. tsc already owns unused locals/params; lint adds the hooks and refresh rules.
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // .claude holds vendored agent skills, not app code.
  { ignores: ['dist', 'node_modules', 'src/node_modules', 'coverage', '.claude'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { ecmaVersion: 2022, globals: globals.browser },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      // The classic hooks rules. v7's preset also carries the React Compiler rules (refs, immutability, purity),
      // which flag the imperative three.js/GSAP idiom (mutating uniforms and materials in effects and frames);
      // this app does not run the React Compiler, so those stay off rather than reshaping working render code.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [js.configs.recommended],
    languageOptions: { ecmaVersion: 2022, globals: globals.node },
  },
);
