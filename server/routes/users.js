var express = require('express');
var router = express.Router();
require("./../util/util");
var User=require('./../model/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post("/login",function (req,res,next) {
  var param={
    userName:req.body.userName,
    userPwd:req.body.userPwd
  };
  User.findOne(param,function (err,doc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else {
     if (doc){
       res.cookie("userId",doc.userId,{
         path:'/',
         maxAge:1000*60*60
       });
       res.cookie("userName",doc.userName,{
         path:'/',
         maxAge:1000*60*60
       });
       // req.session.user=doc;
       res.json({
         status:'0',
         msg:'',
         result:{
           userName:doc.userName
         }
       })
     }
    }
  })


});
router.post("/logout",function (req,res,next) {
  res.cookie("userId","",{
    path:"/",
    maxAge:-1
  })
  res.cookie("userName","",{
    path:"/",
    maxAge:-1
  })
  res.json({
    status:"0",
    msg:'',
    result:''
  })
})
router.get("/checkLogin",function (req,res,next) {
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName||''
    })
  }else {
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    })
  }
});
//查询购物车列表
router.get("/cartList",function (req,res,next) {
  var userId=req.cookies.userId;
  User.findOne({userId:userId},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })

    }else {
      if(doc){}
      res.json({
        status:'0',
        msg:'',
        result:doc.cartList
      })
    }
  })
})
router.post("/cartDel",function (req,res,next) {
  var userId=req.cookies.userId,productId=req.body.productId;
  User.update({
    userId:userId,
  },{
    $pull:{
      'cartList':{
        'productId':productId
      }}
  },function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:""
      })
    }else {
      res.json({
        status:'0',
        msg:"",
        result:"success"
      })
    }

    }
  );
});
//修改商品数量
router.post("/cartEdit",function (req,res,next) {
  var userId=req.cookies.userId,
    productId=req.body.productId,
    productNum=req.body.productNum,
    checked=req.body.checked;
  User.update({"userId":userId,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked,
  },function (err,doc) {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ""
      })
    }else {
      res.json({
        status:'0',
        msg:"",
        result:"success"
      })
    }
  })
});
//全选
router.post("/editCheckAll",function (req,res,next) {
  var userId=req.cookies.userId,checkAll=req.body.checkAll?'1':'0';
  User.findOne({userId:userId},function (err,user) {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ""
      })
    }else {
      if(user){
        user.cartList.forEach((item)=>{
          item.checked=checkAll;
        });
        user.save(function (err1,doc1) {
          if(err1) {
            res.json({
              status: '1',
              msg: err.message,
              result: ""
            })
          }else{
            res.json({
              status: '0',
              msg: '',
              result: "success"
            })
          }
        });
      }

    }
  })
});
router.get("/addressList",function (req,res,next) {
  var userId=req.cookies.userId;
  User.findOne({userId:userId},function (err,doc) {
    if(err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ""
      })
    }else{
      res.json({
        status: '0',
        msg: '',
        result:doc.addressList
      })
    }
  });
});
router.post('/setDefault',function (req,res,next) {
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  if (!addressId) {
    res.json({
      status: '1003',
      msg: err.message,
      result: ""
    })
  } else {
    User.findOne({userId: userId}, function (err, doc) {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ""
        })
      } else {
        var addressList = doc.addressList;
        addressList.forEach((item) => {
          if (item.addressId == addressId) {
            item.isDefault = true;
          } else {
            item.isDefault = false;
          }
        });
        doc.save(function (err1, doc1) {
          if (err) {
            res.json({
              status: '1',
              msg: err.message,
              result: ""
            })
          } else {
            res.json({
              status: '0',
              msg: '',
              result: ''
            })
          }
        });
      }

    })
  }
});

//删除地址
router.post("/delAddress",function (req,res,next) {
  var userId = req.cookies.userId, addressId = req.body.addressId;
  User.update({
      userId:userId,
    },{
      $pull:{
        'addressList':{
          'addressId':addressId
        }}
    },function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:""
        })
      }else {
        res.json({
          status:'0',
          msg:"",
          result:"del success"
        })
      }

    }
  );
})
//订单确认
router.post("/payment",function (req,res,next) {
  var userId=req.cookies.userId,total=req.body.orderTotal,addressId=req.body.addressId;
  console.log("orderTotal"+total);
  User.findOne({userId:userId},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:""
      })
    }else {
      var address='',goodsList=[],orderTotal=0;
      doc.addressList.forEach((item)=>{
        if(addressId==item.addressId){
          address=item;
        }
      });
      //获取用户购物车的购买商品
      doc.cartList.filter((item)=>{
        if(item.checked=='1'){
          goodsList.push()
        }
      });
      var platform='622';
      var r1=Math.floor(Math.random()*10);
      var r2=Math.floor(Math.random()*10);
      //
      var sysDate=new Date().Format('yyyyMMddhhmmss');
      //订单创建时间
      var createDate=new Date().Format('yyyy-MM-dd hh:mm:ss');
      var orderId=platform+r1+sysDate+r2;
      //订单信息
      var order={
        orderId:orderId,
        orderTotal:total,
        addressInfo:address,
        orderStatus:'1',
        createDate:createDate
      };
      doc.orderList.push(order);
      doc.save(function (err1,doc1) {
        if(err1){
          res.json({
            status:'1',
            msg:err.message,
            result:""
          })
        }else {
          res.json({
            status:'0',
            msg:"",
            result:order
          })
        }
      })
    }
  })
});
router.get("/orderDetail",function (req,res,next) {
  //get方法的请求方式req.param(" ")
  //post方法的请求方式req.body.变量名
  var userId=req.cookies.userId,orderId=req.param("orderId");
  User.findOne({userId:userId},function (err,userInfo) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:""
      })
    }else {
      var orderList=userInfo.orderList;
      if(orderList.length>0) {
        var orderTotal = "";
        orderList.forEach((item) => {
          if (item.orderId == orderId) {
            orderTotal = item.orderTotal;
          }
        });
        if (orderTotal) {
          res.json({
            status: '0',
            msg: "",
            result: {
              orderId: orderId,
              orderTotal: orderTotal
            }
          })
        }else {
          res.json({
            status:'12002',
            msg:"无此订单",
            result:""
          })
        }
      }else{
        res.json({
          status:'12001',
          msg:"当前用户未创建订单",
          result:""
        })
      }
    }
  })
})
router.get("/getCartCount",function (req,res,next) {
  if(req.cookies&&req.cookies.userId){
    var userId=req.cookies.userId;
    User.findOne({userId:userId},function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:""
        })
      }else {
        var cartList=doc.cartList;
        let cartCount=0;
        cartList.map(function (item) {
          cartCount+=parseInt(item.productNum);
        })
        res.json({
          status:'0',
          msg:"",
          result:cartCount
        })
      }
    })
  }
})
module.exports = router;
