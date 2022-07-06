import React, { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLHeadingElement> {
	variant?:
		| "primary"
		| "secondary"
		| "accent"
		| "info"
		| "success"
		| "warning"
		| "error";
	children?: React.ReactNode;
}

const Display = ({ children, variant, className, ...rest }: Props) => {
	return (
		<h1
			className={`text-5xl font-bold font-display ${
				variant ? `text-${variant}` : ""
			} ${className}`}
			{...rest}
		>
			{children}
		</h1>
	);
};

export default Display;
