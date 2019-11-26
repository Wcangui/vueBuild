<template>
   <div class="landbg">
        <div class="Land_main">
            <div class="dc_size">{{$store.state.webTitle}}</div>
            <div class="land_maint">
                <dl class="land">
                    <dt>平台登录 </dt>
                    <!-- <dd class="dd"><img src="../assets/ul13.png" /><input type="text" :value="account" placeholder="输入用户名..."/></dd> -->
                    <!--  <dd class="dd"><img src="../assets/ul14.png" /><input type="text" :value="pwd"  placeholder="输入密码"/></dd> -->
                    <!--  <dd class="dda"><div class="fl"><input type="checkbox" :value="keep" />记住密码</div><a href="#" class="fr">忘记密码？</a></dd> -->
                    <dd class="dd">
                        <Input placeholder="输入用户名" v-model="account">
                            <span slot="prepend">
                                <Icon type="ios-contact" size="20"/>
                            </span>
                            <span slot="append" style="display:none;">
                                <Icon type="md-eye" size="20" />
                            </span>
                        </Input>
                    </dd>
                    <dd class="dd">
                        <Input v-model="pwd" class="pwd" placeholder="输入密码" type="password" id="pwd">
                            <span slot="prepend">
                                <Icon type="md-lock" size="20"/>
                            </span>
                            <span slot="append">
                                <Icon type="md-eye" size="20" style="display:none;"/>
                            </span>
                        </Input>

                    </dd>
                    <dd>
                        <Button class="land_a" @click="login" :loading="loading"></Button>
                    </dd>

                    <!-- <dd class="dda">
                        <div class="fl"><Checkbox v-model="keep" size="large"><span style="font-size: 12px;">记住密码</span></Checkbox></div>
                        <a href="#" class="fr">忘记密码？</a>
                    </dd> -->
                </dl>
            </div>      
        </div>
   </div>
</template>


<script>
import '../css/login.css'
import api from '../api'
import {addUerLoginInfo} from '../api/common'
export default {
    data(){
        return{
            loading:false,
            keep:false,
            account:'',
            pwd:''
        }
    },
    methods:{
        login(){
            this.loading=true;
            try{        
                var loginInfo=this.account+'\t'+this.pwd;   

                api.auth.login(loginInfo)
                .then(res =>{
                    if(res.isSuccess){
                        addUerLoginInfo(res);
                        this.$router.push(this.$route.query.redirect || '/')
                    }else{
                        this.$$Message.error(res.description || '登录失败')
                    }

                    this.loading=false;
                })
                .catch(err =>{
                    this.loading=false;
                    console.log(err);
                })
            }catch{
                this.loading=false;
            }
        }
    },
    mounted(){
        document.getElementById("pwd").querySelector("input").onfocus=function(){
            document.getElementById("pwd").querySelector(".ivu-icon-md-eye").style.display="inline-block";
        }
        document.getElementById("pwd").querySelector("input").onblur=function(){
            document.getElementById("pwd").querySelector(".ivu-icon-md-eye").style.display="none";
        }
    }
}
</script>











