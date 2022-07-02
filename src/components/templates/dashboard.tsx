import Display from "@atoms/display";
import { financeAtom } from "@state/finance-atom";
import { estimateSavings } from "@utils/finance";
import { formatDollars } from "@utils/generic";
import { useAtom } from "jotai";
import React from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const Dashboard = () => {
	const [finances] = useAtom(financeAtom);

	const { yearlySnapshots } = estimateSavings(finances, { years: 10 });

	return (
		<div className="flex flex-col items-center gap-10 w-full h-full">
			<Display>Summary</Display>
			<div className="max-w-2xl max-h-96 w-full h-96">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						width={600}
						height={400}
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
						<Tooltip formatter={(value: number) => formatDollars(value)} />
						<Legend />
						<Bar
							name="Cash"
							dataKey="totalCash"
							stackId="income"
							fill="#8884d8"
						/>
						<Bar
							name="Stocks"
							dataKey="totalInvested"
							stackId="income"
							fill="#ffb555"
						/>
						<Bar
							name="Super"
							dataKey="totalSuper"
							stackId="income"
							fill="#82ca9d"
						/>
						<Bar
							name="FHSS"
							dataKey="super.fhss"
							stackId="income"
							fill="#fb95ff"
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default Dashboard;
