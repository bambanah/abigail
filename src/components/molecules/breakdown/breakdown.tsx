import CurrencyText from "@atoms/currency-text";
import Heading from "@atoms/heading";
import { financeAtom } from "@state/finance-atom";
import {
	calculateAnnualExpenseAmount,
	getMarginalTaxRate,
} from "@utils/finance-helpers";
import { YearlySnapshot } from "@utils/forecast";
import { useAtom } from "jotai";
import { FC, RefObject } from "react";
import Indent from "./indent";
import Section from "./section";

interface Props {
	snapshot: YearlySnapshot;
	innerRef?: RefObject<HTMLDivElement>;
}

const Breakdown: FC<Props> = ({ snapshot, innerRef, ...rest }) => {
	const [finances] = useAtom(financeAtom);

	return (
		<div
			className="flex flex-col w-full m-auto items-center h-full"
			ref={innerRef}
			{...rest}
		>
			<div className={`flex flex-col px-2 box-border origin-top w-full`}>
				<Section heading={["Salary Package", snapshot.salary + snapshot.bonus]}>
					<Indent label="Salary" value={snapshot.salary} />
					<Indent label="Bonus" value={snapshot.bonus} />
				</Section>

				<Section
					heading={[
						"Superannuation",
						snapshot.super.employerCont +
							snapshot.super.concessionalCont +
							snapshot.super.nonConcessionalCont,
					]}
					neutral
				>
					<Indent
						label="Employer Super Cont."
						value={snapshot.super.employerCont * 0.85}
						subText={snapshot.super.employerCont * 0.15}
					/>
					<Indent
						label="FHSS Deposit"
						value={snapshot.super.fhssDepositAmount * 0.85}
						subText={snapshot.super.fhssDepositAmount * 0.15}
						neutral
					/>
					<Indent
						label="Concessional Cont."
						value={snapshot.super.concessionalCont * 0.85}
						subText={snapshot.super.concessionalCont * 0.15}
						neutral
					/>
					<Indent
						label="Non-Concessional Cont."
						value={snapshot.super.nonConcessionalCont * 0.85}
						subText={snapshot.super.nonConcessionalCont * 0.15}
					/>
				</Section>

				<Section heading={["Deductions", -snapshot.totalDeductions]}>
					<Indent label="Income Tax" value={-snapshot.deductions.incomeTax} />
					<Indent
						label="Medicare Levy"
						value={-snapshot.deductions.medicareLevy}
					/>
					<Indent
						label="Medicare Levy Surcharge"
						value={-snapshot.deductions.medicareLevySurcharge}
					/>
					<Indent label="HECS" value={-snapshot.deductions.hecs} />
				</Section>

				<Section heading={["Expenses", -snapshot.totalExpenses]}>
					{finances.expenses?.map((expense, idx) => (
						<Indent
							key={idx}
							label={expense.title}
							value={-calculateAnnualExpenseAmount(expense)}
						/>
					))}
				</Section>

				<div className="flex justify-between mt-5 mb-10 raised p-3">
					<Heading level="4">Savings</Heading>
					<Heading level="4">
						<CurrencyText
							value={
								snapshot.postExpensesIncome +
								snapshot.super.fhssDepositAmount * 0.85
							}
						/>
					</Heading>
				</div>

				<Section heading={["Balances", undefined]} neutral>
					<Indent label="Cash Savings" value={snapshot.totalCash} neutral />
					<Indent
						label="FHSS Amount in Super"
						value={snapshot.super.fhssAmountInSuper}
						neutral
					/>
					<Indent
						level={2}
						label="Total House Deposit"
						value={
							snapshot.super.fhssAmountInSuper -
							(1 - Math.max(0, getMarginalTaxRate(snapshot.salary) - 0.3)) +
							snapshot.totalCash
						}
						className="font-bold"
					/>
					<Indent
						label="Superannuation Balance"
						value={snapshot.totalSuper}
						neutral
					/>
					<Indent
						label="HECS Amount Left"
						value={snapshot.hecsAmountLeft}
						neutral
					/>
				</Section>
			</div>
		</div>
	);
};

export default Breakdown;
