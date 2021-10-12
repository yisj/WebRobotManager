<template>
  <div v-if="showFlag" class="site-delete" >
    <div class="title">선택한 지도를 삭제하겠습니까?</div>

    <div class="button-box">
      <button @click="cancel" >취소</button>
      <button @click="deleteSite" >확인</button>
    </div>
  </div>
</template>

<script>
import {ref, getCurrentInstance, onMounted, watch, reactive} from 'vue'


export default {
  name: 'SiteDelete',
  props: {
  },
  setup () {
    const { proxy } = getCurrentInstance();
    const API = proxy._api;

    let showFlag = ref(false);
    let key = ref(-1); //Database Primary Key
    
    onMounted(() => {
      proxy._eventBus.on('showSiteDeleteModal', (params)=>{
        showFlag.value = params.flag;
        if(params.key != null)
          key.value = params.key;
      })
    })
    const cancel = () =>{
      showFlag.value = false;
    }
    const deleteSite = () =>{
      //delete site
      API.delete('/site-lists/' + key.value).then(
        response => {
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
          proxy._eventBus.emit('closeSiteDeleteModal');
      }
    )
    return{
      showFlag,
      cancel,
      watch,
      onMounted,
      deleteSite
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.site-delete{
  width: 250px;
  height: 156px;
  padding: 40px 20px 30px;
  box-sizing: border-box;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.16);
  background-color: #222222;
  position: absolute;
  top:442px;
  left: 835px;
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
  text-align: center;
}
.button-box{
  padding: 30px 0 0 0;
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
