/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./views/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xxl: "1600px",
      xl: "1200px",
      lg: "992px",
      md: "768px",
      sm: "576px",
      xs: "320px"
    },
    extend: {
      colors: {
        primary: "var(--primary)",
        danger: "var(--danger)",
        gray: "var(--gray)",
        "blue": "var(--blue)",
        "green": "var(--green)",
        "light-blue": "var(--light-blue)",
        "blue": "var(--blue)",
        "dark-gray": "var(--dark-gray)",
        "light-gray": "var(--light-blue)",
        "cornflower-blue": "var(--cornflower-blue)",
        "very-light-blue": "var(--very-light-blue)",
      },
      textColor: {
        main: "var(--text-main)",
        sub: "var(--text-sub)",
        gray: "var(--text-gray)",
      },
    },
  },
  plugins: [],
};
