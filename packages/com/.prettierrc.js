export default {
  bracketSpacing: true,
  printWidth: 101,
  proseWrap: 'always',
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  overrides: [
    {
      files: ['**/*.json'],
      options: {
        useTabs: false,
      },
    },
  ],
  plugins: ['prettier-plugin-tailwindcss'],
};
