<template>
  <div class="main">
    <Header></Header>
    <section id="content">
      <router-view></router-view>
    </section>
    <Footer></Footer>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

export default {
  components: {
    Header,
    Footer
  },
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
      this.logoutUser();
      this.$router.push({ name: 'Login'});
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      setTimeout( () => {
        if( !vm.auth ) next({ name: 'Login' });
        else next();
      }, 1000);
    })
  },
  
  mounted() {
    // console.log(this.auth)
  }
}
</script>

<style scoped>
</style>
