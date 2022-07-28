<template>
  <div class="outer-box">
    <div class="container">
      <div class="form-box">
        <!-- 注册 -->
        <form class="register-box hidden">
          <h1>注册</h1>
          <el-select v-model="registerForm.company" placeholder="请选择期货公司">
            <el-option
              v-for="company in companyList"
              :key="company"
              :label="company"
              :value="company"
              align="center" 
              >
            </el-option>
          </el-select>
          <input type="text" placeholder="用户名" id="username" v-model="registerForm.username">
          <input type="password" placeholder="密码" id="password" v-model="registerForm.password">
          <input type="password" placeholder="确认密码" id="checkPwd" v-model="checkPwd">
          <input type="text" placeholder="邮箱" id="email" v-model="registerForm.email">
          <input type="text" placeholder="信易账号" id="xinyiAccount" v-model="registerForm.xinyiAccount">
          <input type="password" placeholder="信易密码" id="xinyiPwd" v-model="registerForm.xinyiPwd">      
          <input type="text" placeholder="交易账号" id="tradingAccount" v-model="registerForm.tradingAccount">
          <input type="password" placeholder="交易密码" id="tradingPwd" v-model="registerForm.tradingPwd">
          <button @click="register">注册</button>
        </form>
        <form class="login-box">
          <h1 style="margin-bottom:3em">登录</h1>
          <input type="text" placeholder="用户名" style="margin-bottom:4em" id="loginUsername" v-model="loginForm.username"> 
          <input type="password" placeholder="密码" style="margin-bottom:5em" id="loginPwd" v-model="loginForm.password">
          <Vcode :show="isShow" @success="login" @close="close" />
          <button @click="submit">登录</button> 
        </form>
      </div>
      <div class="con-box left">
        <h2>仅支持<span>部分期货公司</span></h2>
        <p>由<span>中南大学大数据</span>组开发</p>
        <img src="@/assets/logo/image1.jpeg" alt="">
        <p>已有账号</p>
        <button id="login" @click="toLogin">去登录</button>
      </div>
      <div class="con-box right">
        <h2><span>期货</span>交易系统</h2>
        <p>由<span>中南大学大数据组</span>开发</p>
        <img src="@/assets/logo/csu.png" alt="">
        <p>没有账号?</p>
        <button id="register" @click="toRegister">去注册</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {register, getAllCompany} from "@/api/user"
import Vcode from "vue-puzzle-vcode"

  export default {
    name:'RegisterPage',
    components: { Vcode },
    data(){
      return{
        companyList: [],
        isShow: false,
        loginForm:{      
          username:'',
          password:'',
        },
        checkPwd:'',
        registerForm:{      
          username:'',
          password:'',
          email:'',
          xinyiAccount:'',
          xinyiPwd:'',
          tradingAccount:'',
          tradingPwd:'',
          company:''
        }
      }
    },
    created(){
      this.getCompanyList()
    },
    
    methods:{
      getCompanyList(){
        getAllCompany().then(res => {
          if(res.data){
            this.companyList = res.data
          }
        })
      },

      toRegister(){
        document.getElementsByClassName("form-box")[0].style.transform = 'translateX(95%)'
        document.getElementsByClassName("login-box")[0].classList.add('hidden')
        document.getElementsByClassName("register-box")[0].classList.remove('hidden')
      },
      toLogin(){
        document.getElementsByClassName("form-box")[0].style.transform = 'translateX(0%)'
        document.getElementsByClassName("register-box")[0].classList.add('hidden')
        document.getElementsByClassName("login-box")[0].classList.remove('hidden')
      },
      login(){
        if(this.loginForm.username == ""){
          this.$message({
            message: '用户名不能为空',
            type: 'error'
          }).then(() => {return})
        }
        if(this.loginForm.password == ""){
          this.$message({
            message: '密码不能为空',
            type: 'error'
          }).then(() => {return})
        }
        this.$store.dispatch('user/login', this.loginForm).then(() => {
          this.$store.dispatch('user/getInfo').then(res => {
            this.$router.push({ path: '/'})
          })}).catch(() => {
            this.$message({
            message: '登录失败',
            type: 'error'})
          })   
      },
      register(){
        if(this.registerForm.password != this.checkPwd){
          this.$message({
            message: '密码不一致',
            type: 'error'})
        }    
        register(this.registerForm).then(()=>{
          this.resetRegisterForm()
          this.$alert('注册成功','系统消息',{
            confirmButtonText: '确定',
            callback: () => {
              this.toLogin()
            }
          })     
        })
      },
      submit(){
        this.isShow = true
      },
    
      close(){
        this.isShow = false
      },
      resetRegisterForm(){
        this.registerForm = {      
          username:'',
          password:'',
          email:'',
          xinyiAccount:'',
          xinyiPwd:'',
          tradingAccount:'',
          tradingPwd:'',
          company:''
        }
        this.checkPwd = ''
      }
    }
  }
</script>


<style lang="scss" scoped>
  *{
      padding: 0;
      margin: 0;
  }

  .outer-box{
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(200deg, #f3e7e9, #e3eeff);
  }

  .container{
    background-color: #fff;
    width: 900px;
    height: 600px;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  .form-box{
    position: absolute;
    top: -10%;
    left: 5%;
    background-color: #d3b7d8;
    width: 400px;
    height: 700px;
    border-radius: 5px;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    transition: 0.5s ease-in-out;
    & button{
      width: 70%;
      margin-top: 35px;
      background-color: #f6f6f6;
      outline: none;
      border-radius: 8px;
      padding: 13px;
      color: #a262ad;
      letter-spacing: 2px;
      border: none;
      cursor: pointer;
      &:hover{
        background-color: #a262ad;
        color: #f6f6f6;
        transition: background-color 0.5s ease;
      }
    }
  }

  .register-box,.login-box{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .hidden{
    display: none;
    transition: 0.5s;
  }

  h1{
      text-align: center;
      margin-bottom: 25px;
      /* 大写字母 */
      text-transform: uppercase;
      color: #fff;
      /* 字间距 */
      letter-spacing: 5px;
  }

  input{
      background-color: transparent;
      width: 70%;
      color: #fff;
      border: none;
      /* 下边框样式 */
      border-bottom: 1px solid rgba(255, 255, 255, 0.4);
      padding: 10px 0;
      text-indent: 10px;
      margin: 8px 0;
      font-size: 14px;
      /* 字间距 */    
      letter-spacing: 2px;
      &::placeholder{
        color: #fff;
      }
      &:focus{
        color: #a262ad;
        outline: none;
        border-bottom: 1px solid #a262ad80;
        transition: 0.5s;
      &:focus::placeholder{
        opacity: 0;
      }
      }
  }
  


  .con-box{
    width: 50%;
    /* 弹性布局 垂直排列 居中 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* 绝对定位 */
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    &.left{
      left: -2%;
    }
    &.right{
      right: -2%;
    }
    & h2{
      color: #8e9aaf;
      font-size: 25px;
      font-weight: bold;
      letter-spacing: 3px;
      text-align: center;
      margin-bottom: 4px;
    }
    & p{
      font-size: 12px;
      letter-spacing: 2px;
      color: #8e9aaf;
      text-align: center;
    }
    & span{
      color: #d3b7d8;
    }
    & img{
      width: 250px;
      height: 250px;
      opacity: 0.9;
      margin: 40px 0;
    }
    & button{
      margin-top: 3%;
      background-color: #fff;
      color: #a262ad;
      border: 1px solid #d3b7d8;
      padding: 6px 10px;
      letter-spacing: 1px;
      outline: none;
      /* 鼠标放上变小手 */
      cursor: pointer;
      &:hover{
        background-color: #a262ad;
        color: #f6f6f6;
      }
    }
  }



</style>