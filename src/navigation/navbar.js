import React from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
	return (
		<div className="navbar-container">
			<div className="navbar-logo-wrapper">React SWAPI</div>
			<div className="navlinks-wrapper">
				<div className="navlink">
					<NavLink exact to="/">
						Home
					</NavLink>
				</div>
				<div className="navlink">
					<NavLink to="/about">About</NavLink>
				</div>
				<div className="navlink">
					<NavLink to="/documentation">Documentation</NavLink>
				</div>
			</div>
		</div>
	);
}

export default NavBar;
