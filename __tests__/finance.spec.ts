import { Expense } from "@schema/expense-schema";
import { FinancialDetails } from "@schema/financial-details-schema";
import {
	calculatePostTaxAmount,
	calculateAnnualSavings,
	calculateTotalExpenses,
	forecastSavings,
	getAdvantageOfFHSS,
} from "@utils/finance";
import {
	calculateHecsRepayment,
	calculateIncomeTax,
	calculateMedicareLevy,
	calculateMedicareLevySurcharge,
} from "@utils/finance-helpers";

describe("finance calculations", () => {
	const defaultSalary = 100_000;

	// $18,300/year
	const defaultExpenses: Expense[] = [
		{ title: "expense1", amount: 150, cadence: "weekly" },
		{ title: "expense2", amount: 500, cadence: "fortnightly" },
	];

	it("Should calculate tax", () => {
		expect(calculateIncomeTax(15_000)).toEqual(0);
		expect(calculateIncomeTax(18_200)).toEqual(0);
		expect(calculateIncomeTax(20_000)).toEqual(342);
		expect(calculateIncomeTax(44_000)).toEqual(4902);
		expect(calculateIncomeTax(45_000)).toEqual(5092);
		expect(calculateIncomeTax(85_000)).toEqual(18_092);
		expect(calculateIncomeTax(119_000)).toEqual(29_142);
		expect(calculateIncomeTax(124_000)).toEqual(30_947);
		expect(calculateIncomeTax(179_800)).toEqual(51_593);
		expect(calculateIncomeTax(200_000)).toEqual(60_667);
	});

	it("Should calculate hecs repayment", () => {
		expect(calculateHecsRepayment(45_000)).toEqual(0);
		expect(calculateHecsRepayment(68_000)).toEqual(2380);
		expect(calculateHecsRepayment(80_000)).toEqual(4000);
		expect(calculateHecsRepayment(119_000)).toEqual(10_115);
		expect(calculateHecsRepayment(124_000)).toEqual(11_160);
		expect(calculateHecsRepayment(179_800)).toEqual(17_980);
	});

	it("Should calculate medicare levy", () => {
		expect(calculateMedicareLevy(24_000)).toEqual(63.98);
		expect(calculateMedicareLevy(27_000)).toEqual(350.95);
		expect(calculateMedicareLevy(30_000)).toEqual(600);
		expect(calculateMedicareLevy(36_000)).toEqual(720);
		expect(calculateMedicareLevy(100_000)).toEqual(2000);

		expect(calculateMedicareLevy(24_000, 10_000)).toEqual(0);
		expect(calculateMedicareLevy(27_000, 15_000)).toEqual(156.25);
		expect(calculateMedicareLevy(30_000, 17_000)).toEqual(480.01);
		expect(calculateMedicareLevy(36_000, 36_000)).toEqual(720);
		expect(calculateMedicareLevy(100_000, 100_000)).toEqual(2000);

		expect(calculateMedicareLevy(24_000, 10_000, 1)).toEqual(0);
		expect(calculateMedicareLevy(27_000, 15_000, 2)).toEqual(0);
		expect(calculateMedicareLevy(25_000, 20_000, 2)).toEqual(0);
		expect(calculateMedicareLevy(38_000, 10_000, 1)).toEqual(336.65);
		expect(calculateMedicareLevy(100_000, 50_000, 23)).toEqual(1516.7);
	});

	it("Should calculate medicare levy surcharge", () => {
		// Single income
		expect(calculateMedicareLevySurcharge(80_000, 0, 0)).toEqual(0);
		expect(calculateMedicareLevySurcharge(95_000, 0, 0)).toEqual(950);
		expect(calculateMedicareLevySurcharge(110_000, 0, 0)).toEqual(1375);
		expect(calculateMedicareLevySurcharge(150_000, 0, 0)).toEqual(2250);

		// Family because of spouse
		expect(calculateMedicareLevySurcharge(1000, 190_000, 0)).toEqual(0);
		expect(calculateMedicareLevySurcharge(70_000, 100_000, 0)).toEqual(0);
		expect(calculateMedicareLevySurcharge(100_000, 100_000, 0)).toEqual(1000);
		expect(calculateMedicareLevySurcharge(140_000, 100_000, 0)).toEqual(1750);
		expect(calculateMedicareLevySurcharge(200_000, 100_000, 0)).toEqual(3000);

		// Family because of dependent(s)
		expect(calculateMedicareLevySurcharge(179_000, 0, 1)).toEqual(0);
		expect(calculateMedicareLevySurcharge(181_000, 0, 1)).toEqual(1810);
		expect(calculateMedicareLevySurcharge(183_000, 0, 3)).toEqual(0);
		expect(calculateMedicareLevySurcharge(183_001, 0, 3)).toEqual(1830.01);
		expect(calculateMedicareLevySurcharge(220_000, 0, 1)).toEqual(2750);
		expect(calculateMedicareLevySurcharge(300_000, 0, 1)).toEqual(4500);

		// Family with spouse and dependents
		expect(calculateMedicareLevySurcharge(70_000, 100_000, 1)).toEqual(0);
		expect(calculateMedicareLevySurcharge(100_000, 100_000, 1)).toEqual(1000);
		expect(calculateMedicareLevySurcharge(120_000, 100_000, 1)).toEqual(1500);
		expect(calculateMedicareLevySurcharge(220_000, 100_000, 1)).toEqual(3300);
	});

	it("Should forecast savings", () => {
		const finances: FinancialDetails = {
			salary: defaultSalary,
			hecs: false,
			expenses: defaultExpenses,
		};

		expect(forecastSavings(finances, 3)).toEqual(13_933.25);
		expect(forecastSavings(finances, 6)).toEqual(27_866.5);
		expect(forecastSavings(finances, 12)).toEqual(55_733);
		expect(forecastSavings(finances, 24)).toEqual(111_466);
		expect(forecastSavings(finances, 36)).toEqual(167_199);

		const financesWithHecs: FinancialDetails = {
			salary: defaultSalary,
			hecs: true,
			expenses: defaultExpenses,
		};

		expect(forecastSavings(financesWithHecs, 3)).toEqual(12_183.25);
		expect(forecastSavings(financesWithHecs, 6)).toEqual(24_366.5);
		expect(forecastSavings(financesWithHecs, 12)).toEqual(48_733);
		expect(forecastSavings(financesWithHecs, 24)).toEqual(97_466);
		expect(forecastSavings(financesWithHecs, 36)).toEqual(146_199);
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
		expect(calculatePostTaxAmount(50_000)).toEqual(42_283);
		expect(calculatePostTaxAmount(80_000)).toEqual(61_933);
		expect(calculatePostTaxAmount(85_000)).toEqual(65_208);
		expect(calculatePostTaxAmount(100_000)).toEqual(74_033);
		expect(calculatePostTaxAmount(120_000)).toEqual(86_633);
	});

	it("Should calculate savings with expenses", () => {
		const finances: FinancialDetails = {
			salary: defaultSalary,
			hecs: false,
			expenses: defaultExpenses,
		};

		const savings = calculateAnnualSavings(finances);

		expect(savings.cash).toEqual(55_733);
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

		expect(savings.cash).toEqual(59_403);
		expect(savings.super).toEqual(8500);
	});

	it("Should calculate advantage of FHSS", () => {
		expect(
			getAdvantageOfFHSS({ salary: 40_000, expenses: defaultExpenses })
		).toEqual(1247.25);
		expect(
			getAdvantageOfFHSS({ salary: 50_000, expenses: defaultExpenses })
		).toEqual(1575);
		expect(
			getAdvantageOfFHSS({ salary: 60_000, expenses: defaultExpenses })
		).toEqual(2925);
		expect(
			getAdvantageOfFHSS({ salary: 60_001, expenses: defaultExpenses })
		).toEqual(2670);
		expect(
			getAdvantageOfFHSS({ salary: 70_000, expenses: defaultExpenses })
		).toEqual(2670);
		expect(
			getAdvantageOfFHSS({ salary: 80_000, expenses: defaultExpenses })
		).toEqual(2670);
		expect(
			getAdvantageOfFHSS({ salary: 140_000, expenses: defaultExpenses })
		).toEqual(2895);
	});

	it("Should calculate savings with HECS and expenses", () => {
		const finances: FinancialDetails = {
			salary: defaultSalary,
			hecs: true,
			expenses: defaultExpenses,
		};

		const savings = calculateAnnualSavings(finances);

		expect(savings.cash).toEqual(48_733);
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

		expect(savings.cash).toEqual(63_578);
		expect(savings.super).toEqual(10_500);
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

		expect(savings.cash).toEqual(58_133);
		expect(savings.super).toEqual(12_000);
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
		).toEqual(-56);

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
		).toEqual(1356);

		const carValue = 59_111;
		const balloonAmount = carValue * 0.3;

		const totalCost = leaseAnnual * 5 + balloonAmount;
		expect(totalCost).toEqual(72_853.3);
	});
});

export {};
