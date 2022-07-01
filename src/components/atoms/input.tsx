import React, { FC, InputHTMLAttributes } from "react";

const Input: FC<InputHTMLAttributes<HTMLInputElement>> = ({
	className,
	...rest
}) => {
	return (
		<input
			className={`input input-bordered w-full max-w-xs ${className}`}
			{...rest}
		/>
	);
};

export default Input;
