<template>
<!-- 해당 페이지는 Robot(ubuntu)에서만 작동합니다.-->
  <div class="robot-remote">
    <div v-if="showContent.robotInfo" class="container robot-info">
        <div class="robot-info-labels">
          <div>ID: {{robotInfo.robotId}}</div>
          <div>UUID: {{uuid}}</div>
          <!-- <div>Agent ID: {{robotInfo.agentId}}</div> -->
          <div>Type: {{robotInfo.robotType}}</div>
          <div>Site: {{robotInfo.site}}</div>
          <div>Status: {{robotInfo.robotStatus}}</div>
        </div>
        <div v-if="showContent.robotInfo" id="videos"></div>        
    </div>
    <div v-if="showContent.notFoundFile" class=" container not-found-file">
        <div>{{notFoundFileLabel.label1}}</div>
        <div>{{notFoundFileLabel.label2}}</div>
    </div>
  </div>
</template>

<script>
import { ref,onMounted,getCurrentInstance, reactive, watch } from 'vue'

export default {
  name: 'RobotRemote',
  props: {
  },
  setup () {
    const { proxy } = getCurrentInstance();
    const API = proxy._api;

    /*WebRTC 관련 변수 */
    let roomCheck = false;
    let isChannelReady = false;
    let isInitiator = false;
    let isStarted = false;
    let localStreams = new Array(); // local stream이 담겨있는 array
    //let mediaCount = 1; //연결된 미디어 갯수 (마이크(audio) + 카메라) 기본적으로 마이크는 잡혀있다는 가정에 1개 카운트
    let pc;
    let room = ref('');
    let turnReady;

    const pcConfig = reactive({
      'iceServers': [{
        urls : 'stun:stun.l.google.com:19302'
      },{
      urls: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com'
      }]
    });

    // Set up audio and video regardless of what devices are present.
    const sdpConstraints = reactive({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
    /*                 */

    const robotInfo = reactive({
      robotId:'',
      robotType:'',
      //agentId:'',
      site:'',
      robotStatus:''
    });
    let currentRobotStatus = 'Offline';

    const uuid = ref('');
    const notFoundFileLabel = reactive({
			label1:'uuid 및 agentId를 찾지 못했습니다.',
    	label2:'Agent를 먼저 실행시켜 주세요.'
		});
		const showContent = reactive({
			robotInfo: false,
			notFoundFile: false
		})
		const getParameterByName = (name) =>{
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    const getRobotInfo = () => {
        //get robot list
        API.post('/robot-by-uuid',{robot_uuid:uuid.value}).then(
          response => {      
              robotInfo.robotId = response.data.robot_id == null ? '' : response.data.robot_id;
              //robotInfo.agentId = response.data.agent_id == null ? '' : response.data.agent_id;
              robotInfo.robotType = response.data.robot_type == null ? '' : response.data.robot_type.robot_type
              robotInfo.site = response.data.site == null ? '' : response.data.site.site_name;
              robotInfo.robotStatus = response.data.robot_status;

              //room.value = robotInfo.agentId;
              room.value = response.data.agent_id == null ? '' : response.data.agent_id;
              online();
          },
          error => {
            console.log(error.response);
          });
        setTimeout(getRobotInfo, 1000);	
    }
    const online = () => {
      //set status (Online (default: ready))
      API.put('/robot-online',{ robot_uuid:uuid.value, robot_status: currentRobotStatus}).then(
        response => {      
              
              console.log(response);
        },
        error => {
          console.log(error.response);
        });
    }
    
   

    const blobToFile = (blob, name) => {
        blob.lastModifiedDate = new Date();
        blob.name = name;
        return blob;
};
const GetFileObjectFromURL = (filePathOrUrl, convertBlob) => {
       GetFileBlobUsingURL(filePathOrUrl, function (blob) {
          convertBlob(blobToFile(blob, 'testFile.jpg'));
       });
};
const GetFileBlobUsingURL = (url, convertBlob) => {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.addEventListener('load', function() {
            convertBlob(xhr.response);
        });
        xhr.send();
};
    onMounted(() =>{


      uuid.value = getParameterByName('uuid')
      console.log(location.search);
			if(uuid.value){
        showContent.robotInfo = true;
			  getRobotInfo();
			}else{
				console.log('not found');
				showContent.notFoundFile = true;
			}		

      
      proxy._socket.on('created', function(room) {
        console.log('Created room ' + room);
        isInitiator = true;
      });

      proxy._socket.on('full', function(room) {
        console.log('Room ' + room + ' is full');
      });

      proxy._socket.on('join', function (room){
        console.log('Another peer made a request to join room ' + room);
        console.log('This peer is the initiator of room ' + room + '!');
        isChannelReady = true;
        
      });

      proxy._socket.on('joined', function(room) {
        console.log('joined: ' + room);
        isChannelReady = true;
        
      });

      proxy._socket.on('log', function(array) {
        console.log.apply(console, array);
      });

      // This client receives a message
      proxy._socket.on('message', function(message) {
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
        } else if (message === 'bye'  && isStarted) {
          
          handleRemoteHangup();
        } else if (message === 'reload'){
          window.location.reload();
        }
      });

      proxy._socket.on('robotStatus', function(robotStatus) {
        console.log('robotStatus: ' + robotStatus);
        currentRobotStatus = robotStatus;
        
      });

      getConnectedDevices('videoinput').then(function(cameras){
        //mediaCount += cameras.length;
        console.log('Create Cameras.',cameras);
        if(cameras && cameras.length > 0) {
          cameras.forEach(function(camera,index){
            openCamera(camera.deviceId).then(
              function(stream){
                gotStream(index, stream);
              }
            ).catch(function(e){
              console.log(e)
            })
          });
          
        }
      });

    
      window.onbeforeunload = function() {
        sendMessage('bye');
        
      };
    })
    watch(
      () => room.value,
      (roomName, beforeRoomName) => {
        console.log(beforeRoomName, roomName);
        if(roomName !== ''){
          proxy._socket.emit('create or join', roomName,'video');
          console.log('Attempted to create or  join room', roomName);
        }else{
          sendMessage('bye');
        }
    });

    const sendMessage = (message, roomName) => {
      console.log('Client sending message: ', message);
      if(message == 'bye')
      proxy._socket.emit('bye', 'robot');
      else
      proxy._socket.emit('message', message);
    }

    const gotStream = (index, stream) => {
      console.log('Adding local stream.');

      var video = document.createElement("video");
      video.id = 'localVideo' + index;
      video.style.width = '50%';
      video.style.height = '50%';
      video.autoplay = true;


      var videos = document.getElementById("videos");
      videos.appendChild(video);
      localStreams.push(stream);
      video.srcObject = stream;

      if (isInitiator) {
        maybeStart();
      }
      // localStreams에 저장된 스트림이 camera 갯수와 같다면 send Message
      //console.log(localStreams.length, mediaCount);
      //if(localStreams.length == mediaCount){
        sendMessage('ready remote video');
      //}
    }

    const maybeStart = () => {
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

    const createPeerConnection = () => {
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

    const handleIceCandidate = (event) => {
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

    const handleCreateOfferError = (event) => {
      console.log('createOffer() error: ', event);
    }

    const doCall = () => {
      console.log('Sending offer to peer');
      pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
    }

    const doAnswer = () => {
      console.log('Sending answer to peer.');
      pc.createAnswer().then(
        setLocalAndSendMessage,
        onCreateSessionDescriptionError
      );
    }

    const setLocalAndSendMessage = (sessionDescription) => {
      pc.setLocalDescription(sessionDescription);
      console.log('setLocalAndSendMessage sending message', sessionDescription);
      sendMessage(sessionDescription);
    }

    const onCreateSessionDescriptionError = (error) => {
      console.log('Failed to create session description: ' + error.toString());
    }

    const requestTurn = (turnURL) => {
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

    const handleRemoteStreamAdded = (event) => {
      console.log('Remote stream added.');
      
    }

    const handleRemoteStreamRemoved = (event) => {
      console.log('Remote stream removed. Event: ', event);
    }

    const hangup = () => {
      console.log('Hanging up.');
      stop();
      sendMessage('bye');
    }

    const handleRemoteHangup = () => {
      console.log('Session terminated.');
      stop();
      isInitiator = false;
    }

    const stop = () => {
      isStarted = false;
      pc.close();
      pc = null;
    }

    const getConnectedDevices = async (type) => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log("getConnectedDevices ",devices);
        return devices.filter(device => device.kind === type);
    }

    const openCamera = async (cameraId) => { 
      const constraints = {
          'audio': false,
          'video': {
            'deviceId': cameraId            
          }
      }
      return await navigator.mediaDevices.getUserMedia(constraints);
    }

    return{
        notFoundFileLabel,
        robotInfo,
        uuid,
        room,
        watch,
				showContent
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.robot-remote{
    width: 100%;
    height: 100%;
}

.container{
    width: 100%;
    height: 100%;
    font-family: HDharmonyM;
    font-size: 40px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: #fff;
}
.not-found-file{
    text-align: center;
    margin-top: 350px;
}
.robot-info{
    text-align: left;
    display: flex;
}
.robot-info-labels{
    margin: 200px 20px 0;
    width: 50%;
}
#videos{
  flex:1;
}
#videos video{
  width: 50%;
  height: 50%;
}
.not-found-file div, .robot-info div{
	margin-bottom: 10px;
}

</style>
