import Breakdown from "@molecules/breakdown";
import { isEditingFinanceAtom } from "@state/finance-atom";
import { useAtom } from "jotai";
import ForecastChart from "@molecules/forecast-chart";
import Summary from "@molecules/summary";
import FinanceForm from "@organisms/finance-form";
import FinanceSummary from "@organisms/finance-summary";
import Tile from "@molecules/dashboard-tile";

const Dashboard = () => {
	const [editingFinances] = useAtom(isEditingFinanceAtom);

	return (
		<div className="max-w-7xl w-full p-10 gap-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 grid-flow-row-dense auto-rows-[10rem]">
			<Tile rows={editingFinances ? 2 : 1}>
				{editingFinances ? <FinanceForm /> : <FinanceSummary />}
			</Tile>

			<Tile>
				<Summary />
			</Tile>

			<Tile rows={4} className="items-start">
				<Breakdown />
			</Tile>

			<Tile rows={2} cols={2}>
				<ForecastChart years={5} />
			</Tile>
		</div>
	);
};

export default Dashboard;
