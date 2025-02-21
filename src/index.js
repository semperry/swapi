import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import "./styles/main.scss";
import App from "./pages/App";
import About from "./pages/about";
import Docs from "./pages/docs";
import NavBar from "./navigation/navbar";
import Footer from "./components/footer";
import SwapiHeader from "./components/swapiHeader";
import BannerAds from "./components/affiliate/BannerAds";
import PayPalButton from "./components/affiliate/PayPalButton";

function Main() {
	return (
		<BrowserRouter>
			<NavBar />
			<SwapiHeader />

			<div className="row ad-box">
				<div className="banner-ad-box pulsing">
					<span>
						<a
							className="yellow"
							href="https://www.sabermasters.com/discount/RYAN47680"
							target="_blank"
						>
							Get yours today!
						</a>
					</span>
					<BannerAds />
					<a
						className="yellow"
						href="https://www.sabermasters.com/discount/RYAN47680"
						target="_blank"
					>
						Get yours today!
					</a>
				</div>

				<PayPalButton />
			</div>

			<Switch>
				<Route exact path="/" component={App} />
				<Route path="/about" component={About} />
				<Route path="/documentation" component={Docs} />
				<Route path="/docs" component={Docs} />
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
