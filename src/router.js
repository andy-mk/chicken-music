import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Recommend = (resolve) => {
  import('./views/Recommend.vue').then((module) => {
    resolve(module)
  })
}

const SonglistDetail = (resolve) => {
  import('./components/songlist-detail/SonglistDetail.vue').then((module) => {
    resolve(module)
  })
}

const Singer = (resolve) => {
  import('./views/Singer.vue').then((module) => {
    resolve(module)
  })
}

const SingerDetail = (resolve) => {
  import('./components/singer-detail/SingerDetail.vue').then((module) => {
    resolve(module)
  })
}

const Rank = (resolve) => {
  import('./views/Rank.vue').then((module) => {
    resolve(module)
  })
}

const Search = (resolve) => {
  import('./views/Search.vue').then((module) => {
    resolve(module)
  })
}

const User = (resolve) => {
  import('./views/User.vue').then((module) => {
    resolve(module)
  })
}

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: SonglistDetail
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: SonglistDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: 'singer/:id',
          component: SingerDetail
        },
        {
          path: 'playlist/:id',
          component: SonglistDetail
        }
      ]
    },
    {
      path: '/user',
      component: User
    }
  ]
})
