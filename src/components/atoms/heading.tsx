import React, { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLHeadingElement> {
	level?: 1 | "1" | 2 | "2" | 3 | "3" | 4 | "4" | 5 | "5";
}

const Heading = ({ level, children, ...rest }: Props) => {
	const baseClass = "font-bold font-display";

	switch (level) {
		case 5:
		case "5":
			return (
				<h5 className={`${baseClass} text-lg`} {...rest}>
					{children}
				</h5>
			);
		case 4:
		case "4":
			return (
				<h4 className={`${baseClass} text-xl`} {...rest}>
					{children}
				</h4>
			);
		case 3:
		case "3":
			return (
				<h3 className={`${baseClass} text-2xl`} {...rest}>
					{children}
				</h3>
			);
		case 2:
		case "2":
			return (
				<h2 className={`${baseClass} text-3xl`} {...rest}>
					{children}
				</h2>
			);
		default:
			return (
				<h1 className={`${baseClass} text-4xl`} {...rest}>
					{children}
				</h1>
			);
	}
};

export default Heading;
