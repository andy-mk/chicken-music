<template>
  <div id="app">
    <Header></Header>
    <Nav></Nav>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <Player></Player>
    <GlobalPopup :popup="popup" @close="closePopup"></GlobalPopup>
  </div>
</template>

<script>
import Header from './components/header/Header'
import Nav from './components/nav/Nav'
import Player from './components/player/Player'
import GlobalPopup from './components/global-popup/GlobalPopup'

export default {
  data() {
    return {
      popup: true
    }
  },
  components: {
    Header,
    Nav,
    Player,
    GlobalPopup
  },
  methods: {
    closePopup() {
      this.popup = false
    }
  }
}
</script>

<style lang="scss">

</style>
