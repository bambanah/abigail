import { Expense } from "@schema/expense-schema";
import { FinancialDetails } from "@schema/financial-details-schema";
import { round } from "@utils/generic";
import { FHSS_MAX_ANNUAL_DEPOSIT, FHSS_MAX_TOTAL_DEPOSIT } from "./constants";
import {
	calculateEmployerSuperContribution,
	calculateHecsRepayment,
	calculateIncomeTax,
	calculateMedicareLevy,
	calculateMedicareLevySurcharge,
	getMarginalTaxRate,
} from "./finance-helpers";

interface YearlySnapshot {
	year: number;
	totalCash: number;
	totalInvested?: number;
	totalValue: number;

	assessableIncome?: number;
	takeHomeIncome?: number;

	totalSuper: number;
	super?: {
		fhss?: number;
		employerCont?: number;
		concessionalCont?: number;
		nonConcessionalCont?: number;
	};

	totalDeductions: number;
	deductions?: {
		incomeTax?: number;
		medicareLevy?: number;
		medicareLevySurcharge?: number;
		hecs?: number;
	};

	totalExpenses?: number;
}

interface EsimateSavingsOptions {
	years?: number;
	superInterest?: number;
	salaryIndexation?: number;
}

export const estimateSavings = (
	finances: FinancialDetails,
	options?: EsimateSavingsOptions
) => {
	const years = options?.years ?? 1;
	// TODO: Probably a better way of handling this
	const superInterest = options?.superInterest ?? 0.06;
	const salaryIndexation = options?.salaryIndexation ?? 0.025;

	// TODO: Populate this
	const yearlySnapshots: YearlySnapshot[] = [];

	let salary = finances.salary;

	let cashSavingsAmount = finances.currentCash ?? 0;
	// Not including FHSS deposits, as they will be withdrawn
	let superAmount = 0;
	let fhssAmountInSuper = 0;
	let totalFhssDeposit = 0;
	let totalInvestedAmount = 0;

	for (let i = 0; i < years; i++) {
		// Apply interest/indexing from the second year onwards
		if (i > 0) {
			salary += salary * salaryIndexation;

			superAmount += superAmount * superInterest;
			fhssAmountInSuper += fhssAmountInSuper * superInterest;

			totalInvestedAmount += totalInvestedAmount * 0.1;
		}

		const bonus =
			finances.bonus !== undefined && finances.bonus.length >= i + 1
				? finances.bonus[i] ?? 0
				: 0;
		let assessableIncome = salary + bonus;

		// ----- 1. Salary Sacrifice -----
		if (
			finances.schemes?.fhss &&
			totalFhssDeposit < FHSS_MAX_TOTAL_DEPOSIT &&
			salary > 30_000
		) {
			const amountToDeposit = Math.min(
				FHSS_MAX_ANNUAL_DEPOSIT,
				FHSS_MAX_TOTAL_DEPOSIT - totalFhssDeposit
			);

			assessableIncome -= amountToDeposit;

			totalFhssDeposit += amountToDeposit;
			fhssAmountInSuper += 0.85 * amountToDeposit;
		}

		// TODO: Voluntary concessional super contributions

		// ----- 2. Tax and HECS -----
		const takeHomeIncome = calculatePostTaxAmount(
			assessableIncome,
			finances.hecs
		);

		/// ----- 3. Expenses -----
		const postExpensesAmount =
			takeHomeIncome - calculateTotalExpenses(finances.expenses);

		superAmount += calculateEmployerSuperContribution(salary);
		totalInvestedAmount += 0 * postExpensesAmount;
		cashSavingsAmount += 1 * postExpensesAmount;

		yearlySnapshots.push({
			year: i + 1,
			totalCash: round(cashSavingsAmount),
			totalInvested: round(totalInvestedAmount),
			totalSuper: round(superAmount),
			totalValue: round(
				cashSavingsAmount +
					totalInvestedAmount +
					superAmount +
					fhssAmountInSuper
			),

			super: {
				fhss: round(fhssAmountInSuper),
			},
			totalDeductions: round(assessableIncome - takeHomeIncome),
		});
	}

	const fhssWithdrawalTaxRate = Math.max(0, getMarginalTaxRate(salary) - 0.3);
	const fhssAfterWithdrawal = fhssAmountInSuper * (1 - fhssWithdrawalTaxRate);

	return {
		estimatedTotal: round(
			cashSavingsAmount +
				totalInvestedAmount +
				fhssAfterWithdrawal +
				superAmount
		),
		cash: cashSavingsAmount,
		super: superAmount,
		yearlySnapshots,
	};
};

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

export const calculatePostTaxAmount = (
	assessableIncome: number,
	hecs = false,
	medicareLevySurchargeExempt = false,
	medicareLevyExempt = false
) => {
	const hecsPaid = hecs ? calculateHecsRepayment(assessableIncome) : 0;

	const incomeTax = calculateIncomeTax(assessableIncome);

	const medicareLevy = medicareLevyExempt
		? 0
		: calculateMedicareLevy(assessableIncome);
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
