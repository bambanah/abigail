import Display from "@atoms/display";
import { isEditingFinanceAtom } from "@state/finance-atom";
import { useAtom } from "jotai";
import React, { FC, HTMLAttributes } from "react";
import FinanceForm from "./finance-form";
import FinanceSummary from "./finance-summary";

const Navigation: FC<HTMLAttributes<HTMLDivElement>> = ({ className }) => {
	const [editingFinances] = useAtom(isEditingFinanceAtom);

	return (
		<div className={`${className} flex gap-5 lg:flex-col lg:items-center`}>
			<Display variant="primary" className="text-center">
				Abigail
			</Display>

			{editingFinances ? <FinanceForm /> : <FinanceSummary />}
		</div>
	);
};

export default Navigation;
