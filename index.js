var express=require('express');
var bodyParser=require('body-parser');
var route=require('./route.js');
var user=require('./user.js');
var world=require('./world.js');


var app=express();

app.get('/',function(req,res){
    res.send('hi sonam');
})


app.listen(8082);

//app.set("view engine","ejs");
app.use(bodyParser.json({limit:'1mb'}));
app.use(bodyParser.urlencoded({extended:true}))


var url_map = {
    '注册':{
        'path':'/register',
        'respond':user.register
    },
    '登录':{
        'path':'/login',
        'respond':user.login
    },
    '获取排行榜':{
        'path':'/list',
        'respond':world.getList
    },
    '上传分数':{
        'path':'/addscore',
        'respond':world.addScore
    },
    '获取排名':{
        'path':'/getranking',
        'respond':world.getRanking
    }
}

route.route(app,url_map);
