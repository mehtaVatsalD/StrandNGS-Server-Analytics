var job="";
var taskid=window.location.search.split("=")[1];
var table=document.getElementsByClassName('taskDetailTable')[0];


// var fileIndex=0,fileText=[],splittedFile=[];
// function readTextFile(file)
// {
//     var rawFile = new XMLHttpRequest();
//     rawFile.open("GET", file, false);
//     rawFile.onreadystatechange = function ()
//     {
//         if(rawFile.readyState === 4)
//         {
//             if(rawFile.status === 200 || rawFile.status == 0)
//             {
//                 var allText = rawFile.responseText;
//                 fileText[fileIndex]=allText;
//                 splittedFile[fileIndex]=allText.split('\n');
//                 fileIndex++; 
//                 if(fileIndex==1)
//                 {
//                     getTaskDetails();               
//                 }  
//             }
//         }
//     }
//     rawFile.send(null);
// }
// readTextFile("stdout.log");
// readTextFile("stderr.txt");

if (taskid != undefined) {
    document.getElementById('searchTaskid').value = taskid;
    getTaskDetails();
}
else{
    document.getElementsByClassName('emptyBack')[0].style.display="block";
    // $(".emptyBack").show();
}

$(document).ready(function(){

    //construction of tabs in logs page
    $("#logTab0").click(function(){
        $(".activeTab").removeClass('activeTab');
        $(this).parent().addClass('activeTab');
    });

    $("#logTab1").click(function(){
        $(".activeTab").removeClass('activeTab');
        $(this).parent().addClass('activeTab');
    });

    $("#logTab2").click(function(){
        $(".activeTab").removeClass('activeTab');
        $(this).parent().addClass('activeTab');
    });

    $("#logTab2").not("#downloadStderr").click(function(){
        $("#summaryDiv").hide();
        $("#fileText").html(fileText[1]);
        $("#fileText").show();
    });

    $("#downloadStdout").click(function(){
        if (fileText[0]!="") {
            download('stdout_'+taskid+".txt",fileText[0]);
        }
        else{
            alert("File is empty can't download it!")
        }
    });

    $("#downloadStderr").click(function(){
        if (fileText[0]!="") {
            download('stderr_'+taskid+".txt",fileText[1]);
        }
        else{
            alert("File is empty can't download it!")
        }
    });

    $("#logTab1").not("#downloadStdout").click(function(){
        $("#summaryDiv").hide();
        $("#fileText").html(fileText[0]);
        $("#fileText").show();
    });

    $("#logTab0").click(function(){
        $("#summaryDiv").show();
        $("#fileText").hide();
    });

    $("span.openCloseTool,span.openCloseTool + .showHideCaret").click(function(){
        if($("#toolInfo").is(":visible")){
            $("#toolInfo").slideUp("slow");
            $("span.openCloseTool+ .showHideCaret").switchClass('fa-caret-down','fa-caret-right');
        }
        else{
            $("#toolInfo").slideDown("slow");
            $("span.openCloseTool+ .showHideCaret").switchClass('fa-caret-right','fa-caret-down');
        }
    });

    $("span.openCloseTask,span.openCloseTask + .showHideCaret").click(function(){
        if($("#taskInfo").is(":visible")){
            $("#taskInfo").slideUp("slow");
            $("span.openCloseTask+ .showHideCaret").switchClass('fa-caret-down','fa-caret-right');
        }
        else{
            $("#taskInfo").slideDown("slow");
            $("span.openCloseTask+ .showHideCaret").switchClass('fa-caret-right','fa-caret-down');
        }
    });

    $(".openCloseSmaple,span.openCloseSmaple + .showHideCaret").click(function(){
        if($("#sampleInfo").is(":visible")){
            $("#sampleInfo").slideUp("slow");
            $("span.openCloseSmaple + .showHideCaret").switchClass('fa-caret-down','fa-caret-right');
        }
        else{
            $("#sampleInfo").slideDown("slow");
            $("span.openCloseSmaple + .showHideCaret").switchClass('fa-caret-right','fa-caret-down');
        }
    });
});

function searchTaskid(){
    var taskidInput=document.getElementById('searchTaskid').value;
    if(taskidInput!="")
    {
        window.location="task.html?taskid="+taskidInput;
    }
    else
    {
        alert('Please Enter TaskId');
    }
}

function enterHit(event){
    if (event.keyCode==13) {
        searchTaskid();
    }
}

var fileIndex=0,fileText=[],splittedFile=[];
function getTaskDetails(){
    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        if (this.status === 200) {
            job=this.responseText;
            var url=JSON.parse(job);
            $("#taskInfo,#toolInfo,#sampleInfo,#fileText,#summaryDiv").html('');
            getTaskData();
            //computeTimeDistribution(splittedFile[0]);
            // var x=loadCompressedASCIIFile("http://localhost:8080/StrandNGS-Server/" + url["stderrURL"]);
            // console.log(x);
            var stdoutCom = getLogFile(baseURL+"/StrandNGS-Server/" + url["stdoutURL"]);
            fileText[0]=zlibDecompress(stdoutCom);
            fileText[0]=zlibDecompress(fileText[0]);
            splittedFile[0]=fileText[0].split('\n');

            var stdoutCom = getLogFile(baseURL+"/StrandNGS-Server/" + url["stderrURL"]);
            fileText[1]=zlibDecompress(stdoutCom);
            fileText[1]=zlibDecompress(fileText[1]);
            splittedFile[1]=fileText[1].split('\n');

            computeTimeDistribution(splittedFile[0]);
        }
        else{
            $(".emptyResponse").show();
            $(".emptyBack").show();
        }
      }
    }   );

    xhr.open("GET", restUrls["getJob"]+taskid);

    xhr.send(data); 
}


// function loadCompressedASCIIFile(request_url) {

//     var req = new XMLHttpRequest();

//     // You gotta trick it into downloading binary.
//     req.open('GET', request_url, false);
//     req.overrideMimeType('text\/plain; charset=x-user-defined');    
//     req.send(null);

//     // Check for any error....
//     if (req.status != 200) {
//         return '';
//     }

//     // Here's our raw binary.
//     var rawfile = req.responseText;

//     // Ok you gotta walk all the characters here
//     // this is to remove the high-order values.

//     // Create a byte array.
//     var bytes = [];

//     // Walk through each character in the stream.
//     for (var fileidx = 0; fileidx < rawfile.length; fileidx++) {
//         var abyte = rawfile.charCodeAt(fileidx) & 0xff;
//         bytes.push(abyte);
//     }

//     // Instantiate our zlib object, and gunzip it.    
//     // Requires: http://goo.gl/PIqhbC [github]
//     // (remove the map instruction at the very end.)
//     var  gunzip  =  new  Zlib.Gunzip ( bytes ); 
//     var  plain  =  gunzip.decompress ();

//     // Now go ahead and create an ascii string from all those bytes.
//     var asciistring = "";
//     for (var i = 0; i < plain.length; i++) {         
//          asciistring += String.fromCharCode(plain[i]);
//     }

//     return asciistring;

// }

function getLogFile(request_url){
    var req = new XMLHttpRequest();

    // You gotta trick it into downloading binary.
    req.open('GET', request_url, false);
    req.overrideMimeType('text\/plain; charset=x-user-defined');    
    req.send(null);

    // Check for any error....
    if (req.status != 200) {
        return '';
    }

    // Here's our raw binary.
    var rawfile = req.responseText;
    return rawfile;
}

function zlibDecompress(rawfile){
    // Ok you gotta walk all the characters here
    // this is to remove the high-order values.

    // Create a byte array.
    var bytes = [];

    // Walk through each character in the stream.
    for (var fileidx = 0; fileidx < rawfile.length; fileidx++) {
        var abyte = rawfile.charCodeAt(fileidx) & 0xff;
        bytes.push(abyte);
    }

    // Instantiate our zlib object, and gunzip it.    
    // Requires: http://goo.gl/PIqhbC [github]
    // (remove the map instruction at the very end.)
    var  gunzip  =  new  Zlib.Gunzip ( bytes ); 
    var  plain  =  gunzip.decompress ();

    // Now go ahead and create an ascii string from all those bytes.
    var asciistring = "";
    for (var i = 0; i < plain.length; i++) {         
         asciistring += String.fromCharCode(plain[i]);
    }

    return asciistring;
}

function getTaskData(){
    job=JSON.parse(job);
    var table=document.getElementsByClassName('taskDetailTable')[0];
    job["WaitTime"]=((parseInt(job["StartTime"])-parseInt(job["SubmissionTime"]))/60000).toFixed(2);
    job["ExeTime"]=([parseInt(job["EndTime"])-parseInt(job["StartTime"])]/60000).toFixed(2);
    var data={};
    for(var key in job)
    {
        if (taskLabels.hasOwnProperty(key)) {
            if (key == "Status") {
                var stat = String(job[key]);
                data[taskLabels[key]] = [statusDecode[stat]];
            }
            else{
                data[taskLabels[key]]=[job[key]];
            }
        }
    }
    printTables(data,"taskInfo",false);
}

var summary='',toolinfo={},jobInfo={},samples={},sampleInfo={},sampleTaken=false;
var extraZeros='00';
var headerBaits = [
    'INFO  Product version:',
    'INFO  Product build:',
    'INFO  Number of processors:',
    'INFO  Number of Threads: ',
    'INFO  Java total memory: ',
    'INFO  OS: ',
    'INFO  OS Version: ',
    'INFO  Java vm version: ',
    '[System Property]:	java.options=',
    '[System Property]:	numParallelTasksPerWorker='
];

var header = {};

function padZeros(value){
    return extraZeros.substr(0,extraZeros.length-value.length)+value;
}

function format_time(time){
    //converts 5hrs, 9 mins, 20.520 secs to 05:09:20.520
    timeParts=time.split(', ');
    var days = '';
    var hrs = '';
    var mins = '';
    var secs = '';

    if (timeParts.length >= 1) {
        secs = timeParts[timeParts.length-1].split('.')[0];
    }
    if (timeParts.length >= 2) {
        mins = timeParts[timeParts.length-2].split(' ')[0];
    }
    if (timeParts.length >= 3) {
        hrs = timeParts[timeParts.length-3].split(' ')[0];
    }
    if (timeParts.length >= 4) {
        days = timeParts[timeParts.length-4].split(' ')[0];
    }

    if(timeParts.length>=4){
        hrs=days*24 + hrs;
        return padZeros(hrs)+":"+padZeros(mins)+":"+padZeros(secs);
    }
    else if (timeParts.length==3) {
        return padZeros(hrs)+":"+padZeros(mins)+":"+padZeros(secs); 
    }
    else if (timeParts.length==2) {
        return "00:"+padZeros(mins)+":"+padZeros(secs);
    }
    else if (timeParts.length==1) {
        return "00:00:"+padZeros(secs);
    }
}

function strTosecs(str){
    //calculates total second if input string given is of format 10 hrs, 15 mins, 17.230 secs
    var fields=str.split(' ');
    var secs=0;
    if (fields.length==6) {
        secs=secs+parseInt(fields[0])*60*60;
        secs=secs+parseInt(fields[2])*60;
        secs=secs+Number(fields[4]);
    }
    else if (fields.length==4) {
        secs=secs+parseInt(fields[0])*60;
        secs=secs+Number(fields[2]);
    }
    else{
         secs=secs+Number(fields[0]);
    }
    return secs;
}


//computeTimeDistribution

var jobName = '';
var jobType = '';

var jobNames = [];
var elapsedTimes = [];
var elapsedTimeStrs = [];
var totalTimeElapsed = 0;
var totalTimeElapsedStr = 0;

var completeSamplePaths=[];

function computeTimeDistribution(file){

    getDataForTimeDis(file);

    setToolInfo();

    setJobInfo();

    showSampleTooltip();

}

function getDataForTimeDis(file){
    for(var i=0;i<file.length;i++){
        line=file[i];
        line=line.trim();
        if (line.indexOf("INFO  Job Name =")!=-1) {
            jobName = line.split('=')[1].trim();
        }
        if (line.indexOf("INFO  Job Type =")!=-1) {
            jobType = line.split("=")[1].trim();
        }
        if (line.indexOf("INFO  Elapsed time =")!=-1) {
            var strElapsedTime=line.split('=')[1].trim();
            if (jobType!='Pipeline') {
                var elapsedTime = strTosecs(strElapsedTime);
                jobNames.push(jobName);
                elapsedTimes.push(Number(elapsedTime).toFixed(3));
                elapsedTimeStrs.push(format_time(strElapsedTime));
                totalTimeElapsed=totalTimeElapsed+Number(elapsedTime);
            }  
            else{
                totalTimeElapsedStr=format_time(strElapsedTime);
            }
        }
        if (line=="Sample Information" && !sampleTaken) {
            line=file[++i];
            var j=0;
            while(line!=""){
                var sampleLine=line.split('\t');
                var sampleSize=sampleLine[1];
                completeSamplePaths[j++]=sampleLine[0];
                sampleLine=sampleLine[0].split('/');
                sampleLine=sampleLine[sampleLine.length-1];
                samples[sampleLine]=[sampleSize];
                line=file[++i];    

            }
            sampleTaken=true;
        }
        for(var j=0;j<headerBaits.length;j++){
            bait=headerBaits[j];
            if (line.indexOf(bait)!=-1) {
                header[bait] = line;
                break;
            }
        }

    }
    if (sampleTaken == false) {
        document.getElementsByClassName('headTab')[2].style.display='none';
        document.getElementById('taskInfo').style.display='block';
        document.getElementsByClassName('headTab')[0].getElementsByClassName('fa')[0].classList.remove('fa-caret-right');
        document.getElementsByClassName('headTab')[0].getElementsByClassName('fa')[0].classList.add('fa-caret-down');
    }
    printSampleSizeNumber();
    printTables(samples,"sampleInfo",false);
}

function setToolInfo(){
    for(var i=0;i<headerBaits.length;i++){
        bait=headerBaits[i];
        if(header.hasOwnProperty(bait)){
            if (bait.indexOf("[System Property]")==-1) {
                var key=header[bait].split('  ')[1];
                var value=key.split(':')[1].trim();
                key=key.split(':')[0].trim();
                toolinfo[key]=[value];
            }
            else{
                var key=header[bait].split('\t')[1];
                var value=key.split(/=(.+)/)[1];
                if (value == undefined) {
                    value = "Default ( Effective CPU Count )"
                }
                key=key.split("=")[0].trim();
                toolinfo[key]=[value];
            }
        }
    }
    printTables(toolinfo,"toolInfo",false);
}

function setJobInfo(){
    var numJobs=jobNames.length;

    for(var i=0;i<jobInfoLabels.length;i++){
        jobInfo[jobInfoLabels[i]]=[];
    }
    for(var i=0;i<numJobs;i++){
        jobInfo[jobInfoLabels[0]].push(jobNames[i]);
        jobInfo[jobInfoLabels[1]].push((100*elapsedTimes[i]/totalTimeElapsed).toFixed(2));
        jobInfo[jobInfoLabels[2]].push(elapsedTimes[i]);
        jobInfo[jobInfoLabels[3]].push(elapsedTimeStrs[i]);
    }
    jobInfo[jobInfoLabels[0]].push("<strong>Pipeline</strong>");
    jobInfo[jobInfoLabels[1]].push("<strong>"+100+"</strong>");
    jobInfo[jobInfoLabels[2]].push("<strong>"+totalTimeElapsed+"</strong>");
    jobInfo[jobInfoLabels[3]].push("<strong>"+totalTimeElapsedStr+"</strong>");

    printTables(jobInfo,"summaryDiv",true);
}

function printSampleSizeNumber(){
    sampleInfo[sampleInfoLabels[0]]=[Object.keys(samples).length];

    var totalSize=0;
    for(var key in samples){
        var size =samples[key][0];
        var unit=size.substr(size.length-2,2);
        size = Number(size.substr(0,size.length-2));
        if (unit=="GB") {
            size*=1024;
        }
        else if(unit=="KB"){
            size/=1024;
        }
        totalSize+=size;
    }

    if(totalSize>=1024){
        totalSize/=1024;
        unit="GB";
    }
    else if (totalSize<=1) {
        totalSize*=1024;
        unit="KB";
    }
    sampleInfo[sampleInfoLabels[1]]=[totalSize+" "+unit];
    printTables(sampleInfo,"sampleInfo",false);
}

function showSampleTooltip(){
    var table = document.getElementById('sampleInfo').getElementsByTagName('table')[1];
    var tr=table.getElementsByTagName('tr');
    for(var i=0;i<tr.length;i++){
        var toolTipCell=tr[i].getElementsByTagName('td')[0];
        toolTipCell.setAttribute('title',completeSamplePaths[i]);
    }
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
