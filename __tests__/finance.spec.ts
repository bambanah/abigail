import { Expense } from "@schema/expense-schema";
import { FinancialDetails } from "@schema/financial-details-schema";
import {
	calculatePostTaxAmount,
	calculateAnnualSavings,
	calculateTotalExpenses,
	forecastSavings,
} from "@utils/finance";
import { calculateHecsRepayment, calculateTax } from "@utils/finance-helpers";

describe("finance calculation", () => {
	const defaultSalary = 100_000;

	const defaultExpenses: Expense[] = [
		{ title: "expense1", amount: 150, cadence: "weekly" },
		{ title: "expense2", amount: 500, cadence: "fortnightly" },
	];

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
		expect(calculateHecsRepayment(45_000)).toEqual(0);
		expect(calculateHecsRepayment(68_000)).toEqual(2380);
		expect(calculateHecsRepayment(80_000)).toEqual(4000);
		expect(calculateHecsRepayment(119_000)).toEqual(10_115);
		expect(calculateHecsRepayment(124_000)).toEqual(11_160);
		expect(calculateHecsRepayment(179_800)).toEqual(17_980);
	});

	it("Should forecast savings", () => {
		const finances: FinancialDetails = {
			salary: defaultSalary,
			hecs: false,
			expenses: defaultExpenses,
		};

		expect(forecastSavings(finances, 3)).toEqual(14_683.25);
		expect(forecastSavings(finances, 6)).toEqual(29_366.5);
		expect(forecastSavings(finances, 12)).toEqual(58_733);
		expect(forecastSavings(finances, 24)).toEqual(117_466);
		expect(forecastSavings(finances, 36)).toEqual(176_199);

		const financesWithHecs: FinancialDetails = {
			salary: defaultSalary,
			hecs: true,
			expenses: defaultExpenses,
		};

		expect(forecastSavings(financesWithHecs, 3)).toEqual(12_933.25);
		expect(forecastSavings(financesWithHecs, 6)).toEqual(25_866.5);
		expect(forecastSavings(financesWithHecs, 12)).toEqual(51_733);
		expect(forecastSavings(financesWithHecs, 24)).toEqual(103_466);
		expect(forecastSavings(financesWithHecs, 36)).toEqual(155_199);
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

		const savings = calculateAnnualSavings(finances);

		expect(savings.cash).toEqual(58_733);
		expect(savings.super).toEqual(10_000);
	});

	it("Should calculate savings with HECS and expenses", () => {
		const finances: FinancialDetails = {
			salary: defaultSalary,
			hecs: true,
			expenses: defaultExpenses,
		};

		const savings = calculateAnnualSavings(finances);

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

		const savings = calculateAnnualSavings(finances);

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

		const savings = calculateAnnualSavings(finances);

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

		const savings = calculateAnnualSavings(finances);

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
		const withoutLeaseSavings = calculateAnnualSavings(withoutLease);

		const withLease = {
			salary: baseSalary - leaseAnnual,
			hecs: true,
			desiredFunMoney: 0,
			bonus: 28_000,
		};
		const withLeaseSurplus = calculateAnnualSavings(withLease);

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
		const withoutLeaseSavings = calculateAnnualSavings(withoutLease);

		const withLease: FinancialDetails = {
			salary: baseSalary - leaseAnnual,
			schemes: {
				fhss: true,
			},
			hecs: true,
			bonus: 28_000,
		};
		const withLeaseSurplus = calculateAnnualSavings(withLease);

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
