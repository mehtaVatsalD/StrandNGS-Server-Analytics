//urls for rest api
var baseURL=window.location.origin;
var restUrls={
	"login":baseURL+"/StrandNGS-Server/rest/TaskUtility/login",
	"logout":baseURL+"/StrandNGS-Server/rest/TaskUtility/logout",
	"jobStats":baseURL+"/StrandNGS-Server/rest/TaskUtility/TaskHistory",
	"sampleStats":baseURL+"/StrandNGS-Server/rest/TaskUtility/Samples",
	"userLogged":baseURL+"/StrandNGS-Server/rest/TaskUtility/User",
	"getJob":baseURL+"/StrandNGS-Server/rest/TaskUtility/Task?taskId=",
	"workers":baseURL+"/StrandNGS-Server/rest/TaskUtility/Workers",
	"changePassword":baseURL+"/StrandNGS-Server/rest/TaskUtility/ChangePassword",
};

//urls for redirecting pages using javascript
var redirectUrls={
	"jobStats":baseURL+"/StrandNGS-Server/serverStats/jobStats.html",
	"sampleStats":baseURL+"/StrandNGS-Server/serverStats/sampleStats.html",
	"login":baseURL+"/StrandNGS-Server/serverStats/index.html",
	"plots":baseURL+"/StrandNGS-Server/serverStats/plot.html"
}

var yparamLabel={
	"waitHours":"Wait Time (Hrs.)",
	"exeHours":"Execution Time (Hrs.)",
	"totalHours":"Total Time (Hrs.)",	
	"percentJobs":"% of Jobs",
	"cpercentJobs":"% of Jobs (c)",
	//sampleStatsplot
	"usernoSample":"Number of Samples per User",
	"userszSample":"Total Size of Samples per User",
	"monthnoSample":"Monthly Plot for Number of Samples",
	"monthszSample":"Monthly Plot for Size of Samples",
	"relativeSampleNo":"Relative Number of Samples Distributed Among Organisms",
	"relativeSampleSize":"Relative Size of Samples Distributed Among Organisms"
}

var xparamLabel={
	"time":"Time",
	"user":"User",
	'waitMins':"Wait Time (mins.)"	
}

var colors=[
		'rgba(33,150,243,1)',
		'rgba(233,30,99,1)', 
		'rgba(76,175,80,1)',
		'rgba(121,85,72,1)',
		'rgba(255,235,59,1)',
		'rgba(244,67,54,1)',
		'rgba(255,152,0,1)',
		'rgba(63,81,181,1)', 
		'rgba(0,150,136,1)',
		'rgba(245, 1, 46,1)',
        'rgba(255, 87, 34,1)',
        'rgba(60, 204, 244,1)',
        'rgba(110, 90, 90,1)',
        'rgba(160, 213, 13,1)',
        'rgba(238, 134, 26,1)',
        'rgba(20, 115, 134,1)',
        'rgba(243, 70, 143,1)',
        'rgba(1, 86, 41,1)',
        'rgba(183, 77, 237,1)',
        'rgba(244, 203, 0,1)',
        'rgba(132, 12, 46,1)',
        'rgba(166, 76, 1,1)',
        'rgba(40, 73, 119,1)',
        'rgba(120, 125, 130,1)',
        'rgba(141, 246, 162,1)',
        'rgba(254, 184, 110,1)',
        'rgba(55, 98, 227,1)',
        'rgba(197, 2, 127,1)',
        'rgba(50, 154, 50,1)',
        'rgba(75, 50, 131,1)',
        'rgba(254, 242, 112,1)',
        'rgba(239, 62, 96,1)',
        'rgba(60, 46, 20,1)',
        'rgba(11, 120, 253,1)'
        ];

var taskLabels={
	"TaskID":"Task ID",
	"TaskName":"Task Name",
	"Owner":"Owner",
	"Contexr":"Context Name",
	"WorkerIP":"Worker IP",
	"SubmissionTime":"Submission Time",
	"WaitTime":"Wait Time(Mins.)",
	"ExeTime":"Execution Time(Mins.)",
	"Status":"Status"
};

var statusDecode = {
	"1001" : "Successful",
	"1000" : "Failed",
	"1002" : "Terminated",
	"601" : "Deleted"
};

var jobInfoLabels=["Job Name","% Time<br>Taken","Time<br>in Seconds","Time<br>hh:mm:ss"];

var sampleInfoLabels=["Number of Samples","Total Size of Samples"];

var workerLabels={
	"workerIP" : "Worker IP",
	"workerCV" : {
		"tmpDir" : "Tmp Dir",
		"productVersion" : "Product Version",
		"numParallelTasksPerWorker" : "Number of Parallel Tasks per Worker",
		"javaOptions" : "Java Options",
		"numWorkers" : "Number of Workers",
		"workerName" : "Worker Name",
		"platform" : "Platform",
		"totalPhysicalMemorySize" : "Total Physical Memory Size",
		"supportedContexts":
                {
                    "contextName": "Supported Context Names"
                }
	},
	"working": "Working"
};

// var logTablesTitles={
// 	"task":"Task Information",
// 	"tool":"Tool Information",
// 	"samples":"Samples' Information",
// 	"summary":"Summary of Task"
// }

var errorMessages={
	"username" : "Enter Username!",
	"password" : "Enter Password!",
	"oldPassword" : "Enter Old Password!",
	"newPassword" : "Enter New Password!",
	"confirm" : "Confirm Password!",
	"matchError" : "New Password and Confirm New Password are Not Matching!",
	"invalidLogin" : "Invalid Username or Password!",
	"oldpassIncorrect" : "Old Password is Not Correct!",
};

var successMessages = {
	"passChanged" : "Successfully Changed Password.Redirecting to Login Page..."
};