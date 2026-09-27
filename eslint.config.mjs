import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier/flat';

const config = [
  ...nextVitals,
  prettier,
  { ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts'] },
];

export default config;
