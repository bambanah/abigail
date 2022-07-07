const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	content: ["./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", ...defaultTheme.fontFamily.sans],
				serif: ["Spectral", "Lora", ...defaultTheme.fontFamily.serif],
				display: ['"Source Serif Pro"', ...defaultTheme.fontFamily.serif],
				mono: ['"Overpass Mono"', ...defaultTheme.fontFamily.mono],
				outfit: ["Outfit", ...defaultTheme.fontFamily.sans],
			},
			colors: {
				primary: "#DC2626",
				...defaultTheme.colors,
			},
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: false,
	},
};
