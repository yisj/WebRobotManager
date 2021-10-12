<template>
  <div class="robot-list">
  	<div>
      </div>
        <div class="title">
          <div class="title-bar">
            <!-- title -->
            <div>로봇 리스트</div>
            <div>{{countRobot}}</div>          
          </div>
          <div class="title-button">
            <span @click="showUpdate">수정</span>
            <span @click="showDelete">삭제</span>
            <button @click="showRegister" class="add-button">등록</button>
          </div>
        </div>

        <div>
          <div class="table">
            <!-- table -->
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Model</th>
                  <th>Site</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody id="robot-list">
                <tr v-for="(robot,index) in robotList" :key="index" @click="clickRobot(index)" class="robot">
                  <td>{{robot.robotId}}</td>
                  <td>{{robot.robotType}}</td>
                  <td>{{robot.site}}</td>
                  <td>{{robot.robotStatus}}</td>
                </tr>              
              </tbody>
            </table>      
          </div>

          <div class="lastest-update">
            <!-- lastest update -->
            <span>Last Update</span>
            <span id="update-time">{{nowTimeInfo.time}}</span>
            <img @click="updateRobotList" src="../../assets/ic_update.png">
          </div>            
        </div>

        <div class="check-button-box">
          <!-- check button -->
          <button @click="checkRobot" class="check-button" v-bind:style="styles.checkButton">확인</button>
        </div>

        <div class="notice-box">
          <!-- notice -->
          <div>
            <p>공지</p>
            <p>1. 공지 내용</p>
            <p>1. 공지 내용</p>
            <p>1. 공지 내용</p>
            <p>1. 공지 내용</p>
            <p>1. 공지 내용</p>
            <p>1. 공지 내용</p>
            <p>1. 공지 내용</p>
            <p>1. 공지 내용</p>
          </div>
        </div>
    </div>
</template>

<script>
import {reactive, ref, getCurrentInstance,watch,onMounted} from 'vue'

export default {
  name: 'RobotList',
 props: {
  },
  setup () {
    const { proxy } = getCurrentInstance();
    const API = proxy._api;

    let robotList = reactive([]);
    let nowTimeInfo = reactive({
      time: '',
      timeCount: 0
    });
    let updateFlag = ref(false);
    let selectRobot = -1;
    const countRobot = ref(0);
    const modalFlags = reactive({
      updateModal:false,
      deleteModal:false,
      registerModal:false
    });
    const styles = reactive({
      checkButton:{
        'background-color': '#4c4b4c'
      }
    });
		const timer = () =>{
      nowTimeInfo.timeCount++;
      setTimeout(timer, 1000);
    }
    const updateRobotList = () =>{
      updateFlag.value = true;
    }
    const getRobotList = () =>{
      robotList.splice(0, robotList.length);
      //get robot list
      API.get('/registered-robot-list').then(
				response => {      
          let obj = response.data;
          obj.forEach((element) => {
            
            let robot = {
              key: element.id,
              robotId:element.robot_id,
              robotAgentId:element.agent_id,
              robotUuid: element.robot_uuid,
              robotType:element.robot_type.robot_type,
              site:element.site == null ? '' : element.site.site_name,
              robotStatus:element.robot_status
          	}
            robotList.push(robot);
          });
          countRobot.value = obj.length;
        },
        error => {
          console.log(error.response);
          alert("Error Message: "+ error.response.data + "( Code: " + error.response.status + " )");
          return Promise.reject(error.response);
        });
    }
        
    onMounted(() => {
      // start timer
      timer();

      proxy._eventBus.on('closeRobotUpdateModal',() =>{        
          modalFlags.updateModal = false;
          updateFlag.value = true;
      })
      proxy._eventBus.on('closeRobotDeleteModal',() =>{
          modalFlags.deleteModal = false;
          updateFlag.value = true;
      })
      proxy._eventBus.on('closeRobotRegisterModal',() =>{
          modalFlags.registerModal = false;
          updateFlag.value = true;
      })
      updateFlag.value = true;
          
    })
    const clickRobot = (index) =>{
      let robotList = document.getElementById("robot-list").children;
      
      robotList.forEach( (robot, i) => {
        if(i == index){
        	if(selectRobot != index){
        	    robot.style.border = '1px solid #05a951';
        	    styles.checkButton['background-color'] = '#05a951';
        	    selectRobot = index;
        	}else{
            robot.style.border = '1px solid #00000000';
            robot.style.borderBottom  = '1px solid #525051';
            styles.checkButton['background-color'] = '#4c4b4c';
            selectRobot = -1;
      	  }
        }else{
          robot.style.border = '1px solid #00000000';
          robot.style.borderBottom  = '1px solid #525051';
        }
      });
    }
    const showUpdate = () =>{
      if(selectRobot == -1){
        alert("로봇을 선택해 주세요.")
        return;
      }

      if(modalFlags.updateModal)
        modalFlags.updateModal = false;
      else{
        modalFlags.updateModal = true; 
        modalFlags.deleteModal = false;
        modalFlags.registerModal = false;
      }
    }
    const showDelete = () =>{
      if(selectRobot == -1){
        alert("로봇을 선택해 주세요.")
        return;
      }

      if(modalFlags.deleteModal)
        modalFlags.deleteModal = false;
      else{
        modalFlags.updateModal = false; 
        modalFlags.deleteModal = true;
        modalFlags.registerModal = false;
      }
    }
    const showRegister = () =>{
      if(modalFlags.registerModal)
        modalFlags.registerModal = false;
      else{
        modalFlags.updateModal = false; 
        modalFlags.deleteModal = false;
        modalFlags.registerModal = true;
      }  
    }
    const checkRobot = () => {
			sessionStorage.setItem('robotId',robotList[selectRobot].robotId);
      sessionStorage.setItem('robotAgentId',robotList[selectRobot].robotAgentId);
			sessionStorage.setItem('robotType',robotList[selectRobot].robotType);

      if(window.history.state.back == '/select')
        proxy._router.push("site-list");
      else
        proxy._router.push("/robot");
    }
    watch(
      () => modalFlags.deleteModal,
      (flag) => {
        if(flag)
          proxy._eventBus.emit('showRobotDeleteModal', {"flag": flag, "key": robotList[selectRobot].key});
      }
    )
    watch(
        () => modalFlags.updateModal,
        (flag) => {
          if(flag)
            proxy._eventBus.emit('showRobotUpdateModal', {"flag": flag, "robotInfo": robotList[selectRobot]});
        }
    )
    watch(
        () => modalFlags.registerModal,
        (flag) => {
          if(flag)
            proxy._eventBus.emit('showRobotRegisterModal', flag);    
        }
    )
    watch(
      () => nowTimeInfo.timeCount,
      (count) => {
        if(count === 31)
          updateFlag.value = true;
        }
    )
    watch(
      () => updateFlag.value,
      (flag) => {
        if(flag){
          getRobotList();
          let now = new Date();
          nowTimeInfo.time = now.getFullYear() +"." + ("0" + (now.getMonth() + 1)).slice(-2) + "." + ("0" + now.getDate()).slice(-2) + " " +
                      ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2) + ":" + ("0" + now.getSeconds()).slice(-2);
          updateFlag.value = false;
        }else{
          nowTimeInfo.timeCount = 0;
        }
      }
    )
    return{
      getRobotList,
      countRobot,
      updateRobotList,
      modalFlags,
      nowTimeInfo,
      styles,
      onMounted,
      showUpdate,
      showDelete,
      showRegister,
      watch,
      checkRobot,
      robotList,
      clickRobot
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
:focus{outline: none;}
p{
  margin: 0;
}
.title{
  width: 894px;
  height: 30px;
  margin: 0 auto 20px auto;
  box-sizing: border-box;
}
.title-bar{    
  font-family: HDharmonyM;
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: white;
}
.title-bar div{
  float: left;
}
.title-bar div:nth-child(2){
  margin:4px 18px;
  width: 25px;
  height: 14px;
  border-radius: 4px;
  background-color: #004282;
  
  font-family: HDharmonyL;
  font-size: 9px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.4;
  letter-spacing: normal;
  text-align: center;
  color: white;
}
.title-button{
  float: right;
    
}
.title-button span{
  margin-left: 20px;
  font-family: HDharmonyL;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #e6e6e6;
  cursor: pointer;
}
.title-button button{
  margin-left: 40px;
  width: 70px;
  height: 30px;
  border-radius: 4px;
  background-color: #00000000;
  border: solid 1px #b0b0b0;
  font-family: HDharmonyL;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #e6e6e6;
  cursor: pointer;
}
.robot-list{
  padding-top:220px;
  cursor: pointer;
  margin: 0 auto;
  position: relative;
  width:1180px;
}
.notice-box{
  bottom: 48px; 
  width: 100%;
  border-radius: 20px;
  height: 130px;
  padding:20px 30px;
  border:none;
  outline: none;
  box-sizing: border-box;
  position: absolute;
  background-color: #1a1a1a;
  color:white;
}
.notice-box div{
  width: 100%;
  height: 100%;
  overflow: scroll;
  overflow-x: hidden;
}
.table{
  width: 894px;
  height: 370px;
  margin: 0 auto;
  background-color: #1a1a1a;
  color: #e6e6e6;
  padding-top:30px;
  box-sizing: border-box;
}
table{
  border-collapse:collapse;
  width:100%; 
  margin:0 auto; 
  overflow:hidden;
}
table thead{
  float:left;
  width:100%; 
  height: 30px; 
  padding: 0 44px 0 30px;
  font-family: HDharmonyL;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #e6e6e6;
  box-sizing: border-box; 
}
table thead tr{
	display:table;
	width:100%;
}
table tbody td:nth-child(1), table thead th:nth-child(1){
  width: 193px;
  text-align: left;
} 
table tbody td:nth-child(2), table thead th:nth-child(2){
  width: 140px;
  text-align: left;
}
table tbody td:nth-child(3), table thead th:nth-child(3){
   width: 338px;
  text-align: left;
}
table tbody td:nth-child(4), table thead th:nth-child(4){
  width: 159px;
 text-align: left;
}

table tbody{
  float:left;
  width:100%;
  height:310px;
  overflow-y:scroll;
  overflow-x:hidden; 
  padding: 0 30px; 
  box-sizing: border-box; 
  font-family: HDharmonyL;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #e6e6e6;
}

table tbody tr{
  display:table;
  width:100%; 
  height: 50px; 
  border: 1px solid #00000000;
  border-bottom:1px solid #525051; 
  box-sizing: border-box; 
}

.lastest-update{
  width: 894px;
  margin: 22px auto 0 auto;
  font-family: HDharmonyL;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #b0b0b0;
  padding-left:20px;
  box-sizing: border-box;
}
.lastest-update span{
  margin:0 10px;
}
.lastest-update img{
  top: 1px;
  position: relative;
}
#update-time{
  font-family: HDharmonyL;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #fff;
}
.check-button-box{
  text-align: center;
  top: 700px;
  width: 100%;
  position: absolute;

}
.check-button{
  outline: none;
  border:none;
  width: 100px;
  height: 40px;
  opacity: 0.9;
  border-radius: 4px;
  background-color: #4c4b4c;

  font-family: HDharmonyM;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #fff;
}
</style>
