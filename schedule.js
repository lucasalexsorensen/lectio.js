var axios = require("axios");
var jsdom = require("jsdom");

module.exports = (token, studentId, schoolId, cb) => {
	var url = `https:\/\/www.lectio.dk/lectio/${schoolId}/SkemaNy.aspx?type=elev&elevid=${studentId}`;

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

			days.forEach((e,i) => {
				var day = days[i];
				objDay = {};
				objDay.lectures = [];

				for (var lecture in day.children) {
					if (day.children[lecture].className){
						if (day.children[lecture].className.indexOf('s2skemabrik') != -1){
							var objLecture = {};
							var lectureData = day.children[lecture].getAttribute('title');

							// Date data
							if (lectureData.match(/(\d*\/\d*-\d{4})/)) objLecture.date= lectureData.match(/(\d*\/\d*-\d{4})/)[1];
							
							// Class data
							if (lectureData.match(/Hold: (.*)/)) objLecture.class = lectureData.match(/Hold: (.*)/)[1];

							// Teacher data
							if (lectureData.match(/Lærer: (.*)/)) objLecture.teacher = lectureData.match(/Lærer: (.*)/)[1];

							// Classroom data
							if (lectureData.match(/Lokale: (.*)/)) objLecture.classroom = lectureData.match(/Lokale: (.*)/)[1];
							
							objDay.lectures.push(objLecture);
						}
					}
				}	

				objSchedule.push(objDay);
			});

			cb(objSchedule)
		});
	})
	.catch((error) => {
		console.error('Error:', error)
	})
}