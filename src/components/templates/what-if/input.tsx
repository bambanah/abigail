import { ChangeEvent, FC } from "react";

interface InputProps {
	label: string;
	id: string;
	value: string | number;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<InputProps> = ({ label, id, value, onChange }) => {
	return (
		<div className="form-control">
			<label className="label" htmlFor={id}>
				<span className="">{label}</span>
			</label>
			<input
				className="input input-bordered max-w-fit"
				id={id}
				value={value}
				onChange={onChange}
			/>
		</div>
	);
};

export default Input;
