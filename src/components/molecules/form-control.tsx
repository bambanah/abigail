import { ReactNode } from "react";

interface Props {
	id: string;
	label?: string;
	children?: ReactNode;
	className?: string;
	error?: string;
	labelLocation?: "left" | "right" | "top" | "bottom";
}

const FormControl = ({
	id,
	label,
	children,
	className,
	labelLocation,
}: Props) => {
	let locationStyle: string;

	switch (labelLocation) {
		case "left": {
			locationStyle = "flex-row items-center";
			break;
		}
		case "right": {
			locationStyle = "flex-row-reverse justify-end items-center gap-1";
			break;
		}
		case "bottom": {
			locationStyle = "flex-col-reverse justify-end";
			break;
		}
		default:
			locationStyle = "flex-col";
	}

	return (
		<div className={`w-40 flex ${locationStyle} ${className}`}>
			{label && (
				<label className="label" htmlFor={id}>
					<span>{label}</span>
				</label>
			)}
			{children}
		</div>
	);
};

export default FormControl;
