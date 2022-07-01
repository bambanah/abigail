import React, { SelectHTMLAttributes } from "react";

const Select: React.FC<SelectHTMLAttributes<HTMLSelectElement>> = ({
	children,
	className,
	...rest
}) => {
	return (
		<select
			className={`select select-bordered w-full max-w-xs ${className}`}
			{...rest}
		>
			{children}
		</select>
	);
};

export default Select;
