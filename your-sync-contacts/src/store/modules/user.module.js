import axios from 'axios';

const state = {
  user: {}
};

const getters = {
  userAuthenticated: (state) => {
    if (Object.keys(state.user).length === 0 && Object.getPrototypeOf(state.user) === Object.prototype)
      return false
    return true
  },

  profile: (state) => {
    return state.user;
  }
};

const mutations = {
  updateUser: (state, userData) => {
    state.user = userData;
  },

  logoutUser: (state) => {
    state.user = {};
  }
};

const actions = {
  fetchUser: ({ commit }) => {
    if( localStorage.getItem('accessToken') === null ) {
      commit('logoutUser');
      return;
    }

    axios.get('http://localhost:11223/profile', 
    {
      params: {
        accessToken: localStorage.getItem('accessToken')
      }
    })
    .then( response => {
      commit('updateUser', response.data);
      return;
    })
    .catch( () => {
      commit('logoutUser');
      return;
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}