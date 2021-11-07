<template>
  <div class="main">
    <section id="header">
      <h4 class="user-name">{{ user.userName }} đang đăng nhập</h4>
      <button @click="logout">Đăng xuất</button>
    </section>
    <section id="content">
      <router-view></router-view>
    </section>
    <section id="footer">
      <p>©2021 KHyM. All right reserved</p>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  data() {
    return {

    }
  },

  computed: {
    ...mapGetters({
      auth: 'userAuthenticated',
      user: 'profile',
    })
  },

  methods: {
    ...mapMutations({
      logoutUser: 'logoutUser'
    }),

    logout() {
      localStorage.removeItem('accessToken');
      this.logoutUser();
      this.$router.push({ name: 'Login'});
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      setTimeout( () => {
        if( !vm.auth ) next({ name: 'Login' });
        else next();
      }, 500);
    })
  },
  
  mounted() {
    // console.log(this.auth)
  }
}
</script>

<style scoped>
#header {
  height: 80px;
  background-color: #f4f7f2;
  display: flex;
  justify-content: right;
  align-items: center;
}

#header *{
  margin-right: 20px;
}

#content {
  min-height: 478px;
}

#footer {
  height: 50px;
  background-color: #f4f7f2;
}

#footer p {
  margin-left: 20px;
  padding-top: 20px;
}
</style>