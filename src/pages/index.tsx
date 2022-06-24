import Layout from "src/components/layouts/layout";
import React, { useEffect, useState } from "react";
import { calculateSavings } from "src/helpers/finance";
import { FinanceConstants } from "types/finance";
import FinanceForm from "src/components/organisms/form";
import { isValidNumber } from "@utils/helpers";

const numberToDollars = (value: number | undefined) => {
	return (
		value?.toLocaleString(undefined, {
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		}) ?? "N/A"
	);
};

const DashboardPage = () => {
	const [savings, setSavings] = useState(0);
	const [finances, setFinances] = useState<FinanceConstants | undefined>();
	const [idealSavings, setIdealSavings] = useState(0);

	const [initialValues, setInitialValues] = useState<
		FinanceConstants | undefined
	>();

	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const salary = localStorage.getItem("salary");
		const bonus = localStorage.getItem("bonus");
		const utiliseFHSS = localStorage.getItem("utiliseFHSS");
		const hecs = localStorage.getItem("hecs");

		if (salary && isValidNumber(salary)) {
			const storedFinances: FinanceConstants = {
				salary: Number(salary),
			};

			if (bonus && isValidNumber(bonus)) {
				storedFinances.bonus = Number(bonus);
			}

			storedFinances.utiliseFHSS = utiliseFHSS === "true";
			storedFinances.hecs = hecs === "true";

			setInitialValues(storedFinances);
			setFinances(storedFinances);

			setLoaded(true);
		} else {
			setLoaded(true);
		}
	}, []);

	useEffect(() => {
		if (finances !== undefined) {
			const calculatedSavings = calculateSavings(finances);

			setSavings(calculatedSavings?.savings);

			if (!finances.utiliseFHSS) {
				finances.utiliseFHSS = true;

				const calculatedIdealSavings = calculateSavings(finances);
				setIdealSavings(calculatedIdealSavings.savings);
			}
		}
	}, [finances]);

	return (
		<Layout>
			<div className="flex justify-center items-center min-w-screen min-h-screen">
				<div className="container max-w-2xl mx-auto flex flex-col gap-8 p-24 justify-center">
					<h1 className="text-5xl font-bold font-display text-violet-500 text-center">
						Abigail
					</h1>

					{loaded && (
						<FinanceForm
							setFinances={setFinances}
							initialValues={initialValues}
						/>
					)}

					{finances?.salary && finances?.bonus && (
						<div className="text-center mt-10">
							<p>
								If you earn <b>${numberToDollars(finances.salary)}</b> per year
								with a <b>${numberToDollars(finances.bonus)}</b> yearly bonus
							</p>
							<br />
							<h2 className="text-2xl">
								You could save <b>${numberToDollars(savings)}</b> per year
							</h2>
							{idealSavings - savings > 0 && (
								<p className="mt-5">
									You could save{" "}
									<b className="text-green-500">
										${numberToDollars(idealSavings - savings)}
									</b>{" "}
									more per year by utilising the FHSS
								</p>
							)}
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
};

export default DashboardPage;
