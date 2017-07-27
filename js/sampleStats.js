// XML http request
var samples="";	
function sampleReq(){
	var data = null;

	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
	  if (this.readyState === 4) {
	  	samples=this.responseText;
	  	if (this.status==401) {
	  		window.location=redirectUrls["login"];
	  	}
	  	else if(samples==''){
	 		document.getElementsByClassName('loadingDiv')[0].style.display="none";
	    	document.getElementsByClassName('emptyResponse')[0].style.display="block";
	    	document.getElementsByClassName('emptyBack')[0].style.display="block";
	    }
	  	else{
	  		samples=JSON.parse(samples);
	  		getLoggedUser();
	    	selectSamplesUser();
	  	}
	  }
	});

	xhr.open("GET", restUrls["sampleStats"]);
	xhr.setRequestHeader("content-type", "application/json");
	xhr.send(data);
}

//primary fuction for caculating data required for all plots and then plotting it
function createSamplePlots(){
	//this function calculates all data required for all plots
	calculationForSmapleStats();
	//below given code plots all graphs
	getSampleStatPlot(userFil,noofSamples,sample1tags,"bar",xparamLabel["user"],yparamLabel["usernoSample"]);
	plotonCanvas(0,"bar","myChart9");
	getSampleStatPlot(userFil,sizeofSamples,sample1tags,"bar",xparamLabel["user"],yparamLabel["userszSample"]);
	plotonCanvas(1,"bar","myChart10");
	getSampleStatPlot(datax,sampleonTime,sample2tags,"line",xparamLabel["time"],yparamLabel["monthnoSample"]);
	plotonCanvas(2,"line","myChart11");
	getSampleStatPlot(datax,sampleSizeonTime,sample2tags,"line",xparamLabel["time"],yparamLabel["monthszSample"]);
	plotonCanvas(3,"line","myChart12");
	getSampleStatPlot(orgaFil,organismNumber,sample3tags,"pie","",yparamLabel["relativeSampleNo"]);
	plotonCanvas(4,"pie","myChart13");
	getSampleStatPlot(orgaFil,organismSize,sample3tags,"pie","",yparamLabel['relativeSampleSize']);
	plotonCanvas(5,"pie","myChart14");
	//this plot is initially plotted for enlarged graph
	getSampleStatPlot(userFil,noofSamples,sample1tags,"bar",xparamLabel["user"],yparamLabel["usernoSample"]);
	plotonCanvas(6,"bar","hoverChart");
}

//this function updates data and then plots it on changing filters
function plotSamples(){
	//calculates data required for  all graphs
	calculationForSmapleStats();

	//updates all plots
	getSampleStatPlot(userFil,noofSamples,sample1tags,"bar",xparamLabel["user"],yparamLabel["usernoSample"]);
	myChart[0].data.datasets=dataset;
	myChart[0].data.labels=labels;
	myChart[0].update();

	getSampleStatPlot(userFil,sizeofSamples,sample1tags,"bar",xparamLabel["user"],yparamLabel["userszSample"]);
	myChart[1].data.datasets=dataset;
	myChart[1].data.labels=labels;
	myChart[1].update();

	getSampleStatPlot(datax,sampleonTime,sample2tags,"line",xparamLabel["time"],yparamLabel["monthnoSample"]);
	myChart[2].data.datasets=dataset;
	myChart[2].data.labels=labels;
	myChart[2].update();

	getSampleStatPlot(datax,sampleSizeonTime,sample2tags,"line",xparamLabel["time"],yparamLabel["monthszSample"]);
	myChart[3].data.datasets=dataset;
	myChart[3].data.labels=labels;
	myChart[3].update();

	getSampleStatPlot(orgaFil,organismNumber,sample3tags,"pie","",yparamLabel["relativeSampleNo"]);
	myChart[4].data.datasets=dataset;
	myChart[4].data.labels=labels;
	myChart[4].update();

	getSampleStatPlot(orgaFil,organismSize,sample3tags,"pie","",yparamLabel['relativeSampleSize']);
	myChart[5].data.datasets=dataset;
	myChart[5].data.labels=labels;
	myChart[5].update();
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
	filters[1]=freq;
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
	for(var i=0;i<userFil.length;i++)
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


//implementation for collecting data for all plots

//declaration of required variables
var myChart=[],datax=[],date1,date2,freq,noofSamples=[],sampleonTime=[],sizeofSamples=[],sampleSizeonTime=[],organismNumber=[],organismSize=[],userFil=[],orgaFil=[],sample1tags=[],sample2tags=[],sample3tags=[],filters=[];
function calculationForSmapleStats(){
	datax=[];noofSamples=[];sampleonTime=[];sizeofSamples=[];sampleSizeonTime=[];organismNumber=[];organismSize=[];userFil=[];orgaFil=[];sample1tags=[];sample2tags=[];sample3tags=[];filters=[];
	//this hides loading gif
	document.getElementsByClassName('loadingDiv')[0].style.display="none";

	//for getting time range
	var dates=applyTimeRange();
	date1=dates[0];
	date2=dates[1];	

	//applySampleFilter() gets filter details into respective variable(array)
	applySampleFilter();

	//initialization of variables
	sampleXparamInitialize();
	sampleYparamInitialize();
	

	//parsing through sample's json data
	for(var i=0;i<samples.length;i++)
	{
		var date=samples[i]["CreationTime"];
		date=date.split(' ');
		date=[date[0],date[1],date[2],date[3],date[5]];
		date=date.join(' ');
		date=new Date(date);
		var day=date.getDate();
		var month=date.getMonth()+1;
		var year=date.getFullYear();
		var inRange=checkTimeRange(day+"/"+month+"/"+year,date1,date2);
		if (userFil.indexOf(samples[i]["Owner"])!=-1 && orgaFil.indexOf(samples[i]["Organism"])!=-1 && inRange) {

			//for no.of sample vs user plot and size of sample vs user plot
			var index=userFil.indexOf(samples[i]["Owner"]);
			if (index!=-1) {
				noofSamples[index]++;
				sizeofSamples[index]+=samples[i]["Size"];
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
				sampleSizeonTime[index]+=samples[i]["Size"];
				sample2tags[index][sample2tags[index].length]=i;
			}

			//for relative samples no. and sample size plot on organisms
			var index=orgaFil.indexOf(samples[i]["Organism"]);
			if (index!=-1) {
				organismNumber[index]++;
				organismSize[index]+=samples[i]["Size"];
				sample3tags[index][sample3tags[index].length]=i;
			}


		}

	}
	filerDetails();
}

//function for applying selected filters
function applySampleFilter(){
	userFil=[],orgaFil=[];
	var users=document.getElementsByName('user');
	var organisms=document.getElementsByName('organism');
	var j=0;
	for(var i=0;i<users.length;i++)
	{
		if (users[i].checked) {
			userFil[j]=users[i].value;
			j++;
		}
	}
	filters[2]=userFil;
	var j=0;
	for(var i=0;i<organisms.length;i++)
	{
		if (organisms[i].checked) {
			orgaFil[j]=organisms[i].value;
			j++;
		}
	}
	filters[3]=orgaFil;
}

//this function stores collected data into variables required for chart.js library
var dataset=[],labels=[],yAxes=[],xAxes=[],options={},footer=null,tooltips={};
var backgroundColor=[],borderColor=[],pointBackgroundColor=[],pointBorderColor=[];
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
		options={tooltips: tooltips}
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
//this function get all users and organisms from sample's json data and creates checkbox list in filter panel
function selectSamplesUser() {
	var parent=document.getElementsByClassName('userFil')[0];
	var users=[],organisms=[];
	var j=0,k=0;
	for(var i=0;i<samples.length;i++)
	{
		if (users.indexOf(samples[i]["Owner"])==-1) {
			users[j]=samples[i]["Owner"];
			j++;
		}
		//console.log(samples[i]["Organism"]);
		if (samples[i]["Organism"]!==undefined) {
			if (organisms.indexOf(samples[i]["Organism"])==-1) {
			organisms[k]=samples[i]["Organism"];
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
		input.setAttribute("name","user");
		input.setAttribute("onchange","plotSamples()");
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
		input.setAttribute("onchange","plotSamples()");
		label.appendChild(input);
		text=organisms[i];
		var t=document.createTextNode(text);
		var br=document.createElement("br");
		label.appendChild(t);
		parent.appendChild(label);
	}
	createSamplePlots();
}

$(document).ready(function(){

	//implementation of enlarged plots
	$('#plot9Parent').click(function(){
		myChart[6].destroy();
		getSampleStatPlot(userFil,noofSamples,sample1tags,"bar",xparamLabel["user"],yparamLabel["usernoSample"]);
		plotonCanvas(6,"bar","hoverChart");
		$("#hoverPlotParent").css("width","100%").css("height","100%").css("margin","0 auto");
		$(".hoverParent").fadeIn("slow");
		$(".hoverClose").fadeIn("slow");
		$(".hoverMain").fadeIn("slow");
	});

	$('#plot10Parent').click(function(){
		myChart[6].destroy();
		getSampleStatPlot(userFil,sizeofSamples,sample1tags,"bar",xparamLabel["user"],yparamLabel["userszSample"]);
		plotonCanvas(6,"bar","hoverChart");
		$("#hoverPlotParent").css("width","100%").css("height","100%").css("margin","0 auto");
		$(".hoverParent").fadeIn("slow");
		$(".hoverClose").fadeIn("slow");
		$(".hoverMain").fadeIn("slow");
	});

	$('#plot11Parent').click(function(){
		myChart[6].destroy();
		getSampleStatPlot(datax,sampleonTime,sample2tags,"line",xparamLabel["time"],yparamLabel["monthnoSample"]);
		plotonCanvas(6,"line","hoverChart");
		$("#hoverPlotParent").css("width","100%").css("height","100%").css("margin","0 auto");
		$(".hoverParent").fadeIn("slow");
		$(".hoverClose").fadeIn("slow");
		$(".hoverMain").fadeIn("slow");
	});

	$('#plot12Parent').click(function(){
		myChart[6].destroy();
		getSampleStatPlot(datax,sampleSizeonTime,sample2tags,"line",xparamLabel["time"],yparamLabel["monthszSample"]);
		plotonCanvas(6,"line","hoverChart");
		$("#hoverPlotParent").css("width","100%").css("height","100%").css("margin","0 auto");
		$(".hoverParent").fadeIn("slow");
		$(".hoverClose").fadeIn("slow");
		$(".hoverMain").fadeIn("slow");
	});

	$('#plot13Parent').click(function(){
		myChart[6].destroy();
		getSampleStatPlot(orgaFil,organismNumber,sample3tags,"pie","",yparamLabel["relativeSampleNo"]);
		plotonCanvas(6,"pie","hoverChart");
		$("#hoverPlotParent").css("width","50%").css("height","100%").css("margin","0 auto");
		$(".hoverParent").fadeIn("slow");
		$(".hoverClose").fadeIn("slow");
		$(".hoverMain").fadeIn("slow");
	});

	$('#plot14Parent').click(function(){
		myChart[6].destroy();
		getSampleStatPlot(orgaFil,organismSize,sample3tags,"pie","",yparamLabel['relativeSampleSize']);
		plotonCanvas(6,"pie","hoverChart");
		$("#hoverPlotParent").css("width","50%").css("height","100%").css("margin","0 auto");
		$(".hoverParent").fadeIn("slow");
		$(".hoverClose").fadeIn("slow");
		$(".hoverMain").fadeIn("slow");
	});

	//implementation of showing details of particular point
	document.getElementById("hoverChart").onclick = function(evt) {
    var activePoints = myChart[6].getElementAtEvent(evt);
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

	    console.log(firstPoint);
	    console.log(graphLabel);
	    if (graphLabel==yparamLabel["usernoSample"]) {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML=yparamLabel["usernoSample"];
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + userFil[firstPoint['_index']];
	    	document.getElementsByClassName('pointDetail')[1].innerHTML="Showing " + sample1tags[indextoTake].length + " Records";
	    	getDetails(sample1tags[indextoTake]);
	    }
	    else if (graphLabel==yparamLabel["userszSample"]) {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML=yparamLabel["userszSample"];
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + userFil[firstPoint['_index']];
	    	document.getElementsByClassName('pointDetail')[1].innerHTML="Showing " + sample1tags[indextoTake].length + " Records";
	    	getDetails(sample1tags[indextoTake]);
	    }
	    else if (graphLabel==yparamLabel["monthnoSample"]) {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML=yparamLabel["monthnoSample"];
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + datax[firstPoint['_index']];
	    	document.getElementsByClassName('pointDetail')[1].innerHTML="Showing " + sample2tags[indextoTake].length + " Records";
	    	getDetails(sample2tags[indextoTake]);
	    }
	    else if (graphLabel==yparamLabel["monthszSample"]) {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML=yparamLabel["monthszSample"];
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + datax[firstPoint['_index']];
	    	document.getElementsByClassName('pointDetail')[1].innerHTML="Showing " + sample2tags[indextoTake].length + " Records";
	    	getDetails(sample2tags[indextoTake]);
	    }
	    else if (graphLabel==yparamLabel["relativeSampleNo"]) {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML=yparamLabel["relativeSampleNo"];
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + orgaFil[firstPoint['_index']];
	    	document.getElementsByClassName('pointDetail')[1].innerHTML="Showing " + sample3tags[indextoTake].length + " Records";
	    	getDetails(sample3tags[indextoTake]);
	    }
	    else if (graphLabel==yparamLabel['relativeSampleSize']) {
	    	document.getElementsByClassName('detailTitle')[0].innerHTML=yparamLabel['relativeSampleSize'];
	    	document.getElementsByClassName('pointDetail')[0].innerHTML="Showing details for : " + orgaFil[firstPoint['_index']];
	    	document.getElementsByClassName('pointDetail')[1].innerHTML="Showing " + sample3tags[indextoTake].length + " Records";
	    	getDetails(sample3tags[indextoTake]);
	    }
	}
	};
});

//this function collects data for showing details table and stores it in specific variable
var detailJson=[],detailJsonNew=[],ind=0;
function getDetails(taskids){
	detailJson=[];detailJsonNew=[];ind=0;counts=0;previously='';
	var detailTable=document.getElementsByClassName('detailTable')[0];
	var detailTableBody=document.getElementsByClassName('detailTableBody')[0];
	var tbody=document.createElement('tbody');
	tbody.setAttribute('class','detailTableBody');
	for(var i=0;i<taskids.length;i++)
	{

		var date = samples[taskids[i]]["CreationTime"];
		date=date.split(' ');
		date=[date[0],date[1],date[2],date[3],date[5]];
		date=date.join(' ');
		date=new Date(date);
		var dateToHold=date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
		detailJson[i]={
				"owner":samples[taskids[i]]["Owner"],
				"name":samples[taskids[i]]["Name"],
				"createTime":dateToHold,
				"createObj":date,
				"size":samples[taskids[i]]["Size"],
				"organism":samples[taskids[i]]["Organism"],
				"libLayout":samples[taskids[i]]["Library Layout"],
				"platform":samples[taskids[i]]["Platform"],
				"build":samples[taskids[i]]["Build"]
			};

		detailJsonNew[i]={
				"owner":samples[taskids[i]]["Owner"],
				"name":samples[taskids[i]]["Name"],
				"createTime":dateToHold,
				"createObj":date,
				"size":samples[taskids[i]]["Size"],
				"organism":samples[taskids[i]]["Organism"],
				"libLayout":samples[taskids[i]]["Library Layout"],
				"platform":samples[taskids[i]]["Platform"],
				"build":samples[taskids[i]]["Build"]
			};
	}
	//console.log(detailJson);
	printDetailTable(detailJson);
}

//this function prints calculated detailed data in table format
function printDetailTable(jobs){
	var detailTable=document.getElementsByClassName('detailTable')[0];
	var detailTableBody=document.getElementsByClassName('detailTableBody')[0];
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
function sortDetails(param){
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

//shows details of which filters are applied for current plots
function filerDetails(){
	var filterDetail="Showing <strong class=\"strongDetail\">"+filters[1]+"</strong> Sample plots from <strong class=\"strongDetail\">"+filters[0][0]+"</strong> to <strong class=\"strongDetail\">"+filters[0][1]+"</strong>";
	filterDetail+=" for <br>Users : ";
	for(var i=0;i<filters[2].length;i++)
	{
		var str=" <strong class=\"strongDetail\">["+filters[2][i]+"]</strong>";
		filterDetail+=str;
	}
	filterDetail+=" and <br>Organisms : "
	for(var i=0;i<filters[3].length;i++)
	{
		var str=" <strong class=\"strongDetail\">["+filters[3][i]+"]</strong>";
		filterDetail+=str;
	}
	document.getElementById('filterDetailpara').innerHTML=filterDetail;
}