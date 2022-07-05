import { financeAtom } from "@state/finance-atom";
import { estimateSavings } from "@utils/finance";
import { formatDollars, round } from "@utils/generic";
import { useAtom } from "jotai";
import React, { FC } from "react";
import {
	ResponsiveContainer,
	BarChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	Bar,
	LabelList,
} from "recharts";

interface Props {
	years?: number;
}

const ForecastChart: FC<Props> = ({ years = 5 }) => {
	const [finances] = useAtom(financeAtom);

	const { yearlySnapshots } = estimateSavings(finances, { years });

	return (
		<ResponsiveContainer width="100%" height={450}>
			<BarChart
				data={yearlySnapshots}
				margin={{
					top: 20,
					right: 30,
					left: 20,
					bottom: 5,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="year" tickFormatter={(value) => `Year ${value}`} />
				<YAxis tickFormatter={(value) => formatDollars(value)} />
				<Tooltip
					labelFormatter={(value) => `Year ${value}`}
					formatter={(value: number) => [formatDollars(value)]}
				/>
				<Legend />
				<Bar name="Cash" dataKey="totalCash" stackId="income" fill="#8884d8" />
				{/* <Bar
					name="Stocks"
					dataKey="totalInvested"
					stackId="income"
					fill="#ffb555"
				/> */}
				<Bar
					name="Super"
					dataKey="totalSuper"
					stackId="income"
					fill="#82ca9d"
				/>
				<Bar name="FHSS" dataKey="super.fhss" stackId="income" fill="#fb95ff">
					<LabelList
						dataKey="totalValue"
						position="top"
						formatter={(value: number) => formatDollars(round(value, 0))}
						className="fill-slate-600"
					/>
				</Bar>
			</BarChart>
		</ResponsiveContainer>
	);
};

export default ForecastChart;
