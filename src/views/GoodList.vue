<template>
  <div>
    <navheader></navheader>
    <navbread>
      <span>Goods</span>
    </navbread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods()">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop()">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked=='all'}" @click="priceChecked='all'">All</a></dd>
              <dd v-for="(item,index) in priceFilter" >
                <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked==index}">{{item.startPrice}}-{{item.endPrice}}</a>
              </dd>
            </dl>
          </div>
          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodList">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area" @click="addCart(item.productId)">
                      <a href="javascript:;" class="btn btn--m" >加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                加载中....
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop()"></div>
    <navfooter></navfooter>
    <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
    <p slot="message">
      请先登陆，负责无法执行加入购物车
    </p>
    <div slot="btnGroup">
      <a class="btn btn--m" href="javascript:;" @click="mdShow=false">关闭</a>
    </div>
  </modal>
    <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
      <p slot="message">
        <svg class="navbar-cart-logo">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart"></use>
        </svg>
        <span>加入购物车成功</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShowCart=false">继续购物</a>
        <router-link class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>
      </div>
    </modal>
  </div>
</template>
<script>
  import './../assets/css/base.css'
  import './../assets/css/product.css'
  import './../assets/css/checkout.css'
  import './../assets/css/login.css'
  import navheader from '@/components/navheader.vue'
  import navfooter from '@/components/navfooter.vue'
  import navbread from '@/components/navbread.vue'
  import modal from '@/components/modal.vue'
  import axios from 'axios'

  export default{
    data(){
      return {
          goodList:[],
          priceFilter:[
            {
              startPrice:'0.00',
              endPrice:'500.00'
            },
            {
              endPrice:'1000.00',
              startPrice:'500.00'
            },
            {
              startPrice:'1000.00',
              endPrice:'2000.00'
            },

          ],
          priceChecked:'all',
          filterBy:false,
          overLayFlag:false,
          sortFlag:true,
          pageSize:8,
          page:1,
          busy:true,
          mdShow:false,
          mdShowCart:false
      }
    },
    components:{
        navheader,
        navfooter,
        navbread,
        modal
    },
    mounted:function () {
      this.getGoodsList();
    },
    methods:{
        getGoodsList(flag){
            var param={
                page:this.page,
                pageSize:this.pageSize,
                sort:this.sortFlag?1:-1,
                priceLevel:this.priceChecked
            };

            axios.get('/goods/list',{
                params:param
            }).then((result)=>{
                var res=result.data;
                if(res.status=="0"){
                    if(flag){
                      this.goodList=this.goodList.concat(res.result.list);
                      if(res.result.count==0){
                          this.busy=true;
                      }else{
                          this.busy=false;
                      }
                    }else {
                        this.goodList=res.result.list;
                        this.busy=false;
                    }
                }else {
                  this.goodList=[];
                }
            })
        },
        sortGoods(){
            this.sortFlag=!this.sortFlag;
            this.page=1;
            this.getGoodsList()
        },
        showFilterPop(){
          this.filterBy=true;
          this.overLayFlag=true;
        },
        closePop(){
          this.filterBy=false;
          this.overLayFlag=false;
        },
        setPriceFilter(index){
            this.priceChecked=index;
            this.closePop();
            this.getGoodsList();
        },
        loadMore(){
            this.busy = true;
            setTimeout(() => {
              this.page++;
              this.getGoodsList(true);
            }, 500);
      },
      addCart(productId){
        axios.post('/goods/addCart', {
          productId:productId
        }).then((res)=>{
          console.log(res);
            console.log(res.data.status);
            console.log(res.data.status==0);
            if(res.data.status==0){
                this.mdShowCart=true;
//                alert("加入成功");
              this.$store.commit("updateCartCount",1)
            }else{
//                alert("失败");
              this.mdShow=true
            }
        })
      },
      closeModal(){
          this.mdShow=false
      }
    }
  }
</script>
