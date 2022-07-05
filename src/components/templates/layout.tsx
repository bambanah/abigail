import Navigation from "@organisms/navigation";
import React from "react";

interface Props {
	children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
	return (
		<div className="flex flex-col items-center w-full max-w-full min-h-screen m-auto lg:flex-row lg:max-w-5xl lg:justify-center lg:items-start ">
			<Navigation className="justify-between w-full max-w-xl px-5 pt-10 box-border grow-0 lg:basis-1/3 lg:h-screen lg:justify-start lg:py-20 " />
			<div className="flex justify-center w-full pt-5 grow-0 lg:basis-2/3 lg:min-h-screen lg:py-10">
				{children}
			</div>
		</div>
	);
};

export default Layout;
