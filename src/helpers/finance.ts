import { round } from "@utils/helpers";
import { Finance } from "types/finance";

export const calculateSavings = (finances: Finance) => {
	const superAmount = 0.1 * finances.salary;

	const fhss = finances.utiliseFHSS ? 15_000 : 0;

	const preTaxAmount = finances.salary + (finances.bonus ?? 0) - fhss;

	const postTaxAmount = calculatePostTaxAmount(preTaxAmount, true);

	let postExpensesAmount = postTaxAmount;

	if (finances.monthlyExpenses) {
		postExpensesAmount =
			postTaxAmount -
			Object.values(finances.monthlyExpenses).reduce((a, b) => a + b, 0) * 12;
	}

	const savings = postExpensesAmount - finances.desiredFunMoney * 12;

	return { savings: round(savings + fhss * 0.85, 2), super: superAmount };
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

export const calculatePostTaxAmount = (preTaxAmount: number, hecs = false) => {
	const hecsPaid = hecs ? 0.04 * preTaxAmount : 0;

	return preTaxAmount - hecsPaid - calculateTax(preTaxAmount);
};
