const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	content: ["./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", ...defaultTheme.fontFamily.sans],
				display: ["Outfit", '"Playfair Display"', "sans-serif"],
			},
		},
	},
	plugins: [],
};
