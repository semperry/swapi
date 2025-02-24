const AtAtSpinner = () => {
	return (
		<svg
			width="200"
			height="200"
			viewBox="0 0 200 200"
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* AT-AT Walker Body */}
			<rect
				x="50"
				y="80"
				width="60"
				height="40"
				fill="gray"
				stroke="black"
				stroke-width="2"
			/>

			{/* Head */}
			<rect
				x="105"
				y="90"
				width="30"
				height="20"
				fill="gray"
				stroke="black"
				stroke-width="2"
			/>

			{/* Red Eyes */}
			<circle cx="130" cy="95" r="2" fill="red">
				<animate
					attributeName="fill"
					values="red;darkred;red"
					dur="0.5s"
					repeatCount="indefinite"
				/>
			</circle>

			{/* Legs with Walking Animation */}
			<line x1="60" y1="120" x2="50" y2="150" stroke="black" stroke-width="4">
				<animate
					attributeName="y2"
					values="150;155;150"
					dur="0.5s"
					repeatCount="indefinite"
				/>
			</line>
			<line x1="90" y1="120" x2="80" y2="150" stroke="black" stroke-width="4">
				<animate
					attributeName="y2"
					values="150;155;150"
					dur="0.5s"
					repeatCount="indefinite"
					begin="0.25s"
				/>
			</line>
			<line x1="70" y1="120" x2="60" y2="150" stroke="black" stroke-width="4">
				<animate
					attributeName="y2"
					values="150;155;150"
					dur="0.5s"
					repeatCount="indefinite"
				/>
			</line>
			<line x1="100" y1="120" x2="90" y2="150" stroke="black" stroke-width="4">
				<animate
					attributeName="y2"
					values="150;155;150"
					dur="0.5s"
					repeatCount="indefinite"
					begin="0.25s"
				/>
			</line>

			{/* Snowspeeder */}
			<polygon
				id="snowspeeder"
				points="150,40 160,45 150,50 140,45"
				fill="orange"
				stroke="black"
				stroke-width="2"
			>
				<animateTransform
					attributeName="transform"
					type="rotate"
					from="0 100 100"
					to="360 100 100"
					dur="2s"
					repeatCount="indefinite"
				/>
			</polygon>

			{/* AT-AT Laser Shot (Aiming Downwards) */}
			<line x1="140" y1="101" x2="170" y2="140" stroke="red" stroke-width="2">
				<animate
					attributeName="x2"
					values="140;150;160"
					dur="1s"
					repeatCount="indefinite"
				/>
				<animate
					attributeName="y2"
					values="101;120;140"
					dur="1s"
					repeatCount="indefinite"
				/>
			</line>
		</svg>
	);
};

export default AtAtSpinner;
