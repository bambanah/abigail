import Breakdown from "@molecules/breakdown";
import { isEditingFinanceAtom } from "@state/finance-atom";
import { useAtom } from "jotai";
import ForecastChart from "@molecules/forecast-chart";
import Summary from "@molecules/summary";
import FinanceForm from "@organisms/finance-form";
import FinanceSummary from "@organisms/finance-summary";

const Dashboard = () => {
	const [editingFinances] = useAtom(isEditingFinanceAtom);

	return (
		<div className="max-w-lg flex flex-col gap-8 items-center">
			{editingFinances ? <FinanceForm /> : <FinanceSummary />}

			<Summary />

			<ForecastChart years={5} />

			<Breakdown />
		</div>
	);
};

export default Dashboard;
