import Input from "@atoms/input";
import Label from "@atoms/label";
import React, { ChangeEvent } from "react";

interface Props {
	value: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	label: string;
	placeholder?: string;
}

const FormField: React.FC<Props> = ({
	value,
	onChange,
	label,
	placeholder,
}) => {
	return (
		<Label>
			<span>{label}</span>
			<Input
				placeholder={placeholder ?? label}
				value={value}
				onChange={onChange}
			/>
		</Label>
	);
};

export default FormField;
