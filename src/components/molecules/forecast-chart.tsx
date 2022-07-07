import CurrencyText from "@atoms/currency-text";
import { YearlySnapshot } from "@utils/forecast";
import { formatDollars, round } from "@utils/generic";
import { FC } from "react";
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	LabelList,
	Legend,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface Props {
	yearlySnapshots: YearlySnapshot[];
	includeSuper?: boolean;
	includeHecs?: boolean;
	handleClick?: (index: number) => void;
	activeIndex?: number;
}

const ForecastChart: FC<Props> = ({
	handleClick,
	yearlySnapshots,
	activeIndex,
	includeSuper = true,
	includeHecs = false,
}) => {
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

	const incomeStack: Bar[] = [];

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
			fill: "#2563eb",
		});

	incomeStack.push(
		{ name: "Cash", dataKey: "totalCash", fill: "#ef4444" },
		{ name: "FHSS", dataKey: "super.fhssAmountInSuper", fill: "#f59e0b" }
	);

	if (yearlySnapshots[0].totalValue < 0) {
		return (
			<div className="w-full h-full flex gap-2 justify-center items-center font-mono font-bold text-xl">
				You&#39;d lose
				<CurrencyText
					includeSign={false}
					value={yearlySnapshots[0].totalValue}
				/>
				in the first year alone!
			</div>
		);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const BackgroundRender = ({ index, width, height, x, y }: any) => {
		if (index !== activeIndex) {
			return <path x="0" y="0" height="0" width="0" />;
		}

		return (
			<path
				fillOpacity={0.1}
				fill={"black"}
				d={`M ${x},${y} h ${width} v ${height} h ${-width} Z`}
			></path>
		);
	};

	return (
		<ResponsiveContainer
			width="100%"
			height={"100%"}
			className="font-mono font-bold"
		>
			<ComposedChart
				data={yearlySnapshots}
				margin={{
					top: 0,
					right: 0,
					left: 0,
					bottom: 0,
				}}
			>
				<CartesianGrid strokeDasharray="4" vertical={false} />
				<XAxis
					dataKey="year"
					tickFormatter={(value) => `Year ${value}`}
					stroke="black"
				/>
				<YAxis
					tickFormatter={(value) =>
						formatDollars(value, { shorten: true, decimalPlaces: 0 })
					}
					stroke="black"
					// TODO: dynamically calculate domain
				/>
				<Tooltip
					labelFormatter={(value) => `Year ${value}`}
					formatter={(value: number, name: string) => [
						`${formatDollars(value, {
							decimalPlaces: 0,
							shorten: true,
						})} ${name}`,
					]}
				/>
				<Legend />

				{incomeStack.map((bar, idx) => (
					<Bar
						key={bar.dataKey}
						name={bar.name}
						dataKey={bar.dataKey}
						stackId={"income"}
						fill={bar.fill}
						onClick={(e: { year: number }) => {
							handleClick && handleClick(e.year - 1);
						}}
						className={`cursor-pointer z-10`}
						background={
							(includeSuper && bar.name === "Super") ||
							(!includeSuper && bar.name === "Cash") ? (
								<BackgroundRender />
							) : undefined
						}
					>
						{idx === incomeStack.length - 1 && (
							<LabelList
								dataKey={"totalValue"}
								position="insideTopRight"
								formatter={(value: number) =>
									formatDollars(round(value, 0), {
										shorten: true,
										decimalPlaces: 0,
									})
								}
								className="font-bold font-mono"
							/>
						)}
					</Bar>
				))}

				{includeHecs && (
					<Line
						name="Remaining HECS"
						dataKey="hecsAmountLeft"
						fill="#000000"
						stroke="#000000"
						animationDuration={300}
					>
						<LabelList
							dataKey={"hecsAmountLeft"}
							position="left"
							formatter={(value: number) =>
								value > 0
									? formatDollars(round(value, 0), {
											shorten: true,
											decimalPlaces: 0,
									  })
									: ""
							}
							className="font-bold font-mono text-md"
						/>
					</Line>
				)}
			</ComposedChart>
		</ResponsiveContainer>
	);
};

export default ForecastChart;
