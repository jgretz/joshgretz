import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";

import { ErrorPage } from "./components/error";

import "./globals.css";

import { GlobalPendingIndicator } from "./components/global-pending-indicator";
import Bar from "./components/side/bar";

function App({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<GlobalPendingIndicator />
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function Root() {
	return (
		<App>
			<div className="side absolute left-0 top-0 z-10 w-full bg-black text-white sm:fixed sm:h-full sm:w-[200px]">
				<Bar />
			</div>

			<div className="absolute left-0 top-[240px] z-0 w-full bg-background text-black sm:top-0 sm:min-h-screen sm:pl-[200px]">
				<Outlet />
			</div>
		</App>
	);
}

export function ErrorBoundary() {
	return (
		<App>
			<ErrorPage />
		</App>
	);
}
