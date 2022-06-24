import React, { ButtonHTMLAttributes, FC } from "react";

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
	children,
	className,
	...rest
}) => {
	return (
		<button className={`${className} btn`} {...rest}>
			{children}
		</button>
	);
};

export default Button;
