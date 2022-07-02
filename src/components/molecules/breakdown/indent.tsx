import CurrencyText from "@atoms/currency-text";

interface IndentProps extends React.HTMLAttributes<HTMLParagraphElement> {
	label: string;
	value?: number;
	neutral?: boolean;
}

const Indent = ({ label, value, neutral, className, ...rest }: IndentProps) => (
	<p className={`ml-7 gap-1 flex justify-between ${className}`} {...rest}>
		<span>{label}</span>
		<CurrencyText
			value={value}
			useColor={neutral ? "text-yellow-500" : true}
			includeSign={neutral ? false : true}
		/>
	</p>
);

export default Indent;
