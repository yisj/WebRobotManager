<template>
  <div v-if="showFlag" class="map-editor" >
    <div class="editor">
      <canvas></canvas>
      <a class="close" @click="close" ></a>
      <div class="button-box">
        <div class="tool shape" @click="showTool(0)"><img src="../../../assets/ic_camera.png" ondragstart="return false"></div>
        <div class="tool eraser" @click="showTool(1)"><img src="../../../assets/ic_camera.png" ondragstart="return false"></div>
        <div class="tool deactive"></div>
        <div class="tool deactive"></div>
        <div class="tool deactive"></div>
        <div class="tool deactive"></div>
        <div class="tool deactive"></div>
        <button class="save" @click="deleteRobot" >저장</button>
      </div>

      <div v-show="tools[0]" class="shape-tool-box">
        
      </div>
      
      <div v-show="tools[1]" class="eraser-tool-box">

      </div>
      </div>
  </div>
</template>

<script>
import {ref,getCurrentInstance,onMounted,watch,reactive} from 'vue'


export default {
  name: 'MapEditor',
  props: {
  },
  setup () {
    const { proxy } = getCurrentInstance();
    const API = proxy._api;

    let showFlag = ref(false);
    let selectTool = -1;
    const tools = reactive([0,0])
    onMounted(() => {
      proxy._eventBus.on('showMapEditor', (flag)=>{
        showFlag.value = flag;
      })
    })
    const showTool = (index) =>{
      let toolList = document.getElementsByClassName("tool");
      toolList.forEach( (tool, i) => {
        if(i == index){
        	if(selectTool != index){
        	    tool.style.border = '1px solid #05a951';
              var label = tool.nextElementSibling;
              label.style.display = 'absolute';
        	    selectTool = index;
              tools[i] = true;
        	}else{
            tool.style.border = '1px solid #00000000';
            selectTool = -1;
            tools[i] = false;
      	  }
        }else{
          tool.style.border = '1px solid #00000000';
          tools[i] = false;
        }
      });

    }
    const close = () =>{
      // TODO
      
      showFlag.value = false;
    }
   
    
    return{
      showFlag,
      close,
      showTool,
      tools,
      onMounted
    }
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas{
  width: 100%;
  height: 100%;
  z-index: 4;
  background-color: #fff;
}
.editor{
  width: 1800px;
  height: 1020px;
  box-sizing: border-box;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.16);
  background-color: #222222;
  position: absolute;
  margin:0 auto;
  left: 60px;
  top: 30px;
  z-index: 3;
}
.map-editor{
  height: 100%;
  width: 100%;
  top: 0;
  z-index: 2;
  position: absolute;
  background-color: #000000cc;
}

.button-box{
  height: 100%;
  box-sizing: border-box;
  width: 250px;
  padding: 20px 20px 20px 20px;
  position: absolute;
  bottom: 0px;
  left: 0px;
  background-color: #00000044;
}
.button-box button{
  bottom: 10px;
  position: absolute;
  width: 210px;
  height: 40px;
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
.save{
  right: 20px;
  background-color: #05a951;
}
.close {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 32px;
  height: 32px;
  opacity: 0.3;
}
.close:hover {
  opacity: 1;
}
.close:before, .close:after {
  position: absolute;
  left: 15px;
  content: ' ';
  height: 33px;
  width: 2px;
  background-color: #333;
}
.close:before {
  transform: rotate(45deg);
}
.close:after {
  transform: rotate(-45deg);
}
.tool{
  background-color: #00000000;
  border: 1px solid #00000000;
  float: left;
  width: 90px;
  height: 90px;
  margin: 5px;
  border-radius: 10px;
  box-sizing: border-box;
  display: table;
}
.tool img{
  width: 100%;
}
.deactive {
  display: none;
}
.shape-tool-box{
  width: 100px;
  height: 300px;
  background-color: #00000044;
  position: absolute;
  top: 20px;
  left: 270px;
}
.eraser-tool-box{
  width: 100px;
  height: 300px;
  background-color: #00000044;
  position: absolute;
  top: 20px;
  left: 270px;
}
</style>
