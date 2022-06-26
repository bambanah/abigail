import React from "react";

interface Props {
	children: React.ReactNode;
	variant?: "primary";
}

const Display = ({ children, variant }: Props) => {
	const variantClasses = {
		primary: "text-violet-500",
	};

	return (
		<h1
			className={`text-5xl font-bold font-display text-center ${
				variant ? variantClasses[variant] : ""
			}`}
		>
			{children}
		</h1>
	);
};

export default Display;
