/* eslint-disable @typescript-eslint/no-explicit-any */
import Label from "src/components/atoms/label";
import React, { ChangeEvent } from "react";
import Input from "@atoms/input";
import ErrorMessage from "@atoms/error";

interface Props {
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur: {
		(e: React.FocusEvent<any, Element>): void;
		<T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
	};
	label?: string;
	placeholder?: string;
	error?: string;
	name: string;
	required?: boolean;
	value: string;
}

const FormField: React.FC<Props> = ({
	onChange,
	onBlur,
	label,
	placeholder,
	error,
	name,
	required,
	value,
}) => {
	return (
		<div className="form-control">
			{label && (
				<Label htmlFor={name} className="font-bold">
					{label}
					{required && <span className="text-error"> *</span>}
				</Label>
			)}
			<Input
				placeholder={placeholder ?? label}
				id={name}
				name={name}
				onChange={onChange}
				value={value}
				className={error ? "input-error" : ""}
				onBlur={onBlur}
				required={required}
			/>
			<ErrorMessage>{error}</ErrorMessage>
		</div>
	);
};

export default FormField;
