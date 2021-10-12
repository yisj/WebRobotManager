<template>
  <div class="map">
    <div class="button-box">
      <button @click="showManagerPanel('mapping')">Mapping</button>
      <button @click="showManagerPanel('editor')">Editing</button>
      <button @click="goSiteList">List</button>

     
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, reactive } from 'vue'

export default {
  components: {  },
  name: 'Map',
  props: {
  },
  setup () {
      const { proxy } = getCurrentInstance();
      const managerPanels = reactive({
        editor: false
      })
      const goSiteList = () =>{
        proxy._router.push("/select/site-list");
      }
      const showManagerPanel = (panel) => {
        proxy._eventBus.emit('showMapEditor', true);  

      }
      return{
        goSiteList,
        managerPanels,
        showManagerPanel
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.map{
  flex: 1;
  position: absolute;
  right: 410px;
}

.button-box{
  padding: 20px 10px;
}

.button-box button{
  float: right;
  width: 70px;
  margin: 0 5px;
  height: 30px;
  border-radius: 4px;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.16);
  background-color: #05a951;
  outline: none;
  border:none;

  font-family: HDharmonyM;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: white;
  cursor: pointer;
}

</style>
