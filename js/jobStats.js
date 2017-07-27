//XML http request
var json="";
function xmlReq(){
	var data = null;

	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
	  if (this.readyState === 4) {
	    json=this.responseText;
	    if (this.status==401) {
	    	window.location=redirectUrls["login"];
	    }
	    else if(json=='[]'){
	 		document.getElementsByClassName('loadingDiv')[0].style.display="none";
	    	document.getElementsByClassName('emptyResponse')[0].style.display="block";
	    	document.getElementsByClassName('emptyBack')[0].style.display="block";
	    }
	  	else{
	  		json=JSON.parse(json);
	  		getLoggedUser();
	    	selectJobUser();
	  	}
	  }
	});

	xhr.open("GET", restUrls["jobStats"]);

	xhr.send(data);
}

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
	getMultiPlot(datax,totalTime,plot6tags,"line",yparamLabel["totalHours"],"Time",userFil);
	plotonCanvas(5,"line","myChart6");
	getJobStatPlot(waitforAnalysis0,cummWait,plot7tags,"bar",xparamLabel["waitMins"],"% of Jobs");
	plotonCanvas(6,"bar","myChart7");
	getJobStatPlot(waitforAnalysis,cummWaitVal,plot8tags,"line",xparamLabel["waitMins"],"% of Jobs (c)");
	plotonCanvas(7,"line","myChart8");

	//this plot is initially plotted for enlarged graph
	getJobStatPlot(datax,waitTime,plot1tags,"line","Time",yparamLabel["waitHours"]);
	plotonCanvas(8,"line","hoverChart");

}


//this function updates data and then plots it on changing filters
function plotJobs(){

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
	//myChart[2].options.tooltips.callbacks.footer=footer;
	myChart[2].update();
	getJobStatPlot(statusDatax,statusData,plot4tags,"pie","","Status");
	myChart[3].data.datasets=dataset;
	myChart[3].data.labels=labels;
	//myChart[3].options.tooltips.callbacks.footer=footer;
	myChart[3].update();
	getJobStatPlot(userDatax,userData,plot5tags,"bar",xparamLabel["user"],yparamLabel["totalHours"]);
	myChart[4].data.datasets=dataset;
	myChart[4].data.labels=labels;
	myChart[4].options.tooltips.callbacks.footer=footer;
	myChart[4].update();
	getMultiPlot(datax,totalTime,plot6tags,"line",yparamLabel["totalHours"],xparamLabel["time"],userFil);
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
	userDatax=userFil;
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
	for(var i=0;i<userFil.length;i++)
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
	for(var i=0;i<userFil.length;i++)
	{
		userData[i]=0;
		plot5tags[i]=[];
	}
}

//implementation for collecting data for all plots

//declaration of required variables
var myChart=[],date1,date2,freq,cnodeFil=[],contextFil=[],statusFil=[],userFil=[],filters=[],datax=[],statusDatax=[],contextDatax=[],userDatax=[],waitTime=[],exeTime=[],statusData=[],contextData=[],userData=[],totalTime=[],cummWait=[],waitforAnalysis=[],waitforAnalysis0=[],cummWaitVal=[];
//declaration of vars for displaying details
var plot1tags=[],plot2tags=[],plot3tags=[],plot4tags=[],plot5tags=[],plot6tags=[],plot7tags=[],plot8tags=[];
function calculationForJobStats(){
	cnodeFil=[];contextFil=[];statusFil=[];userFil=[];filters=[];datax=[];statusDatax=[];contextDatax=[];userDatax=[];waitTime=[];exeTime=[];statusData=[];contextData=[];userData=[];totalTime=[];cummWait=[];waitforAnalysis=[];cummWaitVal=[];plot1tags=[];plot2tags=[];plot3tags=[];plot4tags=[];plot5tags=[];plot6tags=[];plot7tags=[];plot8tags=[];
	//this hides loading gif
	document.getElementsByClassName('loadingDiv')[0].style.display="none";

	//for getting time range
	var dates=applyTimeRange();
	date1=dates[0];
	date2=dates[1];

	//applyJobFilter() gets filter details into respective variable(array)
	applyJobFilter();

	//initialization of all vars
	jobXparamInitialize();
	jobYparamInitialze();

	//parsing json
	for(var i=0;i<json.length;i++)
	{
		//checking filters
		if (statusFil.indexOf(json[i]["Status"])!=-1 && contextFil.indexOf(json[i]["Context"])!=-1 && userFil.indexOf(json[i]["Owner"])!=-1 && cnodeFil.indexOf(json[i]["WorkerIP"])!=-1) {
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
		}
	}
	//some remaining calculation of last two plots
	calforHistogram();
	//make all values fix to 2 decimal values
	toTwoDecimalPlaces();
	//show filter details at top
	filerDetails();
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
			plot1tags[index][plot1tags[index].length]=json[i]["TaskID"];
			if (inmins<=60) {
				cummWait[Math.ceil(inmins/5)-1]++;
				plot7tags[Math.ceil(inmins/5)-1][plot7tags[Math.ceil(inmins/5)-1].length]=json[i]["TaskID"];
			}
			else{
				cummWait[12]++;
				plot7tags[12][plot7tags[12].length]=json[i]["TaskID"];
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
			if (index!=-1 && json[i]["WorkerIP"]==cnodeFil[k]) {
					exeTime[k][index]+=result;
					plot2tags[k][index][plot2tags[k][index].length]=json[i]["TaskID"];
					break;
			}		
		}
	}
}

function calforTotalTime(i){
	for(var k=0;k<userFil.length;k++)
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
			if (index!=-1 && json[i]["Owner"]==userFil[k]) {
					totalTime[k][index]+=result;
					plot6tags[k][index][plot6tags[k][index].length]=json[i]["TaskID"];
					break;
			}
		}
	}
}

function calforStatus(i){
	var date=new Date(parseInt(json[i]["EndTime"]));
	if (json[i]["Status"]=="Terminated" || json[i]["Status"]=="Deleted") {
		var date=new Date(parseInt(json[i]["SubmissionTime"]));
	}
	var day=date.getDate();
	var month=date.getMonth()+1;
	var year=date.getFullYear();
	var inRange=checkTimeRange(day+"/"+month+"/"+year,date1,date2);
	if (inRange) {
			statusData[statusFil.indexOf(json[i]["Status"])]++;
			plot4tags[statusFil.indexOf(json[i]["Status"])][plot4tags[statusFil.indexOf(json[i]["Status"])].length]=json[i]["TaskID"];
	}
}

function calforContext(i){
	var date=new Date(parseInt(json[i]["EndTime"]));
	if (json[i]["Status"]=="Terminated" || json[i]["Status"]=="Deleted") {
		var date=new Date(parseInt(json[i]["SubmissionTime"]));
	}
	var day=date.getDate();
	var month=date.getMonth()+1;
	var year=date.getFullYear();
	var inRange=checkTimeRange(day+"/"+month+"/"+year,date1,date2);
	if (inRange) {
		contextData[contextFil.indexOf(json[i]["Context"])]++;
		plot3tags[contextFil.indexOf(json[i]["Context"])][plot3tags[contextFil.indexOf(json[i]["Context"])].length]=json[i]["TaskID"];
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
		userData[userFil.indexOf(json[i]["Owner"])]+=result;
		plot5tags[userFil.indexOf(json[i]["Owner"])][plot5tags[userFil.indexOf(json[i]["Owner"])].length]=json[i]["TaskID"];
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
		for(var k=0;k<userFil.length;k++)
		{
			totalTime[k][j]=totalTime[k][j].toFixed(2);
		}
	}
	for(var j=0;j<userFil.length;j++)
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

	d1=new Date(parseInt(json[i][ept1]));
	d2=new Date(parseInt(json[i][ept2]));
	result=(d2-d1)/(60*1000*60);
	if (result<0) {
		result=NaN;
	}
	return [result,d2.getFullYear(),d2.getMonth()+1,d2.getDate()];
}

//function for applying selected filters
function applyJobFilter(){
	contextFil=[];statusFil=[];userFil=[];cnodeFil=[];
	var context=document.getElementsByName('context');
	var status=document.getElementsByName('status');
	var users=document.getElementsByName('user');
	var cnodes=document.getElementsByName('cnodes');
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
	for(var i=0;i<users.length;i++)
	{
		if (users[i].checked) {
			userFil[j]=users[i].value;
			j++;
		}
	}
	j=0;
	filters[3]=userFil;
	for(var i=0;i<cnodes.length;i++)
	{
		if (cnodes[i].checked) {
			cnodeFil[j]=cnodes[i].value;
			j++;
		}
	}
	filters[4]=cnodeFil;
}

//this function stores collected data into variables required for chart.js library
var dataset=[],labels=[],yAxes=[],xAxes=[],options={},footer=null;
var backgroundColor=[],borderColor=[],pointBackgroundColor=[],pointBorderColor=[];
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
	else if (plotParam=="Context") {
		backgroundColor=['rgba(33,150,243,0.7)','rgba(233,30,99,0.7)'];
		borderColor=['rgba(33,150,243,1)','rgba(233,30,99,1)'];
		dataset=[{
			label: plotParam, 
	        data: ydata,
	        backgroundColor:backgroundColor,
	        borderColor:borderColor,
	        borderWidth: 3
		}];
	}
	else if (plotParam=="Status") 	{
		backgroundColor=['rgba(33,150,243,0.7)','rgba(233,30,99,0.7)','rgba(63,81,181,0.7)','rgba(255,87,34,0.7)'];
		borderColor=['rgba(33,150,243,1)','rgba(233,30,99,1)','rgba(63,81,181,1)','rgba(255,87,34,1)'];
		var providebgColor=[],providebrColor=[];
		for(var i=0;i<statusFil.length;i++)
		{
			providebgColor[i]=backgroundColor[i];
			providebrColor[i]=borderColor[i];
		}
		dataset=[{
			label: plotParam, 
	        data: ydata,
	        backgroundColor:providebgColor,
	        borderColor:providebrColor,
	        borderWidth: 3
		}];
	}
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
function filerDetails(){
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
	document.getElementById('filterDetailpara').innerHTML=filterDetail;
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
		getMultiPlot(datax,totalTime,plot6tags,"line",yparamLabel["totalHours"],xparamLabel["time"],userFil);
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
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + datax[firstPoint['_index']];
	    	getDetails(plot1tags[indextoTake]);
	    }
	    else if(cnodeFil.indexOf(graphLabel)!=-1){
	    	document.getElementsByClassName('detailTitle')[0].innerHTML="Compute Node Usage";
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + datax[firstPoint['_index']]+ " of "+cnodeFil[firstPoint['_datasetIndex']] + " Compute Node";
	    	getDetails(plot2tags[cnodeFil.indexOf(graphLabel)][indextoTake]);
	    }
	    else if (graphLabel=="Context") {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML="Context Plot";
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + contextDatax[firstPoint['_index']];
	    	getDetails(plot3tags[indextoTake]);
	    }
	    else if (graphLabel=="Status") {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML="Status Plot";
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + statusDatax[firstPoint['_index']];
	    	getDetails(plot4tags[indextoTake]);	
	    }
	    else if (graphLabel==yparamLabel["totalHours"]) {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML="Compute Usage by Users";
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + userDatax[firstPoint['_index']];
	    	getDetails(plot5tags[indextoTake]);	
	    }
	    else if(userFil.indexOf(graphLabel)!=-1){
	    	document.getElementsByClassName('detailTitle')[0].innerHTML="Total Time of Job for Different Users";
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + datax[firstPoint['_index']] + " of "+userFil[firstPoint['_datasetIndex']] + " User";
	    	getDetails(plot6tags[userFil.indexOf(graphLabel)][indextoTake]);
	    }
	    else if (graphLabel=="% of Jobs") {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML="Wait Time Histogram";
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + waitforAnalysis0[firstPoint['_index']] +" mins.";
	    	getDetails(plot7tags[indextoTake]);	
	    }
	    else if (graphLabel=="% of Jobs (c)") {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML="Cummulative Wait time plot";
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + waitforAnalysis[firstPoint['_index']];
	    	getDetails(plot8tags[indextoTake]);	
	    }
	} 
	    
  	};
});

//below given function stores data required for showing details
var detailJson=[],detailJsonNew=[],ind=0;
function getDetails(taskids){
	detailJson=[];detailJsonNew=[];ind=0;counts=0;previously='';
	for(var i=0;i<json.length;i++)
	{

		if(taskids.indexOf(json[i]["TaskID"])!=-1)
		{
			var date=new Date(parseInt(json[i]["SubmissionTime"]));
			var waitresult=getData(i,"wait");
			waitresult=(waitresult[0]*60).toFixed(2);
			var exeresult=getData(i,"exe");
			exeresult=(exeresult[0]*60).toFixed(2);
			if (isNaN(exeresult)) {
				exeresult="-";
			}			
			detailJson[ind]={
				'TaskID':json[i]['TaskID'],
				'TaskName':json[i]['TaskName'],
				'Owner':json[i]['Owner'],
				'Context':json[i]['Context'],
				'SubTimeinms':json[i]['SubmissionTime'],
				'SubmissionTime':date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+" "+(date.getHours()+1)+":"+(date.getMinutes()+1)+":"+(date.getSeconds()+1),
				'WorkerIP':json[i]['WorkerIP'],
				'WaitTime':waitresult,
				'ExeTime':exeresult,
				'Status':json[i]['Status']

			};
			detailJsonNew[ind]={
				'TaskID':json[i]['TaskID'],
				'TaskName':json[i]['TaskName'],
				'Owner':json[i]['Owner'],
				'Context':json[i]['Context'],
				'SubTimeinms':json[i]['SubmissionTime'],
				'SubmissionTime':date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+" "+(date.getHours()+1)+":"+(date.getMinutes()+1)+":"+(date.getSeconds()+1),
				'WorkerIP':json[i]['WorkerIP'],
				'WaitTime':waitresult,
				'ExeTime':exeresult,
				'Status':json[i]['Status']

			};
			ind++;
		}
	}
	console.log(detailJson);
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

//this function get names of all user and compute node ip's from json data and creates checkbox list in filter panel
function selectJobUser() {
	var parent=document.getElementsByClassName('userFil')[0];
	var users=[],cnodeIp=[];
	var j=0,k=0;
	for(var i=0;i<json.length;i++)
	{
		if (users.indexOf(json[i]["Owner"])==-1 && json[i]["WorkerIP"]!=null) {
			users[j]=json[i]["Owner"];
			j++;
		}

		if (cnodeIp.indexOf(json[i]["WorkerIP"])==-1 && json[i]["WorkerIP"]!=null) {
			cnodeIp[k]=json[i]["WorkerIP"];
			k++;
		}
		switch(json[i]["Status"])
		{
			case 1001 : json[i]["Status"]="Successful";
						break;
			case 1000 : json[i]["Status"]="Failed";
						break;
			case 1002 : json[i]["Status"]="Terminated";
						break;
			case 601 : json[i]["Status"]="Deleted";
		}
	}
	for(var i=0;i<users.length;i++)
	{
		var input=document.createElement("input");
		var label=document.createElement("label");
		input.setAttribute("type","checkbox");
		input.setAttribute("checked","true");
		input.setAttribute("value",users[i]);
		input.setAttribute("name","user");
		input.setAttribute("onchange","plotJobs()");
		label.appendChild(input);
		text=users[i];
		var t=document.createTextNode(text);
		var br=document.createElement("br");
		label.appendChild(t);
		parent.appendChild(label);
	}
	parent=document.getElementsByClassName('cnodeFil')[0];
	for(var i=0;i<cnodeIp.length;i++)
	{
		var input=document.createElement("input");
		var label=document.createElement("label");
		input.setAttribute("type","checkbox");
		input.setAttribute("checked","true");
		input.setAttribute("value",cnodeIp[i]);
		input.setAttribute("name","cnodes");
		input.setAttribute("onchange","plotJobs()");
		label.appendChild(input);
		text=cnodeIp[i];
		var t=document.createTextNode(text);
		var br=document.createElement("br");
		label.appendChild(t);
		parent.appendChild(label);
	}
	createJobPlots();
}

//that's all jobStats js code ends here 