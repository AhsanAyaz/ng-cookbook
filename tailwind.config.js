/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

module.exports = {
  content: ["./src/**/*.{html,ts,scss}"],
  theme: {
    extend: {
      listStyleType: {
        auto: "auto",
      },
    },
  },
  daisyui: {
    themes: [
      {
        synthwave: {
          ...require("daisyui/src/theming/themes")["synthwave"],
          accent: "yellow",
        },
      },
    ],
  },
  safelist: ["scale-125"],
  plugins: [daisyui],
  darkMode: "class",
};
