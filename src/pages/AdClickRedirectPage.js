import { useEffect } from "react";

const AdClickRedirectPage = (props) => {
	const originType = props.match.params.originType;

	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;

		setTimeout(
			() =>
				fetch(
					`/track/saber-masters/${
						originType.includes("sabermasters-swapi") ? "api-click" : "ad-click"
					}`,
					{ signal }
				)
					.then(() => {
						window.location.replace(
							"https://www.sabermasters.com/discount/RYAN47680"
						);
					})
					.catch((err) => console.error("Tracking failed: ", err)),
			2000
		);

		return () => {
			abortController.abort();
		};
	}, [originType]);

	return (
		<div>
			<h3>Getting your Discount Ready</h3>
			<p>...Loading</p>
		</div>
	);
};

export default AdClickRedirectPage;
