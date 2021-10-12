<template>
  <div class="site-list">
    <div class="title">
			<div class="title-bar">
				<!-- title -->
				<div>지도 리스트</div>
				<div>{{countSite}}</div>          
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
							<th>지도명</th>
							<th>가용 로봇 대수</th>
							<th>설명</th>
							<th>미리보기</th>
						</tr>
					</thead>
					<tbody id="site-list">
						<tr v-for="(site,index) in siteList" :key="index" @click="clickSite(index)" class="site">
							<td>{{site.siteName}}</td>
							<td>{{site.robotCount}}</td>
							<td>{{site.siteInfo}}</td>
							<td><img :src= site.imgFile.thumbnailUrl ></td>
						</tr> 
					</tbody>
				</table>         
			</div>

			<div class="lastest-update">
				<!-- lastest update -->
				<span>Last Update</span>
				<span id="update-time">{{nowTimeInfo.time}}</span>
				<img @click="updateSiteList" src="../../assets/ic_update.png">
			</div>            
		</div>
      
		<div class="check-button-box">
			<!-- check button -->
			<button @click="checkSite" class="check-button" v-bind:style="styles.checkButton">확인</button>
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
import {ref,reactive,getCurrentInstance,watch,onMounted} from 'vue'

export default {
    name: 'siteList',
    props: {
    },
    setup () {
      const { proxy } = getCurrentInstance();
      const API = proxy._api;

      const siteList = reactive([]);
      let selectSite = -1;
        
      const updateFlag = ref(false);
      const countSite = ref(0);
        
      const nowTimeInfo = reactive({
        time: '',
        timeCount: 0
      });
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
      const updateSiteList = () =>{
        updateFlag.value = true;
      }
      const getSiteList = () =>{
        siteList.splice(0, siteList.length);
        //get robot list
        API.get('/site-lists').then(
          response => {
            let obj = response.data;
						console.log(obj);
            obj.forEach((element) => {

              let site = {
                key: element.id,
                siteName:element.site_name.length > 10 ? element.site_info.substring(0,9) + "..." : element.site_name ,
                robotCount:element.robot_list.length,
                siteInfo:element.site_info.length > 25 ? element.site_info.substring(0,24) + "..." : element.site_info,
                imgFile: {
                  name: element.site_image_file.name,
                  file: '',
                  thumbnailUrl: API.defaults.baseURL + element.site_image_file.formats.thumbnail.url,
								  url: API.defaults.baseURL + element.site_image_file.url,
                  width: element.site_image_file.width,
                  height: element.site_image_file.height
                },
                yamlFile: {
                  name: element.site_yaml_file.name,
                  file: '',
                  url: API.defaults.baseURL + element.site_yaml_file.url
                },
              }
              siteList.push(site);
            });
            countSite.value = obj.length;
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

          proxy._eventBus.on('closeSiteUpdateModal',() =>{
            modalFlags.updateModal = false;
            updateFlag.value = true;
          })
          proxy._eventBus.on('closeSiteDeleteModal',() =>{
            modalFlags.deleteModal = false;
            updateFlag.value = true;
          })
          proxy._eventBus.on('closeSiteRegisterModal',() =>{
            modalFlags.registerModal = false;
            updateFlag.value = true;
          })
            
          updateFlag.value = true;
        })
        const clickSite = (index) =>{
          let siteList = document.getElementById("site-list").children;
            
          siteList.forEach( (site, i) => {
            if(i == index){
              if(selectSite != index){
                site.style.border = '1px solid #05a951';
                styles.checkButton['background-color'] = '#05a951';
                selectSite = index;
              }else{
                site.style.border = '1px solid #00000000'; 
                site.style.borderBottom  = '1px solid #525051';
                styles.checkButton['background-color'] = '#4c4b4c';
                selectSite = -1;
              }
            }else{
              site.style.border = '1px solid #00000000'; 
              site.style.borderBottom  = '1px solid #525051';
            }
          });
        }
        const showUpdate = () =>{
          if(selectSite == -1){
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
          if(selectSite == -1){
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
        const checkSite = () => {
					sessionStorage.setItem('siteName',siteList[selectSite].siteName);
					sessionStorage.setItem('mapImageFile',siteList[selectSite].imgFile.url);
          sessionStorage.setItem('mapImageWidth',siteList[selectSite].imgFile.width);
          sessionStorage.setItem('mapImageHeight',siteList[selectSite].imgFile.height);
          sessionStorage.setItem('mapYamlFile',siteList[selectSite].yamlFile.url);
          
			
          if(window.history.state.back == '/select')
            proxy._router.push("robot-list");
          else
            proxy._router.push("/robot");
        }
        watch(
          () => modalFlags.deleteModal,
          (flag) => {
            if(flag)
              proxy._eventBus.emit('showSiteDeleteModal', {"flag": flag, "key": siteList[selectSite].key});        
          }
        )
        watch(
          () => modalFlags.updateModal,
          (flag) => {
            if(flag)
              proxy._eventBus.emit('showSiteUpdateModal', {"flag": flag, "siteInfo": siteList[selectSite]});
          }
        )
        watch(
          () => modalFlags.registerModal,
          (flag) => {
            if(flag)
              proxy._eventBus.emit('showSiteRegisterModal', flag);    
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
              getSiteList();
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
            countSite,
            styles,
            siteList,
            updateSiteList,
            nowTimeInfo,
            onMounted,
            modalFlags,
            showUpdate,
            showDelete,
            showRegister,
            checkSite,
            watch,
            clickSite
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
  color: #fff;
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
  color: var(--white)
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
.site-list{
  padding-top:220px;
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
  width: 223px;
  text-align: left;
} 
table tbody td:nth-child(2), table thead th:nth-child(2){
  width: 130px;
  text-align: left;
}
table tbody td:nth-child(3), table thead th:nth-child(3){
  width: 338px;
  text-align: left;
}
table tbody td:nth-child(4), table thead th:nth-child(4){
  width: 150px;
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
  height: 140px; 
  border:1px solid #00000000; 
  border-bottom:1px solid #525051; 
  box-sizing: border-box; 
}
table tbody tr img{
  width: 150px;
  height: 120px;
  background-color: #474647;
  margin: 10px 0;
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
