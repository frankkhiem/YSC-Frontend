import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import GAuth from 'vue-google-oauth2'

Vue.config.productionTip = false
Vue.prototype.$backendHost = 'http://localhost:11223'

// config google oauth
const gauthOption = {
  clientId: '301608552892-g7inqpodo0dkvlvkmnaqrmpgf8oi695d.apps.googleusercontent.com',
  scope: 'https://www.googleapis.com/auth/contacts https://www.googleapis.com/auth/contacts.readonly',
  prompt: 'consent'
}
Vue.use(GAuth, gauthOption)

// config microsoft oauth

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
