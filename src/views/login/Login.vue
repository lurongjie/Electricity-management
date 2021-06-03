<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="vatatar">
        <img src="~assets/img/logo.png" alt="">
      </div>
      <div></div>
      <!--登录表单区域-->
      <el-form ref="loginFormRef" class="login_form" :model="loginForm" :rules="loginFormRules">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="loginFormReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
  </div>
</template>
<script>
  export default {
    name: 'Login',
    data() {
      return {
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        //校验规则
        loginFormRules: {
          username: [{
              required: true,
              message: '请输入登录名称',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 10,
              message: '长度在 3 到 10 个字符',
              trigger: 'blur'
            }
          ],
          password: [{
              required: true,
              message: '请输入登录密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 15,
              message: '长度在 6 到 15 个字符',
              trigger: 'blur'
            }
          ],
        },

      }
    },
    methods: {
      //重置
      loginFormReset() {
        this.$refs.loginFormRef.resetFields();
      },
      //登录
      login() {
        this.$refs.loginFormRef.validate(async valid => {
          if (!valid) return;
          //结构赋值
          const {
            data: res
          } = await this.$http.post('login', this.loginForm)
          if (res.meta.status !== 200) return this.$message.error('登录失败');
          this.$message.success('登录成功')
          window.sessionStorage.setItem('token', res.data.token);
          this.$router.push('/home')
        })
      }
    },
  }
</script>
<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: relative;

    /*position: absolute;
    left: 50%;
    top: 50%; */
    /* transform: translate(-50%,-50%); */
    .login_form {
      position: absolute;
      bottom: 0px;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;

      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }

  .vatatar {
    width: 130px;
    height: 130px;
    padding: 10px;
    border-radius: 50%;
    border: 1px #eee;
    box-shadow: 0 0 10px#ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translate(-50%, -50%);
    position: absolute;
    left: 50%;
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
</style>