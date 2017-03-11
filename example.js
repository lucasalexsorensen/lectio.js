var scraper = require("./index");

var secrets = require("./secrets");

scraper.auth(secrets.username, secrets.password, secrets.schoolId, (token, studentId) => {
	scraper.schedule(token, studentId, secrets.schoolId, (schedule) => {
		console.log(JSON.stringify(schedule, null, 2));
	})
});

