import React from "react";

const Label: React.FC = ({ children }) => {
	return (
		<label className="label">
			<span className="label-text">{children}</span>
		</label>
	);
};

export default Label;
