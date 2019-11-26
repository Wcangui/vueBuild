import request from './request'

export default class Auth{
    constructor (){

    }

    login (params) {
        var loginData = new Object();
        loginData.loginInfo = params;

        return request("user/login",loginData,false,true);
    }
}