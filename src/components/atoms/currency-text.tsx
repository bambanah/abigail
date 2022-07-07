import { formatDollars } from "@utils/generic";

interface CurrentTextProps extends React.HTMLAttributes<HTMLSpanElement> {
	value?: number;
	children?: number;
	includeSign?: boolean;
	useColor?: boolean | string;
}

const CurrencyText = ({
	value,
	children,
	includeSign = true,
	className,
	useColor = true,
	...rest
}: CurrentTextProps) => {
	let color: string;

	const amount = children ?? value;

	if (amount === undefined || amount === 0) {
		color = "text-neutral";
	} else if (useColor === true) {
		color = amount > 0 ? "text-success" : "text-error";
	} else if (typeof useColor === "string") {
		color = useColor;
	} else {
		color = "text-neutral";
	}

	return (
		<span className={`${color} ${className}`} {...rest}>
			{amount !== undefined ? formatDollars(amount, { includeSign }) : "N/A"}
		</span>
	);
};

export default CurrencyText;
