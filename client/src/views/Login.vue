<template>
    <div class="login">
        <section class="form_container">
            <div class="manage_tip">
                <span class="title">記帳平台</span>
            </div>
            <el-form :model="loginUser" :rules="rules" ref="loginForm" class="loginForm" label-width="60px">
                <el-form-item label="電子郵件" prop="email">
                    <el-input v-model="loginUser.email" placeholder="請輸入電子郵件"></el-input>
                </el-form-item>
                <el-form-item label="密碼" prop="password">
                    <el-input v-model="loginUser.password" placeholder="請輸入密碼" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"  @click="submitForm('loginForm')" class="submit_btn">登 入</el-button>
                </el-form-item>
                <div class="tiparea">
                    <p>還沒有帳號? 請<router-link to='/register'>註冊</router-link></p>
                </div>
            </el-form>
        </section>
    </div>
</template>

<script>
import jwt_decode from "jwt-decode";

export default {
  name: "login",
  data() {
    return {
      loginUser: {
        email: "",
        password: ""
      },
      rules: {
        email: [
          {
            type: "email",
            required: true,
            message: "電子郵件格式不正確",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "密碼不能為空", trigger: "blur" },
          { min: 6, max: 30, message: "長度需6~30字", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios.post("/api/users/login", this.loginUser).then(res => {
            // 登入成功
            const { token } = res.data;
            localStorage.setItem("eleToken", token);

            // 解析token
            const decode = jwt_decode(token);

            // 存儲數據
            this.$store.dispatch("setIsAutnenticated", !this.isEmpty(decode));
            this.$store.dispatch("setUser", decode);

            // 頁面跳轉
            this.$router.push("/index");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    }
  }
};
</script>

<style scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/bg.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form_container {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 20%;
  left: 34%;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
}
.form_container .manage_tip .title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}
.loginForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}

.submit_btn {
  width: 100%;
}
.tiparea {
  text-align: right;
  font-size: 12px;
  color: #333;
}
.tiparea p a {
  color: #409eff;
}
</style>


