import Button from "@atoms/button";
import FormControl from "@molecules/form-control";
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
import Checkbox from "@atoms/checkbox";
import CurrencyInput from "react-currency-input-field";

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
				hecsAmount: initialFinances.hecsAmount?.toString() ?? "0",
				expenses: initialFinances.expenses ?? [],
			}}
			validationSchema={financialDetailsSchema}
			onSubmit={(values, { setSubmitting }) => {
				const finances: FinancialDetails = {
					salary: Number(values.salary),
					bonus: [isValidNumber(values.bonus[0]) ? Number(values.bonus) : 0],
					schemes: { fhss: values.utilizeFHSS },
					hecs: values.hecs,
					hecsAmount: values.hecs ? Number(values.hecsAmount) : 0,
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
					className="box-border w-full flex flex-col items-center rounded-lg gap-2"
				>
					<div className="flex gap-1 flex-col w-full">
						<Heading level="4">Income</Heading>
						<hr className="w-full" />
					</div>

					<div className="flex gap-3 justify-start w-full">
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
						/>
					</div>

					<div className="flex gap-3 justify-start w-full">
						<FormControl
							id="utilizeFHSS"
							label="Utilise FHSS?"
							labelLocation="right"
						>
							<Checkbox
								name="utilizeFHSS"
								checked={values.utilizeFHSS}
								onChange={handleChange}
							/>
						</FormControl>

						<FormControl id="hecs" label="HECS" labelLocation="right">
							<Checkbox
								name="hecs"
								checked={values.hecs}
								onChange={handleChange}
							/>
						</FormControl>

						{values.hecs && (
							<FormControl
								id="hecsAmount"
								className="w-24"
								error={touched.hecsAmount ? errors.hecsAmount : ""}
							>
								<CurrencyInput
									id="hecsAmount"
									name="hecsAmount"
									value={values.hecsAmount}
									defaultValue={values.hecsAmount}
									onValueChange={handleChange}
									onBlur={handleBlur}
									prefix="$"
									className="border border-black rounded-none w-full max-w-xs px-2 h-10 focus-visible:outline focus-visible:outline-black focus-visible:outline-1"
								/>
							</FormControl>
						)}
					</div>

					<FieldArray
						name="expenses"
						render={(arrayHelpers) => (
							<div className="flex flex-col gap-3 justify-between w-full">
								<div className="flex flex-col gap-1">
									<Heading level="4">Expenses</Heading>
									<hr />
								</div>
								{values.expenses && values.expenses.length > 0 ? (
									<>
										{values.expenses.map((_, idx) => (
											<div key={idx} className="flex gap-2 items-center">
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
																? "border-error"
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
																? "border-error"
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
														className="select select-bordered w-min-content"
													>
														<option value="weekly">Weekly</option>
														<option value="fortnightly">Fortnightly</option>
														<option value="monthly">Monthly</option>
														<option value="quarterly">Quarterly</option>
														<option value="annually">Annually</option>
													</Field>
												</div>
												<div className="form-control">
													{idx === 0 && (
														<label
															className="label"
															htmlFor={`expenses.0.title`}
														>
															<span className="label-text text-transparent">
																.
															</span>
														</label>
													)}
													<button
														className="btn btn-ghost text-error w-6 min-h-6 max-h-6 p-0"
														onClick={() => arrayHelpers.remove(idx)}
													>
														<FaTimes />
													</button>
												</div>
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
