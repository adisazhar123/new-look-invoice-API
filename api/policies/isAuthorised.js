module.exports = (req, res, next) => {
	let token;
	if (req.headers && req.headers.authorization) {
		const parts = req.headers.authorization.split(' ');
		if (parts.length == 2) {
			const scheme = parts[0];
			const credentials = parts[1];
		
			if (/^Bearer$/i.test(scheme)) {
				token = credentials;
			}
			
		} else {
			return res.status(401).json(
				{err: 'Format is Authorization: Bearer [token]'}
			)
			
		}
	
	} else {
		return res.status(401).
		json({err: 'No Authorization header was found.'});
	}

	jwtoken.verify(token, function(err, decoded) {
		if (err) {
			return res.status(401).json(
				{err: 'Invalid token.'}
			);
		}
		req.user = decoded;
		next();
	});
}