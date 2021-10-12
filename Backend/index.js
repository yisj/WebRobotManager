'use strict';

var os = require('os');
var nodeStatic = require('node-static');
var http = require('http'); 
 const https = require('https'); 
var socketIO = require('socket.io')(https,{cors:{}}); 

const fs = require('fs'); 

var numVideoClient = 0;
var numClientsMax = 2;

// var clientTypes = ['video','monitoring'];

const options = { 
  key: fs.readFileSync('../certs/hd_server.key'),
  cert: fs.readFileSync('../certs/hd_server.crt') 
  // key: fs.readFileSync('/home/sos/certs/server.key'),
  // cert: fs.readFileSync('/home/sos/certs/server.crt') 

}; 
//////////////////////////////////////////////////
// MQTT

const mqtt = require('mqtt');
//mqtts client
// const mqtt_options = {
//   //host: '15.165.158.30',
//   //port: 1883,
//   //protocol: 'mqtt',
//   username: 'dogu',
//   password: 'dogong123!'
// };
// const client = mqtt.connect("mqtts://15.165.158.30:1883", mqtt_options);

//mqtt client
var agentId ='/cp003';
const mqtt_options = {
  host: '15.165.158.30',
  port: 1883,
  protocol: 'mqtt',
  username: 'dogu',
  password: 'dogong123!'
};
const client = mqtt.connect(mqtt_options);
client.on("connect", () => {	
  console.log("connected"+ client.connected);
});
client.on("error", (error) => {
  console.log("Can't connect" + error);
});
//publish example
var publish_options = {
  retain:false,
  qos:1
};
// client.publish("testtopic", "test message", options)

// subscribe example
const topicList = ["/WRMMonitor/monitoringData", "/WRMLog/robotLog", "/WRMMonitor/heartBeat"];

// const topic_list=["topic2","topic3","topic4"];
// const topic_o={"topic22":0,"topic33":1,"topic44":1};
// client.subscribe(topic_s, {qos:1});
// client.subscribe({qos:1});
client.subscribe(topicList,{qos:1});
//client.subscribe(topic_list, {qos:1});
//client.subscribe(topic_o);

///////////////////////////////////////////////
var fileServer = new(nodeStatic.Server)(); 
let app = https.createServer(options, (req,res)=>{ 
  fileServer.serve(req, res); 
}).listen(3000); 

console.log('Started chating server...');



var io = socketIO.listen(app);

io.sockets.on('connection', function(socket) {
  
  console.log('connection ');
  // convenience function to log server messages on the client
  function log() {
    var array = ['Message from server:'];
    array.push.apply(array, arguments);
    socket.emit('log', array);
  }

  socket.on('message', function(message) {
    var room = Object.keys(io.sockets.adapter.sids[socket.id]).filter(item => item!=socket.id);
     
    io.sockets.in(room).emit('message', message);
  });

  socket.on('create or join', function(room) {
    console.log('create or join');
    
		
    log('Received request to create or join room ' + room);

    var clientsInRoom = io.sockets.adapter.rooms[room];
    var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
    log('Room ' + room + ' now has ' + numClients + ' client(s) (videoClients: ' + numVideoClient + ')');

    if (numClients === 0) {
      socket.join(room);
      log('Client ID ' + socket.id + ' created room ' + room);
      io.sockets.in(room).emit('created', room, socket.id);
    } else if (numClients < numClientsMax) {
        log('Client ID ' + socket.id + ' joined room ' + room);
        io.sockets.in(room).emit('join', room);
        socket.join(room);
        io.sockets.in(room).emit('joined', room, socket.id);
        io.sockets.in(room).emit('ready');          
          } else { // max two clients
            io.sockets.in(room).emit('full', room);
    }
  });

  socket.on('ipaddr', function() {
    var room = Object.keys(io.sockets.adapter.sids[socket.id]).filter(item => item!=socket.id);
    
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          io.sockets.in(room).emit('ipaddr', details.address);
        }
      });
    }
  });


   //key input action
   socket.on('move', function( speed ){
    var date = new Date();
    
     console.log(speed);
     var currentRoom = Object.keys(io.sockets.adapter.sids[socket.id]).filter(item => item!=socket.id);
     const topic ={
      'responseTopic': '/WRMMonitor/response',
      'messageId': date,
      'request':{
        'direction':speed.v,
        'rotate':speed.w
      }
    };
    const obj = JSON.stringify(topic);
    client.publish("/" + currentRoom + "/remoteControl", obj, publish_options);
  });

  socket.on('initPose', function(pose){
    var date = new Date();
    console.log(pose);
    var currentRoom = Object.keys(io.sockets.adapter.sids[socket.id]).filter(item => item!=socket.id);
    const topic ={
    'responseTopic': '/WRMMonitor/response',
    'messageId': date,
    'request':{
      'x': pose.x,
      'y': pose.y,
      'theta': pose.degree
    }
  };
  const obj = JSON.stringify(topic);
  client.publish("/" + currentRoom + "/init2DPose", obj, publish_options);
  });

  socket.on('getMapList', function(pose){
    var date = new Date();
    console.log(pose);
    var currentRoom = Object.keys(io.sockets.adapter.sids[socket.id]).filter(item => item!=socket.id);
    const topic ={
    'responseTopic': '/WRMMonitor/response',
    'messageId': date,
    'request':{
      'fileType': 'MAP'
    }
  };
  const obj = JSON.stringify(topic);
  client.publish("/" + currentRoom + "/getMapList", obj, publish_options,
    function(response){
      console.log(response);
    });
  });

  socket.on('work', function( work ){
    var date = new Date();
    console.log("work ", work);
    var currentRoom = Object.keys(io.sockets.adapter.sids[socket.id]).filter(item => item!=socket.id);
    const topic ={
     'responseTopic': '/WRMMonitor/response',
     'messageId': date,
     'request': work
   };
   const obj = JSON.stringify(topic);
   console.log(obj);
   //client.publish("/" + currentRoom + "/moveTo", obj, publish_options);
 });

  socket.on('navGoal', function( goalPose ){
    var date = new Date();
    console.log("navGoal ", goalPose);
    var currentRoom = Object.keys(io.sockets.adapter.sids[socket.id]).filter(item => item!=socket.id);
    const topic ={
     'responseTopic': '/WRMMonitor/response',
     'messageId': date,
     'request':{
       'markerName':'navGoal',
       'x':goalPose.x,
       'y':goalPose.y,
       'degree': goalPose.degree
     }
   };
   const obj = JSON.stringify(topic);
   client.publish("/" + currentRoom + "/moveTo", obj, publish_options);
 });

 socket.on('stopRobot', function(){
  var date = new Date();
   console.log("stop ")
  var currentRoom = Object.keys(io.sockets.adapter.sids[socket.id]).filter(item => item!=socket.id);
  const topic ={
   'responseTopic': '/WRMMonitor/response',
   'messageId': date
 };
 const obj = JSON.stringify(topic);
 client.publish("/" + currentRoom + "/stop", obj, publish_options);
});

  socket.on('bye', function(kind){
    var currentRoom = Object.keys(io.sockets.adapter.sids[socket.id]).filter(item => item!=socket.id);
 
    console.log('received bye (room: '+currentRoom + ", type: " + kind +")");
    
    if(kind == 'robot'){
      
      //all leave in room
      io.of('/').in(currentRoom).clients(function(error,clients){
        clients.forEach(function(socketId){
          console.log(socketId);
          //if(socketId != socket.id)
            io.sockets.sockets[socketId].leave(currentRoom);
        });
      });
      socket.leave(currentRoom);
    }else{
      socket.leave(currentRoom);
    }
  });

  client.on('message', (topic, message, packet) => {
    //if(topic == "/WRMLog/robotLog")
    var topicData = JSON.parse(message);
    
    switch(topic){
      case topicList[0]: // monitor data
        //console.log(topicData);
        io.sockets.in(topicData.robotId).emit("battery",topicData.batteryStatus, topicData.batteryStatusVoltage);  
        io.sockets.in(topicData.robotId).emit("position",topicData.position);
        io.sockets.in(topicData.robotId).emit("speed",topicData.speed);
        break;  
      case topicList[1]: // log data
        break;
      case topicList[2]: // heartbeat data
        io.sockets.in(topicData.robotId).emit("heartbeat",topicData);  
        
    }
    
    
  });
});


//backend commit test