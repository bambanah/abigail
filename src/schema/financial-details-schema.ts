import { z } from "zod";
import { expenseSchema } from "./expense-schema";

export const financialDetailsSchema = z.object({
	salary: z.number().positive(),
	bonus: z.number().positive().optional(),
	hecs: z.boolean().optional(),

	currentCash: z.number().positive().optional(),

	expenses: z.array(expenseSchema).optional(),
	schemes: z
		.object({
			fhss: z.boolean(),
		})
		.optional(),
});

export type FinancialDetails = z.infer<typeof financialDetailsSchema>;
