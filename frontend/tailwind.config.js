/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
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
                // Geist theme colors
                ectoplasm: {
                    DEFAULT: "#14b8a6",
                    50: "#f0fdfa",
                    100: "#ccfbf1",
                    200: "#99f6e4",
                    300: "#5eead4",
                    400: "#2dd4bf",
                    500: "#14b8a6",
                    600: "#0d9488",
                    700: "#0f766e",
                    800: "#115e59",
                    900: "#134e4a",
                },
                crimson: {
                    DEFAULT: "#be123c",
                    50: "#fff1f2",
                    100: "#ffe4e6",
                    200: "#fecdd3",
                    300: "#fda4af",
                    400: "#fb7185",
                    500: "#f43f5e",
                    600: "#e11d48",
                    700: "#be123c",
                    800: "#9f1239",
                    900: "#881337",
                },
            },
            fontFamily: {
                heading: ["Crimson Text", "serif"],
                body: ["Manrope", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
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
                "fade-in": {
                    from: { opacity: "0", transform: "translateY(10px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "glow-pulse": {
                    "0%, 100%": { boxShadow: "0 0 5px rgba(20, 184, 166, 0.3)" },
                    "50%": { boxShadow: "0 0 20px rgba(20, 184, 166, 0.6)" },
                },
                "dice-roll": {
                    "0%": { transform: "rotateX(0deg) rotateY(0deg)" },
                    "25%": { transform: "rotateX(90deg) rotateY(45deg)" },
                    "50%": { transform: "rotateX(180deg) rotateY(90deg)" },
                    "75%": { transform: "rotateX(270deg) rotateY(135deg)" },
                    "100%": { transform: "rotateX(360deg) rotateY(180deg)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.3s ease-out forwards",
                "glow-pulse": "glow-pulse 2s ease-in-out infinite",
                "dice-roll": "dice-roll 0.5s ease-out",
            },
            boxShadow: {
                ectoplasm: "0 0 20px rgba(20, 184, 166, 0.5)",
                crimson: "0 0 20px rgba(190, 18, 60, 0.5)",
                deep: "0 10px 30px -10px rgba(0,0,0,0.8)",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
