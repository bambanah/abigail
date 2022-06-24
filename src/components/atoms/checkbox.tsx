import React from "react";

interface Props {
	label: string;
	checked: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	name: string;
	className?: string;
}

const Checkbox = ({ checked, label, name, onChange, className }: Props) => {
	return (
		<div className={`form-control ${className}`}>
			<label className="label cursor-pointer justify-start gap-2">
				<input
					type="checkbox"
					checked={checked}
					onChange={onChange}
					className="checkbox"
					name={name}
				/>
				<span className="label-text">{label}</span>
			</label>
		</div>
	);
};

export default Checkbox;
