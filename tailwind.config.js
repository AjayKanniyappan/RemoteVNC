module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  plugins: [require('daisyui')],
};
