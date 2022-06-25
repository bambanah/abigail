import { round } from "@utils/gneric";
import { FinancialDetails } from "@schema/financial-details-schema";
import { Expense } from "@schema/expense-schema";
import { calculateHecsRepayment, calculateTax } from "./finance-helpers";

export const calculateSavings = (finances: FinancialDetails) => {
	const fhss = finances.schemes?.fhss ? 15_000 : 0;

	const preTaxAmount = finances.salary + (finances.bonus ?? 0) - fhss;

	const postExpensesAmount =
		calculatePostTaxAmount(preTaxAmount, finances.hecs) -
		calculateTotalExpenses(finances.expenses);

	// TODO: FHSS gets taxed at marginal tax rate - 30% when withdrawn

	return {
		cash: round(postExpensesAmount + fhss * 0.85, 2),
		super: 0.1 * finances.salary,
	};
};

export const calculateTotalExpenses = (expenses?: Expense[]) =>
	expenses
		?.map(({ cadence, amount }) => {
			switch (cadence) {
				case "weekly":
					return amount * 52;
				case "fortnightly":
					return amount * 21;
				case "monthly":
					return amount * 12;
				case "annually":
					return amount;
			}
		})
		.reduce((a, b) => a + b, 0) ?? 0;

export const calculatePostTaxAmount = (preTaxAmount: number, hecs = false) => {
	const hecsPaid = hecs ? calculateHecsRepayment(preTaxAmount) : 0;

	return preTaxAmount - hecsPaid - calculateTax(preTaxAmount);
};
