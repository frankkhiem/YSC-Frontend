<template>
  <div class="profile">
    <h1>Trang thông tin cá nhân và liên kết tài khoản</h1>
    <div class="user-info">
      <h3>Đây là tài khoản của {{ user.userName }}</h3>
      <input type="date" v-model="user.birthday">
      <a href="#" @click.prevent="updateProfile">Cập nhật</a>
    </div>
    <div class="account">
      <div class="google">
        <h4>Tài khoản Google của bạn:</h4>
        <button v-if="!user.linkedGoogle && !google.linking" @click="getAuthGoogle">Google</button>
        <p v-else-if="google.linking">Đang tiến hành liên kết Google</p>
        <p v-else>Google đã được liên kết</p>
      </div>
      <div class="outlook">
        <h4>Tài khoản Outlook của bạn:</h4>
        <button v-if="!user.linkedOutlook && !outlook.linking" @click="getAuthOutlook">Outlook</button>
        <p v-else-if="outlook.linking">Đang tiến hành liên kết Outlook</p>
        <p v-else>Outlook đã được liên kết</p>
      </div>
      <div class="zalo">
        <h4>Tài khoản Zalo của bạn:</h4>
        <button v-if="!user.linkedZalo" @click="getAuthZalo">Zalo</button>
        <p v-else-if="user.linkedZalo && zalo.loading">Đang lấy hồ sơ Zalo</p>
        <div v-else>
          Zalo đã được liên kết: {{ zalo.name }}
          <br>
          <img :src="zalo.avatar">
          <div v-if="user.avatar !== zalo.avatar">
            <p>Bạn có muốn dùng ảnh Zalo làm avatar của mình</p>
            <button @click="applyZaloAvatar">Áp dụng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      google: {
        linking: false,
      },
      outlook: {
        linking: false,
      },
      zalo: {
        loading: true,
        name: '',
        avatar: '',
      }
    }
  },

  computed: {
    ...mapGetters({
      user: 'profile',
    }),
  },

  methods: {
    ...mapMutations({
      updateUser: 'updateUser'
    }),

    async getAuthGoogle() {
      // console.log('get Google authorization code');
      try {
        let authCode = await this.$gAuth.getAuthCode();
        this.google.linking = true;
        // console.log(authCode);
        
        let response = await axios.post(this.$backendHost + '/google/exchange-token', {
          accessToken: localStorage.getItem('accessToken'),
          authorization_code: authCode
        });
        
        if( response.status === 200 ) {
          this.user.linkedGoogle = true;
          this.updateUser(this.user);        
        }
      } catch (error) {
        // On fail do something
        console.log(error.response);
      }
      this.google.linking = false;
    },

    async getAuthOutlook() {
      console.log('Lien ket outlook');
      
      let url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=e63fb652-b80d-439f-a487-87dc8ea3bd7b&response_type=code&redirect_uri=http://localhost:8080/outlook/get-auth-code&scope=Contacts.Read Contacts.ReadWrite offline_access&response_mode=query`;
      window.location.href = url;
    },

    async getAuthZalo() {
      console.log('Lien ket zalo');

      let url = 'https://oauth.zaloapp.com/v4/permission?app_id=2399654782955708252&redirect_uri=https://ysc-app.loca.lt/zalo-callback&state=your-sync-contacts';
      window.location.href = url;
    },

    async handleAfterAuth() {
      let query = this.$route.query;
      if( query.type === 'linkingOutlook' ) {
        if( query.data && query.data.code ) {
          this.outlook.linking = true;
          console.log('Gui outlook code toi zato');
          console.log(query.data.code);
          try {
            let response = await axios.post(this.$backendHost + '/outlook/exchange-token', {
              accessToken: localStorage.getItem('accessToken'),
              authorization_code: query.data.code
            });

            if( response.status === 200 ) {
              this.user.linkedOutlook = true;
              this.updateUser(this.user);            }
          } catch(error) {
            // statements
            console.log(error);
          }
          this.outlook.linking = false;
          this.$router.replace({ name: 'Profile' });
        }
        else {
          alert('Loi lien ket Outlook');
        }
      }
      else if( query.type === 'linkingZalo' ) {
        if( query.code ) {
          console.log(query.code);
          console.log('Gui zalo auth code toi zato');
          this.zalo.loading = true;
          try {
            let response = await axios.post(this.$backendHost + '/zalo/exchange-token', {
              accessToken: localStorage.getItem('accessToken'),
              authorization_code: query.code
            });

            if( response.status === 200 ) {
              this.user.linkedZalo = true;
              this.updateUser(this.user);
            }
          } catch(error) {
            // statements
            console.log(error);
          }
          this.$router.replace({ name: 'Profile' });
        }
        else {
          console.log('Loi lien ket Zalo roi');
        }
      }
    },

    applyZaloAvatar() {
      this.user.avatar = this.zalo.avatar;
      this.updateProfile();
    },

    async updateProfile() {
      try {
        let response = await axios.put(this.$backendHost + '/profile', this.user, {
          params: {
            accessToken: localStorage.getItem('accessToken')
          }
        });
        
        if( response.status === 200 ) {
          this.updateUser(this.user);
        }
      } catch(e) {
        // statements
        console.log(e);
      }
    }
  },

  created() {
    setTimeout( async () => {
      if( this.user.linkedZalo === true ) {
        try {
          let response = await axios.post(this.$backendHost + '/zalo/load-profile', {
            accessToken: localStorage.getItem('accessToken')
          });

          if( response.status === 200 ) {
            this.zalo.name = response.data.zaloName;
            this.zalo.avatar = response.data.zaloAvatar;
          }
          this.zalo.loading = false;
        } catch(error) {
          // statements
          console.log(error);
        }
      }
    }, 1000);
  },

  mounted() {
    if( this.$route.query.type ) {
      this.handleAfterAuth();
    }
    else {
      console.log('Khong co yeu cau lien ket nao');
    }
  }
}
</script>
<style>
.user-info {
  margin: 30px 0;
}

.account {
  margin: 30px 0;
}

.account h4 {
  margin-bottom: 10px;
}

.google {
  margin-bottom: 3rem;
}

.outlook {
  margin-bottom: 3rem;
}
</style>