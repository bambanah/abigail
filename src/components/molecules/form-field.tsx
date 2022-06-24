/* eslint-disable @typescript-eslint/no-explicit-any */
import Label from "src/components/atoms/label";
import React, { ChangeEvent } from "react";

interface Props {
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur: {
		(e: React.FocusEvent<any, Element>): void;
		<T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
	};
	label: string;
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
			<Label>
				{label}
				{required && <span className="text-red-500"> *</span>}
			</Label>
			<input
				placeholder={placeholder ?? label}
				id={name}
				name={name}
				onChange={onChange}
				value={value}
				className={`input input-bordered w-full max-w-xs${
					error ? " input-error" : ""
				}`}
				onBlur={onBlur}
				required={required}
			/>
			<span className="text-red-400">{error}</span>
		</div>
	);
};

export default FormField;
