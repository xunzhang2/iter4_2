var socket = io();
var xhttp;
xhttp = new XMLHttpRequest();
var get_num  = 0;
var post_num = 0;

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