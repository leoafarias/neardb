module.exports = {
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit',
  '*.{js,jsx,ts,tsx}': 'eslint',
  '*.{js,jsx,ts,tsx,md,html,css}': (filenames) => filenames.map((filename) => `prettier --write '${filename}'`),
};
