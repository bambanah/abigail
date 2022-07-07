import CurrencyText from "@atoms/currency-text";
import { round } from "@utils/generic";

interface IndentProps extends React.HTMLAttributes<HTMLParagraphElement> {
	label: string;
	subText?: number;
	level?: number;
	value?: number;
	neutral?: boolean;
}

const Indent = ({
	label,
	value,
	neutral,
	subText,
	level,
	className,
	...rest
}: IndentProps) => {
	const leftMargin = `ml-${((level ?? 1) - 1) * 6}`;

	return (
		<div
			className={`${leftMargin} gap-1 flex justify-between ${className}`}
			{...rest}
		>
			<span
				className={`${
					value === 0 || value === undefined ? "text-gray-500" : ""
				}`}
			>
				{label}
			</span>
			<div className={`flex flex-col items-end`}>
				<CurrencyText
					value={value}
					useColor={neutral ? "text-base" : true}
					includeSign={neutral ? false : true}
					className={`${
						value === 0 || value === undefined ? "text-gray-500" : ""
					}`}
				/>
				{subText ? (
					<span className="text-error text-sm">
						<CurrencyText value={-round(subText, 0)} />
					</span>
				) : (
					<></>
				)}
			</div>
		</div>
	);
};

export default Indent;
