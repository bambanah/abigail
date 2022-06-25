import Layout from "src/components/layouts/layout";
import React, { useEffect, useState } from "react";
import { calculateAnnualSavings } from "@utils/finance";
import FinanceForm from "src/components/organisms/form";
import { isValidNumber } from "@utils/generic";
import { FinancialDetails } from "@schema/financial-details-schema";

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
	const [finances, setFinances] = useState<FinancialDetails | undefined>();

	const [initialValues, setInitialValues] = useState<
		FinancialDetails | undefined
	>();

	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const salary = localStorage.getItem("salary");
		const bonus = localStorage.getItem("bonus");
		const hecs = localStorage.getItem("hecs");

		if (salary && isValidNumber(salary)) {
			const storedFinances: FinancialDetails = {
				salary: Number(salary),
			};

			if (bonus && isValidNumber(bonus)) {
				storedFinances.bonus = Number(bonus);
			}

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
			const calculatedSavings = calculateAnnualSavings(finances);

			setSavings(calculatedSavings?.cash);
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
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
};

export default DashboardPage;
