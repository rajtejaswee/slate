/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // <--- CHANGE THIS LINE
    autoprefixer: {},
  },
};

export default config;