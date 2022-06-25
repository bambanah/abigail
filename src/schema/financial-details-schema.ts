import * as yup from "yup";
import { expenseSchema } from "./expense-schema";

export const financialDetailsSchema = yup.object({
	salary: yup.number().positive().required(),
	bonus: yup.number().positive(),
	hecs: yup.bool(),

	expenses: yup.array(expenseSchema),
	schemes: yup
		.object({
			fhss: yup.boolean(),
		})
		.optional(),
});

export type FinancialDetails = yup.InferType<typeof financialDetailsSchema>;
