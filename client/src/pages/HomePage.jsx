import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

import AtAtSpinner from "../components/common/AtAtSpinner";

const HomePage = () => {
	const [endpoint, setEndpoint] = useState("people/1");
	const [currentData, setCurrentData] = useState();
	const [isDataLoading, setIsDataLoading] = useState(true);

	const handleFetchPreview = useCallback(() => {
		setIsDataLoading(true);

		fetch(`/api/${endpoint}`)
			.then((res) => res.json())
			.then((data) => {
				setCurrentData(data);
			})
			.catch((err) => console.log(err))
			.finally(() => setIsDataLoading(false));
	}, []);

	const renderData = () => {
		if (isDataLoading)
			return (
				<AtAtSpinner
					contentClass="pulsing yellow"
					message="Fetching your data, stanby..."
				/>
			);
		if (typeof currentData === "object") {
			return <pre>{JSON.stringify(currentData, null, 2)}</pre>;
		} else {
			return null;
		}
	};

	useEffect(() => {
		if (!currentData) {
			handleFetchPreview();
		}
	}, [handleFetchPreview]);

	return (
		<div className="content-container">
			<div className="row">
				<div>
					<p>All the Star Wars data you've ever wanted:</p>
					<p>
						<b>Planets, Spaceships, Vehicles, People, Films and Species</b>
					</p>
					<h4>Now with The Force Awakens data!</h4>
				</div>
			</div>

			<div className="row">
				<hr />
				<h1>Try it now!</h1>
				<div className="input-group">
					<span className="input-group-addon">https://www.swapi.tech/api/</span>
					<input
						className="input-group-control"
						type="text"
						placeholder="...try people/1/, or select from below."
						value={endpoint}
						onChange={(e) => setEndpoint(e.target.value)}
					/>
					<span className="input-group-btn">
						<button
							className="btn btn-primary"
							onClick={() => handleFetchPreview(endpoint)}
						>
							request
						</button>
					</span>
				</div>
				<div className="example-routes-wrapper">
					Need a hint? try{" "}
					<Link to="" onClick={() => setEndpoint("people/1")}>
						people/1/
					</Link>{" "}
					or{" "}
					<Link to="" onClick={() => setEndpoint("planets/3")}>
						planets/3/
					</Link>{" "}
					or{" "}
					<Link to="" onClick={() => setEndpoint("starships/9")}>
						starships/9/
					</Link>{" "}
				</div>
				<p className="result-header">Result:</p>
				<div className="json-content">
					<div className="well">{renderData()}</div>
				</div>
			</div>

			<div className="bottom-row">
				<div>
					<h4>What is this?</h4>
					<p>
						The Star Wars API, or "swapi" (Swah-pee) is the world's first
						quantified and programmatically-accessible data source for all the
						data from the Star Wars canon universe!
					</p>
					<p>
						We've taken all the rich contextual stuff from the universe and
						formatted into something easier to consume with software. Then we
						went and stuck an API on the front so you can access it all!
					</p>
				</div>
				<div>
					<h4>How can I use it?</h4>
					<p>
						All the data is accessible through our HTTP web API. Consult our{" "}
						<Link to="/documentation">documentation</Link> if you'd like to get
						started.
					</p>
				</div>
				<div>
					<h4>What happened with old swapi.co?</h4>
					<p>
						The original swapi.co is not supported or maintained anymore. But
						since so many of my projects and tutorials used it, as well as my
						colleagues I decided to rebuild it from (almost) scratch.
					</p>
				</div>
			</div>
			<hr />
		</div>
	);
};

export default HomePage;
