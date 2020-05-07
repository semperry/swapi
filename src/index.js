import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import "./styles/main.scss";
import App from "./pages/App";
import About from "./pages/about";
import Docs from "./pages/docs";
import NavBar from "./navigation/navbar";
import Footer from "./components/footer";
import SwapiHeader from "./components/swapiHeader";

function Main() {
	return (
		<BrowserRouter>
			<NavBar />
			<SwapiHeader />
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

ReactDOM.render(
	<React.StrictMode>
		<Main />
	</React.StrictMode>,
	document.getElementById("root")
);
