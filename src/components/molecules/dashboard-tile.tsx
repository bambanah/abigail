import React, { HTMLAttributes, FC } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
	rows?: number;
	cols?: number;
}

const Tile: FC<Props> = ({ children, className, rows = 1, cols = 1 }) => {
	return (
		<div
			style={{
				gridRow: `span ${rows} / span ${rows}`,
				gridColumn: `span ${cols} / span ${cols}`,
			}}
			className={`raised h-full w-full p-4 flex items-start justify-center bg-base-100 overflow-y-auto ${className}`}
		>
			{children}
		</div>
	);
};

export default Tile;
