const mongoose = require("mongoose");

const dbURI = "mongodb://localhost:27017/swapi";

const resetDatabase = async () => {
	try {
		// Connect to the database
		await mongoose.connect(dbURI);

		console.log("⚠️ WARNING: This will delete ALL data in the database!");
		process.stdout.write("Type 'yes' to confirm: ");

		process.stdin.once("data", async (input) => {
			const confirmation = input.toString().trim().toLowerCase();

			if (confirmation === "yes") {
				await mongoose.connection.dropDatabase(); // 🔥 Wipe the database
				console.log("✅ Database has been reset.");
			} else {
				console.log("❌ Reset cancelled.");
			}

			mongoose.connection.close();
			process.exit(0);
		});
	} catch (error) {
		console.error("❌ Error resetting database:", error);
		process.exit(1);
	}
};

// Only run if executed directly
if (require.main === module) {
	resetDatabase();
}
