import React from "react";

interface Props {
	children: React.ReactNode;
}

const Label: React.FC<Props> = ({ children }: Props) => {
	return (
		<label className="label">
			<span className="label-text">{children}</span>
		</label>
	);
};

export default Label;
