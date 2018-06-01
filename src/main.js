// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vuelazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'
import Vuex from 'vuex'

Vue.config.productionTip = false;
Vue.use(vuelazyload,{
  loading:"./static/loading-svg/loading-bars-svg"
});
Vue.use(infiniteScroll);
Vue.filter("currency",currency);
Vue.use(Vuex);
/* eslint-disable no-new */
const store=new Vuex.Store({
  state:{
    //登录名
    nickName:'',
    //购物车数量
    cartCount:0,
  },
  mutations:{
    updateUserInfo(state,nickName){
      state.nickName=nickName;
    },
    updateCartCount(state,count){
      state.cartCount+=count;
    },
    initCartCount(state,cartCount){
      state.cartCount=cartCount;
    }
  }
})
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
