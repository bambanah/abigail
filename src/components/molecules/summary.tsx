import { estimateSavings } from "@utils/finance";
import { formatDollars } from "@utils/generic";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { financeAtom } from "@state/finance-atom";

const Summary = () => {
	const [finances] = useAtom(financeAtom);
	const [savings, setSavings] = useState(0);

	const years = 5;

	useEffect(() => {
		if (finances !== undefined) {
			const calculatedSavings = estimateSavings(finances, { years });

			setSavings(calculatedSavings?.estimatedTotal);
		}
	}, [finances]);

	if (!finances) {
		return <></>;
	}

	return (
		<div className="text-center">
			<p>
				If you earn <b>{formatDollars(finances.salary)}</b> p.a. with a{" "}
				<b>
					{formatDollars(
						finances.bonus !== undefined && finances.bonus.length > 0
							? finances.bonus[0]
							: 0
					)}
				</b>{" "}
				annual bonus
			</p>
			<br />
			<h2 className="text-xl">
				You could have <b>{formatDollars(savings)}</b> after {years} years
			</h2>
		</div>
	);
};

export default Summary;
