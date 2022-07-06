import Checkbox from "@atoms/checkbox";
import Header from "@atoms/header";
import Breakdown from "@molecules/breakdown";
import ForecastChart from "@molecules/forecast-chart";
import { financeAtom } from "@state/finance-atom";
import { isValidNumber } from "@utils/generic";
import { useAtom } from "jotai";
import { useState } from "react";
import Input from "./input";

const WhatIf = () => {
	const [finances] = useAtom(financeAtom);

	const [yearsToForecast, setYearsToForecast] = useState(10);
	const [salary, setSalary] = useState(finances.salary);
	const [hecs, setHecs] = useState(finances.hecs ?? false);
	const [additionalSuper, setAdditionalSuper] = useState(0);
	const [fhss, setFhss] = useState(finances.schemes?.fhss ?? false);

	const [includeHecsInForecast, setIncludeHecsInForecast] = useState(false);
	const [includeSuperInForecast, setIncludeSuperInForecast] = useState(false);

	return (
		<div className="w-full h-full p-10 flex flex-col gap-10">
			<Header>What if...</Header>

			<div className="flex flex-wrap gap-5">
				<Input
					label="My salary was..."
					id="salary"
					value={salary}
					onChange={(e) => {
						if (isValidNumber(e.target.value))
							setSalary(Number(e.target.value));
					}}
				/>
				<Input
					label="I contributed more to super..."
					id="salary"
					value={additionalSuper.toString()}
					onChange={(e) => {
						if (!Number.isNaN(+e.target.value))
							setAdditionalSuper(+e.target.value);
					}}
				/>
				<div className="flex flex-col">
					<p>I utilise</p>
					<Checkbox
						label="FHSS"
						onChange={() => setFhss(!fhss)}
						name="fhss"
						checked={fhss}
					/>
					<Checkbox
						label="HECS"
						onChange={() => setHecs(!hecs)}
						name="hecs"
						checked={hecs}
					/>
				</div>
				<ul>
					<li>Expenses were $xx more/less per month</li>
					<li>I invested x% of my leftover money</li>
					<li>Additional &quot;I can live on this much a week&quot; mode</li>
				</ul>
			</div>

			<div
				style={{ boxShadow: "6px 6px 0px black" }}
				className="border border-base-content p-5 flex flex-col gap-5"
			>
				<div className="w-full h-96">
					<ForecastChart
						finances={{
							...finances,
							salary,
							hecs,
							schemes: {
								fhss,
							},
						}}
						years={yearsToForecast}
						includeSuper={includeSuperInForecast}
						includeHecs={includeHecsInForecast}
					/>
				</div>
				<div className="flex gap-16 items-center justify-center font-bold">
					<Checkbox
						label="Include Super"
						onChange={() => setIncludeSuperInForecast(!includeSuperInForecast)}
						name="includeSuperInForecast"
						checked={includeSuperInForecast}
					/>
					<Checkbox
						label="Include HECS"
						onChange={() => setIncludeHecsInForecast(!includeHecsInForecast)}
						name="includeHecsInForecast"
						checked={includeHecsInForecast}
					/>
					<div className="flex items-center gap-2">
						<input
							className="input input-bordered w-14 h-10"
							id="yearsToForecast"
							value={yearsToForecast}
							onChange={(e) => {
								if (
									isValidNumber(e.target.value) &&
									Number(e.target.value) < 100
								)
									setYearsToForecast(Number(e.target.value));
							}}
						/>
						<label className="label" htmlFor="yearsToForecast">
							<span className="label-text">Years</span>
						</label>
					</div>
				</div>
			</div>

			<Breakdown />
		</div>
	);
};

export default WhatIf;
