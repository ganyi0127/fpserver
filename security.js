var crypto=require('crypto');
var fs=require('fs');
var path=require('path');

/**
 * 最大加密明文大小
 */
const MAX_ENCRYPT_BLOCK=117-31;

/**
 * 最大解密密文大小
 */
const MAX_DECRYPT_BLOCK=128;


/**
 * 公钥加密
 */
function encrypt(text){
    var publicKey=fs.readFileSync('./cert.pem').toString();

    var buffer=new Buffer(text,'utf-8');

    var inputLen=buffer.byteLength;

    //密文
    var bufs=[];

    var offset=0;

    var endOffset=MAX_ENCRYPT_BLOCK;

    while(inputLen-offset>0){
        if(inputLen-offset>MAX_ENCRYPT_BLOCK){
            var bufTmp=buf.slice(offset,endOffset);
            bufs.push(crypto.publicEncrypt({key:publicKey,padding:crypto.REA_PKCS1_PADDING},bufTmp));
        }else{
            var bufTmp=buf.slice(offset,inputLen);
            bufs.push(crypto.publicEncrypt({key:publicKey,padding:crypto.REA_PKCS1_PADDING},bufTmp));
        }
        offset+=MAX_ENCRYPT_BLOCK;
        endOffset+=MAX_ENCRYPT_BLOCK;
    }

    var result=Buffer.concat(bufs);

    var base64Str=result.toString('base64');

    console.log('base64: %s',base64Str);

    return base64Str;
}

/**
 * 私钥解密
 */
function decrypt(data){
    //得到私钥
    var privateKey=fs.readFileSync('./server.pem').toString();

    //经过base64编码的密文转成buf
    var buf=new Buffer(date,'base64');

    var inputLen=buf.byteLength;

    //密文
    var bufs=[];

    var offset=0;

    var endOffset = MAX_DECRYPT_BLOCK;

    //分段解密
    while (inputLen-offset>0) {
        if(inputLen-offset>MAX_DECRYPT_BLOCK) {
            var bufTmp=buf.slice(offset, endOffSet);
            bufs.push(crypto.privateDecrypt({key: privateKey,padding:crypto.RSA_PKCS1_PADDING}, bufTmp));
        }else{
            var bufTmp=buf.slice(offset, inputLen);
            bufs.push(crypto.privateDecrypt({key: privateKey,padding:crypto.RSA_PKCS1_PADDING}, bufTmp));
        }
        offset += MAX_DECRYPT_BLOCK;
        endOffset += MAX_DECRYPT_BLOCK;
    }

    var result=Buffer.concat(bufs).toString();

    console.log('result: %s',result);

    return result;
}

/**
 * 计算tokenid
 */
function accessToken(username,expires){
    var content=username+expires;
    var md5vo=crypto.createHash('md5');
    md5vo.update(content);
    return md5vo.digest('hex');
}

module.exports={
    encrypt:encrypt,
    decrypt:decrypt,
    accessToken:accessToken
}
