import React, { FC } from "react";

interface Props {
	children: React.ReactNode;
}

const Content: FC<Props> = ({ children }) => (
	<div className="w-full grow-1 lg:h-screen lg:max-h-screen overflow-y-auto">
		<div className="flex justify-center">{children}</div>
	</div>
);

export default Content;
