import { createWebHistory, createRouter } from "vue-router"
import config from '../config.json'
import axios from 'axios'
import Login from '../components/views/Login.vue'
import Select from '../components/views/Select.vue'
import RobotList from '../components/views/RobotList.vue'
import SiteList from '../components/views/SiteList.vue'
import Robot from '../components/views/Robot.vue'
import RobotRemote from '../components/views/RobotRemote.vue'

const requireAuth = () => (from, to, next) => {

  const API = axios.create({
    baseURL: 'https://172.30.1.13:1337',
    headers: {
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',   
    }
  });
  let username = sessionStorage.getItem('userId');
  let jwt = sessionStorage.getItem('jwt');
  if(!username || !jwt){
    username = localStorage.getItem('userId');
    jwt = localStorage.getItem('jwt');
  }
  
  API.post('/users-permissions/check-jwt',{
    username: username,
    jwt: jwt
  }).then(
    response => {
      sessionStorage.setItem('userId',username);
    sessionStorage.setItem('jwt',jwt);
      return next();
    },
    error => {

      alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
      Promise.reject(error.response);
      return next('/');
    });
}

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login
  },
  {
    path: "/select",
    name: "Select",
    component: Select,
    beforeEnter: requireAuth()
  },
  {
    path: "/select/robot-list",
    name: "RobotList",
    component: RobotList,
    beforeEnter: requireAuth()
  },
  {
    path: "/select/site-list",
    name: "SiteList",
    component: SiteList,
    beforeEnter: requireAuth()
  },
  {
    path: "/robot",
    name: "Robot",
    component: Robot,
    beforeEnter: requireAuth()

  },
  {
    path: "/robot-remote",
    name: "RobotRemote",
    component: RobotRemote

  }


];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;