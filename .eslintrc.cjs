module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  rules: {
    // This is a JS app without prop-types, and apostrophes in copy are intentional.
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
    // Off: sections deliberately colocate presentational sub-components and use the
    // `SectionWrapper` HOC default export — both flagged by this HMR-only hint.
    // Fast Refresh still works (those modules just full-reload in dev).
  },
  overrides: [
    {
      // Node-context files (build config + serverless API) use Node globals.
      files: [
        '*.config.js',
        '*.cjs',
        'vite.config.js',
        'tailwind.config.js',
        'postcss.config.js',
        'api/**/*.js',
        'tools/**/*.{js,mjs}',
      ],
      env: { node: true, browser: false },
    },
  ],
};
