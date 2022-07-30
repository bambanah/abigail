import React, { FC } from "react";

interface Props {
	children: React.ReactNode;
}

const Content: FC<Props> = ({ children }) => (
	<div className="w-full grow-1 pt-[5.1rem] sm:pt-0">
		<div className="flex justify-center">{children}</div>
	</div>
);

export default Content;
