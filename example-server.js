var scraper = require("./index");
var express = require("express");
var cors = require("cors");

var app = express();

app.use(cors());

app.get('/login', (req, res) => {
	scraper.auth(req.query.username, req.query.password, req.query.schoolId, (token, studentId) => {
		console.log('response..');
		res.json({
			token: token,
			studentId: studentId
		});
		process.exit(0);
	});
});

app.get('/verify', (req, res) => {
	scraper.verify(req.query.token, req.query.schoolId, (isAuthenticated) => {
		res.json({
			authenticated: true,
			schoolId: req.query.schoolId
		});
	});
});


app.get('/schedule', (req, res) => {
	scraper.schedule(req.query.token, req.query.studentId, req.query.schoolId, (schedule) => {
		res.json({'schedule': schedule});
	});
});

app.get('/assignments', (req, res) => {
	scraper.assignments(req.query.token, req.query.studentId, req.query.schoolId, (assignments) => {
		res.json({'assignments': assignments});
	});
});

app.listen(3000, () => {
	console.log("API server listening on port 3000");
});