import { BrowserRouter, Switch, Route } from "react-router-dom";

import About from "./pages/AboutPage";
import AdClickRedirectPage from "./pages/AdClickRedirectPage";
import BannerAds from "./components/affiliate/BannerAds";
import Docs from "./pages/DocsPage";
import Footer from "./components/Footer";
import Home from "./pages/HomePage";
import NavBar from "./components/Navbar";
import PayPalButton from "./components/affiliate/PayPalButton";
import SwapiHeader from "./components/SwapiHeader";

const App = () => {
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
				<Route exact path="/" component={Home} />
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
};

export default App;
