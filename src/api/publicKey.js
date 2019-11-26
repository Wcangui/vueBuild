import axios from '../module/axiosbase';
import {responseDataToMap}  from './common'

//获取加密用的公钥信息
export default function getPublicKey() {
    var publicKey = window.readCookie("publicKey");

    if(publicKey && publicKey !==""){
        return Promise.resolve(publicKey);
    }

    return axios.post('user/getPublicKey')
    .then(function (response) {
        var res = responseDataToMap(response)
        if (res.isSuccess) {
            publicKey = res.data.publicKey;
            window.createCookie("publicKey", publicKey, 2);

            return publicKey;
        } else {
            return null;
        }
    })
}