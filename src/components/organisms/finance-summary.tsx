import Heading from "@atoms/heading";
import { financeAtom, isEditingFinanceAtom } from "@state/finance-atom";
import { formatDollars } from "@utils/generic";
import { useAtom } from "jotai";
import React from "react";
import { FaPencilAlt } from "react-icons/fa";

const FinanceSummary = () => {
	const [editingFinances, setEditingFinances] = useAtom(isEditingFinanceAtom);
	const [finances] = useAtom(financeAtom);

	return (
		<div className="gap-5 flex flex-col">
			<div className="flex items-center gap-1 justify-center relative">
				<Heading level={3}>Your Finances</Heading>
				{!editingFinances && (
					<button
						onClick={() => setEditingFinances(true)}
						className="w-8 h-8 inline-flex justify-center items-center btn-ghost rounded-md absolute right-8"
					>
						<FaPencilAlt />
					</button>
				)}
			</div>

			<div className="flex gap-10 items-center justify-between ">
				<span>
					<b>Salary</b> {formatDollars(finances.salary)}
				</span>
				<span>
					<b>Bonus</b> {formatDollars(finances.bonus || 0)}
				</span>
			</div>
		</div>
	);
};

export default FinanceSummary;
