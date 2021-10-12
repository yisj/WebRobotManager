<template>
  <div class="main" v-bind:style="styles.main">
    <div class="back-button" v-bind:style="styles.backButton" @click="backPage">이전</div>
    <router-view />
  
    <RobotUpdate></RobotUpdate>
    <RobotDelete></RobotDelete>
    <RobotRegister></RobotRegister>
    
    <SiteUpdate></SiteUpdate>
    <SiteDelete></SiteDelete>
    <SiteRegister></SiteRegister>

    <!-- Map Manager -->
    <MapEditor></MapEditor>
 
  </div>
</template>

<script>
import { getCurrentInstance,reactive,watch } from 'vue'
import RobotUpdate from './modals/robot/RobotUpdate.vue';
import RobotDelete from './modals/robot/RobotDelete.vue';
import RobotRegister from './modals/robot/RobotRegister.vue';
import SiteUpdate from './modals/site/SiteUpdate.vue';
import SiteDelete from './modals/site/SiteDelete.vue';
import SiteRegister from './modals/site/SiteRegister.vue';
import MapEditor from './modals/map_manager/MapEditor.vue';


export default {
  components: { RobotUpdate, RobotDelete, RobotRegister, SiteUpdate, SiteDelete, SiteRegister, MapEditor },
  name: 'Main',
  props: {
  },
  setup () {
    const { proxy } = getCurrentInstance();
    const styles = reactive({
      main: {
          height: '858px'
      },
      backButton:{
        display: 'none'
      }
    });
    watch(
      () => proxy._router.currentRoute.value.name,
      (name) =>{
        switch(name){
          case 'Login':
          case 'RobotRemote':
            styles.backButton.display = 'none';
            styles.main.height = '858px';
            break;
          case 'Select':
            styles.backButton.display = 'none';
            styles.main.height = '958px';
            break;
          default:
            styles.backButton.display = 'block';
            styles.main.height = '958px';
            break;
        }
      }
    )
    
    const backPage = () =>{
      proxy._eventBus.emit('closeRobotDeleteModal');
      proxy._eventBus.emit('closeRobotRegisterModal');
      proxy._eventBus.emit('closeRobotUpdateModal');
      proxy._eventBus.emit('closeSiteDeleteModal');
      proxy._eventBus.emit('closeSiteRegisterModal');
      proxy._eventBus.emit('closeSiteUpdateModal');
      proxy._eventBus.emit('closeRoom');
      proxy._router.go(-1);
    }
    return{
      styles,
      watch,
      backPage
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main{
  margin-top: 2px;
  margin-bottom: 0px;
  height: 858px;
  display: flex;
  transition: 0.7s;
  background-color: #222222;
}
.back-button{
  z-index: 1;
  margin:14px 20px 0px;
  font-family: HDharmonyL;
  height: 14px;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #e6e6e6;
  cursor: pointer;
}
</style>
