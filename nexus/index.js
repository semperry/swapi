const inquirer = require("inquirer");
const { fetchData } = require("./data-fetching/fetchData");
const { processData } = require("./data-processing/processData");
const { logMessage, logError } = require("./utils/logger");

async function main() {
	console.clear();
	logMessage("Welcome to the Nexus Data CLI!");

	try {
		const { task } = await inquirer.prompt([
			{
				type: "list",
				name: "task",
				message: "Select a task:",
				choices: [
					{
						name: "Fetch raw data (films, characters, quotes)",
						value: "fetch",
					},
					{ name: "Process raw data into fixtures", value: "process" },
					{ name: "Exit", value: "exit" },
				],
			},
		]);

		switch (task) {
			case "fetch":
				await fetchData();
				break;
			case "process":
				await processData();
				break;
			case "exit":
				logMessage("Exiting CLI. Goodbye!");
				process.exit(0);
		}
	} catch (error) {
		logError("An error occurred in the CLI:", error);
	}
}

main();
