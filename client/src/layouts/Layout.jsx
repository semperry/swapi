import BannerAds from "../components/affiliate/BannerAds";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PayPalButton from "../components/affiliate/PayPalButton";
import SwapiHeader from "../components/SwapiHeader";

const Layout = ({ children }) => {
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
		<div className="layout">
			<Navbar />

			<div className="content-wrapper">
				<header className="hero">
					<SwapiHeader />
				</header>

				<div className="sticky-ad-bar">
					<div className="banner-ad-box glow-pulse" onClick={trackAndRedirect}>
						<span>Get $10 Off!</span>
						<BannerAds />
						Get $10 Off!
					</div>

					<PayPalButton />
				</div>

				<main className="page-content">{children}</main>
			</div>
			<Footer />
		</div>
	);
};

export default Layout;
