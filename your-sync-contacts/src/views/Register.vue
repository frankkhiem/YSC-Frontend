<template>
  <div class="register">
    <h1>This is an register page</h1>
    <div class="form-register">
      <h3>Form đăng ký</h3>
      <form @submit.prevent='register'>
        <div class="form-control">
          <label for="email">Email</label>
          <input id="email" type="email" v-model='email'>
        </div>
        <div class="form-control">
          <label for="usename">Họ tên</label>
          <input id="username" type="text" v-model='userName'>
        </div>
        <div class="form-control">
          <label for="password">Mật khẩu</label>
          <input id="password" type="password" v-model='password'>
        </div>
        <div class="form-control">
          <label for="password-confirm">Nhập lại mật khẩu</label>
          <input id="password-confirm" type="password" v-model='passwordConfirm'>
        </div>
        <div>
          <button type="submit">Đăng ký</button>
        </div>
      </form>
      <br><br>
      <div>
        <router-link :to="{ name: 'Login'}">>> Đăng nhập</router-link>
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
      if( this.password !== this.passwordConfirm ) {
        alert('Mật khẩu nhập lại không đúng!');
        return;
      }

      try {
        let response = await axios.post(this.$backendBase + '/register', 
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
        alert(error.response.data.message);
      }
    },

  },
}
</script>

<style scoped>
.register > h1 {
  text-align: center;
  margin-bottom: 3rem;
}

.form-register {
  width: 180px;
  margin: 0 auto;
}

.form-control {
  margin-bottom: 1rem;
}
.form-control * {
  display: block;
}
</style>