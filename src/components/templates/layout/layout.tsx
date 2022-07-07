import Navigation from "@organisms/navigation";
import React, { FC } from "react";
import Content from "./content";

interface Props {
	children: React.ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
	return (
		<div className="flex flex-col w-full max-w-full h-full min-h-screen">
			<Navigation />
			<Content>{children}</Content>
		</div>
	);
};

export default Layout;
