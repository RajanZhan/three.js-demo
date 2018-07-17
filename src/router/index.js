import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/three/three'
import Index2 from '@/components/three2/three2'
import Index3 from '@/components/three3/three3'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index3
    },

  ]
})
