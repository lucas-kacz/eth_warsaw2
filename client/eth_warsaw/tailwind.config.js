// tailwind.config.js
const {nextui} = require("@nextui-org/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@nextui-org/theme/dist/components/button.js", 
    './node_modules/@nextui-org/theme/dist/components/(button|snippet|code|input).js'
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        "white-metal": {
          extend: "dark", // Inherit default values from the dark theme
          colors: {
            background: "#000000", // Black background for a contrasting effect
            foreground: "#ffffff",
            primary: {
              50: "#999999",   // Lighter shades of gray for metallic white effect
              100: "#cccccc",
              200: "#e6e6e6",
              300: "#f0f0f0",
              400: "#f5f5f5",
              500: "#ffffff",  // Metallic white as the main primary color
              600: "#ffffff",
              700: "#ffffff",
              800: "#ffffff",
              900: "#ffffff",
              DEFAULT: "#ffffff",
              foreground: "#ffffff",
            },
            focus: "#f0f0f0", // Light gray for focused elements
          },
          layout: {
            disabledOpacity: "0.3",
            radius: {
              small: "4px",
              medium: "6px",
              large: "8px",
            },
            borderWidth: {
              small: "1px",
              medium: "2px",
              large: "3px",
            },
          },
        },
      },
    }),    
  ],
};