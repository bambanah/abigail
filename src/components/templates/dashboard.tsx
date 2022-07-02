import Display from "@atoms/display";
import ForecastChart from "@molecules/forecast-chart";

const Dashboard = () => {
	return (
		<div className="flex flex-col items-center gap-10 w-full h-full">
			<Display variant="secondary">5 Year Summary</Display>
			<div className="max-w-2xl max-h-96 w-full h-96">
				<ForecastChart />
			</div>
		</div>
	);
};

export default Dashboard;
