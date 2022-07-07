import CurrencyText from "@atoms/currency-text";
import Heading from "@atoms/heading";
import { financeAtom } from "@state/finance-atom";
import { calculateAnnualExpenseAmount } from "@utils/finance-helpers";
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
			className="flex flex-col w-full items-center h-full"
			ref={innerRef}
			{...rest}
		>
			<div className={`flex flex-col px-2 box-border origin-top w-full`}>
				<Section
					heading={[
						"Salary Package",
						snapshot.salary + snapshot.bonus + snapshot.super.employerCont,
					]}
				>
					<Indent label="Salary" value={snapshot.salary} />
					<Indent label="Bonus" value={snapshot.bonus} />
					<Indent
						label="Employer Super Cont."
						value={snapshot.super.employerCont}
					/>
				</Section>

				<Section
					heading={[
						"Additional Super",
						snapshot.super.concessionalCont +
							snapshot.super.nonConcessionalCont,
					]}
					neutral
				>
					<Indent
						label="Concessional Cont."
						value={snapshot.super.concessionalCont}
					/>
					<Indent
						label="Non-Concessional Cont."
						value={snapshot.super.nonConcessionalCont}
					/>
				</Section>

				<Section
					heading={["Schemes", snapshot.super.fhssAmountInSuper]}
					neutral
				>
					<Indent
						label="FHSS Deposit"
						value={snapshot.super.fhssDepositAmount}
						neutral
					/>
					<Indent
						label="FHSS Amount In Super"
						value={snapshot.super.fhssAmountInSuper}
						neutral
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

				<div className="flex justify-between">
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
			</div>
		</div>
	);
};

export default Breakdown;
