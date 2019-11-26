export default String.prototype.format=function(){
    if(arguments.length==0){
        return this;
    }

    var param=arguments[0];
    var str = this;
    if(typeof param == 'object'){
        for(var key in param){
            str=str.replace(new RegExp("\\{" + key + "\\}", "g"),param[key]);
        }
    }else{
        for(var i = 0; i < arguments.length; i++){
            str=str.replace(new RegExp("\\{" + i + "\\}", "g"),arguments[i]);
        }
    }

    return str;
}