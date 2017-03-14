var axios = require("axios");
var jsdom = require("jsdom");

module.exports = (token, studentId, schoolId, cb) => {
	var url = `https://www.lectio.dk/lectio/${schoolId}/OpgaverElev.aspx?elevid=${studentId}`;

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
			objAssignments = [];

			var assignments = window.document.querySelectorAll('#printStudentAssignmentsArea tr');
			var assignmentDescriptions = window.document.querySelectorAll('#printStudentAssignmentsArea tr td[align="left"]')
			
			for (var i=0; i<assignments.length; i++){
				if (i !== 0){
					var objAssignment = {};
					var assignmentInfo = assignments[i].innerHTML;

					// Turned in status
					objAssignment.turnedIn = false;

					// Week data
					if (assignmentInfo.match(/title="(Uge \d+ \(\d+\/\d+-\d+\/\d+\) \d+)\"/)) objAssignment.weekInfo = assignmentInfo.match(/title="(Uge \d+ \(\d+\/\d+-\d+\/\d+\) \d+)\"/)[1];

					// Class data
					if (assignmentInfo.match(/<span lectiocontextcard=".*">(.*)<\/span>/)) objAssignment.class = assignmentInfo.match(/<span lectiocontextcard=".*">(.*)<\/span>/)[1];

					// Assignment name
					if (assignmentInfo.match(/<span title="Gå til opgaveaflevering.*">(.+)<\/a><\/span>/)) objAssignment.name = assignmentInfo.match(/<span title="Gå til opgaveaflevering.*">(.+)<\/a><\/span>/)[1];

					// Due date
					if (assignmentInfo.match(/<span>(\d+\/\d+-\d+ \d+:\d+)<\/span>/)) objAssignment.due = assignmentInfo.match(/<span>(\d+\/\d+-\d+ \d+:\d+)<\/span>/)[1];

					// Workload 
					if (assignmentInfo.match(/<span>(\d+,\d+)<\/span>/)) objAssignment.workload = assignmentInfo.match(/<span>(\d+,\d+)<\/span>/)[1];

					// Update turned in status
					if (assignmentInfo.match(/<span>Afleveret<\/span>/)) objAssignment.turnedIn = true;

					// Check for an existing description and add it
					if (assignmentDescriptions[i-1]) objAssignment.description = assignmentDescriptions[i-1].textContent;

					// Add to list of assignments
					objAssignments.push(objAssignment);
				}
			}

			// Return with assignment object
			cb(objAssignments);
		});
	})
	.catch((error) => {
		console.error('Error:', error)
	})
}