import {
	calculateIncomeTax,
	calculateHecsRepayment,
	calculateMedicareLevy,
	calculateMedicareLevySurcharge,
	compoundInterest,
} from "@utils/finance-helpers";

describe("finance helper calculations", () => {
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

	it("Should calculate compound interest", () => {
		expect(compoundInterest(1000, 0.1, 1)).toEqual(1100);
		expect(compoundInterest(1000, 0.1, 5)).toEqual(1610.51);
		expect(compoundInterest(150_000, 0.05, 20)).toEqual(397_994.66);
		expect(compoundInterest(1000, 0.2, 20)).toEqual(38_337.6);

		expect(compoundInterest(1000, 0.2, 20, "monthly")).toEqual(52_827.53);
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
});
