import Display from "@atoms/display";
import Summary from "@molecules/summary";
import FinanceForm from "@organisms/finance-form";
import FinanceSummary from "@organisms/finance-summary";
import { isEditingFinanceAtom } from "@state/finance-atom";
import { useAtom } from "jotai";

const Home = () => {
	const [editingFinances] = useAtom(isEditingFinanceAtom);

	return (
		<div className="max-w-lg flex flex-col gap-8 items-center mt-20">
			<Display variant="primary" className="text-center">
				Abigail
			</Display>

			<div className="shadow-2xl p-5 rounded-lg">
				{editingFinances ? <FinanceForm /> : <FinanceSummary />}
			</div>

			<Summary />
		</div>
	);
};

export default Home;
