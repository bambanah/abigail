import Navigation from "@organisms/navigation";
import React, { FC } from "react";
import Content from "./content";

interface Props {
	children: React.ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
	return (
		<div className="flex flex-col items-center w-full max-w-full h-full m-auto bg-background-50 lg:flex-row lg:justify-center lg:items-start lg:max-h-screen">
			<Navigation />
			<Content>{children}</Content>
		</div>
	);
};

export default Layout;
