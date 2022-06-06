module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      boxShadow: {
        'custom': '5px 7px 0px #363636'
      },
      maxWidth: {
        '300': '300px'
      }
    },
    container: {
      center: true,
    },
    fontFamily: {
      'sans': ['Cabin', 'sans-serif']
    }
  },
  plugins: [],
};
