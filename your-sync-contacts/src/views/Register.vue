<template>
  <div class="register">
    <h1>This is an register page</h1>
    <br><br>
    <div>
      <router-link :to="{ name: 'Login'}">>> Đăng nhập</router-link>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {

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
    
  }
}
</script>