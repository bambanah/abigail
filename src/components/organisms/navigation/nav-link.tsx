import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { IconType } from "react-icons";

interface Props extends LinkProps {
	children: React.ReactNode;
	icon?: IconType;
	iconActive?: IconType;
}

const NavLink: FC<Props> = ({
	children,
	href,
	icon: Icon,
	iconActive: IconActive,
	...rest
}) => {
	const router = useRouter();
	const active = router.pathname === href;

	const DisplayIcon = () => {
		if (active && IconActive) {
			return (
				<>
					<IconActive />
				</>
			);
		} else if (Icon) {
			return (
				<>
					<Icon />
				</>
			);
		} else {
			return <></>;
		}
	};

	return (
		<Link href={href} {...rest}>
			<a
				className={`flex items-center gap-1 w-full p-2 transition-colors hover:text-primary ${
					active ? "font-bold" : "font-medium"
				}`}
			>
				<DisplayIcon />
				{children}
			</a>
		</Link>
	);
};

export default NavLink;
