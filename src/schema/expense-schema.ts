import * as yup from "yup";

export const expenseSchema = yup.object({
	title: yup.string().required("Required"),
	amount: yup.number().positive().required("Required"),
	cadence: yup
		.string()
		.oneOf(["weekly", "fortnightly", "monthly", "quarterly", "annually"])
		.required("Required"),
});

export type Expense = yup.InferType<typeof expenseSchema>;
