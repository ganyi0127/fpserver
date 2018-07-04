var mysql=require('mysql');
var mongo = require('mongodb');
var url = "mongodb://localhost:27017/sonam";

/**
 * 链接数据库
 */
function connectDB(){
    let mongoClient=mongo.MongoClient;
    return mongoClient;

    //创建数据库链接
    conn=mysql.createConnection({
        host:'localhost',
        port:'3306',
        //insecureAuth:true,
        user:'root',
        password:'12345678'
    });

    conn.query('USE sonam');
    return conn;
}


function close(conn){
    conn.close();
    return;
    conn.end();
}


module.exports={
    url:url,
    connectDB:connectDB,
    close:close
}
