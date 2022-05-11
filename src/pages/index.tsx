import Layout from "@layouts/layout";
import FormField from "@molecules/form-field";
import React, { useEffect, useState } from "react";
import { calculateSavings } from "src/helpers/finance";
import { Finance } from "types/finance";

const DashboardPage = () => {
	const [salary, setSalary] = useState("");
	const [expenses, setExpenses] = useState("");
	const [desiredFunMoney, setDesiredFunMoney] = useState("");

	const [savings, setSavings] = useState("");

	useEffect(() => {
		if (
			!Number.isSafeInteger(salary) ||
			!Number.isSafeInteger(desiredFunMoney) ||
			!Number.isSafeInteger(expenses)
		) {
			setSavings("N/A");
		}

		const finances: Finance = {
			salary: Number(salary),
			desiredFunMoney: Number(desiredFunMoney),
			expenses: {
				total: Number(expenses),
			},
		};

		const calculatedSavings = calculateSavings(finances);

		setSavings(
			calculatedSavings?.toLocaleString(undefined, {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			}) ?? "N/A"
		);
	}, [salary, desiredFunMoney, expenses]);

	return (
		<Layout>
			<div className="flex justify-center items-center min-w-screen min-h-screen bg-violet-50">
				<div className="container max-w-3xl mx-auto flex flex-col gap-8 shadow-2xl p-24 rounded-lg bg-white">
					<h1 className="text-5xl font-bold font-display text-violet-500">
						Gib To Me
					</h1>

					<FormField
						label="Salary"
						value={salary}
						onChange={(e) => setSalary(e.target.value)}
					/>

					<FormField
						label="Expenses (per week)"
						value={expenses}
						onChange={(e) => setExpenses(e.target.value)}
					/>

					<FormField
						label="Fun Money"
						value={desiredFunMoney}
						onChange={(e) => setDesiredFunMoney(e.target.value)}
					/>

					<div>
						<p>${savings}/yr</p>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default DashboardPage;
