const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	content: ["./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", ...defaultTheme.fontFamily.sans],
				serif: ["Spectral", "Lora", ...defaultTheme.fontFamily.serif],
				display: ["Outfit", ...defaultTheme.fontFamily.sans],
			},
			colors: {
				background: "#EDEBE9",
				...defaultTheme.colors,
			},
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: false,
	},
};
