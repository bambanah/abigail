import { estimateSavings } from "@utils/finance";
import { formatDollars } from "@utils/generic";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { financeAtom } from "@state/finance-atom";

const Summary = () => {
	const [finances] = useAtom(financeAtom);
	const [savings, setSavings] = useState(0);

	useEffect(() => {
		if (finances !== undefined) {
			const calculatedSavings = estimateSavings(finances);

			setSavings(calculatedSavings?.estimatedEndTotal);
		}
	}, [finances]);

	if (!finances) {
		return <></>;
	}

	return (
		<div className="text-center mt-10">
			<p>
				If you earn <b>{formatDollars(finances.salary)}</b> p.a. with a{" "}
				<b>{formatDollars(finances.bonus || 0)}</b> annual bonus
			</p>
			<br />
			<h2 className="text-2xl">
				You could save <b>{formatDollars(savings)}</b>/year
			</h2>
		</div>
	);
};

export default Summary;
