import Display from "@atoms/display";
import Breakdown from "@molecules/breakdown";
import Summary from "@molecules/summary";
import FinanceForm from "@organisms/finance-form";
import FinanceSummary from "@organisms/finance-summary";
import { isEditingFinanceAtom } from "@state/finance-atom";
import { useAtom } from "jotai";

const Home = () => {
	const [editingFinances] = useAtom(isEditingFinanceAtom);

	return (
		<div className="max-w-lg flex flex-col gap-8 items-center">
			<Display variant="primary" className="text-center">
				Abigail
			</Display>

			{editingFinances ? <FinanceForm /> : <FinanceSummary />}

			<Summary />

			<Breakdown />
		</div>
	);
};

export default Home;
