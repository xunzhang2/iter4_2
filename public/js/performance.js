var socket = io();
var xhttp_get = new XMLHttpRequest();
var xhttp_post = new XMLHttpRequest();
var duration = 0;
var interval = 0;
var get_num  = 0;
var post_num = 0;
var randomMessage="";
var username=getCookie('username');
var t1,t2;
var elapsedTime=0;
var elapsedTime_get=0;
var elapsedTime_post=0;
var limit=1000;

function startMeasurement(){
    console.log("click start");
// to set flag at server to true
    $.ajax({
      url:  '/startmeasurement',
      type: 'GET',
      contentType: 'application/json',
      dataType: 'json'
    });

    var duration = $('#duration').val();
    var interval = $('#interval').val();
    elapsedTime=0;
    get_num=0;
    post_num=0;

    console.log("duration="+duration);
    console.log("interval="+interval)
    t1=setTimeout(stopMeasurement,duration*1000);
    t2=setInterval(sendPost,interval);
    t3=setInterval(function(){
        elapsedTime++;
    },1000);
    
};

function stopMeasurement(){ 
    console.log("click stop");

// to set flag at server to false
    $.ajax({
      url:  '/stopmeasurement',
      type: 'GET',
      contentType: 'application/json',
      dataType: 'json'      
    });

    clearTimeout(t1);
    clearInterval(t2);
   
};

function sendPost(){
    console.log("sendPost()");
    xhttp_post.onreadystatechange=function(){
        if(xhttp_post.readyState==4&&xhttp_post.status==200){
          
                if((post_num++)>limit){
                    resetMeasurement();
                }

                console.log("post_num="+post_num);
                elapsedTime_post=elapsedTime;
                $('#postresult').html(post_num/elapsedTime_post); 
                sendGet();
        }
    };
    xhttp_post.open('POST','/measurechat',true);
    xhttp_post.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var date=new Date();
    randomMessage=(date.getTime() + "=randomMessageId").substring(20);
    timestamp=current_time();
    xhttp_post.send("message="+ randomMessage + "&timestamp=" + timestamp + "&username=" + username);
}

function sendGet(){
    console.log("sendGet()");
    xhttp_get.onreadystatechange=function(){
        if(xhttp_get.readyState==4&&xhttp_get.status==200){
           
             if((get_num++)>limit){
                    resetMeasurement();
                }

            console.log("get_num="+get_num);
            elapsedTime_get=elapsedTime;
            $('#getresult').html(get_num/elapsedTime_get);
        }       
    };
    xhttp_get.open('GET', "measurechat", true);
    xhttp_get.send();
}

var current_time = function() {
    var d = new Date(Date.now());
    var datestring = d.toLocaleDateString();
    var timestring = d.toLocaleTimeString();
    return datestring.concat(" ", timestring);
};

var resetMeasurement = function(){
    $.ajax({
      url:  '/resetmeasurement',
      type: 'GET',
      contentType: 'application/json',
      dataType: 'json'
    });

    // get_num=0;
    // post_num=0;
    // elapsedTime=0;
    // elapsedTime_get=0;
    // elapsedTime_post=0;
};

