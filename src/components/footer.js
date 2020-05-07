import React from "react";

function Footer() {
	return (
		<div className="footer">
			<div>
				Originially by{" "}
				<a
					href="https://phalt.github.io/"
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

			<div id="donate-form">
				<h4>
					<label>{phrases[Math.floor(Math.random() * phrases.length)]}</label>
				</h4>
				<form
					action="https://www.paypal.com/donate"
					method="post"
					target="_blank"
				>
					<input type="hidden" name="business" value="2HGAUVTWGR5T2" />
					<input type="hidden" name="currency_code" value="USD" />
					<input
						type="image"
						src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
						border="0"
						name="submit"
						title="PayPal - The safer, easier way to pay online!"
						alt="Donate with PayPal button"
					/>
					<img
						alt=""
						border="0"
						src="https://www.paypal.com/en_US/i/scr/pixel.gif"
						width="1"
						height="1"
					/>
				</form>
			</div>
		</div>
	);
}

const phrases = [
	"De Wanna Wanga?",
	"Buy the maintainer some blue milk...",
	"Death sticks are expensive...",
	"A long time ago, in a wallet far far away...",
	"Help me herd some Nerfs...",
	"Saving for a clone army, help if you can...",
	"Even I get boarded sometimes...",
	"I need to stop betting on those pod races...",
	"You underestimate my spending power...",
];

export default Footer;
