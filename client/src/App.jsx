import { BrowserRouter, Switch, Route } from "react-router-dom";

import AboutPage from "./pages/AboutPage";
import AdClickRedirectPage from "./pages/AdClickRedirectPage";
import DocsPage from "./pages/DocsPage";
import HomePage from "./pages/HomePage";
import Layout from "./layouts/Layout";

const App = () => {
	return (
		<BrowserRouter>
			<Layout>
				<Switch>
					<Route exact path="/" component={HomePage} />
					<Route path="/about" component={AboutPage} />
					<Route path="/documentation" component={DocsPage} />
					<Route path="/docs" component={DocsPage} />
					<Route
						path="/partner-discount/:originType"
						component={AdClickRedirectPage}
					/>
				</Switch>
			</Layout>
		</BrowserRouter>
	);
};

export default App;
