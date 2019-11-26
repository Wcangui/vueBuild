import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/*ui框架 */
import iview from 'iview'
import 'iview/dist/styles/iview.css'

/* 全局消息提示 */
import message from './module/messge'

Vue.use(iview);
Vue.use(message);

//设置为window全局变量，以便在其他文件引用
window.router=router;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
