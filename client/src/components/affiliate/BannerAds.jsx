import { useState, useEffect } from "react";

const images = Object.values(
	import.meta.glob("../../assets/images/saber-masters/*.{png,jpg,jpeg,webp}", {
		eager: true,
	})
).map((img) => img.default);

const BannerAds = () => {
	const [imageIndex, setImageIndex] = useState(0);

	useEffect(() => {
		const intCB = (index) => {
			if (index > images.length - 1) {
				return 0;
			} else {
				return index + 1;
			}
		};
		const interval = setInterval(() => setImageIndex(intCB), 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div
			className="banner-images-container"
			style={{ backroundImage: images[imageIndex] }}
		>
			<img src={images[imageIndex]} alt="Saber Masters deal" />
		</div>
	);
};

export default BannerAds;
