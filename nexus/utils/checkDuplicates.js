const fs = require("fs");
const path = require("path");
const levenshtein = require("fast-levenshtein");

const PEOPLE_PATH = path.join(__dirname, "./fixtures/people.json");
const OUTPUT_LOG_PATH = path.join(__dirname, "./logs/duplicatePeopleLog.json");

const peopleData = JSON.parse(fs.readFileSync(PEOPLE_PATH, "utf8"));

const similarityThreshold = 5; // Increased to allow for longer name variations
const ignoreWords = [
	"darth",
	"emperor",
	"master",
	"general",
	"lord",
	"captain",
]; // Common Star Wars titles

const normalizeName = (name) => {
	return name
		.toLowerCase()
		.replace(/\(.*?\)/g, "") // Remove anything in parentheses
		.split(" ")
		.filter((word) => !ignoreWords.includes(word)) // Remove titles
		.join(" ")
		.trim();
};

const potentialDuplicates = [];

for (let i = 0; i < peopleData.length; i++) {
	for (let j = i + 1; j < peopleData.length; j++) {
		const name1Raw = peopleData[i].fields.name;
		const name2Raw = peopleData[j].fields.name;

		const name1 = normalizeName(name1Raw);
		const name2 = normalizeName(name2Raw);

		const distance = levenshtein.get(name1, name2);
		const containsCheck = name1.includes(name2) || name2.includes(name1);

		if (containsCheck || distance <= similarityThreshold) {
			potentialDuplicates.push({
				first: {
					pk: peopleData[i].pk,
					name: name1Raw,
				},
				second: {
					pk: peopleData[j].pk,
					name: name2Raw,
				},
				distance,
				containsCheck,
			});
		}
	}
}

fs.writeFileSync(
	OUTPUT_LOG_PATH,
	JSON.stringify(potentialDuplicates, null, 2),
	"utf8"
);
console.log(`Potential duplicates logged to ${OUTPUT_LOG_PATH}`);
