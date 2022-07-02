import CurrencyText from "@atoms/currency-text";
import Heading from "@atoms/heading";
import { financeAtom } from "@state/finance-atom";
import { estimateSavings, calculateTotalExpenses } from "@utils/finance";
import {
	calculateAnnualExpenseAmount,
	calculateEmployerSuperContribution,
	calculateHecsRepayment,
	calculateIncomeTax,
	calculateMedicareLevy,
	calculateMedicareLevySurcharge,
} from "@utils/finance-helpers";
import { useAtom } from "jotai";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import Indent from "./indent";
import Section from "./section";

const Breakdown = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [finances] = useAtom(financeAtom);

	const assessableIncome =
		finances.salary +
		(finances.bonus !== undefined && finances.bonus.length > 0
			? finances.bonus[0]
			: 0);

	const employerSuperCont =
		calculateEmployerSuperContribution(assessableIncome);
	const totalPackage = assessableIncome + employerSuperCont;

	const fhssPaid = finances.schemes?.fhss ? 15_000 : 0;
	const totalAdditionalSuper = fhssPaid;

	const incomeTax = calculateIncomeTax(assessableIncome);
	const medicareLevy = calculateMedicareLevy(assessableIncome);
	const medicareLevySurcharge =
		calculateMedicareLevySurcharge(assessableIncome);
	const hecsRepayment = calculateHecsRepayment(assessableIncome);
	const totalTaxPaid =
		incomeTax + medicareLevy + medicareLevySurcharge + hecsRepayment;

	return (
		<div className="flex flex-col gap-5 max-w-96 items-center">
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="text-blue-500 flex items-center gap-1"
			>
				<span>{isExpanded ? "Hide" : "View"} Breakdown</span>
				<FaChevronDown
					className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
				/>
			</button>
			<div
				className={`flex flex-col gap-5 overflow-hidden shadow-lg p-5 box-border origin-top min-w-full rounded-md transition-all ${
					isExpanded ? "max-h-full h-full" : "max-h-0 h-0 py-0"
				}`}
			>
				<Section heading={["Salary Package", totalPackage]}>
					<Indent label="Salary" value={finances.salary} />
					<Indent label="Bonus" value={finances.bonus?.at(0) ?? 0} />
					<Indent label="Employer Super Cont." value={employerSuperCont} />
				</Section>

				<Section heading={["Additional Super", totalAdditionalSuper]} neutral>
					<Indent label="FHSS" value={fhssPaid} neutral />
					<Indent label="Concessional Cont." neutral />
					<Indent label="Non-Concessional Cont." neutral />
				</Section>

				<Section heading={["Deductions", -totalTaxPaid]}>
					<Indent label="Income Tax" value={-incomeTax} />
					<Indent label="Medicare Levy" value={-medicareLevy} />
					<Indent
						label="Medicare Levy Surcharge"
						value={-medicareLevySurcharge}
					/>
					<Indent label="HECS" value={-hecsRepayment} />
				</Section>

				<Section
					heading={["Expenses", -calculateTotalExpenses(finances.expenses)]}
				>
					{finances.expenses?.map((expense, idx) => (
						<Indent
							key={idx}
							label={expense.title}
							value={-calculateAnnualExpenseAmount(expense)}
						/>
					))}
				</Section>

				<div className="flex justify-between">
					<Heading level="4">Savings</Heading>
					<Heading level="4">
						<CurrencyText value={estimateSavings(finances).estimatedTotal} />
					</Heading>
				</div>
			</div>
		</div>
	);
};

export default Breakdown;
