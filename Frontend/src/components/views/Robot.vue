<template>
	<div class="robot">
		<div class="side-panel">
			<div class="info-title">
				<img src="../../assets/ic_description.png"><div>정보</div>
			</div>
			<div class="sidenav">
				<button @click="changePanel('map',$event)" v-bind:style="styles.sideButton" class="dropdown-btn">로봇</button>
				<div class="dropdown-container">
					<!-- <div>ID: {{robotInfo.robotId}}</div>
					<div>Type: {{robotInfo.robotType}}</div>
					<div>batteryStatus: {{robotInfo.batteryStatus}}</div>
					<div>batteryStatusVoltage: {{robotInfo.batteryStatusVoltage}}</div> -->
          <div id="battery-container">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div id="robot-info">
            <div>{{robotInfo.robotId}}</div>
            <div>(Type: {{robotInfo.robotType}})</div>
          </div>
					<!-- <div>Sensors: {{robotInfo.robotType}}</div> -->
				</div>

				<button @click="changePanel('task',$event)" class="dropdown-btn">업무</button>
				<div class="dropdown-container">

				</div>
            
				<button @click="changePanel('logData',$event)" class="dropdown-btn">로그 데이터 </button>
				<div class="dropdown-container">
					<!-- <a href="#">Link 1</a>
					<a href="#">Link 2</a>
					<a href="#">Link 3</a> -->
				</div>

        <button @click="changePanel('controller',$event)" class="dropdown-btn">컨트롤러</button>
				<div class="dropdown-container">
          <div class="controller-toggle-container">
            <label class="switch">
              <input type="checkbox" v-model="controllerUse">
              <span class="slider round"></span>
            </label>
          </div>
          <div class="controller-type-container" id="controller-type-group">
            <button v-on:click="changeController($event, 'joypad')">조이패드</button>
            <button v-on:click="changeController($event, 'joystick')">조이스틱</button>
          </div>
          <div v-show="controllerType==='joypad'" class="controller-button-function-container" id="joypad-buttons">
            <div>
              <div></div><span>Button 1</span>
              <select v-model="joypadButton[0]" class="work-list">
                <option v-for="(work, index) in workList" :key="index" :value="work" >{{work.data.workType}}</option>
              </select>
            </div>
            <div>
              <div></div><span>Button 2</span>
              <select v-model="joypadButton[1]" class="work-list">
                <option v-for="(work, index) in workList" :key="index" :value="work" >{{work.data.workType}}</option>
              </select>
            </div>
            <div>
              <div></div><span>Button 3</span>
              <select v-model="joypadButton[2]" class="work-list">
                <option v-for="(work, index) in workList" :key="index" :value="work" >{{work.data.workType}}</option>
              </select>
            </div>
            <div>
              <div></div><span>Button 4</span>
              <select v-model="joypadButton[3]" class="work-list">
                <option v-for="(work, index) in workList" :key="index" :value="work" >{{work.data.workType}}</option>
              </select>
            </div>
            <div>
              <div></div><span>Button 5</span>
              <select v-model="joypadButton[4]" class="work-list">
                <option v-for="(work, index) in workList" :key="index" :value="work" >{{work.data.workType}}</option>
              </select>
            </div>
            <div>
              <div></div><span>Button 6</span>
              <select v-model="joypadButton[5]" class="work-list">
                <option v-for="(work, index) in workList" :key="index" :value="work" >{{work.data.workType}}</option>
              </select>
            </div>
            <div>
              <div></div><span>Button 7</span>
              <select v-model="joypadButton[6]" class="work-list">
                <option v-for="(work, index) in workList" :key="index" :value="work" >{{work.data.workType}}</option>
              </select>
            </div>
            <div>
              <div></div><span>Button 8</span>
              <select v-model="joypadButton[7]" class="work-list">
                <option v-for="(work, index) in workList" :key="index" :value="work" >{{work.data.workType}}</option>
              </select>
            </div>
          </div>
          <div v-show="controllerType==='joystick'" class="controller-button-function-container" id="joystick-buttons">
            <div>
              <div></div><span>Button 1</span>
              <select v-model="joystickButton[0]" class="work-list">
                <option v-for="(work, index) in workList" :key="index" :value="work" >{{work.data.workType}}</option>
              </select>
            </div>
            <div>
              <div></div><span>Button 2</span>
              <select v-model="joystickButton[1]" class="work-list">
                <option v-for="(work, index) in workList" :key="index" :value="work" >{{work.data.workType}}</option>
              </select>
            </div>
            <div>
              <div></div><span>Button 3</span>
              <select v-model="joystickButton[2]" class="work-list">
                <option v-for="(work, index) in workList" :key="index" :value="work" >{{work.data.workType}}</option>
              </select>
            </div>
            <div>
              <div></div><span>Button 4</span>
              <select v-model="joystickButton[3]" class="work-list">
                <option v-for="(work, index) in workList" :key="index" :value="work" >{{work.data.workType}}</option>
              </select>
            </div>
            <div>
              <div></div><span>Button 5</span>
              <select v-model="joystickButton[4]" class="work-list">
                <option v-for="(work, index) in workList" :key="index" :value="work" >{{work.data.workType}}</option>
              </select>
            </div>
            <div>
              <div></div><span>Button 6</span>
              <select v-model="joystickButton[5]" class="work-list">
                <option v-for="(work, index) in workList" :key="index" :value="work" >{{work.data.workType}}</option>
              </select>
            </div>
            <div>
              <div></div><span>Button 7</span>
              <select v-model="joystickButton[6]" class="work-list">
                <option v-for="(work, index) in workList" :key="index" :value="work" >{{work.data.workType}}</option>
              </select>
            </div>
          </div>
				</div>
			</div>
		</div>

		<div class="complex-panel">
			<div class="complex-panel-main complex-panel-item">
        <div class="complex-panel-main-info">
          <!-- <div class="title"><img src="../../assets/ic_location.png"><div>지도</div></div> -->
          <!-- a태그 안에는 선택한 맵 이름 가져오기 -->
          <div class="location-label">위치<span>{{siteInfo.siteName}}</span> (x:{{robotInfo.x}}, y:{{robotInfo.y}})</div>
          
          <div class="follow-view">
              <input type="checkbox" v-model="viewFocusFlag">
            <img src="../../assets/ic_location@2x.png" @click="activeFollowView">
            <div>View Focus</div>
          </div>

           
            <label id="init-pose-button" class="check-button" >
              <input type="checkbox" v-model="initPoseFlag">
              <span class="check-button-background">InitPose</span>
            </label>

            <label id="nav-goal-button" class="check-button" >
              <input type="checkbox" v-model="navGoalFlag">
              <span class="check-button-background">NavGoal</span>
            </label>

          <div id="e-stop" @click="stopRobot">
            E-Stop 
          </div>

          <div class="zoom-box">
            <img src="../../assets/ic_zoom_out@2x.png" @click="zoomOut">
            <img src="../../assets/ic_zoom_in@2x.png" @click="zoomIn">
            <div>{{canvasScale}}%</div>
          </div>
        </div>
				<!-- <div class="map-canvas" @mousedown="activeCanvasMove($event)" ><img id="map" :src= siteInfo.mapImgFile	ondragstart="return false"></div> -->
        <div id="map">
          <canvas id="map-canvas"></canvas>
          <img id="robot-icon" src="../../assets/robot.png" style="display:none;">
          <img id="goal-icon" src="../../assets/goal.png" style="display:none;">
        </div>

        
				<MapManager v-if="complexPanel.mapManager"></MapManager>
				<TaskManager v-if="complexPanel.taskManager"></TaskManager>
			</div>

			<div class="complex-panel-side">
				<div class="complex-panel-item">
					<div class="title"><img src="../../assets/ic_camera.png"><div>정면 카메라</div></div>
					<video id="front_cam"></video>
				</div>
				<div class="complex-panel-item">
					<div class="title"><img src="../../assets/ic_camera.png"><div>좌측 카메라</div></div>
					<video id="left_cam"></video>
				</div>
				<div class="complex-panel-item">
					<div class="title"><img src="../../assets/ic_camera.png"><div>우측 카메라</div></div>
					<video id="right_cam"></video>
				</div>
				<div class="complex-panel-item">
					<div class="title"><img src="../../assets/ic_camera.png"><div>후면 카메라</div></div>
					<video id="rear_cam"></video>
				</div>      
			</div>
		</div>
	</div>
</template>

<script>
import YAML from 'yaml'
import MapManager from './robot/MapManager.vue'
import TaskManager from './robot/TaskManager.vue'
import { getCurrentInstance, reactive, onMounted, ref,watch } from 'vue'

export default {
  name: 'Robot',
  components: {MapManager,TaskManager},
  props: {
  },
  setup () {
    const { proxy } = getCurrentInstance();
    //controller interval
    let controllerInterval = null;
    let controllerType = ref('');
    const speed = reactive({
      v: 0,
      w: 0
    })
    const speedScale = reactive({
      v: 0.5,
      w: 0.7
    })

    //로봇 제어 변수
    const initPoseFlag = ref(false);
    const navGoalFlag = ref(false);

    //view 제어 flag
    const viewFocusFlag = ref(true);
    
    //WebRTC 변수's
    let isChannelReady= false;
    let isInitiator= false;
    let isStarted= false;
    let pc=null;
    let remoteStreams= new Array();
    let remoteStreamIndex = 0;
    let pcConfig= {
        'iceServers': [{
            urls : 'stun:stun.l.google.com:19302'
        },{
            urls: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com'
        }]
    };
		let robotInfo = reactive({
      robotId: sessionStorage.getItem('robotId'),
      robotAgentId: sessionStorage.getItem('robotAgentId'), // == room id
      robotType: sessionStorage.getItem('robotType'),
      batteryStatus: 0,
      batteryStatusVoltage: 0,
      x: 0,  // test code
      y: 0,   // test code
      degree: 0
    });
    const robotPoseInMap = reactive({
      x: -99999,
      y: -99999
    })
		let siteInfo = reactive({
      siteName:sessionStorage.getItem('siteName'),
      mapImgFile:sessionStorage.getItem('mapImageFile'),
      mapInfo:{
        width: sessionStorage.getItem('mapImageWidth') *1,
        height: sessionStorage.getItem('mapImageHeight') *1,
        resolution: 0,
        origin: [0, 0, 0],
        negate: 0,
        occupied_thresh: 0,
        free_thresh: 0
      }
    });
    
    let styles = reactive({
			sideButton:{
			}
    });
    //테스트 코드
    const joypadButton = reactive([null,null,null,null,null,null,null,null])
    const joystickButton = reactive([null,null,null,null,null,null,null])
    const workList = reactive([{
      data:{
        workType:'work 1',
        command: 0
      },
      used:false
    },{
      data:{
        workType:'work 2',
        command: 0
      },
      used:false
    },{
      data:{
        workType:'work 3',
        command: 0
      },
      used:false
    },{
      data:{
        workType:'work 4',
        command: 0
      },
      used:false
    },{
      data:{
        workType:'work 5',
        command: 0
      },
      used:false
    },{
      data:{
        workType:'work 6',
        command: 0
      },
      used:false
    },{
      data:{
        workType:'work 7',
        command: 0
      },
      used:false
    }]);

    /* Canvas 변수 */
    let lastX, lastY;
    let dragStart;
    let poseStart;
    let goalPose;
    let poseEnd;
    let navGoalArrowLength = 100;

    let canvasScale = ref(100);
    const canvasScaleArray = reactive([25,50,75,100,125,150,175,200,400,500]);
    let canvasScaleIndex = 3;
    let followView = true;
    			
    //이미지 객체 생성
    var canvasImg = new Image();

    let complexPanel = reactive({
      mapManager:true,
			taskManager:false
    });
		const mousePos = reactive({
			x: 0,
			y: 0
		});
		const scrollPos = reactive({
			x: 0,
			y: 0
		})
    const controllerUse = ref(false);
    const goSiteList = () =>{
      proxy._router.push("/select/site-list");
    }
    const changePanel = (panel,event) =>{
			var dropdown = document.getElementsByClassName("dropdown-btn");
			for (var i = 0; i < dropdown.length; i++) {
				if(dropdown[i] != event.currentTarget)
					dropdown[i].style.backgroundColor = "#004282";
				else
					dropdown[i].style.backgroundColor = "#05a951";
			}
			
			var dropdownContent = event.currentTarget.nextElementSibling;
			var dropdownContainer = document.getElementsByClassName("dropdown-container");
			for (var j = 0; j < dropdownContainer.length; j++) {
				if(dropdownContainer[j] != dropdownContent){
					if(dropdownContainer[j].style.height != "0px"){
						dropdownContainer[j].style.height = "0px";
					}
				}
			}

      switch(panel){
        case 'map':
          complexPanel.mapManager = true;
          complexPanel.taskManager = false;
					dropdownContent.style.height = "200px";
          break;
        case 'task':
          complexPanel.mapManager = false;
          complexPanel.taskManager = true;
					
					dropdownContent.style.height = "600px";
          break;
        case 'logData':
          complexPanel.mapManager = false;
          complexPanel.taskManager = false;
					
					dropdownContent.style.height = "96px";
          break;
        case 'controller':
          complexPanel.mapManager = false;
          complexPanel.taskManager = false;
					
					dropdownContent.style.height = "500px";
          break;
        
      }
    }
		const activeCanvasMove = (event) => {
			mousePos.x = event.clientX;
			mousePos.y = event.clientY;
			
			event.currentTarget.onmouseup  = deactiveCanvasMove;
			event.currentTarget.onmouseout = deactiveCanvasMove;
			event.currentTarget.onmousemove  = canvasMove;
		}
		const deactiveCanvasMove = (event) => {
			scrollPos.x = event.currentTarget.scrollLeft;
			scrollPos.y = event.currentTarget.scrollTop;
			event.currentTarget.onmouseup = null;
			event.currentTarget.onmousemove  = null;
		}
		const canvasMove = (event) => {
			event.currentTarget.scrollTo(scrollPos.x + (event.clientX - mousePos.x), scrollPos.y + (event.clientY - mousePos.y))
		}
    
    const zoomIn = () => {
      if(canvasScaleIndex < canvasScaleArray.length - 1){
        canvasScale.value = canvasScaleArray[++canvasScaleIndex];
        zoom(canvasScale.value);
      }      
    }
    const zoomOut = () => {
      if(canvasScaleIndex > 0){
        canvasScale.value = canvasScaleArray[--canvasScaleIndex];
        zoom(canvasScale.value);
      }
    }
    const sendMessage = (message) => {
      console.log('Client sending message: ', message);
      if(message == 'bye')
        proxy._socket.emit('bye','monitor');
      else
        proxy._socket.emit('message', message);
    }
    const maybeStart = () => {
      console.log('>>>>>>> maybeStart() ', isStarted, isChannelReady);
      if (!isStarted && isChannelReady) {
        console.log('>>>>>> creating peer connection');
        createPeerConnection();
        isStarted = true;
        console.log('isInitiator', isInitiator);
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
      console.log('Failed to create session description: ',error.toString());
    }
    const requestTurn = (turnURL) => {
      var turnExists = false;
      for (var i in pcConfig.iceServers) {
        if (pcConfig.iceServers[i].urls.substr(0, 5) === 'turn:') {
        turnExists = true;
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
          }
        };
        xhr.open('GET', turnURL, true);
        xhr.send();
      }
    }
    const handleRemoteStreamAdded = (event) => {
      var mediaKind = event.stream.getTracks()[0].kind;
      if(mediaKind == 'video'){
        /*
          현재는 카메라 1대만 운용하는 것으로하며, 차후에 카메라 여러대 붙일 때 수정
        */
 //       if(event.stream.id != thermalStreamId){
          var video = document.querySelector('#front_cam');
          remoteStreams[remoteStreamIndex] = event.stream;
          video.srcObject = remoteStreams[remoteStreamIndex++];
          video.controls = true;
        // }else{
        //   //receive thermal stream
        //   this.thermalStream = event.stream;
        // }      
      }
    }
    const handleRemoteStreamRemoved = (event) => {
      console.log('Remote stream removed. Event: ', event);
    }
    const handleRemoteHangup = () => {
      console.log('Session terminated.');
      stop();

      isInitiator = false;
    }
    const stop = () => {
      isStarted = false;
      if(pc != null){
        pc.close();
        pc = null;
      }
      controllerUse.value = false;
      sendMessage('bye');

      proxy._socket.off('created');
      proxy._socket.off('full');
      proxy._socket.off('join');
      proxy._socket.off('joined');
      proxy._socket.off('log');
      proxy._socket.off('message');
    }
    const resetMedia = () => {
      remoteStreams = [];
      remoteStreamIndex = 0;
      console.log("Peerconnection close");
      pc = null;
      isStarted = false;
    }
    const changeController = (event, value) => {
      var button_group = document.getElementById("controller-type-group").children;
      button_group.forEach((button) => {
        if(button == event.currentTarget){
          button.style.backgroundColor  = '#004282';
          button.style.color  = 'white';
        }else{
          button.style.backgroundColor  = '#ccc';
          button.style.color  = 'black';
        }
      });
      controllerType.value = value;

    }

    /*  Canvas */
    const redraw = () => {
      let canvas = document.getElementById('map-canvas');
      let ctx = canvas.getContext('2d');

      // map(0,0)
      var initPose = calRobotPoseFromMapToImage({x:0,y:0});
      let scale = canvasScaleArray[canvasScaleIndex];
      
      if(viewFocusFlag.value){
        let matrix = ctx.getTransform();
        let robotPose = calRobotPoseFromMapToImage(robotInfo);
        ctx.setTransform(matrix.a ,matrix.b, matrix.c, matrix.d, (canvas.width/2) - robotPose.x*scale*0.01, (canvas.height/2) - robotPose.y*scale*0.01);
      }

			// Clear the entire canvas
			var p1 = ctx.transformedPoint(0,0);
			var p2 = ctx.transformedPoint(canvas.width, canvas.height);
			ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);
			ctx.drawImage(canvasImg,0,0, siteInfo.mapInfo.width, siteInfo.mapInfo.height);

      


      ctx.beginPath();
      ctx.strokeStyle =" #ff0000";
      ctx.fillStyle =" #ff0000";
      ctx.arc(initPose.x, initPose.y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      
      

      //nav goal arrow
      if(poseStart){
        lineDrawing(ctx, poseStart, poseEnd,'red');
        arrowDrawing(ctx, poseStart, poseEnd,'red');
      }
      if(goalPose){
        var goal = document.getElementById('goal-icon');
        var goalImgW = goal.width/2;
        var goalImgH = goal.height/2;
        ctx.save();
       
        //ctx.drawImage(goal, -(robotImgW/4), -goalImgH, goalImgW, goalImgH);
        ctx.drawImage(goal, goalPose.x-(goalImgW/2), goalPose.y-goalImgH, goalImgW, goalImgH);
        ctx.restore();
      }
      // robot 
      ctx.beginPath();
        ctx.strokeStyle = "#0000ff40";
      ctx.fillStyle =" #0000ff40";
      ctx.arc(robotPoseInMap.x, robotPoseInMap.y, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      var robot = document.getElementById('robot-icon');
      var robotImgW = robot.width / 2;
      var robotImgH = robot.height / 2;
      ctx.save();
      ctx.translate( robotPoseInMap.x, robotPoseInMap.y);
      ctx.rotate(robotInfo.degree * (-1));
      ctx.drawImage(robot, -(robotImgW/2), -(robotImgH/2), robotImgW, robotImgH);
      ctx.restore();

		}
    var calRobotPoseFromMapToImage = function(inputPose) {
       var result = {x: 0 , y: 0};
      result.y = ((siteInfo.mapInfo.height * siteInfo.mapInfo.resolution) - (siteInfo.mapInfo.origin[1] + inputPose.y)) / siteInfo.mapInfo.resolution;
      result.x =  (inputPose.x + siteInfo.mapInfo.origin[0]) / siteInfo.mapInfo.resolution;
      
      return result;
    }
    var calPoseFromImageToMap = function(inputPose) {
      const result = {x: 0 , y: 0}

      result.y = ((siteInfo.mapInfo.height * siteInfo.mapInfo.resolution) - (inputPose.y * siteInfo.mapInfo.resolution)) - siteInfo.mapInfo.origin[1];
      result.x =  (inputPose.x *siteInfo.mapInfo.resolution) - siteInfo.mapInfo.origin[0];
      //console.log('calPoseFromImageToMap: ',result);
      return result;
    }
    const activeFollowView = () => {
      if(viewFocusFlag.value)
        viewFocusFlag.value = false;
      else
        viewFocusFlag.value = true;
      redraw();
    }
    const zoom = (scale) => {
      let canvas = document.getElementById('map-canvas');
      let ctx = canvas.getContext('2d');
			var pt = ctx.transformedPoint(lastX,lastY);
			ctx.translate(pt.x,pt.y);
      let matrix = ctx.getTransform();
      ctx.setTransform(1,matrix.b, matrix.c, 1,matrix.e, matrix.f);
			ctx.scale(scale*0.01, scale*0.01);
			ctx.translate(-pt.x,-pt.y);
			redraw();
		}
    
    const trackTransforms = (ctx) => {
      var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
      var xform = svg.createSVGMatrix();
      ctx.getTransform = function(){ return xform; };
      
      var savedTransforms = [];
      var save = ctx.save;
      ctx.save = function(){
        savedTransforms.push(xform.translate(0,0));
        return save.call(ctx);
      };
      var restore = ctx.restore;
      ctx.restore = function(){
        xform = savedTransforms.pop();
        return restore.call(ctx);
      };

      var scale = ctx.scale;
      ctx.scale = function(sx,sy){
        xform = xform.scaleNonUniform(sx,sy);
        return scale.call(ctx,sx,sy);
      };
      var rotate = ctx.rotate;
      ctx.rotate = function(radians){
        xform = xform.rotate(radians*180/Math.PI);
        return rotate.call(ctx,radians);
      };
      var translate = ctx.translate;
      ctx.translate = function(dx,dy){
        xform = xform.translate(dx,dy);
        return translate.call(ctx,dx,dy);
      };
      var transform = ctx.transform;
      ctx.transform = function(a,b,c,d,e,f){
        var m2 = svg.createSVGMatrix();
        m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
        xform = xform.multiply(m2);
        return transform.call(ctx,a,b,c,d,e,f);
      };
      var setTransform = ctx.setTransform;
      ctx.setTransform = function(a,b,c,d,e,f){
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(ctx,a,b,c,d,e,f);
      };
      var pt  = svg.createSVGPoint();
      ctx.transformedPoint = function(x,y){
        pt.x=x; pt.y=y;
        return pt.matrixTransform(xform.inverse());
      }
	  }
    const lineDrawing = (ctx, startPoint, endPoint, color) => {
      if (ctx != null) {
        var aWidth = 3;

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = aWidth;
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
        ctx.restore();
      }
    }
    const arrowDrawing = (ctx, startPoint, endPoint, color) => {
      //console.log(startPoint, endPoint);
      if (ctx != null) {
        var aLength = 12;
        var dx = endPoint.x - poseStart.x;
        var dy = endPoint.y - poseStart.y;
        var angle = Math.atan2(dy, dx);
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.beginPath();

        ctx.moveTo(endPoint.x, endPoint.y);
        ctx.lineTo(endPoint.x-aLength*Math.cos(angle-Math.PI/7),endPoint.y-aLength*Math.sin(angle-Math.PI/7));
                
        //path from the side point of the arrow, to the other side point
        ctx.lineTo(endPoint.x-aLength*Math.cos(angle+Math.PI/7),endPoint.y-aLength*Math.sin(angle+Math.PI/7));
                
        //path from the side point back to the tip of the arrow, and then again to the opposite side point
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.lineTo(endPoint.x-aLength*Math.cos(angle-Math.PI/7),endPoint.y-aLength*Math.sin(angle-Math.PI/7));

        //draws the paths created above
        ctx.stroke();
        ctx.fill();
      }
    }
    const sendNavGoal = (goal) => {
     
      proxy._socket.emit('navGoal',goal);
    }
    const setInitPose = (pose) => {
      proxy._socket.emit("initPose",pose);
    }
    const stopRobot = () => {
      proxy._socket.emit("stopRobot");
    }
    onMounted(() => {
    
      // Map 세팅파일(yaml) 다운로드
      fetch(sessionStorage.getItem('mapYamlFile'))
        .then( 
          //r => r.text(),
          r => {
            r.text().then((text) => {
              var yamlObj = YAML.parse(text + "");
              siteInfo.mapInfo.origin[0] = yamlObj.origin[0]*(-1);  //origin x
              siteInfo.mapInfo.origin[1] = yamlObj.origin[1]*(-1);  // origin y
              siteInfo.mapInfo.origin[2] = yamlObj.origin[2];
              siteInfo.mapInfo.resolution = yamlObj.resolution;
              siteInfo.mapInfo.negate = yamlObj.negate;
              siteInfo.mapInfo.occupied_thresh = yamlObj.occupied_thresh;
              siteInfo.mapInfo.free_thresh = yamlObj.free_thresh;          
              redraw();   
            });
          })


			var dropdown = document.getElementsByClassName("dropdown-btn");
			dropdown[0].style.backgroundColor = "#05a951";
			dropdown[0].nextElementSibling.style.height = "200px";

      
      var canvas = document.getElementById('map-canvas');
      canvas.width=1198, canvas.height=904;
      var ctx = canvas.getContext("2d");
      //페이지 로드후 이미지가 로드 되었을 때 이미지 출력
      canvasImg.addEventListener('load', function(){
          //로드된 이미지를 캔버스에 출력
 
          //canvas.drawImage() 함수를 사용하여 이미지 출력
          ctx.drawImage( canvasImg ,0,0, siteInfo.mapInfo.width, siteInfo.mapInfo.height); 
          redraw();   
      },false);

      canvasImg.src = siteInfo.mapImgFile;
      
      
		  trackTransforms(ctx);
		
      lastX=canvas.width/2, lastY=canvas.height/2;
 
      canvas.addEventListener('mousedown',function(evt){
        viewFocusFlag.value = false;
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        
        if(navGoalFlag.value || initPoseFlag.value){
          poseStart = ctx.transformedPoint(lastX,lastY);
        }else{
          dragStart = ctx.transformedPoint(lastX,lastY);
        }
      },false);
      canvas.addEventListener('mousemove',function(evt){
        
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        if(poseStart){
          
          let pt = ctx.transformedPoint(lastX,lastY);
          var dx = pt.x - poseStart.x;
          var dy = pt.y - poseStart.y;
          var length = Math.sqrt(dx * dx + dy * dy);
          if(length > navGoalArrowLength){
            var angle = Math.atan2(dy, dx);
            poseEnd = {
              x:(Math.cos(angle) * navGoalArrowLength) + poseStart.x,
              y:(Math.sin(angle) * navGoalArrowLength) + poseStart.y
            }
          }else
            poseEnd = pt;
          redraw();
        }
        if (dragStart){
          let pt = ctx.transformedPoint(lastX,lastY);
          ctx.translate(pt.x-dragStart.x, pt.y-dragStart.y);
          redraw();    
        }
        
      },false);
      canvas.addEventListener('mouseup',function(evt){
        if(poseStart){
          controllerUse.value = false;
          //monitorData에서 robotStatus의 상태가 ready일때만 동작함
          var pose = calPoseFromImageToMap(poseStart);
          let pt = ctx.transformedPoint(lastX,lastY);
          var dx = pt.x - poseStart.x;
          var dy = pt.y - poseStart.y;
          pose.degree = Math.atan2(dy, dx);
          
          if(navGoalFlag.value){
            goalPose = poseStart;
            sendNavGoal(pose);
            navGoalFlag.value = false;
          }if(initPoseFlag.value){
            setInitPose(pose);
            initPoseFlag.value = false;
          }
          poseStart = null;
        }
        dragStart = null;
        redraw();
      },false);

      proxy._eventBus.on('closeRoom', () => {
        handleRemoteHangup();
      })

      proxy._socket.emit('create or join', robotInfo.robotAgentId);

      proxy._socket.on('created', room => {
          console.log('Created room ' + room);
          isInitiator = true;
      });

      proxy._socket.on('full', room => {
          console.log('Room ' + room + ' is full');
      });

      proxy._socket.on('join', room => {
        console.log('Another peer made a request to join room ' + room);
        console.log('This peer is the initiator of room ' + room + '!');
        isChannelReady = true;
      });

      proxy._socket.on('joined', room => {
        console.log('joined: ' + room);
        
        sendMessage('ready monitoring');
        isChannelReady = true;
      });

      proxy._socket.on('log', array => {
          console.log.apply(console, array);
      });

      // This client receives a message
      proxy._socket.on('message', message => {
        console.log('Client received message:', message);
        console.log(isInitiator, isStarted);
            
        if (message.type === 'offer') {
            if (!isInitiator && !isStarted) {
                maybeStart();
            }
            
            pc.setRemoteDescription(new RTCSessionDescription(message));
            doAnswer();
        }else if (message.type === 'candidate' && isStarted) {
            var candidate = new RTCIceCandidate({
                sdpMLineIndex: message.label,
                candidate: message.candidate
            });
            pc.addIceCandidate(candidate);
        } else if (message === 'bye' && isStarted) {
            handleRemoteHangup();
        } else if(message === 'ready remote video'){
                
            resetMedia();
            sendMessage('ready monitoring');
        }
      });

      proxy._eventBus.on('reload-video',()=>{
        sendMessage('reload');
      });

      window.onbeforeunload = function(){
        handleRemoteHangup();
      };
      window.onpopstate = function(){
        handleRemoteHangup();
      };

      // socket
      proxy._socket.on('battery', (batteryStatus, batteryStatusVoltage) => {
        robotInfo.batteryStatus = batteryStatus;
        var batterys = document.getElementById("battery-container").children;

        if(robotInfo.batteryStatus == 0){
          batterys.foreach((battery,index) =>{
            battery.style.opacity="0";
          })
        }else if(robotInfo.batteryStatus > 0 && robotInfo.batteryStatus <= 0.125){
          batterys[0].style.opacity="1";
          batterys[1].style.opacity="0";
          batterys[2].style.opacity="0";
          batterys[3].style.opacity="0";
          
        }else if(robotInfo.batteryStatus > 0.125 && robotInfo.batteryStatus <= 0.25){
          batterys[0].style.opacity="1";
          batterys[1].style.opacity="0";
          batterys[2].style.opacity="0";
          batterys[3].style.opacity="0";
        }else if(robotInfo.batteryStatus > 0.25 && robotInfo.batteryStatus <= 0.375){
          batterys[0].style.opacity="1";
          batterys[1].style.opacity="1";
          batterys[2].style.opacity="0";
          batterys[3].style.opacity="0";
        }else if(robotInfo.batteryStatus > 0.375 && robotInfo.batteryStatus <= 0.5){
          batterys[0].style.opacity="1";
          batterys[1].style.opacity="1";
          batterys[2].style.opacity="0";
          batterys[3].style.opacity="0";
        }else if(robotInfo.batteryStatus > 0.5 && robotInfo.batteryStatus <= 0.625){
          batterys[0].style.opacity="1";
          batterys[1].style.opacity="1";
          batterys[2].style.opacity="1";
          batterys[3].style.opacity="0";
        }else if(robotInfo.batteryStatus > 0.625 && robotInfo.batteryStatus <= 0.75){
          batterys[0].style.opacity="1";
          batterys[1].style.opacity="1";
          batterys[2].style.opacity="1";
          batterys[3].style.opacity="0";
        }else if(robotInfo.batteryStatus > 0.75 && robotInfo.batteryStatus <= 0.875){
          batterys[0].style.opacity="1";
          batterys[1].style.opacity="1";
          batterys[2].style.opacity="1";
          batterys[3].style.opacity="1";
        }else if(robotInfo.batteryStatus > 0.875){
          batterys[0].style.opacity="1";
          batterys[1].style.opacity="1";
          batterys[2].style.opacity="1";
          batterys[3].style.opacity="1";
        }


        robotInfo.batteryStatusVoltage = batteryStatusVoltage;
      })
      // socket
      proxy._socket.on('position', (position) => {
        robotInfo.x = (position.x * 1).toFixed(3) * 1;
        robotInfo.y = (position.y * 1).toFixed(3) * 1;
        robotInfo.degree = position.degree * 1;
      })

		})
    watch(
      () => navGoalFlag.value,
      (flag) => {
        if(flag){
          initPoseFlag.value = false;
          controllerUse.value = false;
        }
      }
    )
    watch(
      () => initPoseFlag.value,
      (flag) => {
        if(flag){
          navGoalFlag.value = false;
          controllerUse.value = false;
        }
      }
    )
    watch(
      () => [robotInfo.x,robotInfo.y],
      (position) => {
        //var pose = calRobotPoseFromMapToImage(robotInfo);
        var pose = calRobotPoseFromMapToImage(robotInfo);
        //console.log(pose);
        robotPoseInMap.x = pose.x;
        robotPoseInMap.y = pose.y;
        redraw();
      }
    )
    watch(
      () => viewFocusFlag.value,
      (flag) => {
        if(flag){
          redraw();
        }
      }
    )
    watch(
      () => controllerUse.value,
      (flag) => {
        if(flag){
          initPoseFlag.value = false;
          navGoalFlag.value = false;
          
          //this.$gamepad = navigator.getGamepads();
          const pollGamepad = () => {
            // Always call `navigator.getGamepads()` inside of
            // the game loop, not outside.
            const gamepads = navigator.getGamepads();
            for (const gamepad of gamepads) {
              // Disregard empty slots.
              if (!gamepad) {
                continue;
              }
              var v = 0;
              var w = 0;
              switch(controllerType.value){
                case 'joypad':{
                  
                  v = gamepad.axes[1] * speedScale.v * (-1);
                  w = gamepad.axes[2] * speedScale.w *(-1);
                  
                  if( v > 0 && v < 0.01 )
                    v = 0.0;
                  else if( v < 0 && v > -0.01 )
                    v = 0.0;
                  if( w > 0 && w < 0.01 )
                    w = 0.0;
                  else if( w < 0 && w > -0.01 )
                    w = 0.0;
                  if(speed.v != v || speed.w != w){
                    //this.$socket.emit('move', v, w);
                    speed.v = v;
                    speed. w = w;
                  }
                  proxy._socket.emit("move",speed);
                  let button_group = document.getElementById("joypad-buttons").children;
                  button_group.forEach((button, index) => {
                    //console.log(gamepad.buttons[0].pressed);
                    try{
                      let buttonFlag = gamepad.buttons[index].pressed;
                      
                      if(buttonFlag){
                        button.children[0].style.backgroundColor = '#05a95188';
                        if(!joystickButton[index].used){
                          const workObj = Object.assign({}, joystickButton[index].data);
                          proxy._socket.emit("work", workObj);
                          joystickButton[index].used = true;
                        }
                      }else{
                        if(joystickButton[index] != null)
                          joystickButton[index].used = false;
                        button.children[0].style.backgroundColor = 'white';

                      }
                    }catch(e){
                      console.log(e);
                    }
                  });
                  break;
                }
                case 'joystick':{
                  if(gamepad.id.search('stick') < 0 && gamepad.id.search('Stick') < 0)
                    return;
                  
                  v = gamepad.axes[1] * speedScale.v * (-1);
                  w = gamepad.axes[0] * speedScale.w *(-1);
                    
                  if( v > 0 && v < 0.01 )
                    v = 0.0;
                  else if( v < 0 && v > -0.01 )
                    v = 0.0;

                  if( w > 0 && w < 0.01 )
                    w = 0.0;
                  else if( w < 0 && w > -0.01 )
                    w = 0.0;

                  if(speed.v != v || speed.w != w){
                    // if(gamepad.buttons[0])
                    //   this.$socket.emit('move', v, w);
                    speed.v = v;
                    speed. w = w;
                  }

                  proxy._socket.emit("move",speed);
                  let button_group = document.getElementById("joystick-buttons").children;
                  button_group.forEach((button, index) => {
                    //console.log(gamepad.buttons[0].pressed);
                    try{
                      let buttonFlag = gamepad.buttons[index].pressed;
                      if(buttonFlag){
                        button.children[0].style.backgroundColor = '#05a95188';
                        if(!joystickButton[index].used){
                          const workObj = Object.assign({}, joystickButton[index].data);
                          proxy._socket.emit("work", workObj);
                          joystickButton[index].used = true;
                        }
                      }else{
                        if(joystickButton[index] != null)
                          joystickButton[index].used = false;
                        button.children[0].style.backgroundColor = 'white';

                      }
                    }catch{
                      //
                    }
                  });
        
                  break;
                }
              }   
            }
          };
        
          controllerInterval = setInterval(pollGamepad, 100);
        }else{
          
          clearInterval(controllerInterval);
        }
      }
    )
    return{
        goSiteList,
				robotInfo,
				siteInfo,
        styles,
        complexPanel,
        controllerType,
        controllerUse,
				activeCanvasMove,
        changeController,
        canvasScale,
        activeFollowView,
        zoomIn,
        zoomOut,
        joypadButton,
        joystickButton,
        workList,
        navGoalFlag,
        initPoseFlag,
        viewFocusFlag,
        setInitPose,
        stopRobot,
        changePanel
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
::-webkit-scrollbar{width: 0px; height: 0px;}
::-webkit-scrollbar-track{background-color: #52505100;}
::-webkit-scrollbar-thumb{background-color: #d3d7cf00;}

.robot{
  position: absolute;
  width: 100%;
  height: 904px;
  padding: 29px 0 0 0;
}
.side-panel{
  width: 318px;
  float: left;
  height: 100%;
  margin-right: 2px;
}
.info-title{
  display: flex;
  align-items: center;
  padding: 15px 20px 10px;
  font-family: HDharmonyM;
  font-size: 16px;
  height: 49px;
  box-sizing: border-box;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: white;
}
.info-title div{
  margin: 0 10px;
}
.sidenav a, .dropdown-btn {
  font-family: HDharmonyM;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: white;

	padding: 8px 30px;
  height: 30px;
  box-sizing: border-box;
  text-decoration: none;
  display: block;
  border: none;
  background: none;
  width: 100%;
  cursor: pointer;
  outline: none;
}
.sidenav *{
  margin-bottom: 2px;
}

.dropdown-btn{
  background-color: #004282;
}
.complex-panel{
  width: 100%;
  height: 100%;
}
.complex-panel-main{
  width: 1198px;
  height: 100%;
  margin-right: 2px;
  float:left;
	display: flex;
}
.complex-panel-side{
  width: 400px;
  height: 100%;
  float: left;
}

.complex-panel-side .complex-panel-item{
  height: 224.5px;
  display: flex;

}
.complex-panel-side div:nth-child(1),
.complex-panel-side div:nth-child(2),
.complex-panel-side div:nth-child(3){
  margin-bottom: 2px;
}
.complex-panel-item{
  background-color: #0000004D;
}
video{
  flex: 1;
}
.complex-panel-bottom div:nth-child(1), .complex-panel-bottom div:nth-child(2){
  margin-right: 2px;
}
.complex-panel-main-info{
  position: absolute;
  width: 700px;
  height: 140px;
  background-color: #00000090;
  border-radius: 0 0 20px 0;
}
.title{
  margin:20px 20px;
  z-index: 1;
  position: absolute;
  display: flex;
  font-family: HDharmonyM;
  align-items: center;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: white;
}
.title img{
  float: left;
}
.title div{
  margin: 0 10px;
}

.location-label{
	z-index: 1;
  margin: 15px 15px;
  /* position: absolute; */
  font-family: HDharmonyM;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  text-align: left;
  color: white;
}
.location-label span{
  margin: 0 10px 0;
  color: #05a951;
}
.follow-view{
  top: 55px;
  right:120px;
  font-size: 14px;
  position: absolute;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: white;
  cursor: pointer;
}
.follow-view:hover + img{
  filter: drop-shadow(0 0 0.75rem #05a951);
}
.follow-view input{
  opacity: 0;
  width: 0;
  height: 0;
  margin:0;
}
input:checked + img {
  filter: drop-shadow(0 0 0.75rem #05a951);
}

input:focus + img {
  filter: drop-shadow(0 0 0.75rem #05a951);
}

.dropdown-container{
	height: 0px;
	overflow: hidden;
	margin:0;
	transition: 0.7s;
	background-color: #525051;
}
.dropdown-container div{
	margin: 10px;
	font-family: HDharmonyM;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  color: white;
}
#map{
	display:flex;
	flex:1;
}

.switch {
  right: -240px;
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  margin:0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #05a951;
}

input:focus + .slider {
  box-shadow: 0 0 1px #05a951;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

/* Check button */
.check-button{
   width: 100px;
  height: 48px;
  text-align: center;
  position: absolute; 
   line-height: 48px;
  font-family: HDharmonyM;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  color: white; 
}

.check-button-background {
  position: absolute;
  cursor: pointer;
  margin:0;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 4px;
  background-color: #cccccc88;
  -webkit-transition: .4s;
  transition: .4s;
}

.check-button input { 
  opacity: 0;
  width: 0;
  height: 0;
}
input:checked + .check-button-background {
  background-color: #05a951;
}

input:focus + .check-button-background {
  box-shadow: 0 0 1px #05a951;
}


#controller-type-group{
  display: flex;
}
#controller-type-group button{
  flex:1;
  border: 1px solid #ccc; /* Green border */
  background-color: #ccc;
  font-family: HDharmonyM;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  color: black; /* Black text */
  padding: 10px 24px; /* Some padding */
  cursor: pointer; /* Pointer/hand icon */
  float: left; /* Float the buttons side by side */
  outline: none;
  box-sizing: border-box;
  width:100px;
  height: 37px;
  transition: 0.3s;
}
#controller-type-group button:nth-child(1){
  background-color: #004282;
  color: black; /* Black text */
}

#joypad-buttons, #joystick-buttons{
  margin-top:40px;
}

.controller-button-function-container div div{
  width: 30px;
  height: 30px;
  float: left;
  margin: 0px;
  border-radius: 50%;
  background-color: white;
  box-sizing: border-box;
}
.controller-button-function-container div span{
  line-height: 30px;
  margin: 0 40px 0 10px;
}

#init-pose-button{
  margin:0px;
  top: 60px;
  right:320px;
} 
#nav-goal-button{
  margin:0px;
  top: 60px;
  right:430px;
}
#e-stop{
  width: 100px;
  height: 48px;
  margin:0px;
  border-radius: 4px;
  text-align: center;
  position: absolute;
  top:60px;
  right:210px;
   line-height: 48px;
  background-color: #ff000088;
  font-family: HDharmonyM;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  color: white; 
}
#e-stop:hover{
  background-color: #ff0000;
}
.zoom-box{
  position: absolute;
  top: 55px;
  right:20px;
  margin: 0px;
  cursor: pointer;
}
.zoom-box img:hover{
  filter: drop-shadow(0 0 0.75rem #05a951);
}
.zoom-box div{
  text-align: center;
  font-family: HDharmonyL;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: white;
}
#map-canvas {
  width: 1198px;
  height: 904px;
}
.work-list{
  border-radius: 4px;
  width: 50%;
  height: 30px;
  box-sizing: border-box;
  border: solid 1px #b0b0b0;
  background-color: #00000000;

  font-family: HDharmonyL;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.85;
  letter-spacing: normal;
  padding: 0 0 0 10px;
  text-align: left;
  color: #e6e6e6;
}
#battery-container{
    border: solid 5px white;
    padding: 2px;
    position: relative;
    box-sizing: border-box;
    width: 90px;
    height: 38px;
    right: -200px;
}
#battery-container div{
      float: left;
    margin: 2px;
    background-color: green;
    width: 15px;
    height: 20px;
}
#robot-info{

    top: -40px;
    position:relative;
}
</style>
