import { Link, isRouteErrorResponse, useRouteError } from "@remix-run/react";

export function ErrorPage() {
	const error = useRouteError();
	let status = 500;
	let message = "An unexpected error occurred.";
	let is404 = false;

	if (isRouteErrorResponse(error)) {
		status = error.status;
		switch (error.status) {
			case 404:
				message = "Page Not Found";
				is404 = true;
				break;
		}
	} else {
		console.error(error);
	}

	if (is404) {
		return (
			<div className="container prose py-8">
				<h1 className="text-8xl font-bold text-primary mb-4">404</h1>
				<p className="text-2xl mb-2">
					This is not the page you are looking for.
				</p>
				<p className="text-muted-foreground italic mb-8">
					Move along... move along.
				</p>
				<Link to="/" reloadDocument className="text-primary hover:underline">
					← Go Home
				</Link>
			</div>
		);
	}

	return (
		<div className="container prose py-8">
			<h1>{status}</h1>
			<p>{message}</p>
		</div>
	);
}
