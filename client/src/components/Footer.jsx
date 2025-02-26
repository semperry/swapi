const Footer = () => {
	return (
		<div className="footer">
			<div>
				Originially by{" "}
				<a
					href="https://github.com/phalt"
					target="_blank"
					rel="noopener noreferrer"
				>
					Paul Hallett
				</a>{" "}
				| Refactored and Maintained by{" "}
				<a
					href="https://github.com/semperry"
					target="_blank"
					rel="noopener noreferrer"
				>
					Ryan Curtis
				</a>{" "}
				&copy;
				{new Date().getFullYear()}
			</div>
		</div>
	);
};

export default Footer;
