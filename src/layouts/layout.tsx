import React, { FC } from "react";

const Layout: FC = ({ children }) => {
	return <div className="min-w-screen min-h-screen">{children}</div>;
};

export default Layout;
