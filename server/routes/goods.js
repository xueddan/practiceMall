/**
 * Created by LW on 2018/5/14.
 */
var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
var Goods=require('../model/goods');
var User=require('../model/user');

//链接数据库
mongoose.connect('mongodb://127.0.0.1:27017/db_demo');
//测试是否链接成功
mongoose.connection.on("connected",function () {
  console.log("Success");
});
mongoose.connection.on("error",function () {
  console.log("error");
});
mongoose.connection.on("disconnected",function () {
  console.log("disconnected");
});

router.get('/list',function (req,res,next) {
  let page=parseInt(req.param('page'));
  let pageSize=parseInt(req.param('pageSize'));
  let  sort=req.param("sort");
  let priceLevel=req.param('priceLevel');
  let skip=(page-1)*pageSize;
  let priceGt='',priceLte='';
  let params={};
  if(priceLevel!='all'){
    switch (priceLevel){
      case '0':priceGt=0;priceLte=100;break;
      case '1':priceGt=100;priceLte=200;break;
      case '2':priceGt=200;priceLte=500;break;
      case '3':priceGt=500;priceLte=1000;break;
    }
    params={
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }

  let goodsModel=Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});

  goodsModel.exec({},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else {
      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      })
    }
  })
});
//加入购物车
router.post('/addCart',function (req,res,next) {
  var userId='100000077',productId=req.body.productId;
  console.log("进入购物车===================");
  User.findOne({
    userId:userId
  },function (err,userDoc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else {
      console.log("userDoc"+userDoc);
      if(userDoc){
        let goodsItem='';
        userDoc.cartList.forEach(function (item) {
          if(item.productId==productId){
            goodsItem=item;
            item.productNum++;
          }
        });
        if(goodsItem){
          userDoc.save(function (err3,doc3) {
            if(err3) {
              res.json({
                status: '1',
                msg: err.message
              })
            }else{
              res.json({
                status:'0',
                msg:'',
                result:{
                  count:doc3.length,
                  list:doc3
                }
              })
            }
          })
        }else{
          Goods.findOne({"productId":productId},function (err1,doc1) {
            if(err1){
              res.json({
                status:'1',
                msg:err.message
              })
            }else{
              if(doc1){
                // console.log("doc1++++++++++++++++++++===");
                // console.log(doc1);
                // console.log(typeof doc1);
                //新创建一个对象，实现转换mongoose不能直接增加属性的坑
                var newobj = {
                  productNum: "1",
                  checked: "1",
                  productId: doc1.productId,
                  producName: doc1.producName,
                  salePrice: doc1.salePrice,
                  productName: doc1.productName,
                  productImage: doc1.productImage,
                }
                userDoc.cartList.push(newobj);
                userDoc.save(function (err2,doc2) {
                  if(err2) {
                    res.json({
                      status: '1',
                      msg: err.message
                    })
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:{
                        count:doc2.length,
                        list:doc2
                      }
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })
});
module.exports=router;
