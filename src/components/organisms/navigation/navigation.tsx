import Display from "@atoms/display";
import Link from "next/link";
import {
	IoHelp,
	IoHome,
	IoHomeOutline,
	IoWallet,
	IoWalletOutline,
} from "react-icons/io5";
import NavLink from "./nav-link";

const Navigation = () => {
	return (
		<div className={`w-full max-w-7xl md:pt-5 md:px-10 self-center`}>
			<div className="flex justify-between shadow-md md:raised p-4">
				<Link href="/">
					<a>
						<Display className="text-center text-4xl text-primary">
							Abigail
						</Display>
					</a>
				</Link>

				<div className="flex items-start gap-2">
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
