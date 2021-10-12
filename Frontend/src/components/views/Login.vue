<template>
    <div class="login">
      <form v-on:submit.prevent="login">
        <p class="login-label">로그인</p>
        <div class="input-box">
          <input class="input-effect" type="text" v-model="loginInfo.id" placeholder="아이디를 입력해 주세요.">
          <span class="focus-border"></span>
        </div>
        
        <p class="login-label">패스워드</p>
        <div class="input-box">
          <input class="input-effect" type="password" v-model="loginInfo.password" autocomplete="off" placeholder="패스워드를 입력해 주세요.">
          <span class="focus-border"></span>
        </div>

        <label class="id-save">아이디 저장
          <input v-model="saveId" type="checkbox">
          <span class="checkmark"></span>
        </label>
        
        <div class="login-button">
          <button type="submit" id="login" v-bind:style="styles.loginButton">로그인</button>
        </div>
      </form>
    
      <div v-if="!loginInfo.loginResult" class="fail-box">
        <p><img src="../../assets/ic_error.png">&nbsp;&nbsp;&nbsp;아이디 혹은 패스워드가 틀렸습니다.<br>
        다시 입력해 주세요.</p>
      </div>
      
      <div class="login-info-footer">
        <a href="#">계정 생성</a>
        <a href="#">아이디 찾기</a>
        <a href="#">비밀번호 찾기</a>
      </div>
    </div>
</template>

<script>
import { watch,reactive,getCurrentInstance, onMounted,ref } from 'vue'

export default {
  name: 'Login',
  props: {
  },
  setup () {
    const { proxy } = getCurrentInstance();
    const API = proxy._api;
    // data 정의
    const styles = reactive({
      loginButton:{
        'background-color' : '#525051'
      }
    })
    const loginInfo = reactive({
      id:'',
      password:'',
      loginResult:true
    })
    
    let saveId = ref(false)
    
    watch(
      () => [loginInfo.id,loginInfo.password],
      (info) => {
        if(info[0] != "" && info[1] != "")
          styles.loginButton['background-color'] = '#05a951';
        else
          styles.loginButton['background-color'] = '#525051';
      }
    )
    onMounted(()=>{
      
      let id = localStorage.getItem('userId');
      let password = localStorage.getItem('userPassword');
      if(id != null){
        loginInfo.id = id;
        loginInfo.password = password;
        saveId.value = true;
      }

    })
    const login = () => {
        API.post('/auth/local',{
          identifier: loginInfo.id,   
          password: loginInfo.password
        }).then(
          response => {
            loginInfo.loginResult = true;
            API.put('/users-permissions/reset-jwt',{username:loginInfo.id, jwt:response.data.jwt}).then(response => {
              sessionStorage.setItem('userId',loginInfo.id);
              sessionStorage.setItem('userPassword',loginInfo.password);
              sessionStorage.setItem('jwt',response.data.jwt);
            
              if(saveId.value){
                localStorage.setItem('userId',loginInfo.id);
                localStorage.setItem('userPassword',loginInfo.password);
                localStorage.setItem('jwt',response.data.jwt);
                
              }else{
                localStorage.removeItem('userId');
                localStorage.removeItem('userPassword');
                localStorage.removeItem('jwt');
              }
              proxy._router.push('/select');
            });
          },
          error => {
              loginInfo.loginResult = false;
              return Promise.reject(error.response);
          });
    }
    return { 
        login,
        loginInfo,
        styles,
        saveId,
        onMounted,
        watch
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
:focus{outline: none;}
p{
  margin:0;
}

.login{
  width: 250px;
  padding-top:210px;
  position: relative;
  margin: 0 auto;
}
.login-label{
  font-family: HDharmonyM;
  font-size: 16px;
  padding-top:30px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: left;
  color: #e6e6e6;
}
.id-save{
  font-family: HDharmonyL;
  top:20px;
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
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.id-save input {
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
.id-save input:checked ~ .checkmark {
  background-color: #00000000;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.id-save input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.id-save .checkmark:after {
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

#login{
  width: 100px;
  height: 40px;
  opacity: 0.9;
  border-radius: 4px;
  outline: none;
  border: none;
  background-color: #525051;

  font-family: HDharmonyM;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
}
.login input[type=text],input[type=password]{
  width: 100%;
  background-color: #0000;
}
.input-box{
  position: relative;
}

.login-button{
  display: flex;
  padding-top: 60px;
}
.login-button button{
  margin:0 auto;
}
.fail-box{
  padding-top: 40px;

  font-family: HDharmonyL;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #b0b0b0;

}
.fail-box img{
  margin: -5px;
}
.login-info-footer{
  width: 250px;
  position: absolute;
  bottom: 120px;
  display: flex;

}
.login-info-footer a:link{
  margin: 0 auto;
  
  font-family: HDharmonyL;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: right;
  color: #b0b0b0;
}
.login-info-footer a:visited{
  color: #b0b0b0;
}
/* input box effect */
.input-effect{
  border: 0; 
  padding: 7px 0; 
  border-bottom: 1px solid #ebebeb; 
  color:#ebebeb;
}
.input-effect ~ .focus-border{
  position: absolute; 
  bottom: 0; 
  left: 0; 
  width: 100%; 
  height: 2px; 
  z-index: 99;
}
.input-effect ~ .focus-border:before, 
.input-effect ~ .focus-border:after{
  content: "";
  position: absolute;
  bottom: 0; 
  left: 0;
  width: 0; 
  height: 100%; 
  background-color: #05a951;
  transition: 0.4s;
}
.input-effect ~ .focus-border:after{
  left: auto;
  right: 0;
}
.input-effect:focus{ 
  color:#ebebeb;
}
.input-effect:focus ~ .focus-border:before, 
.input-effect:focus ~ .focus-border:after{
  width: 50%;
  transition: 0.4s;
}
</style>
