function updatePlots(){
	if ($(".jobPlotRow").is(":visible")) {
		filterChanged = true;
		updateJobPlots();
	}
	else{
		filterChanged = true;
		updateSamplePlots();
	}
}

var json=[{},{}],jsonIndex=0,jsonBool=[false, false],filterChanged = false;
function requestData(){
	getLoggedUser();
	restApi(restUrls['jobStats'],"",createRequiredFilters);
	// restApi(restUrls['sampleStats'],"",createRequiredFilters);
}

function restApi(url,data,callback=function(){console.log('Done...')}){
	console.log("starting",jsonIndex);
	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === 4) {
			console.log("Got it...");
		    json[jsonIndex] = JSON.parse(this.responseText);
		    jsonBool[jsonIndex] = true;
		    jsonIndex++;
		    callback();
		}
	});

	xhr.open("GET", url);

	xhr.send(data);
}

var createRequiredFilters = function (){
	document.getElementsByClassName('loadingDiv')[0].style.display="none";

	if(jsonBool[1]){
		extraFilForSamples();
	}
	else if (jsonBool[0]) {
		extraFilForJob();
	}
	

}

function extraFilForJob(){
	var parent=document.getElementById('jobExtraFil').getElementsByClassName('jobUserFil')[0];
	var users=[],cnodeIp=[],taskNames=[];
	var j=0,k=0,t=0;
	for(var i=0;i<json[0].length;i++)
	{
		if (users.indexOf(json[0][i]["Owner"])==-1 && json[0][i]["WorkerIP"]!=null) {
			users[j]=json[0][i]["Owner"];
			j++;
		}

		if (cnodeIp.indexOf(json[0][i]["WorkerIP"])==-1 && json[0][i]["WorkerIP"]!=null) {
			cnodeIp[k]=json[0][i]["WorkerIP"];
			k++;
		}
		if (taskNames.indexOf(json[0][i]["TaskName"])==-1 && json[0][i]["TaskName"].indexOf('TsoT1')!=-1 && json[0][i]["WorkerIP"]!=null) {
			taskNames[t]=json[0][i]["TaskName"];
			t++;
		}
		switch(json[0][i]["Status"])
		{
			case 1001 : json[0][i]["Status"]="Successful";
						break;
			case 1000 : json[0][i]["Status"]="Failed";
						break;
			case 1002 : json[0][i]["Status"]="Terminated";
						break;
			case 601 : json[0][i]["Status"]="Deleted";
		}
	}
	taskNames[t]="Others";
	for(var i=0;i<users.length;i++)
	{
		var input=document.createElement("input");
		var label=document.createElement("label");
		input.setAttribute("type","checkbox");
		input.setAttribute("checked","true");
		input.setAttribute("value",users[i]);
		input.setAttribute("name","jobUser");
		input.setAttribute("onchange","updateJobPlots()");
		label.appendChild(input);
		text=users[i];
		var t=document.createTextNode(text);
		var br=document.createElement("br");
		label.appendChild(t);
		parent.appendChild(label);
	}
	parent=document.getElementById('jobExtraFil').getElementsByClassName('cnodeFil')[0];
	for(var i=0;i<cnodeIp.length;i++)
	{
		var input=document.createElement("input");
		var label=document.createElement("label");
		input.setAttribute("type","checkbox");
		input.setAttribute("checked","true");
		input.setAttribute("value",cnodeIp[i]);
		input.setAttribute("name","cnodes");
		input.setAttribute("onchange","updateJobPlots()");
		label.appendChild(input);
		text=cnodeIp[i];
		var t=document.createTextNode(text);
		var br=document.createElement("br");
		label.appendChild(t);
		parent.appendChild(label);
	}
	parent=document.getElementById('jobExtraFil').getElementsByClassName('taskNameFil')[0];
	for(var i=0;i<taskNames.length;i++)
	{
		var input=document.createElement("input");
		var label=document.createElement("label");
		input.setAttribute("type","checkbox");
		input.setAttribute("checked","true");
		input.setAttribute("value",taskNames[i]);
		input.setAttribute("name","taskNames");
		input.setAttribute("onchange","updateJobPlots()");
		label.appendChild(input);
		text=taskNames[i];
		var t=document.createTextNode(text);
		var br=document.createElement("br");
		label.appendChild(t);
		parent.appendChild(label);
	}
	createJobPlots();
}

function extraFilForSamples(){
	var parent=document.getElementById('sampleExtraFil').getElementsByClassName('sampleUserFil')[0];
	var users=[],organisms=[];
	var j=0,k=0;
	for(var i=0;i<json[1].length;i++)
	{
		if (users.indexOf(json[1][i]["Owner"])==-1) {
			users[j]=json[1][i]["Owner"];
			j++;
		}
		if (json[1][i]["Organism"]!==undefined) {
			if (organisms.indexOf(json[1][i]["Organism"])==-1) {
			organisms[k]=json[1][i]["Organism"];
			k++;
		}
		}

	}
	for(var i=0;i<users.length;i++)
	{
		var input=document.createElement("input");
		var label=document.createElement("label");
		input.setAttribute("type","checkbox");
		input.setAttribute("checked","true");
		input.setAttribute("value",users[i]);
		input.setAttribute("name","sampleUser");
		input.setAttribute("onchange","updateSamplePlots()");
		label.appendChild(input);
		text=users[i];
		var t=document.createTextNode(text);
		var br=document.createElement("br");
		label.appendChild(t);
		parent.appendChild(label);
	}
	parent=document.getElementsByClassName('orgaFil')[0];
	for(var i=0;i<organisms.length;i++)
	{
		var input=document.createElement("input");
		var label=document.createElement("label");
		input.setAttribute("type","checkbox");
		input.setAttribute("checked","true");
		input.setAttribute("value",organisms[i]);
		input.setAttribute("name","organism");
		input.setAttribute("onchange","updateSamplePlots()");
		label.appendChild(input);
		text=organisms[i];
		var t=document.createTextNode(text);
		var br=document.createElement("br");
		label.appendChild(t);
		parent.appendChild(label);
	}
	createSamplePlots();
}

//declaration of required variables
var myChart=[],date1,date2,freq,taskDisData=[],cnodeFil=[],contextFil=[],statusFil=[],jobUserFil=[],taskNameFil=[],filters=[],datax=[],statusDatax=[],contextDatax=[],userDatax=[],waitTime=[],exeTime=[],taskDisDatax=[],statusData=[],contextData=[],userData=[],totalTime=[],cummWait=[],waitforAnalysis=[],waitforAnalysis0=[],cummWaitVal=[];
//declaration of vars for displaying details
var plot1tags=[],plot2tags=[],plot3tags=[],plot4tags=[],plot5tags=[],plot6tags=[],plot7tags=[],plot8tags,plot9tags=[];

//implementation for collecting data for all plots

//declaration of required variables
var noofSamples=[],sampleonTime=[],sizeofSamples=[],sampleSizeonTime=[],organismNumber=[],organismSize=[],sampleUserFil=[],orgaFil=[],sample1tags=[],sample2tags=[],sample3tags=[],filters=[];

//variable declaration for jobPlots
var dataset=[],labels=[],yAxes=[],xAxes=[],options={},footer=null;
var backgroundColor=[],borderColor=[],pointBackgroundColor=[],pointBorderColor=[];


//primary fuction for caculating data required for all plots and then plotting it
function createJobPlots(){
	//this function calculates all data required for all plots
	calculationForJobStats();

	//below given code plots all graphs
	getJobStatPlot(datax,waitTime,plot1tags,"line",xparamLabel["time"],yparamLabel["waitHours"]);
	plotonCanvas(0,"line","myChart1");
	getMultiPlot(datax,exeTime,plot2tags,"line",yparamLabel["exeHours"],xparamLabel["time"],cnodeFil);
	plotonCanvas(1,"line","myChart2");
	getJobStatPlot(contextDatax,contextData,plot3tags,"pie","","Context");
	plotonCanvas(2,"pie","myChart3");
	getJobStatPlot(statusDatax,statusData,plot4tags,"pie","","Status");
	plotonCanvas(3,"pie","myChart4");
	getJobStatPlot(userDatax,userData,plot5tags,"bar",xparamLabel["user"],yparamLabel["exeHours"]);
	plotonCanvas(4,"bar","myChart5");
	getMultiPlot(datax,totalTime,plot6tags,"line",yparamLabel["totalHours"],"Time",jobUserFil);
	plotonCanvas(5,"line","myChart6");
	getJobStatPlot(waitforAnalysis0,cummWait,plot7tags,"bar",xparamLabel["waitMins"],"% of Jobs");
	plotonCanvas(6,"bar","myChart7");
	getJobStatPlot(waitforAnalysis,cummWaitVal,plot8tags,"line",xparamLabel["waitMins"],"% of Jobs (c)");
	plotonCanvas(7,"line","myChart8");

	getJobStatPlot(taskDisDatax,taskDisData,plot9tags,"pie","","Task Distribution");
	plotonCanvas(16,"pie","myChart16");

	//this plot is initially plotted for enlarged graph
	getJobStatPlot(datax,waitTime,plot1tags,"line","Time",yparamLabel["waitHours"]);
	plotonCanvas(8,"line","hoverChart");

}


//this function updates data and then plots it on changing filters
function updateJobPlots(){

	//calculates data required for  all graphs
	calculationForJobStats();

	//updates all plots
	getJobStatPlot(datax,waitTime,plot1tags,"line",xparamLabel["time"],yparamLabel["waitHours"]);
	myChart[0].data.datasets=dataset;
	myChart[0].data.labels=labels;
	myChart[0].options.tooltips.callbacks.footer=footer;
	myChart[0].update();
	getMultiPlot(datax,exeTime,plot2tags,"line",yparamLabel["exeHours"],xparamLabel["time"],cnodeFil);
	myChart[1].data.datasets=dataset;
	myChart[1].data.labels=labels;
	myChart[1].options.tooltips.callbacks.footer=footer;
	myChart[1].update();
	getJobStatPlot(contextDatax,contextData,plot3tags,"pie","","Context");
	myChart[2].data.datasets=dataset;
	myChart[2].data.labels=labels;
	myChart[2].options.tooltips.callbacks.footer=footer;
	myChart[2].update();
	getJobStatPlot(statusDatax,statusData,plot4tags,"pie","","Status");
	myChart[3].data.datasets=dataset;
	myChart[3].data.labels=labels;
	myChart[3].options.tooltips.callbacks.footer=footer;
	myChart[3].update();
	getJobStatPlot(userDatax,userData,plot5tags,"bar",xparamLabel["user"],yparamLabel["totalHours"]);
	myChart[4].data.datasets=dataset;
	myChart[4].data.labels=labels;
	myChart[4].options.tooltips.callbacks.footer=footer;
	myChart[4].update();
	getMultiPlot(datax,totalTime,plot6tags,"line",yparamLabel["totalHours"],xparamLabel["time"],jobUserFil);
	myChart[5].data.datasets=dataset;
	myChart[5].data.labels=labels;
	myChart[5].options.tooltips.callbacks.footer=footer;
	myChart[5].update();
	getJobStatPlot(waitforAnalysis0,cummWait,plot7tags,"bar",xparamLabel["waitMins"],yparamLabel["percentJob"]);
	myChart[6].data.datasets=dataset;
	myChart[6].data.labels=labels;
	myChart[6].options.tooltips.callbacks.footer=footer;
	myChart[6].update();

	getJobStatPlot(waitforAnalysis,cummWaitVal,plot8tags,"line",xparamLabel["waitMins"],yparamLabel["cpercentJob"]);	
	myChart[7].data.datasets=dataset;
	myChart[7].data.labels=labels;
	myChart[7].options.tooltips.callbacks.footer=footer;
	myChart[7].update();

	getJobStatPlot(taskDisDatax,taskDisData,plot9tags,"pie","","Task Distribution");
	myChart[16].data.datasets=dataset;
	myChart[16].data.labels=labels;
	myChart[16].options.tooltips.callbacks.footer=footer;
	myChart[16].update();

}

//function to initialize xparam vars and some plot tags
function jobXparamInitialize(){
	//this is for getting months/quaters/years in time range...(initialization of xparam and taskid arrays)
	var aggregation=document.getElementsByName('aggregation');
	for(var i=0;i<aggregation.length;i++)
	{
		if (aggregation[i].checked) {
			freq=aggregation[i].value;
			break;
		}
	}
	filters[5]=freq;
	if (freq=="monthly") {
		getdatax(date1,date2);
	}
	else if (freq=="quaterly") {
		getQuaters(date1,date2);
	}
	else if (freq=="yearly") {
		getYears(date1,date2);
	}

	//initialization of all variables
	statusDatax=statusFil;
	contextDatax=contextFil;
	userDatax=jobUserFil;
	taskDisDatax=taskNameFil;
	for(var i=5;i<=60;i+=5)
	{
		waitforAnalysis[(i-5)/5]="<="+i+" mins";
		waitforAnalysis0[(i-5)/5]=(i-5)+" - "+(i);
		cummWait[(i-5)/5]=0;
		plot7tags[(i-5)/5]=[];
		plot8tags[(i-5)/5]=[];
	}
	waitforAnalysis[(i-5)/5]=">=60 mins.";
	waitforAnalysis0[(i-5)/5]=">=60";
	cummWait[(i-5)/5]=0;
	plot7tags[(i-5)/5]=[];
	plot8tags[(i-5)/5]=[];
}

//function to initialze yparam vars and some plot tags
function jobYparamInitialze(){
	waitTime=[];
	exeTime=[];
	totalTime=[];
	for(var i=0;i<datax.length;i++)
	{
		waitTime[i]=0;
		plot1tags[i]=[];
	}
	for(var i=0;i<cnodeFil.length;i++)
	{
		var data=[],data2=[];
		for(var j=0;j<datax.length;j++)
		{
			data[j]=0;
			data2[j]=[];
		}
		exeTime[i]=data;
		plot2tags[i]=data2;
	}
	for(var i=0;i<jobUserFil.length;i++)
	{
		var data=[],data2=[];
		for(var j=0;j<datax.length;j++)
		{
			data[j]=0;
			data2[j]=[];
		}
		totalTime[i]=data;
		plot6tags[i]=data2;
	}
	statusData=[];
	for(var i=0;i<statusFil.length;i++)
	{
		statusData[i]=0;
		plot4tags[i]=[];
	}
	for(var i=0;i<contextFil.length;i++)
	{
		contextData[i]=0;
		plot3tags[i]=[];
	}
	for(var i=0;i<jobUserFil.length;i++)
	{
		userData[i]=0;
		plot5tags[i]=[];
	}
	for(var i=0;i<taskNameFil.length;i++)
	{
		taskDisData[i]=0;
		plot9tags[i]=[];
	}
	console.log(plot9tags);
}

//wheather to include task or not
function includeTask(i){
	if(taskNameFil.indexOf(json[0][i]["TaskName"])==-1){
		if (taskNameFil.indexOf("Others")==-1) {
			return false;
		}
		else{
			return true;
		}
	}
	return true;
}

//implementation for collecting data for all plots

function calculationForJobStats(){
	cnodeFil=[];contextFil=[];statusFil=[];jobUserFil=[];filters=[];datax=[];taskDisDatax=[];taskDisData=[];statusDatax=[];contextDatax=[];userDatax=[];waitTime=[];exeTime=[];statusData=[];contextData=[];userData=[];totalTime=[];cummWait=[];waitforAnalysis=[];cummWaitVal=[];plot1tags=[];plot2tags=[];plot3tags=[];plot4tags=[];plot5tags=[];plot6tags=[];plot7tags=[];plot8tags=[],plot9tags=[];
	//this hides loading gif
	//document.getElementsByClassName('loadingDiv')[0].style.display="none";

	//for getting time range
	var dates=applyTimeRange();
	date1=dates[0];
	date2=dates[1];

	//applyFilter() gets filter details into respective variable(array)
	applyFilter();
	console.log(taskNameFil);
	//initialization of all vars
	jobXparamInitialize();
	jobYparamInitialze();

	//parsing json
	for(var i=0;i<json[0].length;i++)
	{
		//checking filters
		if (statusFil.indexOf(json[0][i]["Status"])!=-1 && contextFil.indexOf(json[0][i]["Context"])!=-1 && jobUserFil.indexOf(json[0][i]["Owner"])!=-1 && cnodeFil.indexOf(json[0][i]["WorkerIP"])!=-1 && includeTask(i)) {
			//calculating wait time for first plot
			calforWaitTime(i);
			//calculating execution time for all compute nodes for second plot
			calforExeTime(i);
			//calculating total time for all users for last(6th) plot
			calforTotalTime(i);
			//for status plot
			calforStatus(i);
			//for context plot
			calforContext(i);
			//for user usage plot
			calforUsage(i);
			//task distribution
			calforTaskDis(i);
		}
	}
	//some remaining calculation of last two plots
	calforHistogram();
	//make all values fix to 2 decimal values
	toTwoDecimalPlaces();
	//show filter details at top
	jobFilterDetails();
	console.log(plot9tags);
}

function calforTaskDis(i){
	var taskIndex = taskDisDatax.indexOf(json[0][i]["TaskName"]);
	if(taskIndex!=-1)
	{
		taskDisData[taskIndex]++;
		plot9tags[taskIndex].push(json[0][i]["TaskID"]);
	}
	else{
		taskDisData[taskDisData.length-1]++;
		plot9tags[taskDisData.length-1].push(json[0][i]["TaskID"]);
	}
}

function calforWaitTime(i){
	var received=getData(i,"wait");
	var result=received[0];
	var inmins=result*60;
	var year=received[1];
	var month=received[2];
	var day=received[3];
	var inRange=checkTimeRange(day+"/"+month+"/"+year,date1,date2);
	if (inRange==true) {
		if (freq=="monthly") {
			var checkAgg=parseInt(month)+"/"+year;
		}
		else if (freq=="quaterly") {
			var quater;
			if (month<=3) {
				quater='Q1';
			}
			else if (month>=4 && month<=6) {
				quater='Q2';
			}
			else if (month>=7 && month<=9) {
				quater='Q3';	
			}
			else if (month>=10 && month<=12) {
				quater='Q4';	
			}
			var checkAgg=quater+"_"+year;
		}
		else if (freq=="yearly") {
			var checkAgg=year.toString();
		}
		//check
		var index=datax.indexOf(checkAgg);
		if (index!=-1) {
			waitTime[index]+=result;
			plot1tags[index][plot1tags[index].length]=json[0][i]["TaskID"];
			if (inmins<=60) {
				cummWait[Math.ceil(inmins/5)-1]++;
				plot7tags[Math.ceil(inmins/5)-1][plot7tags[Math.ceil(inmins/5)-1].length]=json[0][i]["TaskID"];
			}
			else{
				cummWait[12]++;
				plot7tags[12][plot7tags[12].length]=json[0][i]["TaskID"];
			}
		}
	}
}

function calforExeTime(i){
	for(var k=0;k<cnodeFil.length;k++)
	{	
		var received=getData(i,"exe");
		var result=received[0];
		var year=received[1];
		var month=received[2];
		var day=received[3];
		var inRange=checkTimeRange(day+"/"+month+"/"+year,date1,date2);
		if (inRange==true) {
			if (freq=="monthly") {
				var checkAgg=parseInt(month)+"/"+year;
			}
			else if (freq=="quaterly") {
				var quater;
				if (month<=3) {
					quater='Q1';
				}
				else if (month>=4 && month<=6) {
					quater='Q2';
				}
				else if (month>=7 && month<=9) {
					quater='Q3';	
				}
				else if (month>=10 && month<=12) {
					quater='Q4';	
				}
				var checkAgg=quater+"_"+year;
			}
			else if (freq=="yearly") {
				var checkAgg=year.toString();
			}
			//check
			index=datax.indexOf(checkAgg);
			if (index!=-1 && json[0][i]["WorkerIP"]==cnodeFil[k]) {
					exeTime[k][index]+=result;
					plot2tags[k][index][plot2tags[k][index].length]=json[0][i]["TaskID"];
					break;
			}		
		}
	}
}

function calforTotalTime(i){
	for(var k=0;k<jobUserFil.length;k++)
	{	
		var received=getData(i,"total");
		var result=received[0];
		var year=received[1];
		var month=received[2];
		var day=received[3];
		var inRange=checkTimeRange(day+"/"+month+"/"+year,date1,date2);
		if (inRange==true) {
			if (freq=="monthly") {
				var checkAgg=parseInt(month)+"/"+year;
			}
			else if (freq=="quaterly") {
				var quater;
				if (month<=3) {
					quater='Q1';
				}
				else if (month>=4 && month<=6) {
					quater='Q2';
				}
				else if (month>=7 && month<=9) {
					quater='Q3';	
				}
				else if (month>=10 && month<=12) {
					quater='Q4';	
				}
				var checkAgg=quater+"_"+year;
			}
			else if (freq=="yearly") {
				var checkAgg=year.toString();
			}
			//check
			index=datax.indexOf(checkAgg);
			if (index!=-1 && json[0][i]["Owner"]==jobUserFil[k]) {
					totalTime[k][index]+=result;
					plot6tags[k][index][plot6tags[k][index].length]=json[0][i]["TaskID"];
					break;
			}
		}
	}
}

function calforStatus(i){
	var date=new Date(parseInt(json[0][i]["EndTime"]));
	if (json[0][i]["Status"]=="Terminated" || json[0][i]["Status"]=="Deleted") {
		var date=new Date(parseInt(json[0][i]["SubmissionTime"]));
	}
	var day=date.getDate();
	var month=date.getMonth()+1;
	var year=date.getFullYear();
	var inRange=checkTimeRange(day+"/"+month+"/"+year,date1,date2);
	if (inRange) {
			statusData[statusFil.indexOf(json[0][i]["Status"])]++;
			plot4tags[statusFil.indexOf(json[0][i]["Status"])][plot4tags[statusFil.indexOf(json[0][i]["Status"])].length]=json[0][i]["TaskID"];
	}
}

function calforContext(i){
	var date=new Date(parseInt(json[0][i]["EndTime"]));
	if (json[0][i]["Status"]=="Terminated" || json[0][i]["Status"]=="Deleted") {
		var date=new Date(parseInt(json[0][i]["SubmissionTime"]));
	}
	var day=date.getDate();
	var month=date.getMonth()+1;
	var year=date.getFullYear();
	var inRange=checkTimeRange(day+"/"+month+"/"+year,date1,date2);
	if (inRange) {
		contextData[contextFil.indexOf(json[0][i]["Context"])]++;
		plot3tags[contextFil.indexOf(json[0][i]["Context"])][plot3tags[contextFil.indexOf(json[0][i]["Context"])].length]=json[0][i]["TaskID"];
	}
}

function calforUsage(i){
	var received=getData(i,"total");
	var result=received[0];
	var year=received[1];
	var month=received[2];
	var day=received[3];
	var inRange=checkTimeRange(day+"/"+month+"/"+year,date1,date2);
	if (inRange) {
		userData[jobUserFil.indexOf(json[0][i]["Owner"])]+=result;
		plot5tags[jobUserFil.indexOf(json[0][i]["Owner"])][plot5tags[jobUserFil.indexOf(json[0][i]["Owner"])].length]=json[0][i]["TaskID"];
	}
}

function calforHistogram(){
	var sum=0;
	for(var i=0;i<cummWait.length;i++)
	{
		sum+=cummWait[i];
	}
	for(var i=0;i<cummWait.length;i++)
	{
		cummWait[i]=(cummWait[i]/sum)*100;
		cummWait[i]=Number(cummWait[i].toFixed(2));
	}
	for(var i=0;i<cummWait.length;i++)
	{
		if (i!=0) {
			cummWaitVal[i]=Number(cummWaitVal[i-1])+Number(cummWait[i]);
			cummWaitVal[i].toFixed(2);
			plot8tags[i]=plot8tags[i-1].concat(plot7tags[i]);
		}
		else{
			cummWaitVal[i]=Number(cummWait[i]);
			cummWaitVal[i].toFixed(2);
			plot8tags[i]=plot7tags[i];
		}
		
	}
}

function toTwoDecimalPlaces(){
	for(var j=0;j<datax.length;j++)
	{	
		waitTime[j]=waitTime[j].toFixed(2);
		for(var k=0;k<cnodeFil.length;k++)
		{
			exeTime[k][j]=exeTime[k][j].toFixed(2);
		}
		for(var k=0;k<jobUserFil.length;k++)
		{
			totalTime[k][j]=totalTime[k][j].toFixed(2);
		}
	}
	for(var j=0;j<jobUserFil.length;j++)
	{
		userData[j]=userData[j].toFixed(2);
	}
}

//function for getting data like wait time,execution time and total time 
function getData(i,plotParam){
	var ept1,ept2,parts,part1,part2,year,month,day,hour,min,sec,d1,d2,result;
	if (plotParam=="wait") {
		ept1="SubmissionTime";
		ept2="StartTime";
	}
	else if (plotParam=="exe") {
		ept1="StartTime";
		ept2="EndTime";
	}
	else if(plotParam=="total"){
		ept1="SubmissionTime";
		ept2="EndTime";
	}

	d1=new Date(parseInt(json[0][i][ept1]));
	d2=new Date(parseInt(json[0][i][ept2]));
	result=(d2-d1)/(60*1000*60);
	if (result<0) {
		result=NaN;
	}
	return [result,d2.getFullYear(),d2.getMonth()+1,d2.getDate()];
}

//function for applying selected filters
function applyFilter(){
	contextFil=[];statusFil=[];jobUserFil=[];cnodeFil=[],sampleUserFil=[],orgaFil=[],taskNameFil=[];
	var context=document.getElementsByName('context');
	var status=document.getElementsByName('status');
	var jobUsers=document.getElementsByName('jobUser');
	var cnodes=document.getElementsByName('cnodes');
	var sampleUsers=document.getElementsByName('sampleUser');
	var organisms=document.getElementsByName('organism');
	var taskNames=document.getElementsByName('taskNames');
	var j=0;
	for(var i=0;i<context.length;i++)
	{
		if (context[i].checked) {
			contextFil[j]=context[i].value;
			j++;
		}
	}
	filters[1]=contextFil;
	j=0;
	for(var i=0;i<status.length;i++)
	{
		if (status[i].checked) {
			statusFil[j]=status[i].value;
			j++;
		}
	}
	filters[2]=statusFil;
	j=0;
	for(var i=0;i<jobUsers.length;i++)
	{
		if (jobUsers[i].checked) {
			jobUserFil[j]=jobUsers[i].value;
			j++;
		}
	}
	j=0;
	filters[3]=jobUserFil;
	for(var i=0;i<cnodes.length;i++)
	{
		if (cnodes[i].checked) {
			cnodeFil[j]=cnodes[i].value;
			j++;
		}
	}
	filters[4]=cnodeFil;
	var j=0;
	for(var i=0;i<sampleUsers.length;i++)
	{
		if (sampleUsers[i].checked) {
			sampleUserFil[j]=sampleUsers[i].value;
			j++;
		}
	}
	filters[6]=sampleUserFil;
	var j=0;
	for(var i=0;i<organisms.length;i++)
	{
		if (organisms[i].checked) {
			orgaFil[j]=organisms[i].value;
			j++;
		}
	}
	filters[7]=orgaFil;
	var j=0;
	for(var i=0;i<taskNames.length;i++)
	{
		if (taskNames[i].checked) {
			taskNameFil[j]=taskNames[i].value;
			j++;
		}
	}
}

//this function stores collected data into variables required for chart.js library
function getJobStatPlot(xdata,ydata,plotTags,graphType,xlabel,plotParam){
	dataset=[];labels=xdata;yAxes=[];xAxes=[];options={},footer=null;
	backgroundColor="";borderColor="";pointBackgroundColor="";pointBorderColor="";
	if (graphType=="bar" || graphType=="line") {
		var takeColor=colors[0];
	 //    for (var j = 1; j <ydata.length; j++) {
		// 	backgroundColor[j]=takeColor;
		// 	borderColor[j]=takeColor;
		// 	pointBackgroundColor[j]=takeColor;
		// 	pointBorderColor[j]=takeColor;
		// }
		backgroundColor=takeColor;
		borderColor=takeColor;
		pointBackgroundColor=takeColor;
		pointBorderColor=takeColor;
		dataset=[{
			label: plotParam, 
	        data: ydata,
	        backgroundColor:backgroundColor,
	        borderColor:borderColor,
	        pointBackgroundColor:pointBackgroundColor,
	        pointBorderColor:pointBorderColor,
	        //pointRadius:0,
	        tension:0,
	        borderWidth: 3,
	        fill: false
		}];
		yAxes=[{
			scaleLabel: {
		       display: true,
		       labelString: plotParam
		    },
		    ticks: {
			   beginAtZero:true
			}
		}];
		xAxes=[{
			scaleLabel: {
		       display: true,
		       labelString: xlabel
		    }
		}];
		//var noofjobs=[];
		footer=function(tooltipItems, data) {
                    	var noofjobs=tooltipItems[0].index;
                    	return 'No. of Jobs. : '+plotTags[noofjobs].length;
                    };
		options= {
	    	scales:{
	    		yAxes:yAxes,
	    		xAxes:xAxes
	    	},
	    	tooltips: {
                mode: 'index',
                callbacks: {
                    // Use the footer callback to display the sum of the items showing in the tooltip
                    footer: footer,
                },
                footerFontStyle: 'normal'
            }
	    	// pan:{
	    	// 	enabled:true,
	    	// 	mode: 'xy'
	    	// },
	    	// zoom:{
	    	// 	enabled:true,
	    	// 	mode:'xy'
	    	// }
	    };
	}
	else if (graphType=="pie") {
		console.log(plotParam,xdata,ydata);
		backgroundColor=[];borderColor=[];
		var totalJobs = 0;
		for(var i=0;i<ydata.length;i++){
			totalJobs+=ydata[i];
		}
		for(var i=0;i<xdata.length;i++){
			backgroundColor[i]=colors[i];
			borderColor[i]=colors[i];
		}
		dataset=[{
			label: plotParam, 
	        data: ydata,
	        backgroundColor:backgroundColor,
	        borderColor:borderColor,
	        borderWidth: 3
		}];
		footer=function(tooltipItems, data) {
        	var dataIndex=tooltipItems[0].index;
        	var percentJobs = ((ydata[dataIndex]/totalJobs)*100).toFixed(2);
        	return percentJobs + "% of Jobs";
        };
        options= {
	    	tooltips: {
                mode: 'index',
                callbacks: {
                    // Use the footer callback to display the sum of the items showing in the tooltip
                    footer: footer,
                },
                footerFontStyle: 'normal'
            }
	    	// pan:{
	    	// 	enabled:true,
	    	// 	mode: 'xy'
	    	// },
	    	// zoom:{
	    	// 	enabled:true,
	    	// 	mode:'xy'
	    	// }
	    };
	}
	// else if (plotParam=="Context") {
	// 	var totalJobs = 0;
	// 	for(var i=0;i<ydata.length;i++){
	// 		totalJobs+=ydata[i];
	// 	}
	// 	backgroundColor=['rgba(33,150,243,0.7)','rgba(233,30,99,0.7)'];
	// 	borderColor=['rgba(33,150,243,1)','rgba(233,30,99,1)'];
	// 	dataset=[{
	// 		label: plotParam, 
	//         data: ydata,
	//         backgroundColor:backgroundColor,
	//         borderColor:borderColor,
	//         borderWidth: 3
	// 	}];
	// 	footer=function(tooltipItems, data) {
 //                    	var dataIndex=tooltipItems[0].index;
 //                    	var percentJobs = ((ydata[dataIndex]/totalJobs)*100).toFixed(2);
 //                    	return percentJobs + "% of Jobs";
 //                    };

 //        options= {
	//     	tooltips: {
 //                mode: 'index',
 //                callbacks: {
 //                    // Use the footer callback to display the sum of the items showing in the tooltip
 //                    footer: footer,
 //                },
 //                footerFontStyle: 'normal'
 //            }
	//     	// pan:{
	//     	// 	enabled:true,
	//     	// 	mode: 'xy'
	//     	// },
	//     	// zoom:{
	//     	// 	enabled:true,
	//     	// 	mode:'xy'
	//     	// }
	//     };
	// }
	// else if (plotParam=="Status") 	{
	// 	var totalJobs = 0;
	// 	for(var i=0;i<ydata.length;i++){
	// 		totalJobs+=ydata[i];
	// 	}
	// 	backgroundColor=['rgba(33,150,243,0.7)','rgba(233,30,99,0.7)','rgba(63,81,181,0.7)','rgba(255,87,34,0.7)'];
	// 	borderColor=['rgba(33,150,243,1)','rgba(233,30,99,1)','rgba(63,81,181,1)','rgba(255,87,34,1)'];
	// 	var providebgColor=[],providebrColor=[];
	// 	for(var i=0;i<statusFil.length;i++)
	// 	{
	// 		providebgColor[i]=backgroundColor[i];
	// 		providebrColor[i]=borderColor[i];
	// 	}
	// 	dataset=[{
	// 		label: plotParam, 
	//         data: ydata,
	//         backgroundColor:providebgColor,
	//         borderColor:providebrColor,
	//         borderWidth: 3
	// 	}];
	// 	footer=function(tooltipItems, data) {
 //                    	var dataIndex=tooltipItems[0].index;
 //                    	var percentJobs = ((ydata[dataIndex]/totalJobs)*100).toFixed(2);
 //                    	return percentJobs + "% of Jobs";
 //                    };

 //        options= {
	//     	tooltips: {
 //                mode: 'index',
 //                callbacks: {
 //                    // Use the footer callback to display the sum of the items showing in the tooltip
 //                    footer: footer,
 //                },
 //                footerFontStyle: 'normal'
 //            }	
	//     	// pan:{
	//     	// 	enabled:true,
	//     	// 	mode: 'xy'
	//     	// },
	//     	// zoom:{
	//     	// 	enabled:true,
	//     	// 	mode:'xy'
	//     	// }
	//     };
		
	// }
	// else if (plotParam=="Task Distribution"){

	// }
}

//this function stores collected data into variables required for chart.js library for multiple value plot
function getMultiPlot(xdata,ydata,plotTags,graphType,ylabel,xlabel,plotParam){
	dataset=[];labels=xdata;yAxes=[];xAxes=[];options={},footer=null;
	
	if (graphType=="bar" || graphType=="line") {

		for(var i=0;i<ydata.length;i++){
			colorGive=colors[i];
			backgroundColor="";borderColor="";pointBackgroundColor="";pointBorderColor="";
	
			// for (var j = 0; j <ydata[i].length; j++) {
			// 	backgroundColor[j]=colorGive;
			// 	borderColor[j]=colorGive;
			// 	pointBackgroundColor[j]=colorGive;
			// 	pointBorderColor[j]=colorGive;
			// }

			backgroundColor=colorGive;
			borderColor=colorGive;
			pointBackgroundColor=colorGive;
			pointBorderColor=colorGive;
	
			dataset[i]={
				label: plotParam[i], 
		        data: ydata[i],
		        backgroundColor:backgroundColor,
		        borderColor:borderColor,
		        pointBackgroundColor:pointBackgroundColor,
		        pointBorderColor:pointBorderColor,
		        //pointRadius:0,
		        tension:0,
		        borderWidth: 3,
		        fill: false,
		        yAxesID:1
			};
	
			yAxes[i]={
				id: 1,
	        	type: 'linear',
	        	position: 'left',
	        	scaleLabel: {
			       display: true,
			       labelString: ylabel
		    	}

			};
		}

		xAxes=[{
				scaleLabel: {
			       display: true,
			       labelString: xlabel
			    }
			}];
		footer=function(tooltipItems, data) {
                    	var dataIndex=tooltipItems[0].datasetIndex
                    	var noofjobs=tooltipItems[0].index;
                    	return 'No. of Jobs. : '+plotTags[dataIndex][noofjobs].length;
                    };
		options= {
	    	scales:{
	    		yAxes:yAxes,
	    		xAxes:xAxes
	    	},
	    	tooltips: {
                mode: 'point',
                callbacks: {
                    // Use the footer callback to display the sum of the items showing in the tooltip
                    footer: footer,
                },
                footerFontStyle: 'normal'
            }
	    	// pan:{
	    	// 	enabled:true,
	    	// 	mode: 'xy'
	    	// },
	    	// zoom:{
	    	// 	enabled:true,
	    	// 	mode:'xy'
	    	// }
	    };
	}
	
}

//this function plots graph on given canvas id and stores returned chart.js object in myChart array
function plotonCanvas(ind,graphType,chartid){
	var ctx = document.getElementById(chartid);
	myChart[ind] = new Chart(ctx, {
	    type: graphType,
	    data: {
	        labels: labels,
	        datasets: dataset
	    },
	    options: options
	});
}

//shows details of which filters are applied for current plots
function jobFilterDetails(){
	var filterDetail="Showing <strong class=\"strongDetail\">"+filters[5]+"</strong> Job plots from <strong class=\"strongDetail\">"+filters[0][0]+"</strong> to <strong class=\"strongDetail\">"+filters[0][1]+"</strong>. for the job having context";
	for(var i=0;i<filters[1].length;i++)
	{
		var str=" <strong class=\"strongDetail\">["+filters[1][i]+"]</strong>";
		filterDetail+=str;
	}
	filterDetail+=" ,status";
	for(var i=0;i<filters[2].length;i++)
	{
		var str=" <strong class=\"strongDetail\">["+filters[2][i]+"]</strong>";
		filterDetail+=str;
	}
	filterDetail+=" and Compute Nodes";
	for(var i=0;i<filters[4].length;i++)
	{
		var str=" <strong class=\"strongDetail\">["+filters[4][i]+"]</strong>";
		filterDetail+=str;
	}
	filterDetail+=" for <br>Users : ";
	for(var i=0;i<filters[3].length;i++)
	{
		var str=" <strong class=\"strongDetail\">["+filters[3][i]+"]</strong>";
		filterDetail+=str;
	}
	document.getElementById('jobFilterDetailpara').innerHTML=filterDetail;
}

$(document).ready(function(){
	//implementation of showing enlarged plot
	$('#plot1Parent').click(function(){
		myChart[8].destroy();
		getJobStatPlot(datax,waitTime,plot1tags,"line",xparamLabel["time"],yparamLabel["waitHours"]);
		plotonCanvas(8,"line","hoverChart");
		$("#hoverPlotParent").css("width","100%").css("height","100%").css("margin","0 auto");
		$(".hoverParent").fadeIn("slow");
		$(".hoverClose").fadeIn("slow");
		$(".hoverMain").fadeIn("slow");
	});

	$('#plot2Parent').click(function(){
		myChart[8].destroy();
		getMultiPlot(datax,exeTime,plot2tags,"line",yparamLabel["exeHours"],xparamLabel["time"],cnodeFil);
		plotonCanvas(8,"line","hoverChart");
		$("#hoverPlotParent").css("width","100%").css("height","100%").css("margin","0 auto");
		$(".hoverParent").fadeIn("slow");
		$(".hoverClose").fadeIn("slow");
		$(".hoverMain").fadeIn("slow");
	});

	$('#plot3Parent').click(function(){
		myChart[8].destroy();
		getJobStatPlot(contextDatax,contextData,plot3tags,"pie","","Context");
		plotonCanvas(8,"pie","hoverChart");
		$("#hoverPlotParent").css("width","50%").css("height","100%").css("margin","0 auto");
		$(".hoverParent").fadeIn("slow");
		$(".hoverClose").fadeIn("slow");
		$(".hoverMain").fadeIn("slow");
	});

	$('#plot4Parent').click(function(){
		myChart[8].destroy();
		getJobStatPlot(statusDatax,statusData,plot4tags,"pie","","Status");
		plotonCanvas(8,"pie","hoverChart");
		$("#hoverPlotParent").css("width","50%").css("height","100%").css("margin","0 auto");
		$(".hoverParent").fadeIn("slow");
		$(".hoverClose").fadeIn("slow");
		$(".hoverMain").fadeIn("slow");
	});

	$('#plot5Parent').click(function(){
		myChart[8].destroy();
		getJobStatPlot(userDatax,userData,plot5tags,"bar",xparamLabel["user"],yparamLabel["totalHours"]);
		plotonCanvas(8,"bar","hoverChart");
		$("#hoverPlotParent").css("width","100%").css("height","100%").css("margin","0 auto");
		$(".hoverParent").fadeIn("slow");
		$(".hoverClose").fadeIn("slow");
		$(".hoverMain").fadeIn("slow");
	});

	$('#plot6Parent').click(function(){
		myChart[8].destroy();
		getMultiPlot(datax,totalTime,plot6tags,"line",yparamLabel["totalHours"],xparamLabel["time"],jobUserFil);
		plotonCanvas(8,"line","hoverChart");
		$("#hoverPlotParent").css("width","100%").css("height","100%").css("margin","0 auto");
		$(".hoverParent").fadeIn("slow");
		$(".hoverClose").fadeIn("slow");
		$(".hoverMain").fadeIn("slow");
	});

	$('#plot7Parent').click(function(){
		myChart[8].destroy();
		getJobStatPlot(waitforAnalysis0,cummWait,plot7tags,"bar",xparamLabel["waitMins"],yparamLabel["percentJobs"]);
		plotonCanvas(8,"bar","hoverChart");
		$("#hoverPlotParent").css("width","100%").css("height","100%").css("margin","0 auto");
		$(".hoverParent").fadeIn("slow");
		$(".hoverClose").fadeIn("slow");
		$(".hoverMain").fadeIn("slow");
	});

	$('#plot8Parent').click(function(){
		myChart[8].destroy();
		getJobStatPlot(waitforAnalysis,cummWaitVal,plot8tags,"line",xparamLabel["waitMins"],yparamLabel["cpercentJobs"]);
		plotonCanvas(8,"line","hoverChart");
		$("#hoverPlotParent").css("width","100%").css("height","100%").css("margin","0 auto");
		$(".hoverParent").fadeIn("slow");
		$(".hoverClose").fadeIn("slow");
		$(".hoverMain").fadeIn("slow");
	});

	$('#plot15Parent').click(function(){
		myChart[8].destroy();
		getJobStatPlot(taskDisDatax,taskDisData,plot9tags,"pie","","Task Distribution");
		plotonCanvas(8,"pie","hoverChart");
		$("#hoverPlotParent").css("width","50%").css("height","100%").css("margin","0 auto");
		$(".hoverParent").fadeIn("slow");
		$(".hoverClose").fadeIn("slow");
		$(".hoverMain").fadeIn("slow");
	});

	//implementation of showing details of particular point
	document.getElementById("hoverChart").onclick = function(evt) {
    var activePoints = myChart[8].getElementAtEvent(evt);
    var firstPoint = activePoints[0];
    if(firstPoint!=undefined)
    {
    	$(".loadingDiv").css("height","100%").css("width","100%").css("z-index","5").css("top","0").css("backgroundColor","rgba(255,255,255,0.8)");
	    $(".loadingDiv").fadeIn("slow",function(){
	    	 $(".dethoverParent").fadeIn("slow",function(){
	    	 	$(".detailDiv").fadeIn("slow",function(){
	    	 		$(".dethoverClose").fadeIn("slow",function(){
	    	 			$(".loadingDiv").fadeOut("slow");
	    	 		});
	    	 	});
	    	 });
	    });
    	var graphLabel=firstPoint["_chart"]["config"]["data"]["datasets"][firstPoint["_datasetIndex"]]["label"];
	    var indextoTake=firstPoint["_index"];
	    if (graphLabel==yparamLabel["waitHours"]) {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML="Average Job Waitig Time";
	    	document.getElementsByClassName('pointDetail')[1].innerHTML="Showing " + plot1tags[indextoTake].length + " Records";
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + datax[firstPoint['_index']];
	    	getJobPointDetails(plot1tags[indextoTake]);
	    }
	    else if(cnodeFil.indexOf(graphLabel)!=-1){
	    	document.getElementsByClassName('detailTitle')[0].innerHTML="Compute Node Usage";
	    	document.getElementsByClassName('pointDetail')[1].innerHTML="Showing " + plot2tags[cnodeFil.indexOf(graphLabel)][indextoTake].length + " Records";
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + datax[firstPoint['_index']]+ " of "+cnodeFil[firstPoint['_datasetIndex']] + " Compute Node";
	    	getJobPointDetails(plot2tags[cnodeFil.indexOf(graphLabel)][indextoTake]);
	    }
	    else if (graphLabel=="Context") {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML="Context Plot";
	    	document.getElementsByClassName('pointDetail')[1].innerHTML="Showing " + plot3tags[indextoTake].length + " Records";
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + contextDatax[firstPoint['_index']];
	    	getJobPointDetails(plot3tags[indextoTake]);
	    }
	    else if (graphLabel=="Status") {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML="Status Plot";
	    	document.getElementsByClassName('pointDetail')[1].innerHTML="Showing " + plot4tags[indextoTake].length + " Records";
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + statusDatax[firstPoint['_index']];
	    	getJobPointDetails(plot4tags[indextoTake]);	
	    }
	    else if (graphLabel==yparamLabel["totalHours"]) {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML="Compute Usage by Users";
	    	document.getElementsByClassName('pointDetail')[1].innerHTML="Showing " + plot5tags[indextoTake].length + " Records";
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + userDatax[firstPoint['_index']];
	    	getJobPointDetails(plot5tags[indextoTake]);	
	    }
	    else if(jobUserFil.indexOf(graphLabel)!=-1){
	    	document.getElementsByClassName('detailTitle')[0].innerHTML="Total Time of Job for Different Users";
	    	document.getElementsByClassName('pointDetail')[1].innerHTML="Showing " + plot6tags[jobUserFil.indexOf(graphLabel)][indextoTake].length + " Records";
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + datax[firstPoint['_index']] + " of "+jobUserFil[firstPoint['_datasetIndex']] + " User";
	    	getJobPointDetails(plot6tags[jobUserFil.indexOf(graphLabel)][indextoTake]);
	    }
	    else if (graphLabel=="% of Jobs") {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML="Wait Time Histogram";
	    	document.getElementsByClassName('pointDetail')[1].innerHTML="Showing " + plot7tags[indextoTake].length + " Records";
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + waitforAnalysis0[firstPoint['_index']] +" mins.";
	    	getJobPointDetails(plot7tags[indextoTake]);	
	    }
	    else if (graphLabel=="% of Jobs (c)") {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML="Cummulative Wait time plot";
	    	document.getElementsByClassName('pointDetail')[1].innerHTML="Showing " + plot8tags[indextoTake].length + " Records";
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + waitforAnalysis[firstPoint['_index']];
	    	getJobPointDetails(plot8tags[indextoTake]);	
	    }
	    else if (graphLabel=="Task Distribution") {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML="Task Distribution";
	    	document.getElementsByClassName('pointDetail')[1].innerHTML="Showing " + plot9tags[indextoTake].length + " Records";
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + taskDisDatax[firstPoint['_index']];
	    	getJobPointDetails(plot9tags[indextoTake]);	
	    }
	} 
	    
  	};
});

//below given function stores data required for showing details
var detailJson=[],detailJsonNew=[],ind=0;
function getJobPointDetails(taskids){
	detailJson=[];detailJsonNew=[];ind=0;counts=0;previously='';
	for(var i=0;i<json[0].length;i++)
	{

		if(taskids.indexOf(json[0][i]["TaskID"])!=-1)
		{
			var date=new Date(parseInt(json[0][i]["SubmissionTime"]));
			var waitresult=getData(i,"wait");
			waitresult=(waitresult[0]*60).toFixed(2);
			var exeresult=getData(i,"exe");
			exeresult=(exeresult[0]).toFixed(2);
			// var inHrs = parseInt(exeresult[0]);
			// var inMins = (exeresult[0] - inHrs)*60;
			// var inSecs = parseInt((inMins - parseInt(inMins))*60);
			// inMins - parseInt(inMins);
			// exeresult = inHrs + ":" + inMins + ":" + inSecs;
			if (isNaN(exeresult)) {
				exeresult="-";
			}			
			detailJson[ind]={
				'TaskID':json[0][i]['TaskID'],
				'TaskName':json[0][i]['TaskName'],
				'Owner':json[0][i]['Owner'],
				'Context':json[0][i]['Context'],
				'SubTimeinms':json[0][i]['SubmissionTime'],
				'SubmissionTime':date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+" "+(date.getHours()+1)+":"+(date.getMinutes()+1)+":"+(date.getSeconds()+1),
				'WorkerIP':json[0][i]['WorkerIP'],
				'WaitTime':waitresult,
				'ExeTime':exeresult,
				'Status':json[0][i]['Status']

			};
			detailJsonNew[ind]={
				'TaskID':json[0][i]['TaskID'],
				'TaskName':json[0][i]['TaskName'],
				'Owner':json[0][i]['Owner'],
				'Context':json[0][i]['Context'],
				'SubTimeinms':json[0][i]['SubmissionTime'],
				'SubmissionTime':date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+" "+(date.getHours()+1)+":"+(date.getMinutes()+1)+":"+(date.getSeconds()+1),
				'WorkerIP':json[0][i]['WorkerIP'],
				'WaitTime':waitresult,
				'ExeTime':exeresult,
				'Status':json[0][i]['Status']

			};
			ind++;
		}
	}
	printDetailTable(detailJson);
}

//this function prints collected detailed data into table format
function printDetailTable(jobs){
	var detailTable=document.getElementsByClassName('detailTable')[0];
	var detailTableBody=document.getElementsByClassName('detailTableBody')[0];
	var tbody=document.createElement('tbody');
	tbody.setAttribute('class','detailTableBody');
	for(var i=0;i<jobs.length;i++)
	{
		var tr=document.createElement('tr');
		var td=document.createElement('td');
		td.setAttribute("title","Task ID");
		var anchor=document.createElement('a');
		anchor.setAttribute("href","task.html?taskid="+jobs[i]["TaskID"]);
		anchor.setAttribute("class","taskLinks");
		anchor.setAttribute("target","_blank");
		td.appendChild(anchor);
		anchor.innerHTML=jobs[i]["TaskID"];
		tr.appendChild(td);

		td=document.createElement('td');
		td.setAttribute("title","TaskName");
		td.innerHTML=jobs[i]["TaskName"];
		tr.appendChild(td);

		td=document.createElement('td');
		td.setAttribute("title","Owner");
		td.innerHTML=jobs[i]["Owner"];
		tr.appendChild(td);

		td=document.createElement('td');
		td.setAttribute("title","Context Name");
		td.innerHTML=jobs[i]["Context"];
		tr.appendChild(td);

		td=document.createElement('td');
		td.setAttribute("title","Worker IP");
		td.innerHTML=jobs[i]["WorkerIP"];
		tr.appendChild(td);

		td=document.createElement('td');
		td.setAttribute("title","Submission Time");
		td.innerHTML=jobs[i]["SubmissionTime"];
		tr.appendChild(td);

		td=document.createElement('td');
		td.setAttribute("title","Wait Time(Mins.)");
		td.innerHTML=jobs[i]["WaitTime"];
		tr.appendChild(td);

		td=document.createElement('td');
		td.setAttribute("title","Exe. Time(Mins.)");
		td.innerHTML=jobs[i]["ExeTime"];
		tr.appendChild(td);

		td=document.createElement('td');
		td.setAttribute("title","Status");
		td.innerHTML=jobs[i]["Status"];
		tr.appendChild(td);

		tbody.appendChild(tr)
	}
	detailTable.replaceChild(tbody,detailTableBody);
}


//implementation of sorting details table
var counts=0,previously='';
function sortDetails(param){
	if (param=='WaitTime' || param=='TaskID') {
		detailJsonNew.sort(function(a,b){
			return a[param] - b[param];
		});
	}
	else if (param=='TaskName' || param=='Owner' || param=='Context' || param=='WorkerIP' || param=='Status') {
		detailJsonNew.sort(function(a,b){
			return (a[param]).localeCompare(b[param]);
		});
	}
	else if (param=='ExeTime') {
		detailJsonNew.sort(function(a,b){
			if (a[param]!='-' && b[param]!='-') {
				return a[param] - b[param];
			}
			else if (a[param]=='-' && b[param]=='-') {
				return 0;
			}
			else if (a[param]=='-' && b[param]!='-') {
				return -1;
			}
			else if (a[param]!='-' && b[param]=='-') {
				return 1;
			}	
		});
	}
	else if (param=='SubTimeinms') {
		detailJsonNew.sort(function(a,b){
			if (a[param]<b[param]) {
				return -1;
			}
			else if (a[param]>b[param]) {
				return 1;
			}
			else{
				return 0;
			}
		});
	}
	var caretOld=document.getElementById('caret');
	if (caretOld!=null) {
		caretOld.parentNode.removeChild(caretOld);
	}
	if (previously!=param) {
		counts=0;
		previously=param;
	}
	if (counts%3==0) {
		var caret=document.createElement('i');
		caret.setAttribute('class','fa fa-caret-up');
		caret.setAttribute('id','caret');
		printDetailTable(detailJsonNew);
		var sortParent=document.getElementsByClassName(param)[0];
		sortParent.appendChild(caret);
		counts++;	
	}
	else if (counts%3==1) {
		var caret=document.createElement('i');
		caret.setAttribute('class','fa fa-caret-down');
		caret.setAttribute('id','caret');
		printDetailTable(detailJsonNew.reverse());
		var sortParent=document.getElementsByClassName(param)[0];
		sortParent.appendChild(caret);
		counts++;
	}
	else if (counts%3==2) {
		printDetailTable(detailJson);
		counts++;
	}
}

//primary fuction for caculating data required for all plots and then plotting it
function createSamplePlots(){
	//this function calculates all data required for all plots
	calculationForSmapleStats();
	//below given code plots all graphs
	getSampleStatPlot(sampleUserFil,noofSamples,sample1tags,"bar",xparamLabel["user"],yparamLabel["usernoSample"]);
	plotonCanvas(9,"bar","myChart9");
	getSampleStatPlot(sampleUserFil,sizeofSamples,sample1tags,"bar",xparamLabel["user"],yparamLabel["userszSample"]);
	plotonCanvas(10,"bar","myChart10");
	getSampleStatPlot(datax,sampleonTime,sample2tags,"line",xparamLabel["time"],yparamLabel["monthnoSample"]);
	plotonCanvas(11,"line","myChart11");
	getSampleStatPlot(datax,sampleSizeonTime,sample2tags,"line",xparamLabel["time"],yparamLabel["monthszSample"]);
	plotonCanvas(12,"line","myChart12");
	getSampleStatPlot(orgaFil,organismNumber,sample3tags,"pie","",yparamLabel["relativeSampleNo"]);
	plotonCanvas(13,"pie","myChart13");
	getSampleStatPlot(orgaFil,organismSize,sample3tags,"pie","",yparamLabel['relativeSampleSize']);
	plotonCanvas(14,"pie","myChart14");
	//this plot is initially plotted for enlarged graph
	getSampleStatPlot(sampleUserFil,noofSamples,sample1tags,"bar",xparamLabel["user"],yparamLabel["usernoSample"]);
	plotonCanvas(15,"bar","hoverChart2");
}

//this function updates data and then plots it on changing filters
function updateSamplePlots(){
	//calculates data required for  all graphs
	calculationForSmapleStats();

	//updates all plots
	getSampleStatPlot(sampleUserFil,noofSamples,sample1tags,"bar",xparamLabel["user"],yparamLabel["usernoSample"]);
	myChart[9].data.datasets=dataset;
	myChart[9].data.labels=labels;
	myChart[9].update();

	getSampleStatPlot(sampleUserFil,sizeofSamples,sample1tags,"bar",xparamLabel["user"],yparamLabel["userszSample"]);
	myChart[10].options.tooltips.callbacks.footer=footer;
	myChart[10].data.datasets=dataset;
	myChart[10].data.labels=labels;
	myChart[10].update();

	getSampleStatPlot(datax,sampleonTime,sample2tags,"line",xparamLabel["time"],yparamLabel["monthnoSample"]);
	myChart[11].data.datasets=dataset;
	myChart[11].data.labels=labels;
	myChart[11].update();

	getSampleStatPlot(datax,sampleSizeonTime,sample2tags,"line",xparamLabel["time"],yparamLabel["monthszSample"]);
	myChart[12].options.tooltips.callbacks.footer=footer;
	myChart[12].data.datasets=dataset;
	myChart[12].data.labels=labels;
	myChart[12].update();

	getSampleStatPlot(orgaFil,organismNumber,sample3tags,"pie","",yparamLabel["relativeSampleNo"]);
	myChart[13].options.tooltips.callbacks.footer=footer;
	myChart[13].data.datasets=dataset;
	myChart[13].data.labels=labels;
	myChart[13].update();

	getSampleStatPlot(orgaFil,organismSize,sample3tags,"pie","",yparamLabel['relativeSampleSize']);
	myChart[14].options.tooltips.callbacks.footer=footer;
	myChart[14].data.datasets=dataset;
	myChart[14].data.labels=labels;
	myChart[14].update();
}

function sampleXparamInitialize(){
	//this is for getting months/quaters/years in time range...(initialization of xparam and taskid arrays)
	var aggregation=document.getElementsByName('aggregation');
	for(var i=0;i<aggregation.length;i++)
	{
		if (aggregation[i].checked) {
			freq=aggregation[i].value;
			break;
		}
	}
	filters[5]=freq;
	if (freq=="monthly") {
		getdatax(date1,date2);
	}
	else if (freq=="quaterly") {
		getQuaters(date1,date2);
	}
	else if (freq=="yearly") {
		getYears(date1,date2);
	}
}

function sampleYparamInitialize(){
	//initialization of variables
	for(var i=0;i<sampleUserFil.length;i++)
	{
		noofSamples[i]=0;
		sizeofSamples[i]=0;
		sample1tags[i]=[];
	}

	for(var i=0;i<datax.length;i++)
	{
		sampleonTime[i]=0;
		sampleSizeonTime[i]=0;
		sample2tags[i]=[];
	}

	for(var i=0;i<orgaFil.length;i++)
	{
		organismNumber[i]=0;
		organismSize[i]=0;
		sample3tags[i]=[];
	}
}



function calculationForSmapleStats(){
	datax=[];noofSamples=[];sampleonTime=[];sizeofSamples=[];sampleSizeonTime=[];organismNumber=[];organismSize=[];sampleUserFil=[];orgaFil=[];sample1tags=[];sample2tags=[];sample3tags=[];filters=[];
	//this hides loading gif
	//document.getElementsByClassName('loadingDiv')[0].style.display="none";

	//for getting time range
	var dates=applyTimeRange();
	date1=dates[0];
	date2=dates[1];	

	//applyFilter() gets filter details into respective variable(array)
	applyFilter();

	//initialization of variables
	sampleXparamInitialize();
	sampleYparamInitialize();
	

	//parsing through sample's json data
	for(var i=0;i<json[1].length;i++)
	{
		var date=json[1][i]["CreationTime"];
		date=date.split(' ');
		date=[date[0],date[1],date[2],date[3],date[5]];
		date=date.join(' ');
		date=new Date(date);
		var day=date.getDate();
		var month=date.getMonth()+1;
		var year=date.getFullYear();
		var inRange=checkTimeRange(day+"/"+month+"/"+year,date1,date2);
		if (sampleUserFil.indexOf(json[1][i]["Owner"])!=-1 && orgaFil.indexOf(json[1][i]["Organism"])!=-1 && inRange) {

			//for no.of sample vs user plot and size of sample vs user plot
			var index=sampleUserFil.indexOf(json[1][i]["Owner"]);
			if (index!=-1) {
				noofSamples[index]++;
				sizeofSamples[index]+=json[1][i]["Size"];
				sample1tags[index][sample1tags[index].length]=i;
			}

			//for no.of sample vs time plot and size of sample vs time plot
			if (freq=="monthly") {
				var checkAgg=parseInt(month)+"/"+year;
			}
			else if (freq=="quaterly") {
				var quater;
				if (month<=3) {
					quater='Q1';
				}
				else if (month>=4 && month<=6) {
					quater='Q2';
				}
				else if (month>=7 && month<=9) {
					quater='Q3';	
				}
				else if (month>=10 && month<=12) {
					quater='Q4';	
				}
				var checkAgg=quater+"_"+year;
			}
			else if (freq=="yearly") {
				var checkAgg=year.toString();
			}

			index=datax.indexOf(checkAgg);
			if (index!=-1) {
				sampleonTime[index]++;
				sampleSizeonTime[index]+=json[1][i]["Size"];
				sample2tags[index][sample2tags[index].length]=i;
			}

			//for relative json[1] no. and sample size plot on organisms
			var index=orgaFil.indexOf(json[1][i]["Organism"]);
			if (index!=-1) {
				organismNumber[index]++;
				organismSize[index]+=json[1][i]["Size"];
				sample3tags[index][sample3tags[index].length]=i;
			}

			sampleFilerDetails();

		}

	}
}


function getSampleStatPlot(xdata,ydata,plotTags,graphType,xlabel,plotParam){
	dataset=[];labels=xdata;yAxes=[];xAxes=[];options={},footer=null;tooltips={}; 
	backgroundColor=[];borderColor=[];pointBackgroundColor=[];pointBorderColor=[];
	var keepTooltip=plotParam.split(' ');
	keepTooltip=keepTooltip[0];
	if (keepTooltip=="Size") {
		footer=function(tooltipItems, data) {
                	var dataIndex=tooltipItems[0].datasetIndex
                	var noofjobs=tooltipItems[0].index;
                	return 'No. of Samples. : '+plotTags[noofjobs].length;
                };

        tooltips={
            mode: 'point',
            callbacks: {
                // Use the footer callback to display the sum of the items showing in the tooltip
                footer: footer,
            },
            footerFontStyle: 'normal'
        };
	}
	if (graphType=="bar" || graphType=="line") {
		color=colors[0];
		backgroundColor=color;
		borderColor=color;
		pointBackgroundColor=color;
		pointBorderColor=color;
		dataset=[{
			label: plotParam, 
	        data: ydata,
	        backgroundColor:backgroundColor,
	        borderColor:borderColor,
	        pointBackgroundColor:pointBackgroundColor,
	        pointBorderColor:pointBorderColor,
	        //pointRadius:0,
	        tension:0,
	        borderWidth: 3,
	        fill: false
		}];
		yAxes=[{
			scaleLabel: {
		       display: true,
		       labelString: plotParam
		    },
		    ticks: {
			   beginAtZero:true
			}
		}];
		xAxes=[{
			scaleLabel: {
		       display: true,
		       labelString: xlabel
		    }
		}];
		
		//var noofjobs=[];
		options= {
	    	scales:{
	    		yAxes:yAxes,
	    		xAxes:xAxes
	    	},
	    	tooltips: tooltips
	    	// pan:{
	    	// 	enabled:true,
	    	// 	mode: 'xy'
	    	// },
	    	// zoom:{
	    	// 	enabled:true,
	    	// 	mode:'xy'
	    	// }
	    };
	}
	else if (graphType=='pie') {
		var totalSamples = 0;
		for(var i=0;i<ydata.length;i++){
			totalSamples+=ydata[i];
		}
		footer=function(tooltipItems, data) {
                    	var dataIndex=tooltipItems[0].index;
                    	var percentJobs = ((ydata[dataIndex]/totalSamples)*100).toFixed(2);
                    	return percentJobs + "% of Jobs";
                    };

        options= {
	    	tooltips: {
                mode: 'index',
                callbacks: {
                    // Use the footer callback to display the sum of the items showing in the tooltip
                    footer: footer,
                },
                footerFontStyle: 'normal'
            }
	    	// pan:{
	    	// 	enabled:true,
	    	// 	mode: 'xy'
	    	// },
	    	// zoom:{
	    	// 	enabled:true,
	    	// 	mode:'xy'
	    	// }
	    };
		for(var i=0;i<xdata.length;i++){
			backgroundColor[i]=colors[i];
			borderColor[i]=colors[i];
		}
		dataset=[{
			label: plotParam, 
	        data: ydata,
	        backgroundColor:backgroundColor,
	        borderColor:borderColor,
	        borderWidth: 3
		}];
	}
}

$(document).ready(function(){

	//implementation of enlarged plots
	$('#plot9Parent').click(function(){
		myChart[15].destroy();
		getSampleStatPlot(sampleUserFil,noofSamples,sample1tags,"bar",xparamLabel["user"],yparamLabel["usernoSample"]);
		plotonCanvas(15,"bar","hoverChart2");
		$("#hoverPlotParent2").css("width","100%").css("height","100%").css("margin","0 auto");
		$(".hoverParent").fadeIn("slow");
		$(".hoverClose").fadeIn("slow");
		$(".hoverMain").fadeIn("slow");
	});

	$('#plot10Parent').click(function(){
		myChart[15].destroy();
		getSampleStatPlot(sampleUserFil,sizeofSamples,sample1tags,"bar",xparamLabel["user"],yparamLabel["userszSample"]);
		plotonCanvas(15,"bar","hoverChart2");
		$("#hoverPlotParent2").css("width","100%").css("height","100%").css("margin","0 auto");
		$(".hoverParent").fadeIn("slow");
		$(".hoverClose").fadeIn("slow");
		$(".hoverMain").fadeIn("slow");
	});

	$('#plot11Parent').click(function(){
		myChart[15].destroy();
		getSampleStatPlot(datax,sampleonTime,sample2tags,"line",xparamLabel["time"],yparamLabel["monthnoSample"]);
		plotonCanvas(15,"line","hoverChart2");
		$("#hoverPlotParent2").css("width","100%").css("height","100%").css("margin","0 auto");
		$(".hoverParent").fadeIn("slow");
		$(".hoverClose").fadeIn("slow");
		$(".hoverMain").fadeIn("slow");
	});

	$('#plot12Parent').click(function(){
		myChart[15].destroy();
		getSampleStatPlot(datax,sampleSizeonTime,sample2tags,"line",xparamLabel["time"],yparamLabel["monthszSample"]);
		plotonCanvas(15,"line","hoverChart2");
		$("#hoverPlotParent2").css("width","100%").css("height","100%").css("margin","0 auto");
		$(".hoverParent").fadeIn("slow");
		$(".hoverClose").fadeIn("slow");
		$(".hoverMain").fadeIn("slow");
	});

	$('#plot13Parent').click(function(){
		myChart[15].destroy();
		getSampleStatPlot(orgaFil,organismNumber,sample3tags,"pie","",yparamLabel["relativeSampleNo"]);
		plotonCanvas(15,"pie","hoverChart2");
		$("#hoverPlotParent2").css("width","50%").css("height","100%").css("margin","0 auto");
		$(".hoverParent").fadeIn("slow");
		$(".hoverClose").fadeIn("slow");
		$(".hoverMain").fadeIn("slow");
	});

	$('#plot14Parent').click(function(){
		myChart[15].destroy();
		getSampleStatPlot(orgaFil,organismSize,sample3tags,"pie","",yparamLabel['relativeSampleSize']);
		plotonCanvas(15,"pie","hoverChart2");
		$("#hoverPlotParent2").css("width","50%").css("height","100%").css("margin","0 auto");
		$(".hoverParent").fadeIn("slow");
		$(".hoverClose").fadeIn("slow");
		$(".hoverMain").fadeIn("slow");
	});

	//implementation of showing details of particular point
	document.getElementById("hoverChart2").onclick = function(evt) {
    var activePoints = myChart[15].getElementAtEvent(evt);
    var firstPoint = activePoints[0];
    if(firstPoint!=undefined)
    {
    	$(".loadingDiv").css("height","100%").css("width","100%").css("z-index","5").css("top","0").css("backgroundColor","rgba(255,255,255,0.8)");
	    $(".loadingDiv").fadeIn("slow",function(){
	    	 $(".dethoverParent").fadeIn("slow",function(){
	    	 	$(".detailDiv").fadeIn("slow",function(){
	    	 		$(".dethoverClose").fadeIn("slow",function(){
	    	 			$(".loadingDiv").fadeOut("slow");
	    	 		});
	    	 	});
	    	 });
	    });
    	var graphLabel=firstPoint["_chart"]["config"]["data"]["datasets"][firstPoint["_datasetIndex"]]["label"];
	    var indextoTake=firstPoint["_index"];

	    if (graphLabel==yparamLabel["usernoSample"]) {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML=yparamLabel["usernoSample"];
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + sampleUserFil[firstPoint['_index']];
	    	document.getElementsByClassName('pointDetail')[1].innerHTML="Showing " + sample1tags[indextoTake].length + " Records";
	    	getSamplePointDetails(sample1tags[indextoTake]);
	    }
	    else if (graphLabel==yparamLabel["userszSample"]) {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML=yparamLabel["userszSample"];
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + sampleUserFil[firstPoint['_index']];
	    	document.getElementsByClassName('pointDetail')[1].innerHTML="Showing " + sample1tags[indextoTake].length + " Records";
	    	getSamplePointDetails(sample1tags[indextoTake]);
	    }
	    else if (graphLabel==yparamLabel["monthnoSample"]) {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML=yparamLabel["monthnoSample"];
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + datax[firstPoint['_index']];
	    	document.getElementsByClassName('pointDetail')[1].innerHTML="Showing " + sample2tags[indextoTake].length + " Records";
	    	getSamplePointDetails(sample2tags[indextoTake]);
	    }
	    else if (graphLabel==yparamLabel["monthszSample"]) {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML=yparamLabel["monthszSample"];
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + datax[firstPoint['_index']];
	    	document.getElementsByClassName('pointDetail')[1].innerHTML="Showing " + sample2tags[indextoTake].length + " Records";
	    	getSamplePointDetails(sample2tags[indextoTake]);
	    }
	    else if (graphLabel==yparamLabel["relativeSampleNo"]) {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML=yparamLabel["relativeSampleNo"];
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + orgaFil[firstPoint['_index']];
	    	document.getElementsByClassName('pointDetail')[1].innerHTML="Showing " + sample3tags[indextoTake].length + " Records";
	    	getSamplePointDetails(sample3tags[indextoTake]);
	    }
	    else if (graphLabel==yparamLabel['relativeSampleSize']) {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML=yparamLabel['relativeSampleSize'];
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + orgaFil[firstPoint['_index']];
	    	document.getElementsByClassName('pointDetail')[1].innerHTML="Showing " + sample3tags[indextoTake].length + " Records";
	    	getSamplePointDetails(sample3tags[indextoTake]);
	    }
	}
	};
});

//this function collects data for showing details table and stores it in specific variable
function getSamplePointDetails(taskids){
	detailJson=[];detailJsonNew=[];ind=0;counts=0;previously='';
	var detailTable=document.getElementsByClassName('detailTable')[0];
	var detailTableBody=document.getElementsByClassName('detailTableBody')[0];
	var tbody=document.createElement('tbody');
	tbody.setAttribute('class','detailTableBody');
	for(var i=0;i<taskids.length;i++)
	{

		var date = json[1][taskids[i]]["CreationTime"];
		date=date.split(' ');
		date=[date[0],date[1],date[2],date[3],date[5]];
		date=date.join(' ');
		date=new Date(date);
		var dateToHold=date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
		detailJson[i]={
				"owner":json[1][taskids[i]]["Owner"],
				"name":json[1][taskids[i]]["Name"],
				"createTime":dateToHold,
				"createObj":date,
				"size":json[1][taskids[i]]["Size"],
				"organism":json[1][taskids[i]]["Organism"],
				"libLayout":json[1][taskids[i]]["Library Layout"],
				"platform":json[1][taskids[i]]["Platform"],
				"build":json[1][taskids[i]]["Build"]
			};

		detailJsonNew[i]={
				"owner":json[1][taskids[i]]["Owner"],
				"name":json[1][taskids[i]]["Name"],
				"createTime":dateToHold,
				"createObj":date,
				"size":json[1][taskids[i]]["Size"],
				"organism":json[1][taskids[i]]["Organism"],
				"libLayout":json[1][taskids[i]]["Library Layout"],
				"platform":json[1][taskids[i]]["Platform"],
				"build":json[1][taskids[i]]["Build"]
			};
	}
	printSampleDetailTable(detailJson);
}

//this function prints calculated detailed data in table format
function printSampleDetailTable(jobs){
	var detailTable=document.getElementsByClassName('detailTable')[1];
	var detailTableBody=document.getElementsByClassName('detailTableBody')[1];
	var tbody=document.createElement('tbody');
	tbody.setAttribute('class','detailTableBody');
	for(var i=0;i<jobs.length;i++)
	{
		var tr=document.createElement('tr');
		var td=document.createElement('td');
		td.setAttribute("title","Owner");
		td.innerHTML=jobs[i]["owner"];
		tr.appendChild(td);

		td=document.createElement('td');
		td.setAttribute("title","Name");
		td.innerHTML=jobs[i]["name"];
		tr.appendChild(td);

		td=document.createElement('td');
		td.setAttribute("title","Creation Time");
		td.innerHTML=jobs[i]["createTime"];
		tr.appendChild(td);

		td=document.createElement('td');
		td.setAttribute("title","Size(MB)");
		td.innerHTML=jobs[i]["size"];
		tr.appendChild(td);

		td=document.createElement('td');
		td.setAttribute("title","Organism");
		td.innerHTML=jobs[i]["organism"];
		tr.appendChild(td);

		td=document.createElement('td');
		td.setAttribute("title","Library Layout");
		td.innerHTML=jobs[i]["libLayout"];
		tr.appendChild(td);

		td=document.createElement('td');
		td.setAttribute("title","Platform");
		td.innerHTML=jobs[i]["platform"];
		tr.appendChild(td);

		td=document.createElement('td');
		td.setAttribute("title","Build");
		td.innerHTML=jobs[i]["build"];
		tr.appendChild(td);

		tbody.appendChild(tr)
	}
	detailTable.replaceChild(tbody,detailTableBody);
}

//implementation of sorting
var counts=0,previously='';
function sortSampleDetails(param){
	if (param=='size'	) {
		detailJsonNew.sort(function(a,b){
			return a[param] - b[param];
		});
	}
	else if (param=='owner' || param=='name' || param=='organism' || param=='libLayout' || param=='platform' || param=='build') {
		detailJsonNew.sort(function(a,b){
			return (a[param]).localeCompare(b[param]);
		});
	}
	else if (param=='createObj') {
		detailJsonNew.sort(function(a,b){
			if (a[param]<b[param]) {
				return -1;
			}
			else if (a[param]>b[param]) {
				return 1;
			}
			else{
				return 0;
			}
		});
	}
	var caretOld=document.getElementById('caret');
	if (caretOld!=null) {
		caretOld.parentNode.removeChild(caretOld);
	}
	if (previously!=param) {
		counts=0;
		previously=param;
	}
	if (counts%3==0) {
		var caret=document.createElement('i');
		caret.setAttribute('class','fa fa-caret-up');
		caret.setAttribute('id','caret');
		printSampleDetailTable(detailJsonNew);
		var sortParent=document.getElementsByClassName(param)[0];
		sortParent.appendChild(caret);
		counts++;	
	}
	else if (counts%3==1) {
		var caret=document.createElement('i');
		caret.setAttribute('class','fa fa-caret-down');
		caret.setAttribute('id','caret');
		printSampleDetailTable(detailJsonNew.reverse());
		var sortParent=document.getElementsByClassName(param)[0];
		sortParent.appendChild(caret);
		counts++;
	}
	else if (counts%3==2) {
		printSampleDetailTable(detailJson);
		counts++;
	}
	
	
}

//shows details of which filters are applied for current plots
function sampleFilerDetails(){
	var filterDetail="Showing <strong class=\"strongDetail\">"+filters[5]+"</strong> Sample plots from <strong class=\"strongDetail\">"+filters[0][0]+"</strong> to <strong class=\"strongDetail\">"+filters[0][1]+"</strong>";
	filterDetail+=" for <br>Users : ";
	for(var i=0;i<filters[6].length;i++)
	{
		var str=" <strong class=\"strongDetail\">["+filters[6][i]+"]</strong>";
		filterDetail+=str;
	}
	filterDetail+=" and <br>Organisms : "
	for(var i=0;i<filters[7].length;i++)
	{
		var str=" <strong class=\"strongDetail\">["+filters[7][i]+"]</strong>";
		filterDetail+=str;
	}
	document.getElementById('sampleFilterDetailpara').innerHTML=filterDetail;
}