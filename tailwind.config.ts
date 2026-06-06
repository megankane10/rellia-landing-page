import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        "host-grotesk": ["Host Grotesk", "-apple-system", "Roboto", "Helvetica", "sans-serif"],
        urbanist: ["Urbanist", "-apple-system", "Roboto", "Helvetica", "sans-serif"],
      },
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        rellia: {
          teal: "#0D3540",
          mint: "#9DD6D0",
          /** Darker mint for text on white (waitlist CTA hover, etc.) */
          mintDark: "#1A5C56",
          /** Light grey-teal wash (CTA/footer band, light headers) */
          cream: "#EEF2F2",
          /** Muted grey-teal band behind CTA + footer padding (continuous with footer) */
          greyTeal: "#C5D8D5",
        },
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
        marquee: {
          "0%": { transform: "translate3d(0%, 0, 0)" },
          "100%": { transform: "translate3d(-50%, 0, 0)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        /** Bottom CTA: slide up + unblur on scroll into view */
        "cta-reveal": {
          "0%": { opacity: "0", transform: "translateY(36px)", filter: "blur(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
        /** Horizontal rule: grow top→bottom with unblur */
        "line-reveal": {
          "0%": { opacity: "0", transform: "scaleY(0)", filter: "blur(10px)" },
          "100%": { opacity: "1", transform: "scaleY(1)", filter: "blur(0)" },
        },
        /** Reveals text left→right as if filling with color (clip-path) */
        "healthcare-fill": {
          from: { clipPath: "inset(0 100% 0 0)" },
          to: { clipPath: "inset(0 0% 0 0)" },
        },
        /** Moving brand gradient for hero headline text */
        "rellia-gradient": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        /** Footer credit: mint glow sweeps left→right across linked name */
        "glow-sweep": {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee 22s linear infinite",
        marqueeFast: "marquee 14s linear infinite",
        "fade-up": "fade-up 0.75s ease-out both",
        "cta-reveal": "cta-reveal 0.95s cubic-bezier(0.22, 1, 0.36, 1) both",
        "line-reveal": "line-reveal 0.85s cubic-bezier(0.22, 1, 0.36, 1) both",
        /** `both` = start state during delay (stays clipped), `forwards` = stay filled at end */
        "healthcare-fill":
          "healthcare-fill 1.15s cubic-bezier(0.22, 1, 0.36, 1) 0.65s both forwards",
        "rellia-gradient": "rellia-gradient 6s ease-in-out infinite",
        "glow-sweep": "glow-sweep 3.2s ease-in-out 0.35s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
