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
    },
  },
  plugins: [],
};
