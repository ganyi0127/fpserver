const database=require('./database');
const code=require('./code.js');
const resHandler=require('./resHandler.js');

/**
 * 添加新排名
 */
function addScore(req,res){
    var body=req.body;
    var uuid=body.uuid;
    var score=body.score;
    var username=body.username;
    console.log('add new highestScore: %s\n username: %s\n uuid: %s',score,username,uuid);

    //数据库操作
    var conn=database.connectDB();

    conn.connect(database.url,function(err,db){
        if(err){
            console.log('connect err: %s',err);
        }else{
            console.log('mongoDB数据库创建成功');
            let sbase=db.db('sonam');

            //根据uuid查找对应数据，否则插入
            let where={'uuid':{$eq:uuid}};
            sbase.collection('user').find(where).toArray(function(err,result){

                if(err){
                    console.log('find error: %s',err);
                    db.close();
                }else{
                    let count=result.length;
                    console.log('查询用户 count: %s',count);
                    if(count>0){
                        //更新最高分
                        let _id=result[0]._id;

                        let where={'uuid':uuid};
                        let update={$set:{'score':score}};
                        sbase.collection('user').updateOne(where,update,function(err,result){
                            if(err){
                                console.log('更新分数错误: %s',err);
                                resHandler.send(res,code.CODE_LIST_ERROR);
                            }else{
                                console.log('更新成功 result: %s',result);
                                resHandler.send(res,code.CODE_SECCESS,{
                                    id:_id
                                })
                            }
                            db.close();
                        });
                    }else{
                        //插入最高分
                        let data={'username':username,'score':score,'uuid':uuid,'password':null};
                        console.log('data :%s',data);
                        sbase.collection('user').insertOne(data,function(err,result){
                            if(err){
                                console.log('插入用户错误: %s',err);
                                resHandler.send(res,code.CODE_LIST_ERROR);
                            }else{
                                console.log('result:%s',result);
                                var _id=data._id;
                                console.log('_id:%s',_id);
                                resHandler.send(res,code.CODE_SECCESS,{
                                    id:_id
                                })
                            }
                            db.close();
                        });
                    }
                }
            });
        }
    });
}


/**
 * 获取所有排名
 */
function getList(req,res){
    let body=req.body;
    let limit=body.limit;
    let offset=body.offset;

    if(limit==undefined || limit=="" || limit==null){
        limit=0;
    }
    if(offset==undefined || offset=="" || offset==null){
        offset=0;
    }

    //数据库操作
    var conn=database.connectDB();

    conn.connect(database.url,function(err,db){
        if(err){
            console.log('connect err: %s',err);
        }else{

            console.log('数据库创建成功');

            let sBase=db.db('sonam');
            let where={'score':{$gt:0}};
            let sort={'score':-1};
            sBase.collection('user').ensureIndex(sort);
            sBase.collection('user').find(where).skip(offset).limit(limit).sort(sort).toArray(function(err,result){
                if(err){
                    resHandler.send(res,code.CODE_USER_LOGIN_ERROR);
                }else{
                    resHandler.send(res,code.CODE_SECCESS,{
                        'result':result,
                        'offset':offset,
                        'limit':limit
                    })
                }
            });
        }
    });
}

/**
 * 根据uuid获取排名
 */
function getRanking(req,res){
    let body=req.body;
    let uuid=body.uuid;

    //数据库操作
    var conn=database.connectDB();

    conn.connect(database.url,function(err,db){
        if(err){
            console.log('<getRanking>connect err: %s',err);
            db.close();
        }else{
            console.log('<getRanking>创建数据库成功');

            var sbase=db.db('sonam');

            //1.根绝uuid查询score值
            let where={'uuid':uuid};
            sbase.collection('user').find(where).toArray(function(err,result){
                if(err){
                    console.log('<getRanking>查询分数错误: %s',err);
                    db.close();
                }else{
                    let count=result.length;
                    console.log('<getRanking>查询结果数量：%s',count);
                    if(count==0){
                        console.log('<getRanking>无数据');
                        db.close();
                    }else{

                        //2.根据分数查询排名（判断大于该分数的条目个数）
                        let score=result[0].score;

                        let condition={'score':{$gt:score}};
                        sbase.collection('user').find(condition).toArray(function(err,result){
                            if(err){
                                console.log('<getRanking>查询排名错误：%s',err);
                            }else{
                                let count=result.length;
                                resHandler.send(res,code.CODE_SECCESS,{
                                    'ranking':count+1
                                });
                            }
                            db.close();
                        })
                    }
                }
            });
        }
    })
}


module.exports={
    getList:getList,
    addScore:addScore,
    getRanking:getRanking
}