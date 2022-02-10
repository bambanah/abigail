import React, { ButtonHTMLAttributes, FC } from "react";

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
	children,
	className,
	...rest
}) => {
	return (
		<button
			className={`${className} font-sans bg-slate-200 p-4 rounded-md shadow-xl`}
			{...rest}
		>
			{children}
		</button>
	);
};

export default Button;
