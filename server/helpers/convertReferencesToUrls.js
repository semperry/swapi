const { API_BASE_URL } = require("../config/config");

/**
 * Converts references from numeric UIDs to proper API URLs dynamically.
 * @param {object} data - The raw data.
 * @param {object} referenceMap - Field-to-endpoint mapping.
 */
const convertReferencesToUrls = (data, referenceMap = {}) => {
	const convertedData = { ...data };

	for (const [key, endpoint] of Object.entries(referenceMap)) {
		if (Array.isArray(convertedData.properties[key])) {
			convertedData.properties[key] = convertedData.properties[key].map(
				(id) => `${API_BASE_URL}/${endpoint}/${id}`
			);
		} else {
			convertedData.properties[
				key
			] = `${API_BASE_URL}/${endpoint}/${convertedData.properties[key]}`;
		}
	}

	return convertedData;
};

module.exports = { convertReferencesToUrls };
