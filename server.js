var scraper = require("./index");
var secrets = require("./secrets");
var express = require("express");
var cors = require("cors");

var app = express();

app.use(cors());

app.get('/login', (req, res) => {
	console.log('authenticating...');
	scraper.auth(req.query.username, req.query.password, req.query.schoolId, (token, studentId) => {
		console.log('response..');
		res.json({
			token: token,
			studentId: studentId
		});
		process.exit(0);
	});
});

app.get('/schedule', (req, res) => {
	scraper.schedule(req.query.token, req.query.studentId, req.query.schoolId, (schedule) => {
		res.json({'schedule': schedule})
	});
});

app.listen(3000, () => {
	console.log("API server listening on port 3000");
});