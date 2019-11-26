import Vue from 'vue'
import {logout,isUserLogin} from '../api/common'
import Message from '../module/messge'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'

import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next)=> {
  if (to.path == '/login') {
    logout();
  }
  
  let user = isUserLogin();

  if (!user && to.path != '/login') {
    next({ path: '/login' });
    
    Message.error('请重新登录');
  } else {
    if(to.path === '/monitor' && from.path !=='/monitor' && from.path !=='/'){
      //window.screen.availHeight
      //window.open(to.fullPath,'_blank','height=550,width=1000,menubar=no,toolbar=no,status=no,scrollbars=no,resizable=yes');
      window.open('/#'+to.fullPath,'_blank','height=550,width=1000,menubar=no,toolbar=no,status=no,scrollbars=no,resizable=yes');
    }else{
      next()
    }
  } 
})

export default router
