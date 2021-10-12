'use strict';

var isChannelReady = false;
var isInitiator = false;
var isStarted = false;
var localStreams = new Array(); // local stream이 담겨있는 array
var thermalStreamInfo; //thermal camera에 대한 스트림 아이디 정보
var mediaCount = 1; //연결된 미디어 갯수 (마이크(audio) + 카메라) 기본적으로 마이크는 잡혀있다는 가정에 1개 카운트
var pc;
var turnReady;
var remoteAudioStream;  //관제에서 넘어오는 오디오 스트리밍
var localAudioStream; // 로봇에서 들어오는 오디오 스트리밍

var pcConfig = {
  'iceServers': [{
    urls : 'stun:stun.l.google.com:19302'
  },{
	urls: 'turn:numb.viagenie.ca',
	credential: 'muazkh',
	username: 'webrtc@live.com'
  }]
};

// Set up audio and video regardless of what devices are present.
var sdpConstraints = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true
};

/////////////////////////////////////////////

var room = 'foo';
// Could prompt for room name:
// room = prompt('Enter room name:');

var socket = io.connect();

if (room !== '') {
  socket.emit('create or join', room,'video');
  console.log('Attempted to create or  join room', room);
}

socket.on('created', function(room) {
  console.log('Created room ' + room);
  isInitiator = true;
});

socket.on('full', function(room) {
  console.log('Room ' + room + ' is full');
});

socket.on('join', function (room){
  console.log('Another peer made a request to join room ' + room);
  console.log('This peer is the initiator of room ' + room + '!');
  isChannelReady = true;
  
});

socket.on('joined', function(room) {
  console.log('joined: ' + room);
  isChannelReady = true;
  
});

socket.on('log', function(array) {
  console.log.apply(console, array);
});

////////////////////////////////////////////////

function sendMessage(message) {
  console.log('Client sending message: ', message);
  if(message == 'bye')
	socket.emit('bye','video');
  else
	socket.emit('message', message);
}


var remoteAudio = document.querySelector('#remote-audio');

// This client receives a message
socket.on('message', function(message) {
  console.log('Client received message:', message);
  if (message === 'ready monitoring') {
    maybeStart();
  } else if (message.type === 'answer' && isStarted) {
    pc.setRemoteDescription(new RTCSessionDescription(message));
  } else if (message.type === 'candidate' && isStarted) {
    var candidate = new RTCIceCandidate({
      sdpMLineIndex: message.label,
      candidate: message.candidate
    });
    pc.addIceCandidate(candidate);
  } else if (message === 'bye' && isStarted) {
    handleRemoteHangup();
  } else if (message === 'start calling'){
    remoteAudio.play()
  } else if (message === 'end calling'){
    remoteAudio.pause();
  } else if (message === 'reload'){
    window.location.reload();
  }
});

////////////////////////////////////////////////////


/*
navigator.mediaDevices.getUserMedia({
  audio: false,
  video: true
})
.then(gotStream)
.catch(function(e) {
  alert('getUserMedia() error: ' + e.name);
});
*/

async function getConnectedDevices(type){
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log("getConnectedDevices ",devices);
    return devices.filter(device => device.kind === type);
}

async function openCamera(cameraId, cameraLabel, minWidth, minHeight) {
  //console.log(cameraLabel, " ,",cameraLabel.search('PureThermal'));
  if(cameraLabel.search('PureThermal') >= 0){
    console.log('PureThermal :',cameraId);
    const constraints = {
      // 'audio' : { 'echoCancellation' : true },
      'audio': false,
      'video': {
        'deviceId': cameraId,
        'width': {'min': 80, 'ideal': 80},
        'height': {'min': 60, 'ideal': 60}
      }      
    }
    thermalStreamInfo = cameraId;
    return await navigator.mediaDevices.getUserMedia(constraints);
  }else{
    const constraints = {
        // 'audio' : { 'echoCancellation' : true },
        'audio': false,
        'video': {
          'deviceId': cameraId
          
        }
            
    }
    return await navigator.mediaDevices.getUserMedia(constraints);
  }
}

function gotStream(index, stream) {
  console.log('Adding local stream.');

  var video = document.createElement("video");
  video.id = 'localVideo' + index;
  video.autoplay = true;


  var videos = document.getElementById("videos");
  videos.appendChild(video);
  localStreams.push(stream);
  video.srcObject = stream;

  if (isInitiator) {
    maybeStart();
  }
  // localStreams에 저장된 스트림이 camera 갯수와 같다면 send Message
  console.log(localStreams.length, mediaCount);
  if(localStreams.length == mediaCount){
    sendMessage('ready remote video');
}
}

getConnectedDevices('videoinput').then(function(cameras){
  mediaCount += cameras.length;
  console.log('Create Cameras.',cameras);
  if(cameras && cameras.length > 0) {
    cameras.forEach(function(camera,index){
			openCamera(camera.deviceId,camera.label,323,720).then(
				function(stream){
          if(thermalStreamInfo == camera.deviceId)
            thermalStreamInfo = stream.id;

          console.log("thermalStreamInfo: ",thermalStreamInfo);
					gotStream(index, stream);
				}
			).catch(function(e){
        mediaCount--;
      })
		});
    
	}
});


navigator.mediaDevices.getUserMedia({
  audio: true,
  video: false
})
.then( stream => {
  localStreams.push(stream);
})
.catch(function(e) {
  alert('getUserMedia() error: ' + e.name);
});


/*var constraints = {
  video: true
};

console.log('Getting user media with constraints', constraints);

if (location.hostname !== 'localhost') {
  requestTurn(
    'https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913'
  );
}*/

function maybeStart() {
  console.log('>>>>>>> maybeStart() ', isChannelReady);
  if (!isStarted && isChannelReady) {
    console.log('>>>>>> creating peer connection');
    createPeerConnection();
    localStreams.forEach(stream => {
      pc.addStream(stream);
      console.log("stream info: ",stream);
    });
    //pc.addStream(localStream);
    isStarted = true;
    console.log('isInitiator', isInitiator);
    doCall();
  }else if(isStarted && isChannelReady){
    doCall();
  }
}

window.onbeforeunload = function() {
  sendMessage('bye');
};

/////////////////////////////////////////////////////////

function createPeerConnection() {
  try {
    pc = new RTCPeerConnection(pcConfig);
    pc.onicecandidate = handleIceCandidate;
    pc.onaddstream = handleRemoteStreamAdded;
    pc.onremovestream = handleRemoteStreamRemoved;
    console.log('Created RTCPeerConnnection');
  } catch (e) {
    console.log('Failed to create PeerConnection, exception: ' + e.message);
    alert('Cannot create RTCPeerConnection object.');
    return;
  }
}

function handleIceCandidate(event) {
  console.log('icecandidate event: ', event);
  if (event.candidate) {
    sendMessage({
      type: 'candidate',
      label: event.candidate.sdpMLineIndex,
      id: event.candidate.sdpMid,
      candidate: event.candidate.candidate
    });
  } else {
    console.log('End of candidates.');
  }
}

function handleCreateOfferError(event) {
  console.log('createOffer() error: ', event);
}

function doCall() {
  console.log('Sending thermal camera info');
  sendMessage({
    message:'thermalStreamInfo',
    infomation:thermalStreamInfo
  });
  console.log('Sending offer to peer');
  pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
}

function doAnswer() {
  console.log('Sending answer to peer.');
  pc.createAnswer().then(
    setLocalAndSendMessage,
    onCreateSessionDescriptionError
  );
}

function setLocalAndSendMessage(sessionDescription) {
  pc.setLocalDescription(sessionDescription);
  console.log('setLocalAndSendMessage sending message', sessionDescription);
  sendMessage(sessionDescription);
}

function onCreateSessionDescriptionError(error) {
  trace('Failed to create session description: ' + error.toString());
}

function requestTurn(turnURL) {
  var turnExists = false;
  for (var i in pcConfig.iceServers) {
    if (pcConfig.iceServers[i].urls.substr(0, 5) === 'turn:') {
      turnExists = true;
      turnReady = true;
      break;
    }
  }
  if (!turnExists) {
    console.log('Getting TURN server from ', turnURL);
    // No TURN server. Get one from computeengineondemand.appspot.com:
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var turnServer = JSON.parse(xhr.responseText);
        console.log('Got TURN server: ', turnServer);
        pcConfig.iceServers.push({
          'urls': 'turn:' + turnServer.username + '@' + turnServer.turn,
          'credential': turnServer.password
        });
        turnReady = true;
      }
    };
    xhr.open('GET', turnURL, true);
    xhr.send();
  }
}

function handleRemoteStreamAdded(event) {
  console.log('Remote stream added.');
  var mediaKind = event.stream.getTracks()[0].kind;
  if(mediaKind == 'audio')
    remoteAudio.srcObject = event.stream;
}

function handleRemoteStreamRemoved(event) {
  console.log('Remote stream removed. Event: ', event);
}

function hangup() {
  console.log('Hanging up.');
  stop();
  sendMessage('bye');
}

function handleRemoteHangup() {
  console.log('Session terminated.');
  stop();
  isInitiator = false;
}

function stop() {
  isStarted = false;
  pc.close();
  pc = null;
}
