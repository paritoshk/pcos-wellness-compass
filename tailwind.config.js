const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './index.html', // Ensure index.html is scanned for classes if you use any there
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))", // This will be our Nari Secondary/Background
        foreground: "hsl(var(--foreground))", // This will be our Nari Text Main
        nari: {
          primary: "#4A9D9C",   // Teal
          secondary: "#F7F9FA", // Soft Gray (can also be --background)
          accent: "#FF7062",    // Coral
          "text-main": "#333D47", // Dark Slate Gray (can also be --foreground)
          "text-muted": "#768595",// Lighter Gray
        },
        primary: {
          DEFAULT: "hsl(var(--primary))", // Will be Nari Primary
          foreground: "hsl(var(--primary-foreground))", // Text on Nari Primary
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // Will be Nari Accent (or another secondary if needed)
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))", // Can be Nari Text Muted or a lighter gray
          foreground: "hsl(var(--muted-foreground))", // Text on muted
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // Will be Nari Accent
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Remove old pcos color if it exists as a direct color
        // pcos: '#C679C0', // Example if it was hardcoded
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        poppins: ["Poppins", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 