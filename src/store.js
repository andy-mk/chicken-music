import Vue from 'vue'
import Vuex from 'vuex'

import state from './stroe/state'
import actions from './stroe/actions'
import mutations from './stroe/mutations'
import getters from './stroe/getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})
