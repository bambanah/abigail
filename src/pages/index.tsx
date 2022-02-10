import Input from "@atoms/input";
import Layout from "@layouts/layout";
import React, { useEffect, useState } from "react";

const DashboardPage = () => {
	const [salary, setSalary] = useState("");
	const [weeklyRate, setWeeklyRate] = useState("");
	const [finances, setFinances] = useState({ salary: 0, weeklyRate: 0 });

	useEffect(() => {
		if (Number(salary) && Number(salary) !== finances.salary) {
			setFinances({
				salary: Number(salary),
				weeklyRate: finances.weeklyRate,
			});
		}

		if (Number(weeklyRate) && Number(weeklyRate) !== finances.weeklyRate) {
			setFinances({
				salary: finances.salary,
				weeklyRate: Number(weeklyRate),
			});
		}
	}, [salary, weeklyRate]);

	return (
		<Layout>
			<div className="flex justify-center items-center min-w-screen min-h-screen bg-violet-50">
				<div className="container max-w-3xl mx-auto flex flex-col gap-8 shadow-2xl p-24 rounded-lg bg-white">
					<h1 className="text-5xl font-bold font-display text-violet-500">
						Hello World!
					</h1>
					<Input
						placeholder="Salary"
						value={salary}
						onChange={(e) => setSalary(e.target.value)}
					/>
					<Input
						value={weeklyRate}
						onChange={(e) => setWeeklyRate(e.target.value)}
						placeholder="Weekly Rate"
					/>

					<div>
						<p>
							$
							{finances.salary.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</p>
						<p>
							$
							{finances.weeklyRate.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</p>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default DashboardPage;
