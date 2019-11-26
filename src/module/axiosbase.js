import axios from 'axios';
import Qs from 'qs';
import {redirectTologin,updateUserToken} from '../api/common'
import {Message} from 'iview'

axios.defaults.method = 'post';
axios.defaults.baseURL = process.env.VUE_APP_APIURL;
axios.defaults.paramsSerializer = function(params) {
    return Qs.stringify(params)
};
axios.defaults.timeout = 10000;
axios.defaults.headers.common['IsEncrypt'] = false;

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    updateUserToken(response.headers);
    return response.data;
}, function (error) {
    if(error.response.status === '401'){
        redirectTologin();
    }else{
        var err = error.message;

        Message.error({
            content: err,
            duration: 3
        });
    }

    // 对响应错误做点什么
    return Promise.reject(error);
});
 
export default axios