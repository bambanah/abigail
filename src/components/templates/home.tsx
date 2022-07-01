import Display from "@atoms/display";
import Summary from "@molecules/summary";
import FinanceForm from "@organisms/form";

const Home = () => {
	return (
		<div className="container max-w-lg mx-auto flex flex-col gap-8 justify-center">
			<Display variant="primary" className="text-center">
				Abigail
			</Display>

			{/* TODO: Expand when editing, then collapse */}
			<FinanceForm />

			<Summary />
		</div>
	);
};

export default Home;
