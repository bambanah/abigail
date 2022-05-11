import { round } from "@utils/helpers";
import { Finance } from "types/finance";

export const calculateSavings = (finances: Finance) => {
	const superAmount = 0.1 * finances.salary;

	const fhss = finances.utiliseFHSS ? 15_000 : 0;

	const preTaxAmount =
		finances.salary + (finances.bonus ?? 0) - superAmount - fhss;

	const taxPaid = 0.15 * (superAmount + fhss) + calculateTax(preTaxAmount);

	const hecsPaid = 0.04 * preTaxAmount;

	const postTaxAmount = preTaxAmount - hecsPaid - calculateTax(preTaxAmount);

	const postExpensesAmount =
		postTaxAmount -
		Object.values(finances.expenses).reduce((a, b) => a + b, 0) * 12;

	const savings = postExpensesAmount - finances.desiredFunMoney * 12;

	if (savings < 0) return;

	return round(savings + fhss * 0.85, 2);
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
