import Message from '../module/messge'

//检查用户登录状态
export function isUserLogin() {
    var userInfo = window.readCookie("userInfo");
    if (!userInfo || !userInfo.token) return false;
    else {
        return true;
    }
}
//获取用户登录信息
export function getUserLoginInfo(){
    var userInfo = window.readCookie("userInfo");
    if (!userInfo || !userInfo.token) return null;
    else {
        return userInfo;
    }
}
//更新用户的Token
export function updateUserToken(headers) {
    console.log(headers,headers['cache-control'])
    var token = headers['userToken'];
    var validHours = headers['tokenValidHours'];

    if (token && validHours)
    {
        var userInfo = window.readCookie("userInfo");

        if (userInfo == null) userInfo = new Object();

        userInfo.token = token;
        var now = new Date();
        now.setTime(now.getTime() + (validHours * 60 * 60 * 1000));

        userInfo.expiredTime = now;

        window.createCookie("userInfo", userInfo, validHours);
    }
}
//注销
export function logout() {
    window.eraseCookie("userInfo");
}
//记录用户登录信息
export function addUerLoginInfo(uerLoginInfo){
    var userInfo = new Object();
    userInfo.userCode = uerLoginInfo.data.userCode;
    userInfo.token = uerLoginInfo.data.userToken;
    userInfo.name = uerLoginInfo.data.username;

    userInfo.isAdmin = uerLoginInfo.data.isAdmin;
    userInfo.organizationCode=uerLoginInfo.data.organizationCode;

    var validHours = uerLoginInfo.data.validHours;

    window.createCookie("userInfo", userInfo, validHours);
}
//重定向到登录页面
export function redirectTologin(){
    if(window.router && window.router.currentRoute.path!=="/login"){
        window.router.push({
            path: "/login",
            query: {redirect: window.router.currentRoute.fullPath}
        }); 
        Message.error('请重新登录');
    }
}
//映射webapi数据
export function responseDataToMap(data){
    var _data = data,
        mapData = {};

    if(_data.pageInfo){
        mapData.pageInfo={
            totalCount:_data.pageInfo.totalCount,
            pageCount:_data.pageInfo.pageCount
        }
    }
    mapData.data=_data.returnValue;
    mapData.isSuccess=_data.isSuccess || false;
    mapData.description=_data.description || '';

    return mapData;
}


