<template>
  <div class="footer" v-bind:style="styles.footer">
    <div v-if="showFlag" class="company-info">03058 서울시 종로구 율곡로 75 현대빌딩 | 사업자등록번호 101-81-16293 | T. 1577-7755</div>
    <div v-if="showFlag" class="copyright"><span>© HYUNDAI E&C.</span> ALL RIGHTS RESERVED.</div>
    <div v-show="showTimeLine" class="time-line"> 
      <div id="time-section-select" >
        <select>
          <option>30분</option>
          <option>1시간</option>
          <option>2시간</option>
          <option>4시간</option>
        </select>
      </div>
      <div id="time-line">
        <div id="time-line-container">
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[32] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[31] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[30] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[29] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[28] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[27] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[26] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[25] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[24] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[23] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[22] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[21] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[20] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[19] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[18] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[17] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[16] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[15] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[14] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[13] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[12] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[11] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[10] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[9] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[8] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[7] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[6] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[5] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[4] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[3] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[2] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[1] }}</div></div>
        <div class="time-line-line-container" v-bind:style="styles.timeSection"><div class="time-line-line"></div><div class="time-line-label">{{timeLineLabel[0] }}</div></div>
        </div>
      </div>
      <div id="timer"><div>{{time}}</div></div>
    </div>
  </div>
</template>

<script>
import { ref,reactive,watch,getCurrentInstance, onMounted } from 'vue'

export default {
  name: 'Header',
  props: {
  },
  setup () {
    const { proxy } = getCurrentInstance();
    let time = ref('');
    let showFlag = ref(true);
    let showTimeLine = ref(false);
    
    let minArrIndex = 32;
    
    let count = 1;
    let now = reactive(new Date());
    const minArr = reactive([
      0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,
      0,0,0
    ]);
    const timeLineLabel = reactive([
      "","","","","","","","","","",
      "","","","","","","","","","",
      "","","","","","","","","","",
      "","",""
    ]);
    const styles = reactive({
      footer: {
        height: '160px',
        'margin-top': '0px'
      },
      timeSection:{
        left: '0%'
      }
    });
    onMounted(()=>{
      minArr.forEach((min,index) => {
        let minTmp = now.getMinutes() - index;
                  
        if(minTmp < 0)
          minArr[index] = 60 + minTmp;
        else
          minArr[index] = minTmp;
      
        if(minArr[index] % 2 == 0)
          timeLineLabel[index] = "";
        else
          timeLineLabel[index] = ("0" + now.getHours()).slice(-2) + ":" + ("0" + minArr[index]).slice(-2);
      })
    })
    const timer = () =>{
      // 30분 단위로 세팅되어 있음
      // 선택되어진 단위마다 다르게 세팅해줘야함
      let now = new Date();
      time.value = ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2) + ":" + ("0" + now.getSeconds()).slice(-2);
      let timeLine = document.getElementById("time-line-container");
      
      if(count % 61 == 0){          
        //왼쪽으로 넘어가서 안보이는 div 맨 뒤로 
        let timeSection = timeLine.children[0];
        timeLine.insertBefore(timeSection, null);
        // div 전부 원래자리로
        styles.timeSection.left='0px';
        //count 초기화
        count = 0;

        //min 계산
        let beforIndex = minArrIndex;
        if(++beforIndex > 32)
          beforIndex = 0;
                  
        let min = minArr[beforIndex] + 1;
        minArr[minArrIndex--] = min >= 60 ? min - 60 : min;
                  
        //Label 세팅
        if(minArr[minArrIndex + 1] % 2 == 0)
          timeLineLabel[minArr[minArrIndex + 1]] ="";
        else
          timeLineLabel[minArrIndex + 1] = ("0" + now.getHours()).slice(-2) + ":" + ("0" + minArr[minArrIndex + 1]).slice(-2);
                  
        //index 초기화
        if(minArrIndex < 0)
          minArrIndex = 32;
      }else{
        styles.timeSection.left= '-' + (count * 0.93) + 'px';
      }
      count += 1;
      if(showTimeLine.value)
        setTimeout(timer, 1000);
    }
    watch(
      () => proxy._router.currentRoute.value.name,
      (name) =>{
        console.log(name);
        showTimeLine.value = false;
        switch(name){
          case 'Login':
          case 'RobotRemote':
            styles.footer.height = '160px';
              styles.footer['margin-top'] = '0px';showFlag.value = true;
            break;
          case 'Robot':
            showTimeLine.value = true;
              
            timer();
            showFlag.value = false;
            styles.footer.height = '58px';
            styles.footer['margin-top'] = '2px';
            break;
          case 'Select':
            showFlag.value = true;
            styles.footer.height = '58px';
            styles.footer['margin-top'] = '2px';
            break;
          default:
            showFlag.value = false;
            styles.footer.height = '58px';
            styles.footer['margin-top'] = '2px';
            break;
        }
      }
    )
    return{
      showFlag,
      time,
      timeLineLabel,
      showTimeLine,
      styles,
      watch
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer{
  height: 160px;
  bottom: 0;
  overflow: hidden;
  background-color:  #525051;
  font-family: HDharmonyL;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #b0b0b0;
  transition: height 0.7s, margin-top 0.3s;
}
.company-info{
  padding-top: 60px;
}
.copyright span{
  color:#05a951;
}
.time-line{
  width: 100%;
  height: 100%;
  display: flex;
  padding-top:10px;
}
#time-line-select, #time-line, #timer{
  float: left;  
  height: 100%;
}
#time-section-select{
  width: 103px;
}
#time-section-select select{
  float: right;
  width: 99px;
  height: 48px;
  margin: 0 1px 0 0;
  opacity: 0.3;
  background-color: #000000;
  padding: 0 0 0 19.5px;
  font-family: HDharmonyL;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: white;
  border:none;
  outline: none;
}
#time-line{
  width: 1730px;
  height: 58px;
  overflow: hidden;
}
#time-line-container{
  width: 1910px;
  height: 100%;
}
.time-line-line-container{
  width: 55.8px;
  float: left;
  position: relative;
}
#timer{
  width: 85px;
  display: flex;
  
}
#timer div{
  width: 100%;
  margin:17.5px 0 0 0 ;
  font-family: HDharmonyL;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: white;
}
.time-line-line{
  width: 0.1px;
  margin: 0 auto;
  background-color: #bbbbbb;
  height:6px;
}
</style>
