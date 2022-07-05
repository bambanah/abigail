import Button from "@atoms/button";
import Checkbox from "@atoms/checkbox";
import Heading from "@atoms/heading";
import FormField from "@molecules/form-field";
import {
	FinancialDetails,
	financialDetailsSchema,
} from "@schema/financial-details-schema";
import { financeAtom, isEditingFinanceAtom } from "@state/finance-atom";
import { isValidNumber } from "@utils/generic";
import { Field, FieldArray, Formik, getIn } from "formik";
import { useAtom } from "jotai";
import { FaTimes } from "react-icons/fa";

const FinanceForm = () => {
	const [initialFinances, setFinances] = useAtom(financeAtom);
	const [, setIsEditingFinance] = useAtom(isEditingFinanceAtom);

	return (
		<Formik
			initialValues={{
				salary: initialFinances.salary.toString() ?? "",
				bonus:
					initialFinances.bonus !== undefined &&
					initialFinances.bonus.length > 0
						? initialFinances.bonus.map((b) => b.toString())
						: [],
				utilizeFHSS: initialFinances?.schemes?.fhss ?? false,
				hecs: initialFinances.hecs ?? false,
				expenses: initialFinances.expenses ?? [],
			}}
			validationSchema={financialDetailsSchema}
			onSubmit={(values, { setSubmitting }) => {
				const finances: FinancialDetails = {
					salary: Number(values.salary),
					bonus: [isValidNumber(values.bonus[0]) ? Number(values.bonus) : 0],
					schemes: { fhss: values.utilizeFHSS },
					hecs: values.hecs,
					expenses: values.expenses.map(({ title, amount, cadence }) => ({
						title,
						amount: Number(amount),
						cadence,
					})),
				};

				setFinances(finances);

				setSubmitting(false);

				setIsEditingFinance(false);
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
					className="box-border w-full flex flex-col gap-5 items-center shadow-xl p-5 rounded-lg"
				>
					<Heading level="3">Your Finances</Heading>

					<div className="flex gap-3 flex-col w-full">
						<Heading level="4">Income</Heading>
						<hr className="w-full" />
					</div>

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
							label="First Year Bonus"
							value={values.bonus[0]}
							name="bonus.0"
							onChange={handleChange}
							onBlur={handleBlur}
							// error={touched.bonus[0] ? errors.bonus[0] : ""}
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

					<FieldArray
						name="expenses"
						render={(arrayHelpers) => (
							<div className="flex flex-col gap-3 justify-between w-full">
								<Heading level="4">Expenses</Heading>
								<hr />
								{values.expenses && values.expenses.length > 0 ? (
									<>
										{values.expenses.map((_, idx) => (
											<div key={idx} className="flex gap-3 items-center">
												<div className="form-control">
													{idx === 0 && (
														<label
															className="label"
															htmlFor={`expenses.0.title`}
														>
															<span className="label-text font-bold">
																Title
															</span>
														</label>
													)}
													<Field
														id={`expenses.${idx}.title`}
														name={`expenses.${idx}.title`}
														placeholder="Title"
														className={`input input-bordered w-full max-w-xs ${
															getIn(errors, `expenses.${idx}.title`)
																? "border-red-300"
																: ""
														}`}
													/>
												</div>

												<div className="form-control">
													{idx === 0 && (
														<label
															className="label"
															htmlFor={`expenses.0.amount`}
														>
															<span className="label-text font-bold">
																Amount
															</span>
														</label>
													)}
													<Field
														id={`expenses.${idx}.amount`}
														name={`expenses.${idx}.amount`}
														placeholder="Amount"
														className={`input input-bordered w-full max-w-xs ${
															getIn(errors, `expenses.${idx}.amount`)
																? "border-red-300"
																: ""
														}`}
													/>
												</div>

												<div className="form-control">
													{idx === 0 && (
														<label
															className="label"
															htmlFor={`expenses.0.cadence`}
														>
															<span className="label-text font-bold">
																Cadence
															</span>
														</label>
													)}
													<Field
														component="select"
														id={`expenses.${idx}.cadence`}
														name={`expenses.${idx}.cadence`}
														className="select select-bordered w-34"
													>
														<option value="weekly">Weekly</option>
														<option value="fortnightly">Fortnightly</option>
														<option value="monthly">Monthly</option>
														<option value="quarterly">Quarterly</option>
														<option value="annually">Annually</option>
													</Field>
												</div>

												<button
													className="btn btn-ghost text-red-500 w-8 min-h-8 max-h-8 p-0"
													onClick={() => arrayHelpers.remove(idx)}
												>
													<FaTimes />
												</button>
											</div>
										))}

										<button
											onClick={() =>
												arrayHelpers.push({
													title: "",
													amount: "",
													cadence: "weekly",
												})
											}
											className="btn btn-outline"
										>
											Add new
										</button>
									</>
								) : (
									<button
										onClick={() =>
											arrayHelpers.push({
												title: "",
												amount: "",
												cadence: "weekly",
											})
										}
										className="btn btn-outline"
									>
										Add new
									</button>
								)}
							</div>
						)}
					/>

					<div className="flex gap-5">
						<Button
							type="submit"
							disabled={isSubmitting}
							className="mt-5 btn-primary"
						>
							Save
						</Button>
						<Button
							type="button"
							disabled={isSubmitting}
							className="mt-5 btn-ghost"
							onClick={() => setIsEditingFinance(false)}
						>
							Cancel
						</Button>
					</div>
				</form>
			)}
		</Formik>
	);
};

export default FinanceForm;
