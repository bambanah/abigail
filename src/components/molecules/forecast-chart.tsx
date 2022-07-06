import { FinancialDetails } from "@schema/financial-details-schema";
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
	finances?: FinancialDetails;
	years?: number;
	includeSuper?: boolean;
	includeHecs?: boolean;
}

const ForecastChart: FC<Props> = ({
	finances,
	years = 5,
	includeSuper = true,
	includeHecs = false,
}) => {
	const [storedFinances] = useAtom(financeAtom);

	const financialDetails = finances ?? storedFinances;

	const { yearlySnapshots } = estimateSavings(financialDetails, {
		years,
		includeSuperInTotal: includeSuper,
	});

	const stocksExist =
		yearlySnapshots.reduce(
			(total, val) => (total += val.totalInvested ?? 0),
			0
		) > 0;

	interface Bar {
		name: string;
		dataKey: string;
		fill: string;
		stackId?: string;
	}

	const incomeStack: Bar[] = [
		{ name: "Cash", dataKey: "totalCash", fill: "#2563eb" },
		{ name: "FHSS", dataKey: "super.fhss", fill: "#ef4444" },
	];

	const deductionStack: Bar[] = [];

	if (stocksExist)
		incomeStack.push({
			name: "Stocks",
			dataKey: "totalInvested",
			fill: "#a855f7",
		});

	if (includeSuper)
		incomeStack.push({
			name: "Super",
			dataKey: "totalSuper",
			fill: "#f59e0b",
		});

	if (includeHecs)
		deductionStack.push({
			name: "HECS",
			dataKey: "deductions.hecs",
			stackId: "deductions",
			fill: "#10B981",
		});
	const bars: { [income: string]: Bar[] } = {
		income: incomeStack,
		deductions: deductionStack,
	};

	return (
		<ResponsiveContainer width="100%" height={"100%"}>
			<BarChart
				data={yearlySnapshots}
				margin={{
					top: 20,
					right: 30,
					left: 20,
					bottom: 5,
				}}
				className="text-red-500"
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="year" tickFormatter={(value) => `Year ${value}`} />
				<YAxis
					tickFormatter={(value) =>
						formatDollars(value, { shorten: true, decimalPlaces: 0 })
					}
				/>
				<Tooltip
					labelFormatter={(value) => `Year ${value}`}
					formatter={(value: number) => [
						formatDollars(value, { decimalPlaces: 0, shorten: true }),
					]}
				/>
				<Legend />

				{Object.keys(bars).map((stackName) =>
					bars[stackName].map((bar, idx) => (
						<Bar
							key={bar.dataKey}
							name={bar.name}
							dataKey={bar.dataKey}
							stackId={stackName}
							fill={bar.fill}
						>
							{idx === bars[stackName].length - 1 && (
								<LabelList
									dataKey={
										stackName === "income" ? "totalValue" : "deductions.hecs"
									}
									position="top"
									formatter={(value: number) =>
										formatDollars(round(value, 0), {
											shorten: true,
											decimalPlaces: 0,
										})
									}
									className="fill-base-content"
								/>
							)}
						</Bar>
					))
				)}
			</BarChart>
		</ResponsiveContainer>
	);
};

export default ForecastChart;
