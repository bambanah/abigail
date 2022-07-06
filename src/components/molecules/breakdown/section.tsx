import CurrencyText from "@atoms/currency-text";
import Heading from "@atoms/heading";

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
	heading: [string, number | undefined];
	neutral?: boolean;
	children?: React.ReactNode | React.ReactNode[];
}

const Section: React.FC<SectionProps> = ({
	heading,
	neutral,
	children,
	className,
	...rest
}) => {
	const [label, total] = heading;

	return (
		<div className={className} {...rest}>
			<span className="flex justify-between">
				<Heading level="5">{label}</Heading>
				<CurrencyText
					value={total}
					useColor={neutral ? "text-warning" : true}
					includeSign={neutral ? false : true}
					className="font-bold"
				/>
			</span>
			<hr />
			<div className="flex flex-col gap-4 my-4">{children}</div>
		</div>
	);
};

export default Section;
