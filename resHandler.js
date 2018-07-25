function send(res,code,jsondata){
    var message;
    if(code==200){
        message='成功';
    }else if(code==410){
        message='无更多数据';
    }
    console.log('message: %s',message);
    res.header("Access-Control-Allow-Origin","*");
    res.send({
        code:code,
        message:message,
        data:jsondata
    });
}

module.exports={
    send:send
}
