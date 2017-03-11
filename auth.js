var Nightmare = require("nightmare");
var nightmare = Nightmare({ show: false });

module.exports = (username, password, schoolId, cb) => {
	var url = `https:\/\/www.lectio.dk/lectio/${schoolId}/login.aspx`;
	var url2 = `https:\/\/www.lectio.dk/lectio/${schoolId}/forside.aspx`;

	nightmare
		.goto(url)
		.wait(200)
		.type('#m_Content_username2', username)
		.type('#password2', password)
		.click('#m_Content_submitbtn2')
		.wait('#masterContent')
		.cookies.get('ASP.NET_SessionId')
		.then((token) => {
			nightmare
				.goto(url2)
				.evaluate(() => {
					return document.querySelector('meta[name="msapplication-starturl"]').content.split('forside.aspx?elevid=')[1];
				})
				.end()
				.then((studentId) => {
					cb(token.value, studentId)
				})
				.catch((error) => {
					console.error('Error:', error)
				})
		})
		.catch((error) => {
			console.error('Error:', error);
		})
}