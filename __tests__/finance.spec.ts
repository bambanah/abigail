import { calculateSavings, calculateTax } from "src/helpers/finance";
import { Finance } from "types/finance";

describe("Logic Tests", () => {
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

	it("Should calculate savings", () => {
		const finances: Finance = {
			salary: 138_000,
			utiliseFHSS: true,
			hecs: true,
			desiredFunMoney: 1200,
			bonus: 28_000,
			monthlyExpenses: {
				rent: 400,
				rest: 2000,
			},
		};

		const savings = calculateSavings(finances);

		expect(savings.savings).toEqual(73_573);
		expect(savings.super).toEqual(13_800);
	});

	it("Should calculate savings without FHSS", () => {
		const finances: Finance = {
			salary: 138_000,
			utiliseFHSS: false,
			hecs: true,
			desiredFunMoney: 1200,
			bonus: 28_000,
			monthlyExpenses: {
				rent: 400,
				rest: 2000,
			},
		};

		const savings = calculateSavings(finances);

		expect(savings.savings).toEqual(69_673);
		expect(savings.super).toEqual(13_800);
	});

	it("Should calculate advantage of novated lease vs Lachie car", () => {
		const baseSalary = 138_000;
		const leaseAnnual = 121 * 52;

		const withoutLease: Finance = {
			salary: baseSalary,
			utiliseFHSS: true,
			hecs: true,
			desiredFunMoney: 0,
			bonus: 28_000,
			monthlyExpenses: {
				fuel: 160,
				service: 500 / 12,
				rego: 750 / 12,
			},
		};
		const withoutLeaseSavings = calculateSavings(withoutLease);

		const withLease = {
			salary: baseSalary - leaseAnnual,
			utiliseFHSS: true,
			hecs: true,
			desiredFunMoney: 0,
			bonus: 28_000,
		};
		const withLeaseSurplus = calculateSavings(withLease);

		// Novated lease costs $547 a year more than running a car
		expect(
			Math.floor(withoutLeaseSavings.savings - withLeaseSurplus.savings)
		).toEqual(542);

		const carValue = 59_111;
		const balloonAmount = carValue * 0.3;

		const totalCost = leaseAnnual * 5 + balloonAmount;
		expect(totalCost).toEqual(49_193.3);
	});

	it("Should calculate advantage of Navara on novated lease vs Patsy", () => {
		const baseSalary = 138_000;
		const leaseAnnual = 212 * 52;

		const withoutLease: Finance = {
			salary: baseSalary,
			utiliseFHSS: true,
			hecs: true,
			desiredFunMoney: 0,
			bonus: 28_000,
			monthlyExpenses: {
				fuel: 200,
				service: 600 / 12,
				rego: 750 / 12,
			},
		};
		const withoutLeaseSavings = calculateSavings(withoutLease);

		const withLease = {
			salary: baseSalary - leaseAnnual,
			utiliseFHSS: true,
			hecs: true,
			desiredFunMoney: 0,
			bonus: 28_000,
		};
		const withLeaseSurplus = calculateSavings(withLease);

		// Novated lease costs $2,754 a year more than running a car
		expect(
			Math.floor(withoutLeaseSavings.savings - withLeaseSurplus.savings)
		).toEqual(2754);

		const carValue = 59_111;
		const balloonAmount = carValue * 0.3;

		const totalCost = leaseAnnual * 5 + balloonAmount;
		expect(totalCost).toEqual(72_853.3);
	});
});

export {};
