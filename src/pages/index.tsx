import Layout from "@layouts/layout";
import React from "react";

const DashboardPage = () => {
	return (
		<Layout>
			<div className="flex justify-center items-center min-w-screen min-h-screen bg-violet-50">
				<div className="container max-w-3xl mx-auto flex flex-col gap-8 shadow-2xl p-8 rounded-lg bg-white">
					<h1 className="text-3xl font-bold font-display text-violet-500">
						Hello World!
					</h1>
					<p>This is the Next.js tailwind template</p>
				</div>
			</div>
		</Layout>
	);
};

export default DashboardPage;
