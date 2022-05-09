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
			expenses: {
				rent: 400,
				rest: 2000,
			},
		};

		const savings = calculateSavings(finances);

		expect(savings).toEqual(65_431);
	});

	it("Should calculate savings without FHSS", () => {
		const finances: Finance = {
			salary: 138_000,
			utiliseFHSS: false,
			hecs: true,
			desiredFunMoney: 1200,
			bonus: 28_000,
			expenses: {
				rent: 400,
				rest: 2000,
			},
		};

		const savings = calculateSavings(finances);

		expect(savings).toEqual(61_531);
	});
});

export {};
