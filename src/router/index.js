import Vue from 'vue'
import Router from 'vue-router'
import GoodList from './../views/GoodList.vue'
import Cart from './../views/Cart.vue'
import Address from './../views/address.vue'
import orderConfirm from './../views/orderConfirm.vue'
import orderSuccess from './../views/orderSuccess.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodList',
      component: GoodList
    },
    {
      path:'/cart',
      name:'cart',
      component:Cart
    },
    {
      path:'/address',
      name:'address',
      component:Address
    },
    {
      path:'/orderConfirm',
      name:'orderConfirm',
      component:orderConfirm
    },
    {
      path:'/orderSuccess',
      name:'orderSuccess',
      component:orderSuccess
    }
  ]
})
