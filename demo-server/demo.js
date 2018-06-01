/**
 * Created by LW on 2018/5/14.
 */
let user=require('./User');
let url=require('url');
let util=require('util');

console.log(`userName:${user.userName}`);
console.log(`I'm ${user.userName},I say ${user.sayHello()}`);

let http=require('http');
let app=http.createServer((req,res)=>{
  res.statusCode=200;
  res.setHeader('Content-Type','text-plain,charset=utf-8');
  // url.parse(req.url);
  res.end(url.parse(req.url));
});
app.listen(3000,'127.0.0.1',()=>{
  console.log("服务器已经运行");
});
