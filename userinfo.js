const resHandler=require('./resHandler.js');
const code=require('./code.js');
const database=require('./database');


/**
 * 修改个人信息
 */
function updateUserinfo(req,res){
    var body=req.body;
    var sex=body.sex;
    var age=body.age;
    var signature=body.signature;
    var tokenId=body.tokenId;
    console.log('<updateUserinfo>update userinfo\n    sex: %s\n    age: %s\n    signature: %s',sex,age,signature);

    //数据库操作
    var conn=database.connectDB();

    conn.connect(database.url,function(err,db){
        if(err){
            console.log('<updateUserinfo>connect err: %s',err);
            db.close();
        }else{
            console.log('<updateUserinfo>connect success');

            let sbase=db.db('sonam');

            //查找用户

        }
    });
}


module.exports={
    updateUserinfo:updateUserinfo
}
