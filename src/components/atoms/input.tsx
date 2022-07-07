import React, { FC, InputHTMLAttributes } from "react";

const Input: FC<InputHTMLAttributes<HTMLInputElement>> = ({
	className,
	...rest
}) => {
	return (
		<input
			className={`border border-black rounded-none w-full max-w-xs px-2 h-10 focus-visible:outline focus-visible:outline-black focus-visible:outline-1 ${className}`}
			{...rest}
		/>
	);
};

export default Input;
