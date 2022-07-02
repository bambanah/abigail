import {
	LEVY_FAMILY_EXEMPTION_THRESHOLD,
	LEVY_FAMILY_REDUCTION_THRESHOLD,
	LEVY_SINGLE_EXEMPTION_THRESHOLD,
	LEVY_SINGLE_REDUCTION_THRESHOLD,
} from "./constants";
import { round } from "./generic";

export const calculateHecsRepayment = (amount: number) => {
	if (amount > 137_897) {
		return 0.1 * amount;
	} else if (amount > 130_092) {
		return 0.095 * amount;
	} else if (amount > 122_728) {
		return 0.09 * amount;
	} else if (amount > 115_781) {
		return 0.085 * amount;
	} else if (amount > 109_227) {
		return 0.08 * amount;
	} else if (amount > 103_045) {
		return 0.075 * amount;
	} else if (amount > 97_212) {
		return 0.07 * amount;
	} else if (amount > 91_709) {
		return 0.065 * amount;
	} else if (amount > 86_518) {
		return 0.06 * amount;
	} else if (amount > 81_620) {
		return 0.055 * amount;
	} else if (amount > 77_001) {
		return 0.05 * amount;
	} else if (amount > 72_641) {
		return 0.045 * amount;
	} else if (amount > 68_529) {
		return 0.04 * amount;
	} else if (amount > 64_651) {
		return 0.035 * amount;
	} else if (amount > 60_991) {
		return 0.03 * amount;
	} else if (amount > 57_538) {
		return 0.025 * amount;
	} else if (amount > 54_282) {
		return 0.02 * amount;
	} else if (amount >= 47_014) {
		return 0.01 * amount;
	} else {
		return 0;
	}
};

export const calculateIncomeTax = (amount: number) => {
	if (amount > 180_000) {
		return 51_667 + 0.45 * (amount - 180_000);
	} else if (amount > 120_000) {
		return 29_467 + 0.37 * (amount - 120_000);
	} else if (amount > 45_000) {
		return 5092 + 0.325 * (amount - 45_000);
	} else if (amount > 18_200) {
		return 0.19 * (amount - 18_200);
	} else {
		return 0;
	}
};

export const getMarginalTaxRate = (amount: number) => {
	if (amount > 180_000) return 0.45;
	else if (amount > 120_000) return 0.37;
	else if (amount > 45_000) return 0.32;
	else if (amount > 18_200) return 0.19;
	else return 0;
};

export const calculateMedicareLevy = (
	assessableIncome: number,
	partnerIncome?: number,
	dependents?: number
) => {
	const isFamily =
		(partnerIncome !== undefined && partnerIncome > 0) ||
		(dependents !== undefined && dependents > 0);
	const totalIncome = assessableIncome + (partnerIncome ?? 0);

	// TODO: Account for senior/pensioner threshold increase

	// Family base threshold increases by 4496 for every child
	const familyThresholdIncrease = dependents ? 4496 * dependents : 0;
	const familyExemptionThreshold =
		LEVY_FAMILY_EXEMPTION_THRESHOLD + familyThresholdIncrease;
	const familyReductionThreshold =
		LEVY_FAMILY_REDUCTION_THRESHOLD + familyThresholdIncrease;

	if (
		totalIncome <=
		(isFamily ? familyExemptionThreshold : LEVY_SINGLE_EXEMPTION_THRESHOLD)
	) {
		return 0;
	} else if (
		totalIncome <=
		(isFamily ? familyReductionThreshold : LEVY_SINGLE_REDUCTION_THRESHOLD)
	) {
		// TODO: These values are an approximation. Find how the actual rates are calculated.
		const relative = isFamily
			? (totalIncome - familyExemptionThreshold) /
			  (familyReductionThreshold - familyExemptionThreshold)
			: (assessableIncome - LEVY_SINGLE_EXEMPTION_THRESHOLD) /
			  (LEVY_SINGLE_REDUCTION_THRESHOLD - LEVY_SINGLE_EXEMPTION_THRESHOLD);
		const rate = 0.02 * relative;

		return round(rate * assessableIncome);
	} else {
		return round(0.02 * assessableIncome);
	}
};

export const calculateMedicareLevySurcharge = (
	assessableIncome: number,
	partnerIncome?: number,
	dependents?: number
) => {
	const isFamily =
		(partnerIncome !== undefined && partnerIncome > 0) ||
		(dependents !== undefined && dependents > 0);
	const totalIncome = assessableIncome + (partnerIncome ?? 0);

	// Family base threshold increases by 1500 for every child after the first one
	const familyBaseThreshold =
		180_000 + (dependents ? 1500 * Math.max(dependents - 1, 0) : 0);

	if (
		isFamily &&
		totalIncome > familyBaseThreshold &&
		assessableIncome < 23_226
	) {
		return 0;
	} else if (totalIncome <= (isFamily ? familyBaseThreshold : 90_000)) {
		return 0;
	} else if (totalIncome <= (isFamily ? 210_000 : 105_000)) {
		return assessableIncome * 0.01;
	} else if (totalIncome <= (isFamily ? 280_000 : 140_000)) {
		return assessableIncome * 0.0125;
	} else {
		return assessableIncome * 0.015;
	}
};
