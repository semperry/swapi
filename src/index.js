import React, { createContext, useReducer, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import "./styles/main.scss";
import App from "./pages/App";
import About from "./pages/about";
import Docs from "./pages/docs";
import Auth from "./pages/auth";
import NavBar from "./navigation/navbar";
import Footer from "./components/footer";
import SwapiHeader from "./components/swapiHeader";
import AdminDashboard from "./pages/admin";

export const UserContext = createContext();

const initialState = {
	loggedInStatus: "NOT_LOGGED_IN",
	user: {},
};

const reducer = (state, action) => {
	switch (action.type) {
		case "setUser":
			return { ...state, user: action.user };
		case "setLoggedInStatus":
			return { ...state, loggedInStatus: action.loggedInStatus };
		default:
			return state;
	}
};

function Main() {
	const [state, dispatch] = useReducer(reducer, initialState);

	const handleLogout = () => {
		fetch("/auth/logout", {
			method: "delete",
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.message === "Logged out") {
					dispatch({ type: "setUser", user: {} });
					dispatch({
						type: "setLoggedInStatus",
						loggedInStatus: "NOT_LOGGED_IN",
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};
	// Check login status for auto creds
	useEffect(() => {
		fetch("/auth/logged-in")
			.then((res) => res.json())
			.then((data) => {
				if (data.loggedIn) {
					dispatch({ type: "setUser", user: data.user });
					dispatch({ type: "setLoggedInStatus", loggedInStatus: "LOGGED_IN" });
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<UserContext.Provider value={{ state, dispatch }}>
			<BrowserRouter>
				<NavBar />
				<SwapiHeader />
				<Switch>
					<Route exact path="/" component={App} />
					<Route path="/about" component={About} />
					<Route path="/docs" component={Docs} />
					{state.loggedInStatus === "NOT_LOGGED_IN" ? (
						<Route path="/admin" component={Auth} />
					) : (
						<Route path="/admin" component={AdminDashboard} />
					)}
				</Switch>
				<Footer />
				{state.loggedInStatus === "LOGGED_IN" ? (
					<button onClick={handleLogout}>Logout</button>
				) : null}
			</BrowserRouter>
		</UserContext.Provider>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<Main />
	</React.StrictMode>,
	document.getElementById("root")
);
