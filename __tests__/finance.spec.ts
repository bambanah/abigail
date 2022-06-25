import { Expense } from "@schema/expense-schema";
import { FinancialDetails } from "@schema/financial-details-schema";
import {
	calculatePostTaxAmount,
	calculateSavings,
	calculateTotalExpenses,
} from "@utils/finance";
import { calculateTax } from "@utils/finance-helpers";

const defaultSalary = 100_000;

const defaultExpenses: Expense[] = [
	{ title: "expense1", amount: 150, cadence: "weekly" },
	{ title: "expense2", amount: 500, cadence: "fortnightly" },
];

describe("finance calculation", () => {
	it("Should calculate tax", () => {
		expect(calculateTax(15_000)).toEqual(0);
		expect(calculateTax(18_200)).toEqual(0);
		expect(calculateTax(20_000)).toEqual(3800);
		expect(calculateTax(44_000)).toEqual(8360);
		expect(calculateTax(45_000)).toEqual(8550);
		expect(calculateTax(119_000)).toEqual(29_142);
		expect(calculateTax(124_000)).toEqual(30_947);
		expect(calculateTax(179_800)).toEqual(51_593);
		expect(calculateTax(200_000)).toEqual(60_667);
	});

	it("Should calculate hecs repayment", () => {
		expect(calculateTax(15_000)).toEqual(0);
		expect(calculateTax(18_200)).toEqual(0);
		expect(calculateTax(20_000)).toEqual(3800);
		expect(calculateTax(44_000)).toEqual(8360);
		expect(calculateTax(45_000)).toEqual(8550);
		expect(calculateTax(119_000)).toEqual(29_142);
		expect(calculateTax(124_000)).toEqual(30_947);
		expect(calculateTax(179_800)).toEqual(51_593);
		expect(calculateTax(200_000)).toEqual(60_667);
	});

	it("Should calculate total expenses", () => {
		const expenses: Expense[] = [
			{ title: "expense1", amount: 160, cadence: "weekly" },
			{ title: "expense2", amount: 623, cadence: "fortnightly" },
			{ title: "expense3", amount: 500, cadence: "monthly" },
			{ title: "expense4", amount: 751, cadence: "annually" },
		];

		expect(calculateTotalExpenses(expenses)).toEqual(28_154);
	});

	it("Should calculate post tax amount", () => {
		expect(calculatePostTaxAmount(50_000)).toEqual(43_283);
		expect(calculatePostTaxAmount(80_000)).toEqual(63_533);
		expect(calculatePostTaxAmount(100_000)).toEqual(77_033);
		expect(calculatePostTaxAmount(120_000)).toEqual(90_533);
	});

	it("Should calculate savings with expenses", () => {
		const finances: FinancialDetails = {
			salary: defaultSalary,
			hecs: false,
			expenses: defaultExpenses,
		};

		const savings = calculateSavings(finances);

		expect(savings.cash).toEqual(58_733);
		expect(savings.super).toEqual(10_000);
	});

	it("Should calculate savings with HECS and expenses", () => {
		const finances: FinancialDetails = {
			salary: defaultSalary,
			hecs: true,
			expenses: defaultExpenses,
		};

		const savings = calculateSavings(finances);

		expect(savings.cash).toEqual(51_733);
		expect(savings.super).toEqual(10_000);
	});

	it("Should calculate savings with FHSS", () => {
		const finances: FinancialDetails = {
			salary: defaultSalary,
			expenses: defaultExpenses,
			schemes: {
				fhss: true,
			},
		};

		const savings = calculateSavings(finances);

		expect(savings.cash).toEqual(61_358);
		expect(savings.super).toEqual(10_000);
	});

	it("Should calculate savings with expenses, hecs, bonus, and fhss", () => {
		const finances: FinancialDetails = {
			salary: defaultSalary,
			hecs: true,
			bonus: 20_000,
			schemes: {
				fhss: true,
			},
			expenses: defaultExpenses,
		};

		const savings = calculateSavings(finances);

		expect(savings.cash).toEqual(66_983);
		expect(savings.super).toEqual(10_000);
	});

	it("Should calculate savings with expenses, hecs, bonus, and no fhss", () => {
		const finances: FinancialDetails = {
			salary: defaultSalary,
			hecs: true,
			bonus: 20_000,
			schemes: {
				fhss: false,
			},
			expenses: defaultExpenses,
		};

		const savings = calculateSavings(finances);

		expect(savings.cash).toEqual(62_033);
		expect(savings.super).toEqual(10_000);
	});

	it("Should calculate advantage of novated lease vs Alex", () => {
		const baseSalary = 138_000;
		const leaseAnnual = 121 * 52;

		const withoutLease: FinancialDetails = {
			salary: baseSalary,
			hecs: true,
			bonus: 28_000,
			expenses: [
				{ title: "fuel", amount: 160, cadence: "monthly" },
				{ title: "service", amount: 500, cadence: "annually" },
				{ title: "rego", amount: 750, cadence: "annually" },
			],
		};
		const withoutLeaseSavings = calculateSavings(withoutLease);

		const withLease = {
			salary: baseSalary - leaseAnnual,
			hecs: true,
			desiredFunMoney: 0,
			bonus: 28_000,
		};
		const withLeaseSurplus = calculateSavings(withLease);

		// Novated lease costs $164 a year more than running a car
		expect(
			Math.floor(withoutLeaseSavings.cash - withLeaseSurplus.cash)
		).toEqual(164);

		const carValue = 59_111;
		const balloonAmount = carValue * 0.3;

		const totalCost = leaseAnnual * 5 + balloonAmount;
		expect(totalCost).toEqual(49_193.3);
	});

	it("Should calculate advantage of Navara on novated lease vs Patsy", () => {
		const baseSalary = 138_000;
		const leaseAnnual = 212 * 52;

		const withoutLease: FinancialDetails = {
			salary: baseSalary,
			schemes: {
				fhss: true,
			},
			hecs: true,
			bonus: 28_000,
			expenses: [
				{ title: "fuel", amount: 200, cadence: "monthly" },
				{ title: "service", amount: 600, cadence: "annually" },
				{ title: "rego", amount: 750, cadence: "annually" },
			],
		};
		const withoutLeaseSavings = calculateSavings(withoutLease);

		const withLease: FinancialDetails = {
			salary: baseSalary - leaseAnnual,
			schemes: {
				fhss: true,
			},
			hecs: true,
			bonus: 28_000,
		};
		const withLeaseSurplus = calculateSavings(withLease);

		// Novated lease costs $2,092 a year more than running a car
		expect(
			Math.floor(withoutLeaseSavings.cash - withLeaseSurplus.cash)
		).toEqual(2092);

		const carValue = 59_111;
		const balloonAmount = carValue * 0.3;

		const totalCost = leaseAnnual * 5 + balloonAmount;
		expect(totalCost).toEqual(72_853.3);
	});
});

export {};
