var axios = require("axios");
var jsdom = require("jsdom");

module.exports = (token, studentId, schoolId, cb) => {
	var url = `https:\/\/www.lectio.dk/lectio/${schoolId}/SkemaNy.aspx?type=elev&elevid=${studentId}&week=092017`;

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
		jsdom.env(response.data, (err, window) => {
			if (err){
				console.error(err);
			}
			objSchedule = [];

			var days = window.document.querySelectorAll('.s2skemabrikcontainer.lec-context-menu-instance');
			var dates = [];
			window.document.querySelectorAll('.s2dayHeader td').forEach((e, i) => {
				if(i > 0){
					dates.push(e.innerHTML);
				}
			});

			days.forEach((e,i) => {
				var day = days[i];
				objDay = {};

				objDay.date = dates[i] || null;

				objDay.lectures = [];
				for (var lecture in day.children) {
					if (day.children[lecture].className){
						if (day.children[lecture].className.indexOf('s2skemabrik') != -1){
							var lectureData = day.children[lecture].getAttribute('title');
							var objLecture = {};


							// If lecture state changed (Ændret!)
							objLecture.stateChanged = (lectureData.indexOf('Ændret!') != -1);

							// Date data
							if (lectureData.match(/(\d*\/\d*-\d{4})/)) objLecture.date = lectureData.match(/(\d*\/\d*-\d{4})/)[1];

							// Time data
							objLecture.time = {};
							if (lectureData.match(/(\d+:\d+) til (\d+:\d+)/)){
								var match = lectureData.match(/(\d+:\d+) til (\d+:\d+)/);
								objLecture.time.start = match[1];
								objLecture.time.end = match[2];
							}
							
							// Class data
							if (lectureData.match(/Hold: (.*)/)) objLecture.class = lectureData.match(/Hold: (.*)/)[1];

							// Teacher data
							if (lectureData.match(/Lærer: (.*)/)) objLecture.teacher = lectureData.match(/Lærer: (.*)/)[1];

							// Classroom data
							if (lectureData.match(/Lokale: (.*)/)) objLecture.classroom = lectureData.match(/Lokale: (.*)/)[1];

							// Classrooms data
							if (lectureData.match(/Lokaler: (.*)/)) objLecture.classrooms = lectureData.match(/Lokaler: (.*)/)[1].split(', ');							
							
							objLecture.homework = [];
							if (lectureData.match(/Lektier:(\n-.+)*/g)) {

								objLecture.homework = lectureData.match(/Lektier:(\n-.+)*/g)[0].split('\n').slice(1).map((e, i) => {
									return e.substring(2)
								});
							}

							// Add to list of lectures
							objDay.lectures.push(objLecture);
						}
					}
				}

				// Add to list of days
				objSchedule.push(objDay);
			});

			// Return with schedule object
			cb(objSchedule);
		});
	})
	.catch((error) => {
		console.error('Error:', error)
	})
}