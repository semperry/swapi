function setUrl(req, res, next) {
	try{
		const url = `${req.protocol}://${req.headers.host}`;
	
		req.swapi_url = url;
		console.log(url)
		next();
	} catch (err) {
		res.status(400).json({ message: "Swapi Server Error", errors: err.message})
	}
}


module.exports = setUrl;