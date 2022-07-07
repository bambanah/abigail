import React, { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	checked: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;
}

const Checkbox = ({ checked, onChange, className, ...rest }: Props) => {
	return (
		<input
			type="checkbox"
			checked={checked}
			onChange={onChange}
			className={`checkbox appearance-none cursor-pointer border border-black h-6 w-6 rounded-none ${className}`}
			{...rest}
		/>
	);
};

export default Checkbox;
