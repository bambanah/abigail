import { ChangeEvent, FC, InputHTMLAttributes } from "react";
import Checkbox from "./checkbox";
import Input from "./input";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	id: string;
	label?: string;
	type?: "text" | "checkbox";
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
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
					{...rest}
				/>
				<label className="label cursor-pointer pl-2" htmlFor={id}>
					<span>{label}</span>
				</label>
			</div>
		);
	}

	return (
		<div className="form-control">
			{label && (
				<label className="label" htmlFor={id}>
					<span>{label}</span>
				</label>
			)}
			<Input id={id} value={value} name={id} {...rest} />
		</div>
	);
};

export default FormControl;
