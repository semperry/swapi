import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import About from "./pages/about";
import AdClickRedirectPage from "./pages/AdClickRedirectPage";
import App from "./pages/App";
import BannerAds from "./components/affiliate/BannerAds";
import Docs from "./pages/docs";
import Footer from "./components/footer";
import NavBar from "./navigation/navbar";
import PayPalButton from "./components/affiliate/PayPalButton";
import SwapiHeader from "./components/swapiHeader";

import "./styles/main.scss";

function Main() {
	const trackAndRedirect = () => {
		fetch("/track/saber-masters")
			.then(() => {
				window.open(
					"https://www.sabermasters.com/discount/RYAN47680",
					"_blank"
				);
			})
			.catch((err) => console.error("Tracking failed: ", err));
	};

	return (
		<BrowserRouter>
			<NavBar />
			<SwapiHeader />

			<div className="row ad-box">
				<div className="banner-ad-box pulsing" onClick={trackAndRedirect}>
					<span>Get $10 Off!</span>
					<BannerAds />
					Get $10 Off!
				</div>

				<PayPalButton />
			</div>

			<Switch>
				<Route exact path="/" component={App} />
				<Route path="/about" component={About} />
				<Route path="/documentation" component={Docs} />
				<Route path="/docs" component={Docs} />
				<Route
					path="/partner-discount/:originType"
					component={AdClickRedirectPage}
				/>
			</Switch>
			<Footer />
		</BrowserRouter>
	);
}

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
	<React.StrictMode>
		<Main />
	</React.StrictMode>
);
