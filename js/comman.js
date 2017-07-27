$(document).ready(function(){
	//for making date picker using kendo date picker plugin
	if ($("#datepicker1").length) {
		$("#datepicker1").kendoDatePicker({
			format:"d/M/yyyy",
		  animation: {
		   close: {
		     effects: "fadeOut zoom:out",
		     duration: 300
		   },
		   open: {
		     effects: "fadeIn zoom:in",
		     duration: 300
		   }
		  }
		});
		
		$("#datepicker2").kendoDatePicker({
			format:"d/M/yyyy",
		  animation: {
		   close: {
		     effects: "fadeOut zoom:out",
		     duration: 300
		   },
		   open: {
		     effects: "fadeIn zoom:in",
		     duration: 300
		   }
		  }
		});	
	}

	//hiding enlarged plot
	$('.hoverParent,.hoverClose').click(function(){
		$(".hoverParent").fadeOut("slow");
		$(".hoverMain").fadeOut("slow");
		$(".hoverClose").fadeOut("slow");
	});


	//hiding details table
	$('.dethoverParent,.dethoverClose').click(function(){
		$(".dethoverParent").fadeOut("slow");
		$(".detailDiv").fadeOut("slow");
		$(".dethoverClose").fadeOut("slow");
		var caretOld=document.getElementById('caret');
		if (caretOld) {
			caretOld.parentNode.removeChild(caretOld);
		}
	});

	//function to perform when escape key is pressed 
	$(document).keyup(function(e) {
	     if (e.keyCode == 27) { 
			if ($(".dethoverParent").is(":visible")) {
				$(".dethoverParent").fadeOut("slow");
				$(".detailDiv").fadeOut("slow");
				$(".dethoverClose").fadeOut("slow");
				var caretOld=document.getElementById('caret');
				if (caretOld) {
					caretOld.parentNode.removeChild(caretOld);
				}
			}
			else{
				$(".hoverParent").fadeOut("slow");
				$(".hoverMain").fadeOut("slow");
				$(".hoverClose").fadeOut("slow");
			}
	    }
	});

	//showing dropdown at top right portion
	$(".showUser").click(function(){
		$(".dropDownBack").show();
		$(".dropDown").slideDown(400);
	});

	//hiding dropdown at top right portion
	$(".dropDownBack").click(function(){
		$(".dropDownBack").hide();
		$(".dropDown").slideUp(400);
	});

	$(".samplePlotRow").hide();
	$("#sampleDetailTable").hide();
	$("#copy2").hide();
	$("#sampleFilterDetailpara").hide();

	$("#jobStatPage").click(function(){
		if (filterChanged) {
			console.log("updating...");
			filterChanged = false;
			updateJobPlots();
		}
		$(".activeli").removeClass("activeli");
		$(this).addClass("activeli");

		$(".samplePlotRow").hide();
		$("#sampleExtraFil").hide();
		$("#hoverPlotParent2").hide();
		$("#sampleDetailTable").hide();
		$("#copy2").hide();
		$("#sampleFilterDetailpara").hide();

		$("#jobExtraFil").show();
		$(".jobPlotRow").show();
		$("#hoverPlotParent").show();
		$("#jobDetailTable").show();
		$("#copy1").show();
		$("#jobFilterDetailpara").show();

	});

	$("#sampleStatPage").click(function(){
		if (!jsonBool[1]) {
			document.getElementsByClassName('loadingDiv')[0].style.display="block";

			document.getElementsByClassName('loadingDiv')[0].style.backgroundColor="rgba(255,255,255,1)";
			restApi(restUrls['sampleStats'],"",createRequiredFilters);	
		}
		else if (filterChanged) {
			console.log("updating...");
			filterChanged = false;
			updateSamplePlots();
		}
		$(".activeli").removeClass("activeli");
		$(this).addClass("activeli");

		$(".samplePlotRow").show();
		$("#sampleExtraFil").show();
		$("#hoverPlotParent2").show();
		$("#sampleDetailTable").show();
		$("#copy2").show();
		$("#sampleFilterDetailpara").show();
		
		$("#jobExtraFil").hide();
		$(".jobPlotRow").hide();
		$("#hoverPlotParent").hide();
		$("#jobDetailTable").hide();
		$("#copy1").hide();
		sampleFilerDetails();
		$("#jobFilterDetailpara").hide();

	});

	// $(".internalLinks li").click(function(){
	// 			$(".activeLink").removeClass("activeLink");
	// 			$(this).addClass("activeLink");
	// 		});

			// var key = window.location.href.split("#")[1];
			// if (key != undefined) {
			// 	$(".activeLink").removeClass("activeLink");
			// 	$("."+key).addClass("activeLink");
			// }
});

function checkTimeRange(date,date1,date2){
	date1=date1.split('/');
	date1=new Date(date1[2],date1[1],date1[0]);
	date2=date2.split('/');
	date2=new Date(date2[2],date2[1],date2[0]);
	date=date.split('/');
	date=new Date(date[2],date[1],date[0]);
	if (date>=date1 && date<=date2) {
		return true;
	}
	else{
		return false;
	}
}

//for applying time range for both sample and job stats
function applyTimeRange(){
	var range=document.getElementsByName('duration');
	for(var i=0;i<range.length;i++)
	{
		if (range[i].checked) {
			range=range[i].value;
			break;
		}
	}
	var date=new Date();
	if (range=='pquater') {
		var month=date.getMonth();
		var year=date.getFullYear();
		var quater=Math.ceil((month+1)/3);
		quater--;
		if (quater==0) {
			quater=4;
			year--;
		}
		var date1="1/"+(quater*3-2)+"/"+year;
		var date2="31/"+(quater*3)+"/"+year;
		
	}
	else if (range=='pyear') {
		var year = date.getFullYear();
		year--;
		var date1="1/1/"+year;
		var date2="31/12/"+year;
	}
	else if (range=='ptwoyears') {
		var year = date.getFullYear();
		year--;
		var date1="1/1/"+(year-1);
		var date2="31/12/"+year;
	}
	else if (range=='pthreeyears') {
		var year = date.getFullYear();
		year--;
		var date1="1/1/"+(year-2);
		var date2="31/12/"+year;
	}
	else if (range=='range') {
		var date1=document.getElementById('datepicker1').value;
		var date2=document.getElementById('datepicker2').value;
		if (date1=="") {
			var date1="1/9/2014";
		}	
		else if (date2=="") {
			var date2=new Date();
			date2=date2.getDate()+"/"+(date2.getMonth()+1)+"/"+date2.getFullYear();
		}
		date1obj=date1.split('/');
		date1obj=new Date(date1obj[2],date1obj[1],date1obj[0]);
		date2obj=date2.split('/');
		date2obj=new Date(date2obj[2],date2obj[1],date2obj[0]);
		if(date1obj>date2obj){
			
			var date1="1/9/2014";
			var date2=new Date();
			date2=date2.getDate()+"/"+(date2.getMonth()+1)+"/"+date2.getFullYear();
		}
	}
	else{
		var date1="1/1/2014";
		var date2=new Date();
		date2=date2.getDate()+"/"+(date2.getMonth()+1)+"/"+date2.getFullYear();
	}
	filters[0]=[date1,date2];
	return [date1,date2];
}


//getting x axis data like months between time range
function getdatax(date1,date2){
	date1=date1.split('/');
	var mon1=date1[1];
	var yr1=date1[2];
	date2=date2.split('/');
	var mon2=date2[1];
	var yr2=date2[2];
	var end=mon2+"/"+yr2;
	var mon_year=mon1+"/"+yr1;
	var i=0;
	while(mon_year!=end)
	{
		datax[i]=mon_year;
		mon1++;
		if (mon1==13) {
			mon1=1;
			yr1++;
		}
		var mon_year=mon1+"/"+yr1;
		i++;
	}
	datax[i]=end;
}

//getting x axis data like quaters between time range
function getQuaters(date1,date2){
	date1=date1.split('/');
	var mon1=date1[1];
	var yr1=date1[2];
	date2=date2.split('/');
	var mon2=date2[1];
	var yr2=date2[2];
	var end=mon2+"/"+yr2;
	var mon_year=mon1+"/"+yr1;
	var quater,i=0;
	while(mon_year!=end)
	{
		if (mon1<=3) {
			quater='Q1';
		}
		else if (mon1>=4 && mon1<=6) {
			quater='Q2';
		}
		else if (mon1>=7 && mon1<=9) {
			quater='Q3';	
		}
		else if (mon1>=10 && mon1<=12) {
			quater='Q4';	
		}

		quaterYr=quater+"_"+yr1;
		if (datax[i-1]!=quaterYr) {
			datax[i]=quaterYr;
			i++;
		}
		mon1++;
		if (mon1==13) {
			mon1=1;
			yr1++;
		}
		var mon_year=mon1+"/"+yr1;
	}
}

//getting x axis data like years between time range
function getYears(date1,date2){
	date1=date1.split('/');
	var yr1=date1[2];
	date2=date2.split('/');
	var yr2=date2[2];
	var i=0;
	while(yr1!=yr2)
	{
		datax[i]=yr1.toString();
		yr1++;
		i++;
	}
	datax[i]=yr2;	
}

//this function is to show date picker when time range is chosen else hide it
function showhide(){
	var rangeRadio = document.getElementById('rangeRadio');
	if (rangeRadio.checked) {
		document.getElementById('datepickDiv').style.display="block";
	}
	else{
		document.getElementById('datepickDiv').style.display="none";
	}
}

// //functionality for selecting all checkboxs of particular filter panel
// function selectall(){
// 	var users=document.getElementsByName('user');
// 	for(var i=0;i<users.length;i++)
// 	{
// 		users[i].checked=true;
// 	}
// 	plots();
// }

// //functionality for clearing all checkboxs of particular filter panel
// function clearall(){
// 	var users=document.getElementsByName('user');
// 	for(var i=0;i<users.length;i++)
// 	{
// 		users[i].checked=false;
// 	}
// 	plots();
// }

//functionality for selecting all checkboxs of particular filter panel and also for clearing it
function checkUncheck(check,filtertoCheck){
	if (check.checked) {
		var users=document.getElementsByName(filtertoCheck);
		for(var i=0;i<users.length;i++)
		{
			users[i].checked=true;
		}
	}
	else{
		var users=document.getElementsByName(filtertoCheck);
		for(var i=0;i<users.length;i++)
		{
			users[i].checked=false;
		}
	}
	if (filtertoCheck == 'context' || filtertoCheck == 'status' || filtertoCheck == 'jobUser' || filtertoCheck == 'cnodes' || filtertoCheck == 'taskNames') {
		updateJobPlots();
	}
	else{
		updateSamplePlots();
	}
}

//for making accardion ui
function accardion(accardionIp,parent){
	if (accardionIp.innerHTML=='+') {
		$(parent).slideDown(500);
		accardionIp.innerHTML='-';
	}
	else if (accardionIp.innerHTML=='-') {
		$(parent).slideUp(500);
		accardionIp.innerHTML='+';
	}

}

//for selcting complete element
function selectElementContents(el) {
    var body = document.body, range, sel;
    if (document.createRange && window.getSelection) {
        range = document.createRange();
        sel = window.getSelection();
        sel.removeAllRanges();
        try {
            range.selectNodeContents(el);
            sel.addRange(range);
        } catch (e) {
            range.selectNode(el);
            sel.addRange(range);
        }
    } else if (body.createTextRange) {
        range = body.createTextRange();
        range.moveToElementText(el);
        range.select();
    }
    document.execCommand('copy');
    clearSelection();
}

//for clearing selection particular selected element
function clearSelection() {
	if ( document.selection ) {
	    document.selection.empty();
	} else if ( window.getSelection ) {
	    window.getSelection().removeAllRanges();
	}
}

//for disabling backward going button
function disableBack(){
		window.location.hash="login";
	window.location.hash="Again-No-back-button";//again because google chrome don't insert first hash into history
	window.onhashchange=function(){window.location.hash="login";}
}

//function for checking login credentials and if true then log user in
function checkLogin(){
	var uname=document.getElementById('uname').value;
	var pass=document.getElementById('pass').value;
	var notice = document.getElementsByClassName('notices')[0];
	if (uname == "") {
		notice.innerHTML = errorMessages['username'];
		notice.style.color = "red";
	}
	else if (pass == "") {
		notice.innerHTML = errorMessages['password'];
		notice.style.color = "red";	
	}
	else{
		var data={"userName":uname,"password":pass};
		data = JSON.stringify(data);
		var xhr = new XMLHttpRequest();
		xhr.withCredentials = true;

		xhr.addEventListener("readystatechange", function () {
			if (this.readyState==4) {
				if (this.status==204) {
					window.location=redirectUrls["plots"];
			 	}
			 	else{
			 		notice.innerHTML = errorMessages['invalidLogin'];
			 		notice.style.color = "red";
			 	}
			}
		});

		xhr.open("POST",restUrls["login"]);
		xhr.setRequestHeader("content-type", "application/json");


		xhr.send(data);
	}
	return false;
}

//fo rlogging user out
function logout(){
	var data="";
	json='';

	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
	 	console.log(this.readyState);
	 	console.log(this.status);
	 	if (this.status==204) {
	 		window.location=redirectUrls["login"];
	 	}
	});

	xhr.open("POST", restUrls["logout"]);
	xhr.setRequestHeader("content-type", "application/json");


	xhr.send(data);
}


//for getting name of particular logged user and print it to top right portion
var loggedUser='';
function getLoggedUser(){
	var data = "";

	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
	  if (this.readyState === 4) {
	  	if (this.status==200) {
	  		loggedUser=this.responseText;
	    	document.getElementsByClassName('showUser')[0].innerHTML=loggedUser.toUpperCase()+' <i class="fa fa-caret-down"></i>';
	  	}
	  	else if (this.status==401){
	  		window.location=redirectUrls['login'];
	  	}
	  } 
	});

	xhr.open("GET", restUrls["userLogged"]);

	xhr.send(data);
}	

function printTables(data,parentId,bool){
	max=0;
	for(var key in data){
		if (max<data[key].length) {
			max=data[key].length;
		}
	}
    var table=document.createElement('table');
    table.setAttribute('border','0');
    table.setAttribute('cellspacing','0');
    table.setAttribute('align','center');
    table.setAttribute('width','80%');
    var len=0;
    if (bool) {
        table.setAttribute('class','verticalTable');
        var tr=document.createElement('tr');
        for(var key in data){
            if(len==0){
                len=data[key].length;
            }
            tr.setAttribute('class','headTable');
            var th=document.createElement('th');
            th.innerHTML=key;
            tr.appendChild(th);
        }
        table.appendChild(tr);
        for(var i=0;i<len;i++){
            var tr=document.createElement('tr');
            for(var key in data){
                var td=document.createElement('td');
                td.innerHTML=data[key][i];
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    }
    else{
        table.setAttribute('class','horizontalTable');
        for(var key in data){
            var tr=document.createElement('tr');
            var td=document.createElement('td');
            td.innerHTML=key;
            tr.appendChild(td);
            for(var i=0;i<data[key].length;i++){
                var td=document.createElement('td');
                td.innerHTML=data[key][i];
                td.setAttribute("colspan",max-data[key].length+1);
                tr.appendChild(td)
            }
            table.appendChild(tr);
        }
    }
    document.getElementById(parentId).appendChild(table);
}

//change password method
function changePassword(){
	var oldPassword=document.getElementById('oldPass').value;
	var newPassword=document.getElementById('newPass').value;
	var confirm=document.getElementById('cnewPass').value;
	var notice  = document.getElementsByClassName(' notices ')[0];
	if (oldPassword=="") {
		notice.innerHTML = errorMessages['oldPassword'];
		notice.style.color = "red";
		return false;
	}
	else if (newPassword == "") {
		notice.innerHTML = errorMessages['newPassword'];
		notice.style.color = "red";
		return false;
	}
	else if (confirm == "") {
		notice.innerHTML = errorMessages['confirm'];
		notice.style.color = "red";
		return false;
	}
	else if (confirm!=newPassword) {
		notice.innerHTML = errorMessages['matchError'];
		notice.style.color = "red";
		return false;
	}
	var data="oldPassword="+oldPassword+"&newPassword="+newPassword;
	callRestapi(data);

	return false;
}

//call to rest api for changing password
function callRestapi(data){
	var notice  = document.getElementsByClassName(' notices ')[0];
	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
	  if (this.readyState === 4) {
	    if (this.status==200) {
	    	var response = this.responseText;
	    	if (response == "false") {
	    		notice.innerHTML = errorMessages['oldpassIncorrect'];
				notice.style.color = "red";
	    	}
	    	else{
	    		notice.innerHTML = successMessages["passChanged"];
				notice.style.color = "green";
				setTimeout(function() {
					logout();
				}, 3000);
	    	}
	    }
	    else{
	    	notice.innerHTML = errorMessages['oldpassIncorrect'];
			notice.style.color = "red";
	    }
	  }
	});

	xhr.open("POST",restUrls["changePassword"]);
	xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");

	xhr.send(data);
	return false;
}

//compute worker.html functions

//rest api call to get compute workers
var workersDetails=""
function getWorkers(){
	// var data = "";

	// var xhr = new XMLHttpRequest();
	// xhr.withCredentials = true;

	// xhr.addEventListener("readystatechange", function () {
	//   if (this.readyState === 4) {
	//     workersDetails=JSON.parse(this.responseText);
	//     console.log(workersDetails);
	// 	showWorkerDetails();
	//   }
	// });

	// xhr.open("GET",restUrls["workers"]);

	// xhr.send(data);
	workersDetails=[
	    {
	        "lastPingTime": 1498201075595,
	        "workerIP": "192.168.91.60",
	        "workerCV": {
	            "tmpDir": "app/tmp",
	            "productVersion": "3.0.1",
	            "numParallelTasksPerWorker": 3,
	            "javaOptions": "-Xms50m -XX:MaxHeapFreeRatio=40 -XX:MinHeapFreeRatio=20 -XX:NewRatio=6 -XX:-UseConcMarkSweepGC",
	            "numWorkers": 1,
	            "workerName": "mallika.local",
	            "monitorPort": 9000,
	            "platform": 3,
	            "workerIP": "192.168.91.60",
	            "supportedContexts": [
	                {
	                    "contextName": "Alignment"
	                },
	                {
	                    "contextName": "Analysis"
	                }
	            ],
	            "totalPhysicalMemorySize": 8589934592
	        },
	        "working": false,
	        "terminateWorker": false,
	        "license": {
	            "workerID": 1498126921118
	        }
	    },
	    {
	        "lastPingTime": 1498201075595,
	        "workerIP": "192.168.91.10",
	        "workerCV": {
	            "tmpDir": "app/tmp",
	            "productVersion": "3.0.1",
	            "numParallelTasksPerWorker": 3,
	            "javaOptions": "-Xms50m -XX:MaxHeapFreeRatio=4 -XX:MinHeapFreeRatio=0 -XX:NewRatio=69 -XX:-UseConcMarkSweepGC",
	            "numWorkers": 1,
	            "workerName": "mallika.local",
	            "monitorPort": 9000,
	            "platform": 3,
	            "workerIP": "192.168.91.60",
	            "supportedContexts": [
	                {
	                    "contextName": "Alignment"
	                },
	                {
	                    "contextName": "Analysis"
	                }
	            ],
	            "totalPhysicalMemorySize": 8589934592
	        },
	        "working": true,
	        "terminateWorker": false,
	        "license": {
	            "workerID": 1498126921118
	        }
	    }

	];
	showWorkerDetails();
}

//menubar on left of workers.html implementation
function onClickLi(element){
	var selected=document.querySelector(".computeList .selected");
	var allLis=document.getElementsByClassName('computeList')[0].getElementsByTagName('li');
	for(var i=0;i<allLis.length;i++){
		if(allLis[i]==selected){
			var selectedIndex=i;
		}
		if (allLis[i]==element) {
			var elementIndex=i;
		}
	}
	document.getElementById('detailDiv'+selectedIndex).style.display="none";
	selected.classList.remove("selected");
	document.getElementById('detailDiv'+elementIndex).style.display="block";
	element.setAttribute("class","selected");

}

// $(document).ready(function(){
// 	$(".computeList li").click(function(){
// 		alert('dfdsf');
// 		$(".computeList .selected").removeClass("selected");
// 		$(this).addClass("selected");
// 	});
// });

//manupilation and display of compute worker details
function showWorkerDetails(){
	for(var i=0;i<workersDetails.length;i++){
		var workerDetails=workersDetails[i];
		var div = document.createElement('div');
		div.setAttribute('id','detailDiv'+i);
		document.getElementsByClassName('computeDetails')[0].appendChild(div);
		console.log(div);
		var workerData = {};
		for(var key in workerDetails){
			if(workerLabels.hasOwnProperty(key)){
				if(key=="workerCV"){
					var obj=workerDetails[key];
					for(var childKey in obj){
						if (workerLabels[key].hasOwnProperty(childKey)) {
							if (childKey=="supportedContexts") {
								for(var j=0;j<workerDetails[key][childKey].length;j++){
									if (workerData.hasOwnProperty(workerLabels[key][childKey]["contextName"])) {
										workerData[workerLabels[key][childKey]["contextName"]][0]+=" , "+workerDetails[key][childKey][j]["contextName"];
									}
									else{
										workerData[workerLabels[key][childKey]["contextName"]]=[workerDetails[key][childKey][j]["contextName"]];
									}
								}
							}
							else if (childKey=="platform") {
								if (obj[childKey]==0) {
									workerData[workerLabels[key][childKey]]=["UNKNOWN OS"];
								}
								else if (obj[childKey]==1) {
									workerData[workerLabels[key][childKey]]=["WINDOWS"]
								}
								else if (obj[childKey]==2) {
									workerData[workerLabels[key][childKey]]=["LINUX"]
								}
								else if (obj[childKey]==3) {
									workerData[workerLabels[key][childKey]]=["MAC"]
								}
							}
							else if (childKey=="javaOptions") {
								workerData[workerLabels[key][childKey]]=[obj[childKey].split(' ').join('<br>')];
							}
							else if (childKey=="totalPhysicalMemorySize") {
								workerData[workerLabels[key][childKey]]=[(obj[childKey]/(1024*1024*1024))+" GB"];
							}
							else{
								workerData[workerLabels[key][childKey]]=[obj[childKey]];
							}
						}
					}
				}
				else if (key=="working") {
					if (workerDetails[key]) {
						workerData[workerLabels[key]]=["<span style='color:red'>BUSY</span>"];
					}
					else{
						workerData[workerLabels[key]]=["<span style='color:green'>FREE</span>"];
					}
				}
				else{
					workerData[workerLabels[key]]=[workerDetails[key]];
				}
			}
		}
		var li=document.createElement('li');
		li.innerHTML=workerDetails["workerIP"];
		li.setAttribute("onclick","onClickLi(this)");
		if (i==0) {
			li.setAttribute("class","selected");
		}
		else{
			div.style.display="none";
		}
		if (workerDetails["working"]) {
			li.innerHTML+=" <i class='fa fa-circle' style='color:#ff1100'></i>"
		}
		else{
			li.innerHTML+=" <i class='fa fa-circle' style='color:#00ff0a'></i>"
		}
		document.getElementsByClassName('computeList')[0].appendChild(li);
		printTables(workerData,'detailDiv'+i,false);
	}
}



function resetFilters(){
	var durationFilters = document.getElementsByName('duration');
	
	resetForRadioButtons('duration', 'all');
	resetForRadioButtons('aggregation', 'monthly');

	resetCheckBoxList('context');
	resetCheckBoxList('status');
	resetCheckBoxList('taskNames');
	resetCheckBoxList('jobUser')
	resetCheckBoxList('cnodes');

	resetCheckBoxList('sampleUser');
	resetCheckBoxList('organism');

	resetCheckBoxList('checkAllBox');

	updatePlots();
}

function resetForRadioButtons(inputName, valueToMatch){
	var filterToReset = document.getElementsByName(inputName);
	for(var i = 0; i < filterToReset.length; i++)
	{
		if (filterToReset[i].value == valueToMatch) {
			filterToReset[i].checked = true;
		}
	}
}

function resetCheckBoxList(inputName){
	var filterToReset = document.getElementsByName(inputName);
	for(var i=0; i < filterToReset.length; i++){
		filterToReset[i].checked = true;
	}
}