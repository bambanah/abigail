import Display from "@atoms/display";
import { FC, HTMLAttributes } from "react";
import {
	IoHelp,
	IoHome,
	IoHomeOutline,
	IoPerson,
	IoPersonOutline,
	IoSettings,
	IoSettingsOutline,
	IoWallet,
	IoWalletOutline,
} from "react-icons/io5";
import NavLink from "./nav-link";

const Navigation: FC<HTMLAttributes<HTMLDivElement>> = ({ className }) => {
	return (
		<div
			className={`justify-between w-full max-w-3xl box-border lg:w-64 lg:h-screen lg:max-h-screen ${className}`}
		>
			<div
				style={{ height: "calc(100% - 8rem)" }}
				className="flex box-border lg:flex-col lg:my-16 border-neutral-100 lg:border-r-2 lg:border-slate-200 lg:gap-20 lg:items-center"
			>
				<Display className="text-center text-4xl">Abigail</Display>

				<div className="flex items-start gap-6 lg:flex-col lg:w-full">
					<NavLink href="/" icon={IoHomeOutline} iconActive={IoHome}>
						Dashboard
					</NavLink>
					<NavLink href="/hypotheticals" icon={IoHelp}>
						What If...
					</NavLink>
					<NavLink
						href="/expenses"
						icon={IoWalletOutline}
						iconActive={IoWallet}
					>
						Expenses
					</NavLink>
				</div>

				<div className="flex mt-auto items-start gap-5 lg:flex-col lg:w-full">
					<NavLink href="/account" icon={IoPersonOutline} iconActive={IoPerson}>
						Account
					</NavLink>
					<NavLink
						href="/settings"
						icon={IoSettingsOutline}
						iconActive={IoSettings}
					>
						Settings
					</NavLink>
				</div>
			</div>
		</div>
	);
};

export default Navigation;
