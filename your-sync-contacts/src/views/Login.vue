<template>
  <div class="login">
    <h1>This is an login page</h1>
    <div class="form-login">
      <h3>Form đăng nhập</h3>
      <form @submit.prevent='login'>
        <div class="form-control">
          <label for="email">Email</label>
          <input id="email" type="email" v-model='email'>
        </div>
        <div class="form-control">
          <label for="password">Mật khẩu</label>
          <input id="password" type="password" v-model='password'>
        </div>
        <div>
          <button type="submit">Đăng nhập</button>
        </div>
      </form>
      <br><br>
      <div>
        <router-link :to="{ name: 'Register'}">>> Đăng ký</router-link>
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
      password: ''
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

    login() {
      axios.post(this.$backendHost + '/login', 
      {
        email: this.email,
        password: this.password
      })
      .then( async response => {
        // console.log(response.data);
        localStorage.setItem('accessToken', response.data.accessToken);
        await this.fetchUser();
        this.$router.push({name: 'Home'});
      })
      .catch( error => {
        window.alert(error.response.data.message);
      });
    },

  }
}
</script>
<style scoped>
.login > h1 {
  margin-bottom: 3rem;
  text-align: center;
}

.form-login {
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