import Display from "@atoms/display";
import Link from "next/link";
import { useState } from "react";
import {
	IoHelp,
	IoHome,
	IoHomeOutline,
	IoMenu,
	IoWallet,
	IoWalletOutline,
} from "react-icons/io5";
import NavLink from "./nav-link";

const Navigation = () => {
	const [navLinksShown, setNavLinksShown] = useState(false);

	return (
		<div
			className={`w-full max-w-7xl px-4 pt-4 flex flex-col gap-4 md:pt-5 md:px-10 self-center fixed z-50 sm:relative`}
		>
			<div className="flex justify-between raised bg-base-100 p-3 md:p-4">
				<Link href="/">
					<a>
						<Display className="text-center text-4xl text-primary">
							Abigail
						</Display>
					</a>
				</Link>

				<div className="hidden sm:flex items-start gap-2">
					<NavLink href="/" icon={IoHelp}>
						What If...
					</NavLink>
					<NavLink href="/dashboard" icon={IoHomeOutline} iconActive={IoHome}>
						Dashboard
					</NavLink>
					<NavLink
						href="/expenses"
						icon={IoWalletOutline}
						iconActive={IoWallet}
					>
						Expenses
					</NavLink>
				</div>
				<div
					className="flex sm:hidden items-center cursor-pointer"
					onClick={() => setNavLinksShown(!navLinksShown)}
				>
					<IoMenu className="h-10 w-10" />
				</div>
			</div>
			<div
				className={`${
					navLinksShown ? "fixed" : "hidden"
				} fixed h-screen w-full left-0 top-24 px-4 sm:hidden box-border`}
			>
				<div className={`flex-col gap-4 p-2 raised bg-base-100 sm:hidden`}>
					<NavLink href="/" icon={IoHelp}>
						What If...
					</NavLink>
					<NavLink href="/dashboard" icon={IoHomeOutline} iconActive={IoHome}>
						Dashboard
					</NavLink>
					<NavLink
						href="/expenses"
						icon={IoWalletOutline}
						iconActive={IoWallet}
					>
						Expenses
					</NavLink>
				</div>
			</div>
		</div>
	);
};

export default Navigation;
