import { Expense } from "@schema/expense-schema";
import { FinancialDetails } from "@schema/financial-details-schema";
import { calculateTotalExpenses, getAdvantageOfFHSS } from "@utils/finance";
import { calculatePostTaxAmount, estimateSavings } from "@utils/forecast";

describe("finance calculations", () => {
	const defaultSalary = 100_000;

	// $18,300/year
	const defaultExpenses: Expense[] = [
		{ title: "expense1", amount: 150, cadence: "weekly" },
		{ title: "expense2", amount: 500, cadence: "fortnightly" },
	];

	it("Should calculate total expenses", () => {
		expect(calculateTotalExpenses(defaultExpenses)).toEqual(18_300);

		const expenses: Expense[] = [
			{ title: "expense1", amount: 160, cadence: "weekly" },
			{ title: "expense2", amount: 623, cadence: "fortnightly" },
			{ title: "expense3", amount: 500, cadence: "monthly" },
			{ title: "expense4", amount: 751, cadence: "annually" },
		];

		expect(calculateTotalExpenses(expenses)).toEqual(28_154);
	});

	it("Should calculate post tax amount", () => {
		expect(calculatePostTaxAmount(50_000)).toEqual(42_283);
		expect(calculatePostTaxAmount(80_000)).toEqual(61_933);
		expect(calculatePostTaxAmount(85_000)).toEqual(65_208);
		expect(calculatePostTaxAmount(100_000)).toEqual(74_033);
		expect(calculatePostTaxAmount(120_000)).toEqual(86_633);
	});

	it("Should estimate savings", () => {
		const finances: FinancialDetails = {
			salary: defaultSalary,
			expenses: defaultExpenses,
			bonus: [],
			currentCash: 0,
			hecs: false,
			schemes: {
				fhss: false,
			},
		};

		let savings = estimateSavings(finances);
		expect(savings.estimatedTotal).toEqual(66_233);
		expect(savings.cash).toEqual(55_733);
		expect(savings.super).toEqual(10_500);

		finances.currentCash = 10_000;

		savings = estimateSavings(finances);
		expect(savings.estimatedTotal).toEqual(76_233);
		expect(savings.cash).toEqual(65_733);
		expect(savings.super).toEqual(10_500);

		finances.hecs = true;

		savings = estimateSavings(finances);
		expect(savings.estimatedTotal).toEqual(69_233);
		expect(savings.cash).toEqual(58_733);
		expect(savings.super).toEqual(10_500);

		finances.schemes = { fhss: true };

		savings = estimateSavings(finances);
		expect(savings.estimatedTotal).toEqual(75_228);
		expect(savings.cash).toEqual(52_233);
		expect(savings.super).toEqual(10_500);

		finances.bonus = [25_000];

		savings = estimateSavings(finances);
		expect(savings.estimatedTotal).toEqual(88_728);
		expect(savings.cash).toEqual(63_108);
		expect(savings.super).toEqual(13_125);

		savings = estimateSavings(finances, { years: 2 });
		expect(savings.estimatedTotal).toEqual(156_818.2);
		expect(savings.cash).toEqual(106_403.5);
		expect(savings.super).toEqual(24_675);

		finances.bonus = [25_000, 15_000];

		savings = estimateSavings(finances, { years: 2 });
		expect(savings.estimatedTotal).toEqual(165_268.2);
		expect(savings.cash).toEqual(113_278.5);
		expect(savings.super).toEqual(26_250);

		finances.schemes = { fhss: false };

		savings = estimateSavings(finances, { years: 2 });
		expect(savings.estimatedTotal).toEqual(153_059.75);
		expect(savings.cash).toEqual(126_809.75);
		expect(savings.super).toEqual(26_250);
	});

	it("Should calculate savings with FHSS", () => {
		const finances: FinancialDetails = {
			salary: defaultSalary,
			expenses: defaultExpenses,
			schemes: {
				fhss: true,
			},
		};

		let savings = estimateSavings(finances);

		expect(savings.estimatedTotal).toEqual(69_903);
		expect(savings.cash).toEqual(46_908);
		expect(savings.super).toEqual(10_500);

		finances.salary = 40_000;

		savings = estimateSavings(finances);
		expect(savings.estimatedTotal).toEqual(22_205.25);
	});

	it("Should calculate advantage of FHSS", () => {
		expect(
			getAdvantageOfFHSS({ salary: 40_000, expenses: defaultExpenses })
		).toEqual(1247.25);
		expect(
			getAdvantageOfFHSS({ salary: 50_000, expenses: defaultExpenses })
		).toEqual(1320);
		expect(
			getAdvantageOfFHSS({ salary: 60_000, expenses: defaultExpenses })
		).toEqual(2670);
		expect(
			getAdvantageOfFHSS({ salary: 80_000, expenses: defaultExpenses })
		).toEqual(2670);
		expect(
			getAdvantageOfFHSS({ salary: 140_000, expenses: defaultExpenses })
		).toEqual(2895);

		expect(
			getAdvantageOfFHSS({
				salary: 40_000,
				expenses: defaultExpenses,
				hecs: true,
			})
		).toEqual(1247.25);
		expect(
			getAdvantageOfFHSS({
				salary: 50_000,
				expenses: defaultExpenses,
				hecs: true,
			})
		).toEqual(1820);
		expect(
			getAdvantageOfFHSS({
				salary: 60_000,
				expenses: defaultExpenses,
				hecs: true,
			})
		).toEqual(4170);
		expect(
			getAdvantageOfFHSS({
				salary: 80_000,
				expenses: defaultExpenses,
				hecs: true,
			})
		).toEqual(4395);
		expect(
			getAdvantageOfFHSS({
				salary: 140_000,
				expenses: defaultExpenses,
				hecs: true,
			})
		).toEqual(5645);

		expect(
			getAdvantageOfFHSS(
				{
					salary: 140_000,
					expenses: defaultExpenses,
					hecs: true,
				},
				{ years: 5 }
			)
		).toEqual(25_664.44);
		expect(
			getAdvantageOfFHSS(
				{
					salary: 140_000,
					bonus: [28_000, 22_000],
					expenses: defaultExpenses,
					hecs: true,
				},
				{ years: 5 }
			)
		).toEqual(22_845.69);
	});

	it("Should calculate savings with HECS and expenses", () => {
		const finances: FinancialDetails = {
			salary: defaultSalary,
			hecs: true,
			expenses: defaultExpenses,
		};

		const savings = estimateSavings(finances);

		expect(savings.estimatedTotal).toEqual(59_233);
		expect(savings.cash).toEqual(48_733);
		expect(savings.super).toEqual(10_500);
	});

	it("Should calculate savings with expenses, hecs, bonus, and fhss", () => {
		const finances: FinancialDetails = {
			salary: defaultSalary,
			hecs: true,
			bonus: [20_000],
			schemes: {
				fhss: true,
			},
			expenses: defaultExpenses,
		};

		const savings = estimateSavings(finances);

		expect(savings.estimatedTotal).toEqual(76_178);
		expect(savings.cash).toEqual(51_083);
		expect(savings.super).toEqual(12_600);
	});

	it("Should calculate savings with expenses, hecs, bonus, and no fhss", () => {
		const finances: FinancialDetails = {
			salary: defaultSalary,
			hecs: true,
			bonus: [20_000],
			schemes: {
				fhss: false,
			},
			expenses: defaultExpenses,
		};

		const savings = estimateSavings(finances);

		expect(savings.estimatedTotal).toEqual(70_733);
		expect(savings.cash).toEqual(58_133);
		expect(savings.super).toEqual(12_600);
	});
});

export {};
