import { round } from "@utils/generic";
import { FinancialDetails } from "@schema/financial-details-schema";
import { Expense } from "@schema/expense-schema";
import {
	calculateHecsRepayment,
	calculateTax,
	getMarginalTaxRate,
} from "./finance-helpers";

export const calculateAnnualSavings = (finances: FinancialDetails) => {
	const fhss = finances.schemes?.fhss ? 15_000 : 0;

	const assessableIncome = finances.salary + (finances.bonus ?? 0) - fhss;

	const takeHomeIncome = calculatePostTaxAmount(
		assessableIncome,
		finances.hecs
	);

	const postExpensesAmount =
		takeHomeIncome - calculateTotalExpenses(finances.expenses);

	// FHSS gets taxed at marginal tax rate - 30% when withdrawn
	const fhssWithdrawalTaxRate = Math.max(
		0,
		getMarginalTaxRate(assessableIncome) - 0.3
	);

	const fhssAmountInSuper = 0.85 * fhss;
	const fhssAfterWithdrawal = fhssAmountInSuper * (1 - fhssWithdrawalTaxRate);

	return {
		cash: round(postExpensesAmount + fhssAfterWithdrawal, 2),
		super: 0.1 * finances.salary,
	};
};

export const getAdvantageOfFHSS = (finances: FinancialDetails) => {
	const { cash: savingsWithFHSS } = calculateAnnualSavings({
		...finances,
		schemes: { fhss: true },
	});
	const { cash: savingsWithoutFHSS } = calculateAnnualSavings({
		...finances,
		schemes: { fhss: false },
	});

	return savingsWithFHSS - savingsWithoutFHSS;
};

export const forecastSavings = (finances: FinancialDetails, months: number) => {
	const monthlySavings = calculateAnnualSavings(finances).cash / 12;
	return round(monthlySavings * months, 2);
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

	// TODO: Medicare levy is a thing

	return preTaxAmount - hecsPaid - calculateTax(preTaxAmount);
};
