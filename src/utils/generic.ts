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

export const formatDollars = (value: number | undefined) => {
	return `$${
		value?.toLocaleString(undefined, {
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		}) ?? "N/A"
	}`;
};
