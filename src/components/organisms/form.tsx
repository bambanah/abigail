import Button from "@atoms/button";
import Checkbox from "@atoms/checkbox";
import FormField from "@molecules/form-field";
import { Formik, FormikErrors } from "formik";
import React from "react";
import { FinanceConstants } from "types/finance";

interface Props {
	setFinances: (value: FinanceConstants) => void;
	initialValues?: FinanceConstants;
}

const FinanceForm = ({ setFinances, initialValues }: Props) => {
	return (
		<Formik
			initialValues={{
				salary: initialValues?.salary.toString() ?? "",
				bonus: initialValues?.bonus?.toString() ?? "",
				utilizeFHSS: initialValues?.utiliseFHSS ?? false,
				hecs: initialValues?.hecs ?? false,
			}}
			validate={(values) => {
				const errors: FormikErrors<FinanceConstants> = {};

				if (values.salary.length === 0) errors.salary = "Required";
				if (values.bonus.length === 0) errors.bonus = "Required";

				return errors;
			}}
			onSubmit={(values, { setSubmitting }) => {
				const finances: FinanceConstants = {
					salary: Number(values.salary),
					bonus: Number(values.bonus),
					utiliseFHSS: values.utilizeFHSS,
					hecs: values.hecs,
				};

				setFinances(finances);

				localStorage.setItem("salary", finances.salary.toString());
				localStorage.setItem("bonus", finances.bonus?.toString() ?? "");
				localStorage.setItem(
					"utiliseFHSS",
					finances.utiliseFHSS ? "true" : "false"
				);
				localStorage.setItem("hecs", finances.hecs ? "true" : "false");

				setSubmitting(false);
			}}
			enableReinitialize
		>
			{({
				values,
				errors,
				touched,
				handleChange,
				handleBlur,
				handleSubmit,
				isSubmitting,
			}) => (
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-5 items-center shadow-xl p-5 rounded-md py-10"
				>
					<h2 className="text-2xl font-bold">Set Constants</h2>
					<div className="flex gap-3 justify-between w-full">
						<FormField
							label="Salary"
							name="salary"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.salary}
							error={touched.salary ? errors.salary : ""}
							required
						/>

						<FormField
							label="Bonus"
							value={values.bonus}
							name="bonus"
							onChange={handleChange}
							onBlur={handleBlur}
							error={touched.bonus ? errors.bonus : ""}
							required
						/>
					</div>

					<div className="flex gap-3 justify-between w-full">
						<Checkbox
							name="utilizeFHSS"
							onChange={handleChange}
							label="Utilise FHSS?"
							checked={values.utilizeFHSS}
							className="basis-1/2"
						/>

						<Checkbox
							name="hecs"
							onChange={handleChange}
							label="Do you have HECS?"
							checked={values.hecs}
							className="basis-1/2"
						/>
					</div>

					<Button
						type="submit"
						disabled={isSubmitting}
						className="mt-5 btn-primary"
					>
						Save
					</Button>
				</form>
			)}
		</Formik>
	);
};

export default FinanceForm;
