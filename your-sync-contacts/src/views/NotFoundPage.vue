<template>
  <div class="main">
    <!-- <h1>Đây là trang 404 Not Found</h1>
    <button @click="getAuthOutlook">Outlook</button>
    <h4 v-if="outlook.linking">Đang liên kết</h4>
    <br><br>
    <button @click="getAuthZalo">Zalo</button>
    <h4 v-if="zalo.linking">Đang liên kết</h4> -->
    <img class="error" src="@/assets/img/error 404.gif">
  </div>
</template>
<script>
// import * as msal from '@azure/msal-browser';

export default {
  data() {
    return {
      outlook: {
        linking: false,
      },
      zalo: {
        linking: false,
      }
    }
  },

  methods: {
    getAuthOutlook() {
      console.log('login outlook');
      
      let url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=e63fb652-b80d-439f-a487-87dc8ea3bd7b&response_type=code&redirect_uri=http://localhost:8080/outlook/get-auth-code&scope=Contacts.Read Contacts.ReadWrite offline_access&response_mode=query`;
      window.location.href = url;
    },

    getAuthZalo() {
      console.log('login zalo');
      let url = 'https://oauth.zaloapp.com/v4/permission?app_id=2399654782955708252&redirect_uri=https://ysc-app.loca.lt/zalo-callback&state=your-sync-contacts';
      window.location.href = url;
    },

    handleAfterAuth() {
      let query = this.$route.query;
      if( query.type === 'linkingOutlook' ) {
        if( query.data && query.data.code ) {
          this.outlook.linking = true;
          console.log('Gui code toi zato');
          console.log(query.data.code);
        }
        else {
          alert('Loi lien ket Outlook');
        }
      }
      else if( query.type === 'linkingZalo' ) {
        if( query.code ) {
          console.log(query.code);
          console.log('Gui auth code toi zato');
        }
        else {
          console.log('Loi lien ket Zalo roi');
        }
      }
    }
  },

  mounted() {
    if( this.$route.query.type ) {
      this.handleAfterAuth();
    }
    else {
      console.log('khong co gi');
    }
  }
}
</script>
<style scoped>
.main {
  position: relative;
}

.main h1 {
  font-size: 3rem;
  text-align: center;
}

.error {
  margin: 0 auto;
  display: block;
  height: 100vh;
}
</style>