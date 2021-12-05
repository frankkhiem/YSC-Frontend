<template>
  <div class="header">
    <section>
      <nav>
        <router-link data-item='YSC' class="logo" :to="{name: 'Home'}">
          YSC
        </router-link>
        <p class="sologan">The best solution for you</p>
        <ul class="menuItems">
          <li>
            <router-link data-item='Trang chủ' :to="{name: 'Home'}">
              Trang chủ
            </router-link>
          </li>
          <li>
              <img v-if="user.avatar == null" class="avatar" src="https://www.w3schools.com/howto/img_avatar.png" @click="show_dropdown_menu = !show_dropdown_menu">
              <img v-if="user.avatar != null" class="avatar" :src="user.avatar" @mouseover="show_dropdown_menu = !show_dropdown_menu">
          </li>
        </ul>
      </nav>
      <div class="dropdown-menu" v-show="show_dropdown_menu == true"  @mouseleave="show_dropdown_menu = !show_dropdown_menu">
          <ul>
            <li><p>{{ user.userName }}</p></li>
            <hr>
            <li><router-link :to="{name: 'Profile'}">&raquo;&nbsp;Hồ sơ</router-link></li>
            <li><button @click="logout">Đăng xuất</button></li> 
          </ul>
        </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  data() {
    return {
      show_dropdown_menu : false,
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
      }, 500);
    })
  },
  
  mounted() {
    // console.log(this.auth)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  padding: 0;
  margin: 0; }

.header {
  flex-direction: column;
  align-items: center;
  position: relative;
  font-family: Hack, monospace; }

.header .sologan {
  margin: 15px 0 15px 50px;
  font-size: 35px;
  color: #fdfafa;
  text-transform: uppercase;
  font-weight: 600;
  height: 60px;
  line-height: 60px;
  position: relative;
  border-radius: 10px;
  animation: myanimation-data-v-61dd7a3d 10s infinite;
  padding: 0 20px;
}
@keyframes myanimation {
  0% {background-color: #3f79bb;}
  25%{background-color:#d6d657;}
  50%{background-color:#58c458;}
  75%{background-color:#d15b5b;}
  100% {background-color: #d13c3c;}
}
.header .logo {
  margin-left: 50px;
  font-size: 70px;
  color: #ccc;
  text-transform: uppercase;
  font-weight: 600;
  text-decoration: none;
  transition: all 1s ease-in-out;
  position: relative;}
.header .logo::before {
  content: attr(data-item);
  transition: all 1s ease-in-out;
  color: #1d3abb;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 0;
  overflow: hidden; }
.header .logo:hover::before {
  width: 100%; }

.header nav {
  background: #f9f9f9;
  padding: 25px;
  display: flex;
  justify-content: space-between; }
.header nav .menuItems {
  list-style: none;
  display: flex;
  justify-content: space-between;
  margin-right: 50px; }
.header nav .menuItems > li {
  margin: 20px 50px; }
.header nav .menuItems > li > a {
  text-decoration: none;
  color: #8f8f8f;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.5s ease-in-out;
  position: relative;
  top: 10px;
  text-transform: uppercase; }
.header button {
  color: #fcfcfc;
  font-weight: 400;
  position: relative;
  top: 0px;
  text-transform: uppercase;
  background-color: #1d67bb;
  transition: all 0.2s ease-in-out;
  border: none;
  border-radius: 10px;
  padding: 10px; }

.header button:hover {
  cursor: pointer;
  color: #abb1aa;
  background-color: #4891e4;
}
.header nav .menuItems > li > a::before {
  content: attr(data-item);
  transition: 0.5s;
  color: #1d3abb;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 0;
  overflow: hidden; }
.header nav .menuItems > li > a:hover::before {
  width: 100%;
  transition: all 0.5s ease-in-out; }
.avatar {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  transition: all ease-in-out 0.5s;
}
.avatar:hover {
  transform: scale(1.2);
}
.dropdown-menu {
  background: #f2f2f2;
  border-radius: 20px;
  z-index: 1000;
  position: absolute;
  right: 70px;
  top: 100px;
  padding: 5px;
  width: 20%;
  max-width: 300px;
}
.dropdown-menu li {
  display: block;
  margin: 6px;
}
.dropdown-menu li:last-child {
  display: flex;
  justify-content: center;
  align-content: center;
}
.dropdown-menu p {
  text-transform: uppercase;
  font-size: 18px;
  color: #1d3abb;
  font-weight: 600;
  padding: 6px;
}

.dropdown-menu li a {
  text-decoration: none;
  color: #8f8f8f;
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
  display: block;
  width: 100%;
  padding: 6px;
}

.dropdown-menu li:hover a{
  cursor: pointer;
  color: white;
  background-color: #4891e4;
  border-radius: 8px;
}
</style>
