import { round } from "@utils/generic";
import { FinancialDetails } from "@schema/financial-details-schema";
import { Expense } from "@schema/expense-schema";
import {
	calculateHecsRepayment,
	calculateIncomeTax,
	getMarginalTaxRate,
	calculateMedicareLevySurcharge,
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

	return round(savingsWithFHSS - savingsWithoutFHSS);
};

export const forecastSavings = (finances: FinancialDetails, months: number) => {
	const monthlySavings = calculateAnnualSavings(finances).cash / 12;
	return round(monthlySavings * months);
};

export const calculateTotalExpenses = (expenses?: Expense[]) => {
	if (expenses !== undefined) {
		const totalExpenses = expenses
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
			.reduce((a, b) => a + b, 0);

		return round(totalExpenses);
	} else {
		return 0;
	}
};

export const calculatePostTaxAmount = (
	assessableIncome: number,
	hecs = false,
	medicareLevySurchargeExempt = false,
	medicareLevyExempt = false
) => {
	const hecsPaid = hecs ? calculateHecsRepayment(assessableIncome) : 0;

	const incomeTax = calculateIncomeTax(assessableIncome);

	const medicareLevy = medicareLevyExempt ? 0 : 0.02 * assessableIncome;
	const medicareLevySurcharge = medicareLevySurchargeExempt
		? 0
		: calculateMedicareLevySurcharge(assessableIncome);

	return round(
		assessableIncome -
			hecsPaid -
			incomeTax -
			medicareLevy -
			medicareLevySurcharge
	);
};
