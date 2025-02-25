import { useEffect } from "react";
import AtAtSpinner from "../components/common/AtAtSpinner";

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
					{ signal },
				)
					.then(() => {
						window.location.replace(
							"https://www.sabermasters.com/discount/RYAN47680",
						);
					})
					.catch((err) => console.error("Tracking failed: ", err)),
			3000,
		);

		return () => {
			abortController.abort();
		};
	}, [originType]);

	return (
		<div
			className="pulsing"
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
			}}
		>
			<h2>Getting your Discount Ready</h2>
			<p>
				<AtAtSpinner />
				You will be redirected shortly...
			</p>
		</div>
	);
};

export default AdClickRedirectPage;
