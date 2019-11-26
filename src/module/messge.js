import {Message} from 'iview'

const install = function(Vue, opts = {}){
    Vue.prototype.$$Message = API;
}

Message.config({
    top: 50,
    duration: 3
});

const API = {
    name: 'Message',

    info (options) {
        return Message.info(options);
    },
    success (options) {
        options = options || '操作成功';
        return Message.success(options);
    },
    fail (options) {
        options = options || '操作失败';
        return Message.error(options);
    },
    warning (options) {
        return Message.warning(options);
    },
    error (options) {
        options = options || '出现异常，操作失败';
        return Message.error(options);
    },
    notice (options) {
        options = options || '出现异常，业务操作失败';
        return Message.error(options);
    },

    install 
}

export default API; 
