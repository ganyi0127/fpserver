var database=require('./database.js');
var resHandler=require('./resHandler.js');
var moment=require('moment');
var security=require('./security.js');
var code=require('./code.js');


/**
 * 注册
 */
function register(req,res){
    var body=req.body;
    var username=body.username;
    var password=body.password;
    console.log('<register>username: %s\npassword: %s',username,password);

    //数据库操作
    var conn=database.connectDB();

    console.log('url: %s',database.url);

    conn.connect(database.url,function(err,db){
        if(err){
            console.log('connect err: %s',err);
        }else{
            console.log('<register>mongoDB数据库创建成功');
            let dbase=db.db('sonam');
            let where={'username':{$eq:username}};
            dbase.collection('user').find(where).toArray(function(err,result){
                if(err){
                    console.log('find error: %s',err);
                }else{
                    let count=result.length;
                    console.log('<register>查询用户: %s\ncount:%s',result,count);
                    if(count>0){
                        resHandler.send(res,code.CODE_USER_REGISTER_EXISTED);
                        db.close();
                    }else{
                        let data={'username':username,'password':password};
                        console.log('data  : %s',data);
                        dbase.collection('user').insertOne(data,function(err,result){
                            if(err){
                                console.log('<register>插入用户错误: %s',err);
                            }else{
                                console.log('<register>result: %s',result);
                                var _id = data._id;
                                console.log('<register>_id:%s',_id);
                                var expires=moment().add(7,'days').valueOf();
                                var tokenId=security.accessToken(_id,expires);
                                console.log('<register>插入用户成功');
                                resHandler.send(res,code.CODE_SECCESS,{
                                    tokenId:tokenId
                                });
                            }
                            db.close();
                        });
                    }
                }
            });

        }
    });
    return;
}

/**
 * 登录
 */
function login(req,res){
    var body=req.body;
    var username=body.username;
    var password=body.password;

    if(username=='undefined'){
        return;
    }

    //连接数据库
    var conn=database.connectDB();

    conn.connect(database.url,function(err,db){
        if(err){
            console.log('connect err: %s',err);
            db.close();
        }else{
            console.log('mongoDB数据库创建成功');
            let dbase=db.db('sonam');
            let where={'username':{$eq:username},'password':{$eq:password}};
            dbase.collection('user').find(where).toArray(function(err,result){
                if(err){
                    console.log('find error: %s',err);
                    resHandler.send(res,code.CODE_USER_LOGIN_ERROR);
                }else{
                    let count=result.length;
                    console.log('查询用户: %s\ncount:%s',result,count);
                    if(count>0){
                        var _id=result[0]._id;
                        console.log('_id:%s',_id);
                        console.log('result:%s',result);

                        var expires=moment().add(7,'days').valueOf();

                        //计算tokenId
                        var tokenId=security.accessToken(_id,expires);
                        console.log('登录用户成功');

                        resHandler.send(res,code.CODE_SECCESS,{
                            tokenId:tokenId
                        });
                    }else{
                        resHandler.send(res,code.CODE_USER_LOGIN_ERROR);
                    }
                }
                db.close();
            });
        }
    });
}

/**
 * 判断是否已登录
 */
function isLogin(userId,tokenId,expires,completion){
    var conn=database.connectDB();

    var sql='SELECT * FROM user_login WHERE userid=? AND tokenid=? AND expires>?';
    conn.query(sql,[userId,tokenId,expires],function(err,results){
        if(err){
            completion(false);
        }else{
            completion(results.length>0);
        }
    });
}


module.exports={
    register:register,
    login:login,
    isLogin:isLogin
}
