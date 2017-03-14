var axios = require("axios");

module.exports = (token, schoolId, cb) => {
	var url = `https://www.lectio.dk/lectio/${schoolId}/forside.aspx`;

	axios.get(url, {
		headers: {
			'Cookie': `ASP.NET_SessionId=${token}`,
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
			'Accept-Encoding': 'gzip, deflate, sdch, br',
			'Accept-Language': 'en-US,en;q=0.8,da;q=0.6,nb;q=0.4,de;q=0.2',
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36'
		}
	})
	.then((response) => {
		if (response.status === 200){
			cb(true);
		} else {
			cb(false);
		}
	})
	.catch((error) => {
		console.error('Error:', error)
		cb(false);
	})
}

