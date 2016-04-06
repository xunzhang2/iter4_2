/*
Reference:
1) https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos
2) https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
3) https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
4) https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia
5) https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Parameters
*/

navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.mediaDevices.getUserMedia;

var constraints = {
    audio: false,
    video: true
};

var width = 40;    // We will scale the photo width to this
var height = 0;     // This will be computed based on the input stream
var streaming = false;
var video = document.getElementById('video');
var canvas =document.getElementById('canvas');
var startbutton = document.getElementById('startbutton');
var photo = document.getElementById('photo');
var cancelbutton = document.getElementById('cancelbutton');
//=============================================================

if (navigator.getUserMedia) 
  navigator.getUserMedia(constraints,successCallback,errorCallback);
else
  console.log("getUserMedia not supported");

//=============================================================
startbutton.addEventListener('click', function(ev){
  takepicture();
  ev.preventDefault();
}, false);

video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);

        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);


function successCallback(stream) {
  var video = document.querySelector('video');
  video.src = window.URL.createObjectURL(stream);
  
}

function errorCallback(msg, error) {
  console.log('error');
}

function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);  
      var dataurl = canvas.toDataURL('image/png');
      photo.setAttribute('src', dataurl);
      //=======================upload photo to server==============
      dataurl = encodeURIComponent(dataurl); // deal with escape characters
      // var data = {  
      //       imagename: "myImage.png",  
      //       imagedata: dataurl  
      //   };
    //   $.ajax({
    //   url:  '/chat',
    //   type: 'POST',
    //   data: data,
    //   async: true,
    //   cache: false,
    //   success: function (data) {
    //   window.location.href='/chat?imagedata='+ data.imagedata; // purpose: to render busy.jade
    //   }
    // });
    window.location.href='/chat?imagedata='+ dataurl; // purpose: to render busy.jade

//=============================================================
      
    } else {
      clearphoto();
    }
  }

function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }