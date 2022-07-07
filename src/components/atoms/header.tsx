import React, { HTMLAttributes, FC } from "react";
import Display from "./display";

const Header: FC<HTMLAttributes<HTMLDivElement>> = ({
	children,
	className,
}) => {
	return (
		<div className={`w-max px-5 pt-5 ${className ?? ""}`}>
			<Display className="font-display md:text-6xl">{children}</Display>
		</div>
	);
};

export default Header;
