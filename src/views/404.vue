<template>
    <div class="notFind">
        <img src="../assets/404.png"/>
        <p>您要访问的页面不存在或已删除</p>
        <p>页面将会在<span>{{time}}</span>秒后跳转到<router-link tag="a" :to="home">{{$store.state.webTitle}}首页</router-link></p>
    </div>
</template>
<script>
export default {
    data(){
        return{
            timer:{},
            time:5,
            home:"/"
        }
    },
    mounted(){
        var that=this;
        that.timer= window.setInterval(function(){
            that.time--;
            if(that.time<=0){
                that.$router.push(that.home);
            }  
        },1000)
    },
    destroyed(){
        window.clearInterval(this.timer);
    }
}
</script>

<style scoped>
.notFind{
    font-size: 16px;
    margin: 0 auto;
}
.notFind >p{
    padding: 5px 0;
}
.notFind p span{
    color:red;
    padding: 0 2px;
    font-weight: bold;
}
</style>

