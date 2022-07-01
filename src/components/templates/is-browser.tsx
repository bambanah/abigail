import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type IsBrowserProps = {
	children: ReactNode;
};

export const IsBrowser = ({ children }: IsBrowserProps) => {
	const [isBrowser, setIsBrowser] = useState(false);

	useEffect(() => {
		setIsBrowser(true);
	}, []);

	if (!isBrowser) {
		return <></>;
	}

	return <>{children}</>;
};
