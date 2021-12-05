<template>
    <div class="register-container">
        <div class="register">
            <div class="register-title">
                <span>Đăng ký</span>
            </div>
            <div class="form-register">
            <form @submit.prevent='register'>
                <div class="form-control">
                    <label for="email">Email</label>
                    <div class="register-input-wrap">
                        <input id="email" v-model='email' type="email" class="input-field" placeholder="Nhập email của bạn ..." required>
                        <i class="fa-solid fa-envelope input-icon"></i>
                    </div>
                    <div :class="{errorDisplay: isDisplayErrorEmail, errorMessage: true}">
                        <span>Email đã không tồn tại</span>
                        <i class="fa-solid fa-circle-exclamation"></i>
                    </div>
                </div>
                <div class="form-control">
                    <label for="username">Họ tên</label>
                    <div class="register-input-wrap">
                        <input id="username" type="text" v-model='userName' class="input-field" placeholder="Nhập họ tên của bạn ..." required>
                        <i class="fa-solid fa-user input-icon"></i>
                    </div>
                </div>
                <div class="form-control">
                    <label for="password">Mật khẩu</label>
                    <div class="register-input-wrap">
                        <input id="password" type="password" v-model='password' class="input-field" placeholder="Nhập mật khẩu của bạn ..." required>
                        <i class="fa-solid fa-lock input-icon"></i>
                    </div>
                    <div :class="{errorDisplay: isDisplayErrorPassword, errorMessage: true}">
                        <span>Mật khẩu tối thiểu 6 ký tự</span>
                        <i class="fa-solid fa-circle-exclamation"></i>
                    </div>
                </div>
                <div class="form-control">
                    <label for="password-confirm">Nhập lại mật khẩu</label>
                    <div class="register-input-wrap">
                        <input id="password-confirm" type="password" v-model='passwordConfirm' class="input-field" placeholder="Nhập lại mật khẩu của bạn ..." required>
                        <i class="fa-solid fa-lock input-icon"></i>
                    </div>
                    <div :class="{errorDisplay: isDisplayErrorPasswordConfirm, errorMessage: true}">
                        <span>Mật khẩu nhập lại không đúng</span>
                        <i class="fa-solid fa-circle-exclamation"></i>
                    </div>
                </div>
                <div  class="register-button">
                    <button type="submit">Đăng ký</button>
                </div>
            </form>
            <div class="login-button">
                <p>Bạn đã có tài khoản?</p>
                <router-link :to="{ name: 'Login'}"> Đăng nhập</router-link>
            </div>
            </div>
        </div>
    </div>
  
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      userName: '',
      password: '',
      passwordConfirm: '',
      isDisplayErrorPassword: false,
      isDisplayErrorEmail: false,
      isDisplayErrorPasswordConfirm: false
    }
  },

  watch: {
      email: function(){
          this.isDisplayErrorEmail = false;
      }, 
      password: function(){
          this.isDisplayErrorPassword = false;
      },
      passwordConfirm: function(){
          this.isDisplayErrorPasswordConfirm = false;
      }
  },

  computed: {
    ...mapGetters({
      auth: 'userAuthenticated'
    })
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      setTimeout( () => {
        if( vm.auth ) next({ name: 'Home' });
        else next();
      }, 500);
    })
  },

  methods: {
    ...mapActions({
      fetchUser: 'fetchUser',
    }),

    async register() {
      console.log('Dang ky tai khoan');
      this.isDisplayErrorEmail = false;
      this.isDisplayErrorPassword = false;
      this.isDisplayErrorPasswordConfirm = false;
      if( this.password !== this.passwordConfirm ) {
        this.isDisplayErrorPasswordConfirm = true;
        return;
      }

      try {
        let response = await axios.post(this.$backendHost + '/register', 
        {
          username: this.userName,
          email: this.email,
          password: this.password
        });

        // console.log(response.data);
        localStorage.setItem('accessToken', response.data.accessToken);
        await this.fetchUser();
        this.$router.push({name: 'Home'});
      } catch(error) {
            let errorMessage = error.response.data.message;
            if(errorMessage == 'EMAIL_EXISTS') {
                this.isDisplayErrorEmail = true;
            } else if(errorMessage == 'WEAK_PASSWORD : Password should be at least 6 characters') {
                this.isDisplayErrorPassword = true;
            }
      }
    },

  },
}
</script>

<style scoped>
.register-container {
    background-image: url('.././assets/img/login-background-1.jpg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Poppins', sans-serif;
}
.register {
    width: 480px;
    padding:  25px 60px;
    background-color: #fff;
    border-radius: 12px;
}
.register-title {
    width: 100%;
    text-align: center;
    font-size: 32px;
    /*color: #1da1f2;*/
    color: #333;
}

.register-title span {
    font-weight: 500;
}

.form-register {
    width: 100%;
    min-height: 560px;
    position: relative;
    display: flex;
    flex-direction: column;
}
.form-control {
    display: flex;
    flex-direction: column;
    margin: 15px 0 0 0;
}
.form-control label {
    font-size: 14px;
    padding: 12px 0;
    color: #333;
    font-weight: 500;
    margin: 8px 0 0 0;
}
.register-input-wrap {
    position: relative;
    font-size: 24px;
    height: 36px;
}   
.input-field {
    display: inline-block;
    position: absolute;
    width: 100%;
    height: 100%;
    padding-left: 38px;
    font-size: 16px;
    border: none;
    outline: none;
    border-bottom: 2px solid #e2dbdb;  
}
.input-field:focus {
    border-bottom: 2px solid #b4aeae;
}
.input-field:focus::placeholder {
    color: transparent;
}
.input-field:focus + .input-icon {
    color: #b4aeae;
}
.input-icon {
    position: absolute;
    top: 4px;
    display: inline-block;
    text-align: center;
    height: 100%;
    color: #cecdcd;
    padding-left: 8px;
}
.register-button {
  width: 100%;
  height: 48px; 
  margin-top: 40px;
}
.register-button button {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #00dbde, #fc00ff);
  background-color: #6bbeff;
  border-radius: 24px;
  border: none;
  cursor: pointer;
  color: #fff;
}
.register-button button:hover {
  background: linear-gradient(235deg, #00dbde, #fc00ff);
}
.login-button {
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 0;
}
.login-button a {
    display: inline-block;
    text-decoration: none;
    cursor: pointer;
    color: #a64bf4;
    margin-top: 4px;
}

.errorMessage {
    color: red;
    margin-top: 8px;
    display: none;
}
.errorDisplay {
    display: block;
}
.errorMessage span {
    margin-right: 4px;
}
</style>