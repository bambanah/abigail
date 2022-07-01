import React, { HTMLAttributes, FC } from "react";

const ErrorMessage: FC<HTMLAttributes<HTMLSpanElement>> = ({
	children,
	className,
	...rest
}) => {
	return (
		<span className={`text-red-500 ${className}`} {...rest}>
			{children}
		</span>
	);
};

export default ErrorMessage;
