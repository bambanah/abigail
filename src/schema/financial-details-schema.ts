import * as yup from "yup";
import { expenseSchema } from "./expense-schema";

export const financialDetailsSchema = yup.object({
	salary: yup
		.number()
		.typeError("Must be a number")
		.min(0, "Can't be less than zero")
		.required(),
	bonus: yup
		.array()
		.typeError("Must be an array of numbers")
		.of(
			yup
				.number()
				.typeError("Must be a number")
				.min(0, "Can't be less than zero")
				.required()
		)
		.optional(),
	hecs: yup.boolean().optional(),

	currentCash: yup
		.number()
		.typeError("Must be a number")
		.min(0, "Can't be less than zero")
		.optional(),

	expenses: yup.array(expenseSchema).optional(),
	schemes: yup
		.object({
			fhss: yup.boolean(),
		})
		.optional(),
});

export type FinancialDetails = yup.InferType<typeof financialDetailsSchema>;
