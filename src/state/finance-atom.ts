import { FinancialDetails } from "@schema/financial-details-schema";
import { atomWithStorage } from "jotai/utils";

export const financeAtom = atomWithStorage("financialDetails", {
	salary: 50_000,
} as FinancialDetails);
