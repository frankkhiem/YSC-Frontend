<template>
  <div class="profile">
    <h1>Trang thông tin cá nhân và liên kết tài khoản</h1>
    <div class="user-info">
      <h3>Đây là tài khoản của {{ user.userName }}</h3>
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
          this.google.linking = false;
        }
      } catch (error) {
        // On fail do something
        console.log(error.response);
      }
    },

    async getAuthOutlook() {
      alert('Đã làm đéo đâu mà có!');
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
</style>