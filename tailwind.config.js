/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        MontserratSemiBold: ["Montserrat-SemiBold", "sans"],
        MontserratRegular: ["Montserrat-Regular", "sans"],
      },
    },
  },
  plugins: [],
};
