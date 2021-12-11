module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      'sm': '440px',
      // => @media (min-width: 640px) { ... }

      'md': '576px',
      // => @media (min-width: 768px) { ... }

      'lg': '768px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1025px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1680px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors: {
        darkish : "#353535",
        greenish: "#3c6e71",
        greenish_dark: "#2f5658",
        lightish: "#ffffff",
        grayish: "#d9d9d9",
        grayish_dark: "#aaaaaa",
        blueish: "#284b63",
        blueish_light: "#3d7398",
        blueish_dark: "#1f3a4d"
      }
    },
    fontFamily: {
      myfont: ["Poppins"]
    }
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      backgroundColor: ['disabled'],
    },
  },
  plugins: [],
}
