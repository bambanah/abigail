import Display from "@atoms/display";
import Summary from "@molecules/summary";
import FinanceForm from "@organisms/form";
import { calculateAnnualSavings } from "@utils/finance";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { financeAtom } from "src/state/finance-atom";
import { IsBrowser } from "./is-browser";

const Home = () => {
	const [savings, setSavings] = useState(0);
	const [finances] = useAtom(financeAtom);

	useEffect(() => {
		if (finances !== undefined) {
			const calculatedSavings = calculateAnnualSavings(finances);

			setSavings(calculatedSavings?.cash);
		}
	}, [finances]);

	return (
		<div className="container max-w-lg mx-auto flex flex-col gap-8 justify-center">
			<Display variant="primary">Abigail</Display>

			<FinanceForm />

			<IsBrowser>
				{finances?.salary && finances?.bonus && (
					<Summary finances={finances} savings={savings} />
				)}
			</IsBrowser>
		</div>
	);
};

export default Home;
