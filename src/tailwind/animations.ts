export const keyframes = {
  "accordion-down": {
    from: { height: "0" },
    to: { height: "var(--radix-accordion-content-height)" }
  },
  "accordion-up": {
    from: { height: "var(--radix-accordion-content-height)" },
    to: { height: "0" }
  },
  "fade-in": {
    from: { opacity: "0" },
    to: { opacity: "1" }
  },
  "fade-out": {
    from: { opacity: "1" },
    to: { opacity: "0" }
  },
  "slide-in": {
    from: { transform: "translateY(20px)", opacity: "0" },
    to: { transform: "translateY(0)", opacity: "1" }
  },
  "slide-out": {
    from: { transform: "translateX(0)", opacity: "1" },
    to: { transform: "translateX(40px)", opacity: "0" }
  },
  "neg-slide-in": {
    from: { transform: "translateY(-10px)", opacity: "0" },
    to: { transform: "translateY(0)", opacity: "1" }
  },
  "scale-in": {
    from: { transform: "scale(0.95)", opacity: "0" },
    to: { transform: "scale(1)", opacity: "1" }
  }
};

export const animation = {
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",
  "accordion-right": "accordion-right 0.2s ease-out",
  "accordion-left": "accordion-left 0.2s ease-out",
  "accordion-close-horizontal": "accordion-close-horizontal 0.2s ease-out",

  "collapsible-down": "collapsible-down 0.2s ease-out",
  "collapsible-up": "collapsible-up 0.2s ease-out",
  "collapsible-right": "collapsible-right 0.2s ease-out",
  "collapsible-left": "collapsible-left 0.2s ease-out",
  "collapsible-close-horizontal": "collapsible-close-horizontal 0.2s ease-out",

  "fade-in": "fade-in 0.3s ease-out",
  "fade-out": "fade-out 0.2s ease-out forwards",
  "slide-in": "slide-in 0.35s ease-out",
  "slide-out": "slide-out 0.35s ease-out forwards",
  "neg-slide-in": "neg-slide-in 0.2s ease-out",
  "scale-in": "scale-in 0.2s ease-out"
};
