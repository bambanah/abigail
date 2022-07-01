import { calculateAnnualSavings } from "@utils/finance";
import { formatDollars } from "@utils/generic";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { financeAtom } from "@state/finance-atom";

const Summary = () => {
	const [finances] = useAtom(financeAtom);
	const [savings, setSavings] = useState(0);

	useEffect(() => {
		if (finances !== undefined) {
			const calculatedSavings = calculateAnnualSavings(finances);

			setSavings(calculatedSavings?.cash);
		}
	}, [finances]);

	if (!finances) {
		return <></>;
	}

	return (
		<div className="text-center mt-10">
			<p>
				If you earn <b>${formatDollars(finances.salary)}</b> per year with a{" "}
				<b>${formatDollars(finances.bonus)}</b> yearly bonus
			</p>
			<br />
			<h2 className="text-2xl">
				You could save <b>${formatDollars(savings)}</b> per year
			</h2>
		</div>
	);
};

export default Summary;
