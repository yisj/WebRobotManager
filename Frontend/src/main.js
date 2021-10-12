import { createApp } from 'vue'

import router from './router' // <---

import mitt from 'mitt';
import './assets/fonts/fonts.css'
import App from './App.vue'

// read config.json file
import config from './config.json'
import axios from 'axios'
import io from 'socket.io-client';

//const socket = io(url.substring(0, url.length-5) + '3000');
const socket = io("https://" + config.backend_server.url +':' + config.backend_server.ws.port);

const eventBus = mitt();


const app = createApp(App)
app.config.globalProperties._eventBus = eventBus
app.config.globalProperties._router = router
app.config.globalProperties._config = config
app.config.globalProperties._socket = socket

app.config.globalProperties._api = axios.create({
    baseURL: 'https://' + config.backend_server.url
});

app.use(router)
app.mount('#app')