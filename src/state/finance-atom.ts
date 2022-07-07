import { FinancialDetails } from "@schema/financial-details-schema";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const financeAtom = atomWithStorage("financialDetails", {
	salary: 50_000,
} as FinancialDetails);

export const isEditingFinanceAtom = atom(false);

export const temporaryFinanceAtom = atom({
	salary: 50_000,
} as FinancialDetails);
