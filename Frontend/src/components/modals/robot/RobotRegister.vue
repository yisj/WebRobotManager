<template>
  <div v-if="showFlag" class="robot-register" >
    <div class="title">등록</div>
    <div class="info-box">

      <div>UUID 선택</div>
      <select v-model="robotInfo.robotUuid" class="uuid">
        <option v-for="(type, index) in robotUuid" :key="index" >{{type}}</option>
      </select>

      <div>ID</div>
      <input :value="robotInfo.robotId" @input="robotInfo.robotId=$event.target.value" class="id">

      <div>Model</div>
      <select v-model="robotInfo.robotType" class="model">
        <option v-for="(type, index) in robotTypes" :key="index" >{{type}}</option>
      </select>

      <div>Site</div>
      <select v-model="robotInfo.site" class="site">
        <option v-for="(site, index) in mapList" :key="index" >{{site}}</option>
      </select>
    </div>

    <div class="button-box">
      <button @click="cancel">취소</button>
      <button @click="registerRobot">확인</button>
    </div>
  </div>
</template>

<script>
import {getCurrentInstance, ref,reactive, onMounted, watch} from 'vue'

export default {
  name: 'RobotRegister',
  props: {
  },
  setup () {
    const { proxy } = getCurrentInstance();
    const API = proxy._api;

    let showFlag = ref(false);
    let robotTypes = reactive([]);
    let robotUuid = reactive([]);
    let mapList = reactive(['선택 안함']);
    let robotInfo = reactive({
      robotId: '',
      robotType: '',
      robotUuid: '',
      site: ''
    })
    onMounted(() => {
      proxy._eventBus.on('showRobotRegisterModal',(flag)=>{
        showFlag.value = flag;
      })

      
    })
    const cancel = () => {
      showFlag.value = false;
    }
    const registerRobot = () => {
      //create robot
      API.post('/robot-lists/register',{ robot_id:robotInfo.robotId, robot_uuid:robotInfo.robotUuid, robot_type:robotInfo.robotType, site:robotInfo.site }).then(
        response => {
          console.log(response.data);
          showFlag.value = false;
        },
        error => {
          console.log(error.response);
          alert("Error Message: "+ error.response.data + "( Code: " + error.response.status + " )");
          return Promise.reject(error.response);
        });
    }
    watch(
      () => showFlag.value, 
      (flag) =>{
        if(!flag)
          proxy._eventBus.emit('closeRobotRegisterModal');
        else{
          //get unregistered robot list
          API.get('/unregistered-robot-list').then(
            response => {
              let obj = response.data;
              robotUuid.splice(0, robotUuid.length);

              obj.forEach((uuid,index) => {
                console.log(uuid);
                if(index == 0)
                   robotInfo.robotUuid = uuid;
                 robotUuid.push(uuid);
              })
            },
            error => {
              console.log(error.response);
              alert("Error Message: "+ error.response.data + "( Code: " + error.response.status + " )");
              return Promise.reject(error.response);
            });

          //get robot type list
          API.get('/robot-types').then(
            response => {
              let obj = response.data;
              robotTypes.splice(0, robotTypes.length);

              obj.forEach((element,index) => {
                if(index == 0)
                  robotInfo.robotType = element.robot_type;
                robotTypes.push(element.robot_type);
              });
            },
            error => {
              console.log(error.response);
              alert("Error Message: "+ error.response.data + "( Code: " + error.response.status + " )");
              return Promise.reject(error.response);
            });

          //get map list
          API.get('/site-lists').then(
            response => {
              let obj = response.data;
              mapList.splice(0, mapList.length);

              obj.forEach((element,index) => {
                if(index == 0)
                  robotInfo.site = element.site_name;
                mapList.push(element.site_name);
              });
            },
            error => {
              console.log(error.response);
              alert("Error Message: "+ error.response.data + "( Code: " + error.response.status + " )");
              return Promise.reject(error.response);
            });

        }
      }
    )
    return{
      robotInfo,
      showFlag,
      cancel,
      registerRobot,
      watch,
      robotTypes,
      robotUuid,
      mapList,
      onMounted
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.robot-register{
  width: 250px;
  height: 457px;
  padding: 20px 20px 30px;
  box-sizing: border-box;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.16);
  background-color: #222222;
  position: absolute;
  top:314px;
  left: 838px;
}
.title{
  font-family: HDharmonyM;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: #e6e6e6;
}
.info-box{
  padding:30px 0 0 0;
}
.info-box div{
  font-family: HDharmonyL;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  text-align: left;
  color: #b0b0b0;
}
.info-box div:nth-child(3), .info-box div:nth-child(5), .info-box div:nth-child(7){
  margin:20px 0 0 0;
}
.uuid, .id, .model, .site{
  border-radius: 4px;
  width: 100%;
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
.button-box{
  padding: 41px 0 0 0;
}
.button-box button{
  width: 100px;
  height: 40px;
  margin: 0 auto;
  outline: none;
  border:none;
  opacity: 0.9;
  border-radius: 4px;
  cursor: pointer;

  
  font-family: HDharmonyM;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #fff;
}
.button-box button:nth-child(1){
  margin: 0 10px 0 0;
  background-color: #525051;
}
.button-box button:nth-child(2){
  background-color: #05a951;
}
</style>
