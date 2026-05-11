// tailwind.config.js 
// {import('tailwindcss').Config} 
export default {
  darkMode: "class", // ye hona zaruri hai
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        campton: ['Campton', 'sans-serif'],
      },
      zIndex: {
        9999: "9999",
      },
      animation: {
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        shimmer: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
    },
  },
  plugins: [],
};
