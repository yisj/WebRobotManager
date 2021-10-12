<template>
  <div v-if="showFlag" class="site-register" >
    <div class="title">등록</div>
    <div class="info-box">
      <div>지도명</div>
      <input class="site-name" :value="siteInfo.siteName" @input="siteInfo.siteName=$event.target.value">
      
      <div class="site-info-label">지도 정보</div>
      <textarea class="site-info" v-model="siteInfo.siteInfo"></textarea>

      <div class="robot-register-label">로봇 등록</div>
      <div class="robot-register">
        <div v-for="(robotArray,robotArrayIndex) in robotList" :key="robotArrayIndex" class="robot-checkbox-container">
          <label v-for="(robot,robotIndex) in robotArray" :key="robotIndex" class="robot">{{robot.label}}
            <input v-model="robot.use" type="checkbox">
            <span class="checkmark"></span>
          </label>
        </div>
      </div>

      <div class="upload-site">
        <label class="upload-site-label" for="img-file">지도 불러오기</label>
        <input type="file" id="img-file" style="display: none;" accept=".png" @change="uploadFile">
      </div>

      <div>{{siteInfo.imgFile.name}}</div> 

      <div class="upload-site-yaml">
        <label class="upload-site-yaml-label" for="yaml-file">YAML 불러오기</label>
        <input type="file" id="yaml-file" style="display: none;" accept=".yaml" @change="uploadFile">
      </div>

      <div>{{siteInfo.yamlFile.name}}</div> 
    </div>

    <div class="button-box">
      <button @click="cancel">취소</button>
      <button @click="registerSite">확인</button>
    </div>
  </div>
  
</template>

<script>

import {getCurrentInstance, ref, onMounted,watch, reactive} from 'vue'
const FormData = require('form-data')

export default {
  name: 'SiteRegister',
  props: {
  },
  setup () {
    const { proxy } = getCurrentInstance();
    const API = proxy._api;
    
    let showFlag = ref(false);
    
    let siteInfo = reactive({
      siteName:'',
      siteInfo:'',
      
      imgFile: {
        name: '--------------------',
        file: ''
      },
      yamlFile: {
        name: '--------------------',
        file: ''
      },
    })
    const robotList = reactive([])
    onMounted(() => {
      proxy._eventBus.on('showSiteRegisterModal',(flag)=>{
        
        getRobotList();
        showFlag.value = flag;
      })

    })
    const uploadFile = (e) => {
      console.log(e.target.files[0].name.substring(3));
      let extention = e.target.files[0].name.substring(3);
      switch(e.target.id){
        case 'img-file':
        if(extention.search('png') >= 0){          
          siteInfo.imgFile.name = e.target.files[0].name;
          siteInfo.imgFile.file = e.target.files[0];
        }else{
          alert("올바른 파일이 아닙니다. 다시 확인해주세요.");
        }
          break;
        case 'yaml-file':
          if(extention.search('yaml') >= 0){   
            siteInfo.yamlFile.name = e.target.files[0].name;
            siteInfo.yamlFile.file = e.target.files[0];
          }else{
            alert("올바른 파일이 아닙니다. 다시 확인해주세요.");
          }
          break;
        default:
          break;
      }
      
    }
    const cancel = () => {
      showFlag.value = false;
    }
    const getRobotList = () =>{
      robotList.splice(0, robotList.length);
      //get robot list
      API.get('/robot-lists-no-site').then(
        response => {        
          let obj = response.data;
          let robotArray = []
                
          obj.forEach((element) => {        
            if(element.site == null){
              let robot = {
                  robotId:element.robot_id,
                  label: element.robot_id.length > 10 ? element.robot_id.substring(0,10) + '...': element.robot_id,
                  use: false
              }
                robotArray.push(robot);
            }            
          });
          // 4개씩 분할해서 push
          while(robotArray.length) robotList.push(robotArray.splice(0,4));
        },
        error => {
          console.log(error.response);
          alert("Error Message: "+ error.response.data + "( Code: " + error.response.status + " )");
          return Promise.reject(error.response);
        });

    }
    const registerSite = () => {
      //create site
      const imgData = new FormData();
      imgData.append("files", siteInfo.imgFile.file);
      
      //create site
      const yamlData = new FormData();
      yamlData.append("files", siteInfo.yamlFile.file);
      
      let checkRobotList = [];

      robotList.forEach((robotArray) => {
        robotArray.forEach((robot) => {
          if(robot.use)
            checkRobotList.push(robot.robotId);
        });
      });
      
      let imgUploadInfo = '';
      let yamlUploadInfo = '';
      API.post('/upload/', imgData, { 
        headers: { 'Content-Type': 'multipart/form-data;'},
        onUploadProgress: progressEvent => console.log(progressEvent.loaded)
      }).then(response => {

        imgUploadInfo = response.data;
        console.log('successed upload img');
        if(yamlUploadInfo != ''){
          //send data to database (create)
          API.post('/site-lists',  {
              site_name: siteInfo.siteName,
              site_info: siteInfo.siteInfo,
              robot_list:checkRobotList,
              first_uploaded_by: sessionStorage.getItem('userId'),
              site_image_file: imgUploadInfo,
              site_yaml_file: yamlUploadInfo
          }).then(
            response => {   
              showFlag.value = false;
            },
            error => {
              console.log(error.response);
              alert("Error Message: "+ error.response.data + "( Code: " + error.response.status + " )");
              return Promise.reject(error.response);
            });
        }

      },
      error => {
        console.log(error.response);
        alert("Error Message: "+ error.response.data + "( Code: " + error.response.status + " )");
        return Promise.reject(error.response);
      });

      API.post('/upload/', yamlData, { 
        headers: { 'Content-Type': 'multipart/form-data;'},
        onUploadProgress: progressEvent => console.log(progressEvent.loaded)
      }).then(response => {
        yamlUploadInfo = response.data;
        console.log('successed upload yaml');
        if(imgUploadInfo != ''){
          //send data to database (create)
          
          API.post('/site-lists',  {
              site_name: siteInfo.siteName,
              site_info: siteInfo.siteInfo,
              robot_list:checkRobotList,
              first_uploaded_by: sessionStorage.getItem('userId'),
              site_image_file: imgUploadInfo,
              site_yaml_file: yamlUploadInfo
          }).then(
            response => {   
              showFlag.value = false;
            },
            error => {
              console.log(error.response);
              alert("Error Message: "+ error.response.data + "( Code: " + error.response.status + " )");
              return Promise.reject(error.response);
            });
        }
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
        if(!flag){
          proxy._eventBus.emit('closeSiteRegisterModal');
          console.log(robotList);
        }
      }
    )
    return{
      showFlag,
      siteInfo,
      uploadFile,
      cancel,
      robotList,
      watch,
      registerSite,
      onMounted
    }
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.site-register{
  width: 500px;
  height: 756px;
  padding: 20px 20px 40px;
  box-sizing: border-box;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.16);
  background-color: #222222;
  position: absolute;
  top:150px;
  left: 838px;
}
.title{
  font-family: HDharmonyM;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #e6e6e6;
}

.info-box{
  padding:30px 0 0 0;
}
.site-name{
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
  letter-spacing: normal;
  padding: 9px 10px 8px 10px;
  margin: 10px 0 0 0;
  text-align: left;
  color: #e6e6e6;
}
.site-info{
  resize: none;
  border-radius: 4px;
  width: 100%;
  height: 200px;
  box-sizing: border-box;
  border: solid 1px #b0b0b0;
  background-color: #00000000;

  font-family: HDharmonyL;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  padding: 9px 10px 8px 10px;
  margin: 10px 0 0 0;
  text-align: left;
  color: #e6e6e6;
}
.robot-register{
  overflow-x: hidden;
  overflow-y: scroll;
  text-decoration: none;
   width: 100%;
  height: 155px;
  display: flex;
  box-sizing: border-box;
  border: none;
  background-color: #1a1a1a;

  font-family: HDharmonyL;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  padding: 9px 10px 8px 10px;
  margin: 10px 0 0 0;
  text-align: left;
  color: #e6e6e6;
}
.robot-checkbox-container{
  float: left;
  margin-right: auto;
  width: 220px;
}
.info-box div{

  font-family: HDharmonyL;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #b0b0b0;
}
.upload-site-label, .upload-site-yaml-label{
  cursor: pointer;
  text-decoration: underline;
}

.site-info-label, 
.robot-register-label, 
.upload-site,
.upload-site-yaml {
  margin:20px 0 0 0;
}

.info-box div:nth-child(6), 
.info-box div:nth-child(8),
.info-box div:nth-child(10){
  font-family: HDharmonyL;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  margin: 10px 0 0 0;
  color: #e6e6e6;
}
.button-box{
  padding: 15px 0 0 0;
  display: flex;
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
  background-color: #525051;
}
.button-box button:nth-child(2){
  background-color: #05a951;
}

.robot{
  height: 25px;
  overflow: hidden;
  font-family: HDharmonyL;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #e6e6e6;

  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  line-height: 1.8;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.robot input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #00000000;
  border:solid #b0b0b0 2px;
  border-radius:4px;
}
/* When the checkbox is checked, add a blue background */
.robot input:checked ~ .checkmark {
  background-color: #00000000;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.robot input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.robot .checkmark:after {
  left: 6px;
  top: 1px;
  width: 5px;
  height: 10px;
  border: solid #05a951;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
