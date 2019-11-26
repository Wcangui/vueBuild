import axios from '../module/axiosbase';
import {getUserLoginInfo,redirectTologin,responseDataToMap} from './common'
import getPublicKey from './publicKey'

const decryptData = function (encryptData, key) {
    try {
        //Creating the Vector Key        
        var iv = CryptoJS.enc.Hex.parse(key);
        //Encoding the Password in from UTF8 to byte array
        //Encoding the Salt in from UTF8 to byte array
        var Salt = CryptoJS.enc.Utf8.parse(key);
        //Creating the key in PBKDF2 format to be used during the decryption
        var key128Bits1000Iterations = CryptoJS.PBKDF2(key, Salt, { keySize: 128 / 32, iterations: 100 });
        //Enclosing the test to be decrypted in a CipherParams object as supported by the CryptoJS libarary
        var cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Base64.parse(encryptData)
        });

        //Decrypting the string contained in cipherParams using the PBKDF2 key
        var decrypted = CryptoJS.AES.decrypt(cipherParams, key128Bits1000Iterations, { mode: CryptoJS.mode.CBC, iv: iv, padding: CryptoJS.pad.Pkcs7 });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
    //Malformed UTF Data due to incorrect password
    catch (err) {
        return "";
    }
};

const encryptData = function (plainText, key) {
    try {
        //Creating the Vector Key        
        var iv = CryptoJS.enc.Hex.parse(key);
        //Encoding the Salt in from UTF8 to byte array
        var Salt = CryptoJS.enc.Utf8.parse(key);
        //Creating the key in PBKDF2 format to be used during the decryption
        var key128Bits1000Iterations = CryptoJS.PBKDF2(key, Salt, { keySize: 128 / 32, iterations: 100 });
        //Enclosing the test to be decrypted in a CipherParams object as supported by the CryptoJS libarary

        //Decrypting the string contained in cipherParams using the PBKDF2 key
        var encrypted = CryptoJS.AES.encrypt(plainText, key128Bits1000Iterations, { mode: CryptoJS.mode.CBC, iv: iv, padding: CryptoJS.pad.Pkcs7 });
        return encrypted.toString();
    }
    //Malformed UTF Data due to incorrect password
    catch (err) {
        return "";
    }
};

const request = function (rout, requestData, needAuth, 
    encrypt,ajaxType="POST"){
    var userCode = "",
        token = "",
        enDecryptKey = "",
        decryptKey = "",
        config = {headers:{}};

    var user = getUserLoginInfo();
    if(!user && needAuth){
        redirectTologin();

        return Promise.reject("请求处理失败");
    }

    if(user){
        userCode = user.userCode;
        token = user.token;
    }

    encrypt = !encrypt || encrypt == null ? false : true;

    var type = ajaxType.toUpperCase();
    config.url = rout;
    config.method = type;
    
    if(type === "GET" || type === "DELETE"){
        config.params = requestData;
    }else{
        config.data = requestData;
    }

    if(userCode){
        config.headers['UserCode'] = userCode;
        config.headers['Authorization-Token'] = token;
    }
    
    config.headers['IsEncrypt'] = encrypt;

    if(encrypt){
        return getPublicKey()
        .then(key => {
            if(!key){
                return Promise.reject("请求处理失败");
            }

            // Script.include([process.env.BASE_URL+"js/encrypt/jsencrypt.min.js",
            //     process.env.BASE_URL+"js/encrypt/aes.js",
            //     process.env.BASE_URL+"js/encrypt/pbkdf2.js",
            //     process.env.BASE_URL+"js/encrypt/sha256.js"
            // ]);

            var jsEncrypt = new JSEncrypt();
            jsEncrypt.setPublicKey(key);

            for (var i = 0; i < 8; i++) {
                decryptKey += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }

            if(typeof requestData === "object"){
                requestData = JSON.stringify(requestData);
            }
            //加密内容
            requestData = encryptData(requestData, decryptKey);
            //加密密钥
            enDecryptKey = jsEncrypt.encrypt(decryptKey);

            config.headers['DecryptKey'] = enDecryptKey;
            if(type === "GET" || type === "DELETE"){
                config.params = requestData;
            }else{
                config.data = requestData;
            }

            return axios.request(config).then(res =>{
                var decryptedData = decryptData(res, decryptKey);
                var data = JSON.parse(decryptedData);

                return responseDataToMap(data);
            });
        })
    }

    return axios.request(config).then(res =>{
        return responseDataToMap(res);
    });
}
 
export default request