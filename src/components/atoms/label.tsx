import React from "react";

interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
	children: React.ReactNode;
}

const Label: React.FC<Props> = ({ children, ...rest }: Props) => {
	return (
		<label className="label" {...rest}>
			<span className="label-text">{children}</span>
		</label>
	);
};

export default Label;
