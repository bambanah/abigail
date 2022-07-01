import * as yup from "yup";

export const expenseSchema = yup.object({
	title: yup.string().required(),
	amount: yup.number().positive().required(),
	cadence: yup
		.string()
		.oneOf(["weekly", "fortnightly", "monthly", "annually"])
		.required(),
});

export type Expense = yup.InferType<typeof expenseSchema>;
