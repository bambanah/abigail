import Display from "@atoms/display";
import Summary from "@molecules/summary";
import FinanceForm from "@organisms/form";
import { FinancialDetails } from "@schema/financial-details-schema";
import { calculateAnnualSavings } from "@utils/finance";
import React, { useEffect, useState } from "react";

const Home = () => {
	const [savings, setSavings] = useState(0);
	const [finances, setFinances] = useState<FinancialDetails | undefined>();

	const [initialValues, setInitialValues] = useState<
		FinancialDetails | undefined
	>();

	useEffect(() => {
		const localFinances = localStorage.getItem("financialDetails");

		if (localFinances) {
			const storedFinancialDetails: FinancialDetails =
				JSON.parse(localFinances);

			setInitialValues(storedFinancialDetails);
			setFinances(storedFinancialDetails);
		}
	}, []);

	useEffect(() => {
		if (finances !== undefined) {
			const calculatedSavings = calculateAnnualSavings(finances);

			setSavings(calculatedSavings?.cash);
		}
	}, [finances]);

	return (
		<div className="flex justify-center items-center min-w-screen min-h-screen">
			<div className="container max-w-2xl mx-auto flex flex-col gap-8 p-24 justify-center">
				<Display variant="primary">Abigail</Display>

				<FinanceForm setFinances={setFinances} initialValues={initialValues} />

				{finances?.salary && finances?.bonus && (
					<Summary finances={finances} savings={savings} />
				)}
			</div>
		</div>
	);
};

export default Home;
