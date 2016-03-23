var socket = io();
var xhttp_get = new XMLHttpRequest();
var xhttp_post = new XMLHttpRequest();
var duration = 5; //
var interval = 500; //
var get_num  = 0;
var post_num = 0;
var randomMessage="";
var timestamp="";
var username=getCookie('username');

function startMeasurement(){
    console.log("click start");
    t1=setTimeout(stopMeasurement(),duration*1000);
    t2=setTimeout(sendPost(),interval);
};

function stopMeasurement(){
    // if(t2!=null)
    //     clearTimeout(t2);
    // clearTimeout(t1);
};

function sendPost(){
    xhttp_post.onreadystatechange=function(){
        if(xhttp_post.readyState==4&&xhttp_post.status==200){
                post_num++;
                console.log("post_num="+post_num);
                sendGet();
        }
    };
    xhttp_post.open('POST','/measurechat',true);
    xhttp_post.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var date=new Date();
    randomMessage=date.getTime() + "=randomMessageId".substring(20);
    timestamp=current_time();
    xhttp_post.send("message="+ randomMessage + "&timestamp=" + timestamp + "&username=" + username);
}

function sendGet(){
    xhttp_get.onreadystatechange=function(){
        if(xhttp_post.readyState==4&&xhttp_post.status==200){
            get_num++;
            console.log("get_num="+get_num);
            console.log(xhttp_post.result); //result need to be defined!
        }
    };
    xhttp_get.open('GET', "measurechat?timestamp=" + timestamp, true);
    xhttp_get.send();
}

var current_time = function() {
        var d = new Date(Date.now());
        var datestring = d.toLocaleDateString();
        var timestring = d.toLocaleTimeString();
        return datestring.concat(" ", timestring);
    };






function timeout_get() {
    myGet = setTimeout(function () {
        xhttp.open("GET", "/measurechat", true);
        xhttp.send();
        get_num++;
        timeout_get();
    }, 1000);
    
    myPost = setTimeout(function () {
        xhttp.open("POST", "/measurechat", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("FOR TEST: POST REQUEST");
        post_num++;
        timeout_post();
    }, 1000);
}

function stop() {
    clearTimeout(myGet);
    clearTimeout(myPost);
     $("p").append("<br>");
     $("p").append("post requests: "+get_num);
     $("p").append("<br>");
     $("p").append("get request "+post_num);

    
}