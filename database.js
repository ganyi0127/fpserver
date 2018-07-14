var mysql=require('mysql');
var mongo = require('mongodb');
var url = "mongodb://localhost:27017/sonam";

/**
 * 链接数据库
 */
function connectDB(){
    let mongoClient=mongo.MongoClient;
    return mongoClient;
}


function close(conn){
    conn.close();
}


module.exports={
    url:url,
    connectDB:connectDB,
    close:close
}
