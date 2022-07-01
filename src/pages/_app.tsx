import "@styles/globals.css";
import { IsBrowser } from "@templates/is-browser";
import { AppProps } from "next/app";
import Head from "next/head";

function App({ Component, pageProps }: AppProps) {
	return (
		<IsBrowser>
			<Head>
				<title>
					{process.env.NODE_ENV === "development" ? "</> " : ""}Abigail
				</title>
				<link rel="shortcut icon" type="image/png" href="/favicon.png" />
			</Head>

			<Component {...pageProps} />
		</IsBrowser>
	);
}

export default App;
