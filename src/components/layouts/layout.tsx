import React from "react";

interface Props {
	children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
	return <div className="min-w-screen min-h-screen">{children}</div>;
};

export default Layout;
