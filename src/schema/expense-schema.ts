import { z } from "zod";

export const expenseSchema = z.object({
	title: z.string(),
	amount: z.number().positive(),
	cadence: z.enum(["weekly", "fortnightly", "monthly", "annually"]),
});

export type Expense = z.infer<typeof expenseSchema>;
