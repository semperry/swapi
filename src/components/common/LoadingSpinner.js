const LoadingSpinner = () => {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<svg
				width="50px"
				height="50px"
				viewBox="0 0 50 50"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle
					cx="25"
					cy="25"
					r="20"
					stroke="#007bff"
					strokeWidth="4"
					fill="none"
					strokeLinecap="round"
				>
					<animate
						attributeName="stroke-dasharray"
						values="1,150;90,150;90,150"
						dur="1.5s"
						repeatCount="indefinite"
					/>
					<animate
						attributeName="stroke-dashoffset"
						values="0;-35;-125"
						dur="1.5s"
						repeatCount="indefinite"
					/>
					<animateTransform
						attributeName="transform"
						type="rotate"
						from="0 25 25"
						to="360 25 25"
						dur="1.5s"
						repeatCount="indefinite"
					/>
				</circle>
			</svg>
		</div>
	);
};

export default LoadingSpinner;
