import React, { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLHeadingElement> {
	variant?: "primary" | "secondary";
	children: React.ReactNode;
}

const Display = ({ children, variant, className, ...rest }: Props) => {
	const variantClasses = {
		primary: "text-violet-500",
		secondary: "text-orange-600",
	};

	return (
		<h1
			className={`text-5xl font-bold font-display ${
				variant ? variantClasses[variant] : ""
			} ${className}`}
			{...rest}
		>
			{children}
		</h1>
	);
};

export default Display;
