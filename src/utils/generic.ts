export function round(value: number, exp = 2) {
	if (typeof exp === "undefined" || +exp === 0) return Math.round(value);

	if (Number.isNaN(value) || exp % 1 !== 0) return Number.NaN;

	// Shift
	let valueArray = value.toString().split("e");
	value = Math.round(
		+`${valueArray[0]}e${valueArray[1] ? +valueArray[1] + exp : exp}`
	);

	// Shift back
	valueArray = value.toString().split("e");
	return +`${valueArray[0]}e${valueArray[1] ? +valueArray[1] - exp : -exp}`;
}

export const isValidNumber = (value: string) => {
	return !Number.isNaN(value) && !Number.isNaN(Number.parseFloat(value));
};

interface FormatDollarOptions {
	includeSign?: boolean;
	shorten?: boolean;
	decimalPlaces?: number;
}

export const formatDollars = (
	value?: number,
	options?: FormatDollarOptions
) => {
	if (value === undefined) return "N/A";

	const includeSign = options?.includeSign ?? false;
	const shorten = options?.shorten ?? false;
	const decimalPlaces = options?.decimalPlaces ?? 2;

	let sign = "";
	if (includeSign && value !== 0) {
		sign = value > 0 ? "+" : "-";
	}

	const formattedNumber = Intl.NumberFormat("en-AU", {
		notation: shorten ? "compact" : "standard",
		maximumFractionDigits: decimalPlaces,
	}).format(Math.abs(value));

	return `${sign}$${formattedNumber}`;
};
