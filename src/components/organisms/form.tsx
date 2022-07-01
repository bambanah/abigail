import Button from "@atoms/button";
import Checkbox from "@atoms/checkbox";
import FormField from "@molecules/form-field";
import {
	FinancialDetails,
	financialDetailsSchema,
} from "@schema/financial-details-schema";
import { financeAtom } from "@state/finance-atom";
import { isValidNumber } from "@utils/generic";
import { Formik } from "formik";
import { useAtom } from "jotai";

const FinanceForm = () => {
	const [initialFinances, setFinances] = useAtom(financeAtom);

	return (
		<Formik
			initialValues={{
				salary: initialFinances?.salary.toString() ?? "",
				bonus: initialFinances?.bonus?.toString() ?? "",
				utilizeFHSS: initialFinances?.schemes?.fhss ?? false,
				hecs: initialFinances?.hecs ?? false,
			}}
			validationSchema={financialDetailsSchema}
			onSubmit={(values, { setSubmitting }) => {
				const finances: FinancialDetails = {
					salary: Number(values.salary),
					bonus: isValidNumber(values.bonus) ? Number(values.bonus) : 0,
					schemes: { fhss: values.utilizeFHSS },
					hecs: values.hecs,
				};

				setFinances(finances);

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
