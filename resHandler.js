function send(res,code,jsondata){
    var message;
    if(code==200){
        message='成功';
    }else{
        message='失败';
    }
    console.log('message: %s',message);
    res.send({
        code:code,
        message:message,
        data:jsondata
    });
}

module.exports={
    send:send
}
