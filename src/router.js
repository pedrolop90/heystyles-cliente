import Vue from 'vue'
import Router from 'vue-router'
import DashboardLayout from '@/layout/DashboardLayout'
import AuthLayout from '@/layout/AuthLayout'
Vue.use(Router)

export default new Router({
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: 'login',
      component: DashboardLayout,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "demo" */ './views/Dashboard.vue')
        },
        {
          path: '/icons',
          name: 'icons',
          component: () => import(/* webpackChunkName: "demo" */ './views/Icons.vue')
        },
        {
          path: '/perfil',
          name: 'Perfil',
          component: () => import('./views/Perfil/Perfil.vue')
        },
        {
          path: '/maps',
          name: 'maps',
          component: () => import('./views/Maps.vue')
        },
        {
          path: '/tables',
          name: 'tables',
          component: () => import('./views/Tables.vue')
        },
        {
          path: 'usuario/registro',
          name: 'registro',
          component: () => import('./views/Usuario/registro.vue')
        },
        {
          path: '/proveedor',
          name: 'proveedor',
          component: () => import('./views/Proveedor/index.vue')
        },
        {
          path: '/proveedores',
          name: 'proveedor',
          component: () => import('./views/Proveedor/index.vue')
        },
        {
          path: '/proveedor/registro',
          name: 'registroProveedor',
          component: () => import('./views/Proveedor/registrar.vue')
        },
        {
          path: 'usuario/',
          name: 'index',
          component: () => import('./views/Usuario/index.vue')
        },
        {
          path: 'usuario/modificar',
          name: 'usuarioModificar',
          component: () => import('./views/Usuario/modificar.vue'),
          props: (route) => ({ usuario: route.params.usuario })
        },
        {
          path: 'proveedor/modificar',
          name: 'modificarProveedor',
          component: () => import('./views/Proveedor/modificar.vue'),
          props: (route) => ({ proveedorOriginal: route.params.proveedorOriginal })
        },
        {
          path: 'cargo/',
          name: 'cargo',
          component: () => import('./views/Cargo/index.vue')
        }
      ]
    },
    {
      path: '/',
      redirect: 'login',
      component: AuthLayout,
      children: [
        {
          path: '/login',
          name: 'login',
          component: () => import(/* webpackChunkName: "demo" */ './views/Login.vue')
        }
      ]
    }
  ]
})
