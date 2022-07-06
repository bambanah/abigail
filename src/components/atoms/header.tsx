import React, { HTMLAttributes, FC } from "react";
import Display from "./display";

const Header: FC<HTMLAttributes<HTMLDivElement>> = ({
	children,
	className,
}) => {
	return (
		<div className={`w-max p-5 ${className ?? ""}`}>
			<Display className="font-outfit">{children}</Display>
		</div>
	);
};

export default Header;
