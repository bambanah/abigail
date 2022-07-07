import Header from "@atoms/header";
import Input from "@atoms/input";
import Breakdown from "@molecules/breakdown";
import ForecastChart from "@molecules/forecast-chart";
import { financeAtom } from "@state/finance-atom";
import { YearlySnapshot } from "@utils/forecast";
import { isValidNumber } from "@utils/generic";
import { useAtom } from "jotai";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import FormControl from "../../atoms/form-control";

const WhatIf = () => {
	const [finances] = useAtom(financeAtom);

	const [snapshot, setSnapshot] = useState<YearlySnapshot | undefined>();

	const [yearsToForecast, setYearsToForecast] = useState(5);
	const [salary, setSalary] = useState(finances.salary);
	const [hecs, setHecs] = useState(finances.hecs ?? false);
	const [additionalSuper, setAdditionalSuper] = useState(0);
	const [fhss, setFhss] = useState(finances.schemes?.fhss ?? false);

	const [includeHecsInForecast, setIncludeHecsInForecast] = useState(false);
	const [includeSuperInForecast, setIncludeSuperInForecast] = useState(false);

	const [debouncedYearsToForecast] = useDebounce(yearsToForecast, 1000);
	const [debouncedSalary] = useDebounce(salary, 1000);

	return (
		<div className="w-full h-full max-w-7xl p-10 flex flex-col gap-10">
			<Header className="self-start">What if...</Header>

			<div className="flex flex-wrap gap-5">
				<FormControl
					label="My salary was..."
					id="salary"
					value={salary}
					onChange={(e) => {
						if (isValidNumber(e.target.value))
							setSalary(Number(e.target.value));
					}}
				/>
				<FormControl
					label="I contributed more to super..."
					id="salary"
					value={additionalSuper.toString()}
					onChange={(e) => {
						if (!Number.isNaN(+e.target.value))
							setAdditionalSuper(+e.target.value);
					}}
				/>
				<div className="flex flex-col gap-2">
					<p>I utilise</p>
					<FormControl
						type="checkbox"
						label="FHSS"
						onChange={() => setFhss(!fhss)}
						id="fhss"
						checked={fhss}
					/>
					<FormControl
						type="checkbox"
						label="HECS"
						onChange={() => setHecs(!hecs)}
						id="hecs"
						checked={hecs}
					/>
				</div>
				<ul>
					<li>Expenses were $xx more/less per month</li>
					<li>I invested x% of my leftover money</li>
					<li>Additional &quot;I can live on this much a week&quot; mode</li>
				</ul>
			</div>

			<div className="border border-base-content p-5 flex flex-col gap-5 raised">
				<div className="w-full h-96">
					<ForecastChart
						finances={{
							...finances,
							salary: debouncedSalary,
							hecs,
							schemes: {
								fhss,
							},
						}}
						years={debouncedYearsToForecast}
						includeSuper={includeSuperInForecast}
						includeHecs={includeHecsInForecast}
						handleClick={(s) => setSnapshot(s)}
					/>
				</div>
				<div className="flex gap-16 items-center justify-center font-bold">
					<FormControl
						id="includeSuper"
						type="checkbox"
						label="Include Super"
						onChange={() => setIncludeSuperInForecast(!includeSuperInForecast)}
						checked={includeSuperInForecast}
					/>
					<FormControl
						id="includeHecs"
						type="checkbox"
						label="Include HECS"
						onChange={() => setIncludeHecsInForecast(!includeHecsInForecast)}
						checked={includeHecsInForecast}
					/>
					<div className="flex items-center gap-2">
						<Input
							className="w-14 h-10"
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
			{snapshot && <Breakdown snapshot={snapshot} />}
		</div>
	);
};

export default WhatIf;