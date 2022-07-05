import Breakdown from "@molecules/breakdown";
import ForecastChart from "@molecules/forecast-chart";
import Summary from "@molecules/summary";

const Home = () => {
	return (
		<div className="max-w-lg flex flex-col gap-8 items-center">
			<Summary />

			<ForecastChart years={5} />

			<Breakdown />
		</div>
	);
};

export default Home;
