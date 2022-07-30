import React, { FC } from "react";
import CurrencyInputField, {
	CurrencyInputProps,
} from "react-currency-input-field";

const Input: FC<CurrencyInputProps> = ({ className, ...rest }) => {
	return (
		<CurrencyInputField
			className={`border border-black rounded-none w-full max-w-xs px-2 h-10 focus-visible:outline focus-visible:outline-black focus-visible:outline-1 ${className}`}
			prefix="$"
			{...rest}
		/>
	);
};

export default Input;
