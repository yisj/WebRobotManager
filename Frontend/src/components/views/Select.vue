<template>
  <div class="select">
    <div class="select-box">
      <div @click="select('robot')">
        <span >로봇</span>
        <div  v-bind:style="styles.type.robot"></div>
      </div>
    
		  <div @click="select('site')">
        <span>지도</span>
        <div  v-bind:style="styles.type.site"></div>
      </div>
    </div>

    <div class="comment-box">
  	  <p><img src="../../assets/ic_error.png">&nbsp;&nbsp;&nbsp;둘 중 하나를 선택해 주세요.</p>
    </div>
      
    <div class="check-button-box">
        <button class="check-button" @click="nextPage" v-bind:style="styles.checkButton">확인</button>
    </div>
  </div>
</template>

<script>
import { reactive,getCurrentInstance } from 'vue'

export default {
  name: 'Select',
  props: {
  },
  setup () {
    const { proxy } = getCurrentInstance();
    const selectType = reactive({
      robot: false,
      site: false
    });
    const styles = reactive({
      type:{
        robot: {
          'border-color': '#707070'
        },
  	    site:{
          'border-color': '#707070'
        }
      },
      checkButton:{
          'background-color': '#4c4b4c'
      }
    });

    const select = (type) => {
      switch(type){
        case 0: // select robot
          console.log('robot');
          break;
        case 1: // select site
          console.log('site');
          break;
      }
      let keys = Object.keys(styles.type);
      keys.forEach((key) => {
        if( key == type ){
          if(selectType[key]){
            styles.type[key]['border-color'] = '#707070';
            styles.checkButton['background-color'] = '#4c4b4c';
          }else{
            styles.type[key]['border-color'] = '#05a951';
            styles.checkButton['background-color'] = '#05a951';
          }
          selectType[key] = !selectType[key];
          console.log(selectType[key]);
        }else{
          styles.type[key]['border-color'] = '#707070';
          selectType[key] = false;
        }
      });
    }
    const nextPage = () =>{
      let keys = Object.keys(selectType);
      let pageName = '';
      for(let i = 0 ; i < keys.length ; i++){
        let key = keys[i];
        if(selectType[key] == true){
          switch(key){
            case 'robot':
              pageName = '/select/robot-list';
              break;
            case 'site':
              pageName = '/select/site-list';
              break;
          }
          break;
        }
      }
      proxy._router.push({path: pageName});
    }

    return{
      styles,
      select,
      nextPage
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
:focus{
  outline: none;
}
p{
  margin:0;
}
.comment-box{
  font-family: HDharmonyL;
  padding: 20px 0 0 25px;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #e6e6e6;
}
.comment-box img{
  margin: -5px;
}
.select{
  padding-top:305px;
  margin: 0 auto;
  position: relative;
  width:440px;
}
.select-box{
  height: 200px;
}
.select-box div{
  float:left;
  width: 170px;
  text-align: center;
 padding: 0 25px;

  font-family: HDharmonyM;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #fff;
}
.select-box div div{
  float: left;
  width: 170px;
  height: 170px;
  padding: 7.5px 4.5px 6.5px 3.5px;
  margin-top:6px;
  box-sizing: border-box;
  border-radius: 20px;
  border: solid 1px #707070;
}
.check-button-box{
  text-align: center;
  top: 700px;
  width: 100%;
  position: absolute;
}
.check-button{
  width: 100px;
  height: 40px;
  opacity: 0.9;
  border-radius: 4px;
  outline: none;
  border: none;

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
