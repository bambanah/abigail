import { FC, InputHTMLAttributes } from "react";
import CurrencyInput from "react-currency-input-field";
import Checkbox from "./checkbox";
import Input from "./input";

interface Props
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
	id: string;
	label?: string;
	type?: "text" | "checkbox" | "currency";
	onChange: (value: string) => void;
	value?: string | number;
	checked?: boolean;
	error?: string;
}

const FormControl: FC<Props> = ({
	label,
	id,
	type,
	value,
	checked,
	onChange,
	...rest
}) => {
	if (type === "checkbox") {
		return (
			<div className="flex items-center">
				<Checkbox
					id={id}
					value={value}
					checked={checked ?? false}
					name={id}
					onChange={(e) => onChange(e.target.value)}
					{...rest}
				/>
				<label className="label cursor-pointer pl-2" htmlFor={id}>
					<span>{label}</span>
				</label>
			</div>
		);
	}

	return (
		<div className="form-control w-40">
			{label && (
				<label className="label" htmlFor={id}>
					<span>{label}</span>
				</label>
			)}
			{type === "currency" ? (
				<CurrencyInput
					id={id}
					value={value}
					name={id}
					defaultValue={value}
					onValueChange={(value) => onChange(value ?? "")}
					prefix="$"
					className="border border-black rounded-none w-full max-w-xs px-2 h-10 focus-visible:outline focus-visible:outline-black focus-visible:outline-1"
				/>
			) : (
				<Input
					id={id}
					value={value}
					name={id}
					onChange={(e) => onChange(e.target.value)}
					{...rest}
				/>
			)}
		</div>
	);
};

export default FormControl;
