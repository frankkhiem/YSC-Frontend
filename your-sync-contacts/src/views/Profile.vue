<template>
<div> 
  <section class="u-align-center-lg u-align-center-md u-align-center-xl u-align-left-sm u-align-left-xs u-clearfix u-section-2" id="sec-cdfa">
      <div class="u-clearfix u-sheet u-valign-middle u-sheet-1">
        <h1 class="u-text u-text-1">{{this.user.userName}}</h1>
        <p class="u-large-text u-text u-text-variant u-text-2"></p>
        <div class="u-clearfix u-expanded-width u-layout-wrap u-layout-wrap-1">
          <div class="u-layout">
            <div class="u-layout-row">
              <div class="u-container-style u-layout-cell u-size-20 u-layout-cell-1">
                <div class="u-container-layout u-container-layout-1">
                  <h4 class="u-text u-text-3">About me</h4>
                  <p class="u-text u-text-default u-text-4">{{this.user.aboutMe}}&nbsp;</p>
                </div>
              </div>
              <div class="u-align-center-md u-align-left-sm u-align-left-xs u-container-style u-layout-cell u-size-20 u-layout-cell-2">
                <div class="u-container-layout u-valign-middle-lg u-valign-middle-xl u-valign-top-md u-valign-top-sm u-valign-top-xs u-container-layout-2">
                  <img v-if="user.avatar==null" src="https://iupac.org/wp-content/uploads/2018/05/default-avatar.png" alt="" class="u-image u-image-circle u-image-1" data-image-width="700" data-image-height="700">
                  <img v-else src="https://s120-ava-talk.zadn.vn/1/a/1/6/10/120/a4ed45a7588c417d805d2daf6..." alt="" class="u-image u-image-circle u-image-1" data-image-width="700" data-image-height="700"><br><br>
                  <div class="middle">
                    <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" style="font-size:13px;left: 45%;width: 85px;">
                  </div>
                  <h4 class="u-text u-text-3">Thông tin cá nhân</h4><br>
                    <span style="font-weight: 600;">Email:{{this.user.email}} </span>
                    <br>
                    <span style="font-weight: 600;">Name:<span style="font-size: 16px;">{{this.user.userName}}</span> </span>
                    <br>
                    <span style="font-weight: 600;">Birthday:{{this.user.birthday}} </span><br>
                    <button class="button-48" v-show="showModal==false" role="button" style="width:250px; left:17%;" @click="showModal=true"> <span class="text" >Sửa thông tin cá nhân</span></button>
                </div>
              </div>
              <div class="u-container-style u-layout-cell u-size-20 u-layout-cell-3" style="padding-left: 50px;">
                <div class="u-container-layout u-container-layout-3">
                  <h4 class="u-text u-text-6">Liên kết các tài khoản:</h4>
                <!-- Lien ket toi google -->
                  <p class="u-text u-text-7">
                    <span style="font-weight: 700;">Tài khoản Google của bạn: </span>
                    <br>
                  </p>
                    <div v-if="!user.linkedGoogle && !google.linking" @click="getAuthGoogle">
                      <a class="btn btn-lg btn-google btn-block text-uppercase btn-outline" href="#"><img src="https://img.icons8.com/color/48/000000/business-contact.png"/> Liên kết tới Google</a>
                    </div>
                      <p v-else-if="google.linking">Đang tiến hành liên kết Google</p>
                      <p v-else>Google đã được liên kết</p><br>
                    <!---->
                    <!-- Lien ket toi outlook -->
                    <span style="font-weight: 700;">Tài khoản Outlook của bạn: </span><br>
                    <div v-if="!user.linkedOutlook && !outlook.linking" @click="getAuthOutlook">
                      <a class="btn btn-lg btn-google btn-block text-uppercase btn-outline" target="_blank"><img src="https://img.icons8.com/color/48/000000/ms-outlook.png"/> Liên kết tới Outlook</a>
                    </div>
                      <p v-else-if="user.linkedZalo && zalo.loading">Đang tiến hành liên kết Outlook</p>
                      <p v-else style="padding-top: 5px;">Outlook đã được liên kết</p>
                    <!---->
                      <br>
                    <!--lien ket toi zalo-->
                      <span style="font-weight: 700;">Tài khoản Zalo của bạn: </span>
                    <div v-if="!user.linkedZalo" @click="getAuthZalo" target="_blank">
                      <a class="btn btn-lg btn-google btn-block text-uppercase btn-outline" href="#"><img src="https://img.icons8.com/color/48/000000/zalo.png"/> Liên kết tới Zalo</a>
                    </div>
                      <p v-else-if="user.linkedZalo && zalo.loading">Đang tiến hành liên kết Zalo</p>
                      <p v-else>Zalo đã được liên kết</p>   
                    <!--them cac icon-->              
                  <div class="u-social-icons u-spacing-10 u-social-icons-1">
                    <img src="https://img.icons8.com/ios-filled/60/000000/new-contact.png" title="Google Contacts" width="30" height="30" style="margin-right: 10px;"/>
                    <img src="https://img.icons8.com/ios-filled/60/000000/ms-outlook.png" title="Outlook" width="30" height="30" style="margin-right: 10px;"/>
                    <img src="https://img.icons8.com/ios-filled/60/000000/zalo.png" width="30" height="30" title="Zalo"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
      <!-- Modal cap nhat thong tin -->
    <div v-show="showModal==true" id="modalUpdate" >
        <span class="close-button topright" @click="showModal=false">&#10060;</span>
      <form>      
        <input name="name" type="text" v-model="user.userName" class="feedback-input" placeholder="Name" />   
        <input name="email" type="text" v-model="user.email" class="feedback-input emaildisabled" placeholder="Email" disabled/>
        <input type="date" v-model="user.birthday"  class="feedback-input" placeholder="birthday"/>
        <textarea name="text" v-model="user.aboutMe" class="feedback-input" placeholder="About"></textarea>
        <input type="submit" @click.prevent="updateProfile" value="Cập nhật"/>
      </form>
    </div>
    <!---->
</div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      showModal:false,
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
          this.showModal=false;
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
@import "../assets/css/profile.css";
@import "../assets/css/bootstrap.css";
@import "../assets/css/modal.css";
</style>

