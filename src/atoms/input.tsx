import React, { FC, InputHTMLAttributes } from "react";

const Input: FC<InputHTMLAttributes<HTMLInputElement>> = ({
	className,
	...rest
}) => {
	return (
		<input
			className={`${className} font-sans border-2 shadow-lg rounded-md p-2`}
			{...rest}
		/>
	);
};

export default Input;
