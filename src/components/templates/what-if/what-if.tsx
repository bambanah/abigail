import Button from "@atoms/button";
import Header from "@atoms/header";
import Heading from "@atoms/heading";
import Input from "@atoms/input";
import Breakdown from "@molecules/breakdown";
import ForecastChart from "@molecules/forecast-chart";
import { financeAtom, temporaryFinanceAtom } from "@state/finance-atom";
import { estimateSavings, YearlySnapshot } from "@utils/forecast";
import { isValidNumber } from "@utils/generic";
import { useAtom } from "jotai";
import { createRef, useEffect, useState } from "react";
import { IoChevronUp } from "react-icons/io5";
import { useDebounce } from "use-debounce";
import FormControl from "../../atoms/form-control";

const WhatIf = () => {
	const [finances] = useAtom(financeAtom);
	const [temporaryFinances, setTemporaryFinances] =
		useAtom(temporaryFinanceAtom);

	const debounceDelay = 1000;

	const [snapshots, setSnapshots] = useState<YearlySnapshot[] | undefined>();
	const [activeIndex, setActiveIndex] = useState<number | undefined>();

	const [salary, setSalary] = useState(finances.salary);
	const [debouncedSalary] = useDebounce(salary, debounceDelay);

	const [concessionalSuper, setConcessionalSuper] = useState(0);
	const [debouncedConcessionalSuper] = useDebounce(
		concessionalSuper,
		debounceDelay
	);

	const [nonConcessionalSuper, setNonConcessionalSuper] = useState(0);
	const [debouncedNonConcessionalSuper] = useDebounce(
		nonConcessionalSuper,
		debounceDelay
	);

	const [yearsToForecast, setYearsToForecast] = useState(5);
	const [debouncedYearsToForecast] = useDebounce(
		yearsToForecast,
		debounceDelay
	);

	const [hecs, setHecs] = useState(finances.hecs ?? false);
	const [debouncedHecs] = useDebounce(hecs, debounceDelay);

	const [hecsAmount, setHecsAmount] = useState(finances.hecsAmount ?? 0);
	const [debouncedHecsAmount] = useDebounce(hecsAmount, debounceDelay);

	const [fhss, setFhss] = useState(finances.schemes?.fhss ?? false);
	const [debouncedFhss] = useDebounce(fhss, debounceDelay);

	const [includeSuperInForecast, setIncludeSuperInForecast] = useState(true);
	const [includeHecsInForecast, setIncludeHecsInForecast] = useState(false);

	const breakdownRef = createRef<HTMLDivElement>();

	useEffect(() => {
		setTemporaryFinances({
			...finances,
			salary: debouncedSalary,
			hecs: debouncedHecs,
			hecsAmount: debouncedHecsAmount,
			schemes: {
				fhss: debouncedFhss,
			},
			super: {
				concessionalContribution: debouncedConcessionalSuper,
				nonConcessionalContribution: debouncedNonConcessionalSuper,
			},
		});
	}, [
		debouncedConcessionalSuper,
		debouncedFhss,
		debouncedHecs,
		debouncedHecsAmount,
		debouncedNonConcessionalSuper,
		debouncedSalary,
		finances,
		setTemporaryFinances,
	]);

	useEffect(() => {
		const { yearlySnapshots } = estimateSavings(temporaryFinances, {
			years: debouncedYearsToForecast,
			includeSuperInTotal: includeSuperInForecast,
		});

		setSnapshots(yearlySnapshots);
	}, [debouncedYearsToForecast, includeSuperInForecast, temporaryFinances]);

	return (
		<div className="w-full h-full max-w-7xl p-10 flex flex-col gap-7">
			<Header className="self-start">What if...</Header>

			<div className="flex flex-wrap gap-5">
				<FormControl
					type="currency"
					label="My salary was..."
					id="salary"
					value={salary}
					onChange={(value) => {
						if (isValidNumber(value)) setSalary(Number(value));
					}}
				/>
				<FormControl
					type="currency"
					label="Concessional"
					id="concessionalSuper"
					value={concessionalSuper}
					onChange={(value) => {
						if (!Number.isNaN(+value)) setConcessionalSuper(+value);
					}}
				/>
				<FormControl
					type="currency"
					label="Non-Concessional"
					id="nonConcessionalSuper"
					value={nonConcessionalSuper}
					onChange={(value) => {
						if (!Number.isNaN(+value)) setNonConcessionalSuper(+value);
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
					<FormControl
						type="currency"
						id="hecsAmount"
						value={hecsAmount}
						onChange={(value) => {
							if (!Number.isNaN(+value)) setHecsAmount(+value);
						}}
					/>
				</div>
				<ul>
					<li>Expenses were $xx more/less per month</li>
					<li>I invested x% of my leftover money</li>
					<li>Additional &quot;I can live on this much a week&quot; mode</li>
				</ul>
			</div>

			<div
				className="border border-base-content p-5 flex flex-col gap-5 raised"
				ref={breakdownRef}
			>
				<div className="w-full h-96">
					{snapshots !== undefined && snapshots.length > 0 && (
						<ForecastChart
							yearlySnapshots={snapshots}
							includeSuper={includeSuperInForecast}
							includeHecs={includeHecsInForecast}
							handleClick={(index) => {
								setActiveIndex(index);

								breakdownRef.current?.scrollIntoView({
									behavior: "smooth",
									block: "start",
								});
							}}
							activeIndex={activeIndex}
						/>
					)}
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
							type="number"
							step="1"
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

			<div className="flex flex-col items-center m-auto mt-10 gap-5 max-w-3xl w-full">
				<Heading id="breakdown" level="1">
					Breakdown
				</Heading>
				<div className="flex pb-3 gap-2 overflow-x-auto">
					{Array.from({ length: debouncedYearsToForecast }).map((_, idx) => (
						<Button
							key={idx}
							className={`btn-outline ${
								idx === activeIndex ? "btn-disabled" : ""
							}`}
							onClick={() => {
								setActiveIndex(idx);
							}}
						>
							Year {idx + 1}
						</Button>
					))}
				</div>

				{snapshots && activeIndex !== undefined && snapshots[activeIndex] ? (
					<div className="max-w-md w-full mt-5">
						<Breakdown snapshot={snapshots[activeIndex]} />
					</div>
				) : (
					<div className="flex flex-col justify-center items-center gap-2 w-full pb-10">
						<p className="text-xl font-bold flex items-center gap-2">
							<IoChevronUp /> Select a year to display breakdown
						</p>
						<p className="text-lg flex items-center gap-2">
							(You can also click the graph)
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default WhatIf;
