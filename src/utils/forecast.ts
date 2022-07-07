import { FinancialDetails } from "@schema/financial-details-schema";
import { FHSS_MAX_ANNUAL_DEPOSIT, FHSS_MAX_TOTAL_DEPOSIT } from "./constants";
import { calculateTotalExpenses } from "./finance";
import {
	calculateEmployerSuperContribution,
	calculateHecsRepayment,
	calculateIncomeTax,
	calculateMedicareLevy,
	calculateMedicareLevySurcharge,
	getMarginalTaxRate,
} from "./finance-helpers";
import { round } from "./generic";

interface YearlySnapshotSuper {
	employerCont: number;
	concessionalCont: number;
	nonConcessionalCont: number;
	fhssDepositAmount: number;
	fhssAmountInSuper: number;
}

interface YearlySnapshotDeductions {
	incomeTax: number;
	medicareLevy: number;
	medicareLevySurcharge: number;
	hecs: number;
}

export interface YearlySnapshot {
	year: number;
	totalCash: number;
	totalInvested: number;
	totalValue: number;

	salary: number;
	bonus: number;
	assessableIncome: number;
	takeHomeIncome: number;
	postExpensesIncome: number;

	totalSuper: number;
	super: YearlySnapshotSuper;

	totalDeductions: number;
	deductions: YearlySnapshotDeductions;
	hecsAmountLeft: number;

	totalExpenses: number;
}

const initialSnapshot: YearlySnapshot = {
	year: -1,
	totalCash: 0,
	totalInvested: 0,
	totalValue: 0,

	salary: 0,
	bonus: 0,
	assessableIncome: 0,
	takeHomeIncome: 0,
	postExpensesIncome: 0,

	totalSuper: 0,
	super: {
		fhssAmountInSuper: 0,
		fhssDepositAmount: 0,
		concessionalCont: 0,
		employerCont: 0,
		nonConcessionalCont: 0,
	},

	totalDeductions: 0,
	deductions: {
		incomeTax: 0,
		medicareLevy: 0,
		medicareLevySurcharge: 0,
		hecs: 0,
	},
	hecsAmountLeft: 0,

	totalExpenses: 0,
};

interface ForecastGlobals {
	cashSavingsAmount: number;
	hecsAmountLeft: number;
	superAmount: number;
	fhssAmountInSuper: number;
	totalFhssDeposit: number;
	totalInvestedAmount: number;
}

export interface EsimateSavingsOptions {
	years?: number;
	superInterest?: number;
	salaryIndexation?: number;
	includeSuperInTotal?: boolean;
}

export const estimateSavings = (
	finances: FinancialDetails,
	options?: EsimateSavingsOptions
) => {
	const years = options?.years ?? 1;
	// TODO: Probably a better way of handling these interest rates
	const superInterest = options?.superInterest ?? 0.06;
	const salaryIndexation = options?.salaryIndexation ?? 0.025;
	const includeSuperInTotal = options?.includeSuperInTotal ?? true;

	const yearlySnapshots: YearlySnapshot[] = [];

	let salary = finances.salary;

	const globals: ForecastGlobals = {
		cashSavingsAmount: finances.currentCash ?? 0,
		hecsAmountLeft: finances.hecsAmount ?? Number.POSITIVE_INFINITY,
		superAmount: 0,
		fhssAmountInSuper: 0,
		totalFhssDeposit: 0,
		totalInvestedAmount: 0,
	};

	for (let i = 0; i < years; i++) {
		const snapshot: YearlySnapshot = {
			...initialSnapshot,
			year: i + 1,
			super: {
				...initialSnapshot.super,
			},
			deductions: {
				...initialSnapshot.deductions,
			},
		};

		// Apply interest/indexing from the second year onwards
		if (i > 0) {
			salary += salary * salaryIndexation;
			globals.hecsAmountLeft += globals.hecsAmountLeft * 0.01;

			globals.superAmount += globals.superAmount * superInterest;
			globals.fhssAmountInSuper += globals.fhssAmountInSuper * superInterest;

			globals.totalInvestedAmount += globals.totalInvestedAmount * 0.1;
		}

		// ----- 1. Income Package -----
		const bonus =
			finances.bonus !== undefined && finances.bonus.length >= i + 1
				? finances.bonus[i] ?? 0
				: 0;
		let assessableIncome = salary + bonus;

		const employerSuperCont =
			calculateEmployerSuperContribution(assessableIncome);
		globals.superAmount += employerSuperCont;

		snapshot.salary = salary;
		snapshot.bonus = bonus;
		snapshot.super.employerCont = employerSuperCont;

		// ----- 2. Salary Sacrifice -----
		assessableIncome = salarySacrifice(
			finances,
			globals,
			salary,
			snapshot,
			assessableIncome
		);

		// Assessable income is now set in stone after salary sacrificing
		snapshot.assessableIncome = assessableIncome;

		// ----- 3. Tax and HECS -----
		const takeHomeIncome = calculatePostTaxAmount(
			assessableIncome,
			finances.hecs,
			snapshot,
			globals
		);

		// ----- 4. Expenses -----
		const totalExpenses = calculateTotalExpenses(finances.expenses);
		snapshot.totalExpenses = totalExpenses;

		let postExpensesAmount = takeHomeIncome - totalExpenses;

		// TODO: Voluntary non-concessional super contributions
		const nonConcessionalSuperCont = 0;
		globals.superAmount += nonConcessionalSuperCont;
		postExpensesAmount -= nonConcessionalSuperCont;

		// TODO: Invest money
		globals.totalInvestedAmount += 0 * postExpensesAmount;
		globals.cashSavingsAmount += 1 * postExpensesAmount;

		snapshot.postExpensesIncome = postExpensesAmount;
		snapshot.totalInvested = globals.totalInvestedAmount;
		snapshot.totalCash = globals.cashSavingsAmount;
		snapshot.totalSuper = globals.superAmount;

		snapshot.totalValue = round(
			globals.cashSavingsAmount +
				globals.totalInvestedAmount +
				globals.fhssAmountInSuper +
				(includeSuperInTotal ? globals.superAmount : 0)
		);

		yearlySnapshots.push(snapshot);
	}

	const fhssWithdrawalTaxRate = Math.max(0, getMarginalTaxRate(salary) - 0.3);
	const fhssAfterWithdrawal =
		globals.fhssAmountInSuper * (1 - fhssWithdrawalTaxRate);

	return {
		estimatedTotal: round(
			globals.cashSavingsAmount +
				globals.totalInvestedAmount +
				fhssAfterWithdrawal +
				globals.superAmount
		),
		cash: globals.cashSavingsAmount,
		super: globals.superAmount,
		yearlySnapshots,
	};
};

export function calculatePostTaxAmount(
	assessableIncome: number,
	hecs?: boolean,
	snapshot?: YearlySnapshot,
	globals?: ForecastGlobals
) {
	const incomeTax = calculateIncomeTax(assessableIncome);

	const medicareLevy = calculateMedicareLevy(assessableIncome);
	const medicareLevySurcharge =
		calculateMedicareLevySurcharge(assessableIncome);

	const hecsPaid = hecs
		? Math.min(
				calculateHecsRepayment(assessableIncome),
				globals?.hecsAmountLeft ?? Number.POSITIVE_INFINITY
		  )
		: 0;

	const takeHomeIncome =
		assessableIncome -
		incomeTax -
		medicareLevy -
		medicareLevySurcharge -
		hecsPaid;

	if (globals && snapshot) {
		globals.hecsAmountLeft -= hecsPaid;
		snapshot.hecsAmountLeft = globals.hecsAmountLeft;

		snapshot.deductions.incomeTax = incomeTax;
		snapshot.deductions.medicareLevy = medicareLevy;
		snapshot.deductions.medicareLevySurcharge = medicareLevySurcharge;
		snapshot.deductions.hecs = hecsPaid;

		snapshot.totalDeductions = round(
			hecsPaid + incomeTax + medicareLevy + medicareLevySurcharge
		);
	}

	return takeHomeIncome;
}

function salarySacrifice(
	finances: FinancialDetails,
	globals: ForecastGlobals,
	salary: number,
	snapshot: YearlySnapshot,
	assessableIncome: number
) {
	if (
		finances.schemes?.fhss &&
		globals.totalFhssDeposit < FHSS_MAX_TOTAL_DEPOSIT &&
		salary > 30_000
	) {
		const amountToDeposit = Math.min(
			FHSS_MAX_ANNUAL_DEPOSIT,
			FHSS_MAX_TOTAL_DEPOSIT - globals.totalFhssDeposit
		);

		assessableIncome -= amountToDeposit;

		globals.totalFhssDeposit += amountToDeposit;
		snapshot.super.fhssDepositAmount = amountToDeposit;

		globals.fhssAmountInSuper += 0.85 * amountToDeposit;
	}
	snapshot.super.fhssAmountInSuper = globals.fhssAmountInSuper;

	// TODO: Voluntary concessional super contributions
	const concessionalSuperCont = 0;
	globals.superAmount += 0.85 * concessionalSuperCont;
	snapshot.super.concessionalCont = concessionalSuperCont;

	assessableIncome - concessionalSuperCont;

	return assessableIncome;
}
