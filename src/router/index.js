import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'
import Play from '../views/Play.vue'
import Setting from '../views/Setting.vue'
import Ranking from '../views/Ranking.vue'
import Paginate from 'vuejs-paginate'
Vue.component('paginate', Paginate)

Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(Paginate)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const routes = [
  {
    path: '/play',
    name: 'Play',
    component: Play
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting
  },
  {
    path: '/ranking',
    name: 'Ranking',
    component: Ranking
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
