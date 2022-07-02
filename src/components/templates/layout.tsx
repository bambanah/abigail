import React from "react";

interface Props {
	children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
	return (
		<div className="flex justify-center min-w-screen min-h-screen py-10">
			{children}
		</div>
	);
};

export default Layout;
