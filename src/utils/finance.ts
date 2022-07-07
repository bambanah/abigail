import { Expense } from "@schema/expense-schema";
import { FinancialDetails } from "@schema/financial-details-schema";
import { round } from "@utils/generic";
import { EsimateSavingsOptions, estimateSavings } from "./forecast";

export const getAdvantageOfFHSS = (
	finances: FinancialDetails,
	options?: EsimateSavingsOptions
) => {
	const { estimatedTotal: savingsWithFHSS } = estimateSavings(
		{
			...finances,
			schemes: { fhss: true },
		},
		options
	);

	const { estimatedTotal: savingsWithoutFHSS } = estimateSavings(
		{
			...finances,
			schemes: { fhss: false },
		},
		options
	);

	return round(savingsWithFHSS - savingsWithoutFHSS);
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
					case "quarterly":
						return amount * 4;
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
