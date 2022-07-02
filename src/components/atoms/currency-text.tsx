import { formatDollars } from "@utils/generic";

interface CurrentTextProps extends React.HTMLAttributes<HTMLSpanElement> {
	value?: number;
	includeSign?: boolean;
	useColor?: boolean | string;
}

const CurrencyText = ({
	value,
	includeSign = true,
	className,
	useColor = true,
	...rest
}: CurrentTextProps) => {
	let color: string;

	if (value === undefined || value === 0) {
		color = "text-slate-500";
	} else if (useColor === true) {
		color = value > 0 ? "text-green-600" : "text-red-600";
	} else if (typeof useColor === "string") {
		color = useColor;
	} else {
		color = "text-slate-500";
	}

	return (
		<span className={`${color} ${className}`} {...rest}>
			{value !== undefined ? formatDollars(value, includeSign) : "N/A"}
		</span>
	);
};

export default CurrencyText;
