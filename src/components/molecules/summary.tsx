import { FinancialDetails } from "@schema/financial-details-schema";
import { formatDollars } from "@utils/generic";
import React from "react";

interface Props {
	finances: FinancialDetails;
	savings: number;
}

const Summary = ({ finances, savings }: Props) => {
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
