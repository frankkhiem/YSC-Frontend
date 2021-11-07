<template>
  <div class="home">
    <div class="list-contacts">
      <h3 class="type">Danh bạ đã được đồng bộ</h3>
      
      <div class="contacts-btn">
        <span class="sync-contacts-btn" @click="sync">Đồng bộ</span>
      </div>

      <div class="contacts-content">
        <div class="loading" v-if="syncContacts.loading">Loading.......</div>

        <div v-if="!syncContacts.loading">
          <div style="text-align: center;">
            Đồng bộ lần cuối vào: {{ syncContacts.data.syncAt.toLocaleString() }}
          </div>

          <div class="contact-item" v-for="(contact, index) in syncContacts.data.contacts" :key="index">
            <h3>{{ contact.phoneName }}</h3>
            <div v-for="(phoneNumber, index) in contact.phoneNumbers" :key="index">
              {{ phoneNumber }}
            </div>
            <br>
          </div>
        </div>  
      </div>

    </div>
    <div class="list-contacts">
      <h3 class="type">Danh bạ Google</h3>
      
      <div class="contacts-btn">
        <span class="load-contacts-btn" @click="loadContacts('google')">Làm mới</span>
      </div>

      <div class="contacts-content">
        <div class="loading" v-if="googleContacts.loading">Loading.......</div>
        <div v-if="!googleContacts.loading">
          <div class="contact-item" v-for="(contact, index) in googleContacts.data" :key="index">
            <h3>{{ contact.phoneName }}</h3>
            <div v-for="(phoneNumber, index) in contact.phoneNumbers" :key="index">
              {{ phoneNumber }}
            </div>
            <br>
          </div>
        </div>  
      </div>

    </div>
    <div class="list-contacts">
      <h3 class="type">Danh bạ Outlook</h3>
      
      <div class="contacts-btn">
        <span class="load-contacts-btn" @click="loadContacts('outlook')">Làm mới</span>
      </div>

      <div class="contacts-content">
        <div class="loading" v-if="outlookContacts.loading">Loading.......</div>
        <div v-if="!outlookContacts.loading">
          <div class="contact-item" v-for="(contact, index) in outlookContacts.data" :key="index">
            <h3>{{ contact.phoneName }}</h3>
            <div v-for="(phoneNumber, index) in contact.phoneNumbers" :key="index">
              {{ phoneNumber }}
            </div>
            <br>
          </div>
        </div>  
      </div>

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  // name: 'Home',
  // components: {
  //   HelloWorld
  // }
  data() {
    return {
      syncContacts: {
        loading: true,
        data: {}
      },
      googleContacts: {
        loading: true,
        data: []
      },
      outlookContacts: {
        loading: true,
        data: []
      }      
    }
  }, 
  
  computed: {
    ...mapGetters({
      user: 'profile',
    }),
  },

  methods: {
    async sync() {
      console.log('Dong bo danh ba nguoi dung');
      this.syncContacts.loading = true;

      try {
        let response = await axios.get(this.$backendBase + '/sync-contacts', {
          params: {
            accessToken: localStorage.getItem('accessToken')
          }
        });

        this.syncContacts.data.syncAt = new Date(response.data.syncAt);
        this.syncContacts.data.contacts = response.data.contacts;
      } catch(e) {
        // statements
        console.log(e);
      }

      this.syncContacts.loading = false;
    },

    async loadContacts(type) {
      if( type === 'google' ) {
        console.log('Load danh ba Google');
        this.googleContacts.loading = true;

        try {
          await axios.post(this.$backendBase + '/google/load-contacts', {
            accessToken: localStorage.getItem('accessToken')
          });
          let response = await this.fetchContactFromApi('/google/contacts');
          this.googleContacts.data = response.data;
        } catch(e) {
          // statements
          console.log(e);
        }

        this.googleContacts.loading = false;
      }
      else if(type === 'outlook') {
        console.log('Load danh ba Outlook');
        this.outlookContacts.loading = true;

        try {
          await axios.post(this.$backendBase + '/outlook/load-contacts', {
            accessToken: localStorage.getItem('accessToken')
          });
          let response = await this.fetchContactFromApi('/outlook/contacts');
          this.outlookContacts.data = response.data;
        } catch(e) {
          // statements
          console.log(e);
        }

        this.outlookContacts.loading = false;
      }
      else {
        console.warn('Khong co loai nay');
      }
    },

    fetchContactFromApi(path) {
      let url = this.$backendBase + path;
      return axios.get(url,{
        params: {
            accessToken: localStorage.getItem('accessToken')
          }
      });
    }
  },

  created() {
    setTimeout( () => {
      this.fetchContactFromApi('/contacts')
        .then( response => {
          this.syncContacts.loading = false;
          this.syncContacts.data.syncAt = new Date(response.data.syncAt);
          this.syncContacts.data.contacts = response.data.contacts;
        } )
        .catch( () => {
          return;
        });

      this.fetchContactFromApi('/google/contacts')
        .then( response => {
          this.googleContacts.loading = false;
          this.googleContacts.data = response.data;
        } )
        .catch( () => {
          return;
        });

      this.fetchContactFromApi('/outlook/contacts')
        .then( response => {
          this.outlookContacts.loading = false;
          this.outlookContacts.data = response.data
        } )
        .catch( () => {
          return;
        });
    }, 1500);
  }
  
}
</script>

<style scoped>
.home {
  display: flex;
  margin: 3rem 0;
  padding: 0 2rem;
}

.list-contacts {
  width: 300px;
  flex-grow: 1;
  border-left: 1px solid #aaa;
  min-height: 200px;
  padding: 0 15px;
}

.list-contacts:last-child {
  border-right: 1px solid #aaa;
}

.list-contacts .type {
  text-align: center;
}

.list-contacts .contacts-btn {
  text-align: center;
}

.list-contacts .load-contacts-btn {
  margin-top: 10px;
  display: inline-block;
  height: 30px;
  background-color: #192a56;
  color: #fff;
  line-height: 30px;
  padding: 0 15px;
  border-radius: 3px;
  cursor: pointer;
}

.list-contacts .load-contacts-btn:hover {
  background-color: #46b04a;
  transform: scale(1.02);
}

.list-contacts .sync-contacts-btn {
  margin-top: 10px;
  display: inline-block;
  height: 30px;
  background-color: #46b04a;
  color: #fff;
  line-height: 30px;
  padding: 0 15px;
  border-radius: 3px;
  cursor: pointer;
}

.list-contacts .sync-contacts-btn:hover {
  background-color: #192a56;
  transform: scale(1.02);
}

.list-contacts .contacts-content {
  margin-top: 30px;
}

.contacts-content .loading {
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin-top: 40px;
}

.contacts-content .contact-item {
  margin-top: 15px;
}

</style>