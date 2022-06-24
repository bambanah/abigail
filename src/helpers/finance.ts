import { round } from "@utils/helpers";
import { Finance } from "types/finance";

export const calculateSavings = (finances: Finance) => {
	const superAmount = 0.1 * finances.salary;

	const fhss = finances.utiliseFHSS ? 15_000 : 0;

	const preTaxAmount = finances.salary + (finances.bonus ?? 0) - fhss;

	const postTaxAmount = calculatePostTaxAmount(preTaxAmount, finances.hecs);

	let postExpensesAmount = postTaxAmount;

	if (finances.monthlyExpenses) {
		postExpensesAmount =
			postTaxAmount -
			Object.values(finances.monthlyExpenses).reduce((a, b) => a + b, 0) * 12;
	}

	const savings = postExpensesAmount - (finances.desiredFunMoney ?? 0) * 12;

	return { savings: round(savings + fhss * 0.85, 2), super: superAmount };
};

export const calculatePostTaxAmount = (preTaxAmount: number, hecs = false) => {
	const hecsPaid = hecs ? calculateHecsAmount(preTaxAmount) : 0;

	return preTaxAmount - hecsPaid - calculateTax(preTaxAmount);
};

export const calculateHecsAmount = (amount: number) => {
	if (amount > 137_897) {
		return 0.1 * amount;
	} else if (amount > 130_092) {
		return 0.095 * amount;
	} else if (amount > 122_728) {
		return 0.09 * amount;
	} else if (amount > 115_781) {
		return 0.085 * amount;
	} else if (amount > 109_227) {
		return 0.08 * amount;
	} else if (amount > 103_045) {
		return 0.075 * amount;
	} else if (amount > 97_212) {
		return 0.07 * amount;
	} else if (amount > 91_709) {
		return 0.065 * amount;
	} else if (amount > 86_518) {
		return 0.06 * amount;
	} else if (amount > 81_620) {
		return 0.055 * amount;
	} else if (amount > 77_001) {
		return 0.05 * amount;
	} else if (amount > 72_641) {
		return 0.045 * amount;
	} else if (amount > 68_529) {
		return 0.04 * amount;
	} else if (amount > 64_651) {
		return 0.035 * amount;
	} else if (amount > 60_991) {
		return 0.03 * amount;
	} else if (amount > 57_538) {
		return 0.025 * amount;
	} else if (amount > 54_282) {
		return 0.02 * amount;
	} else if (amount >= 47_014) {
		return 0.01 * amount;
	} else {
		return 0;
	}
};

export const calculateTax = (amount: number) => {
	if (amount > 180_000) {
		return 51_667 + 0.45 * (amount - 180_000);
	} else if (amount > 120_000) {
		return 29_467 + 0.37 * (amount - 120_000);
	} else if (amount > 45_000) {
		return 5092 + 0.325 * (amount - 45_000);
	} else if (amount > 18_200) {
		return 0.19 * amount;
	} else {
		return 0;
	}
};
