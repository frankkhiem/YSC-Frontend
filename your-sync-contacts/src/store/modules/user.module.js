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
    localStorage.removeItem('accessToken');
  }
};

const actions = {
  fetchUser: async ({
    commit
  }) => {
    if (localStorage.getItem('accessToken') === null) {
      commit('logoutUser');
      return;
    }

<<<<<<< HEAD
    axios.get('http://192.168.0.104:11223/profile', 
    {
      params: {
        accessToken: localStorage.getItem('accessToken')
      }
    })
    .then( response => {
      commit('updateUser', response.data);
    })
    .catch( () => {
      commit('logoutUser');
    });
=======
    axios.get('http://192.168.0.104:11223/profile', {
        params: {
          accessToken: localStorage.getItem('accessToken')
        }
      })
      .then(response => {
        commit('updateUser', response.data);
      })
      .catch(() => {
        commit('logoutUser');
      });
>>>>>>> bc988076fdc4c74fdb8c6f078c821e0ce1c6966a
    return;
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}