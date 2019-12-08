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
          name: 'proveedores',
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
        },
        {
          path: 'cargo/registrar',
          name: 'registrarCargo',
          component: () => import('./views/Cargo/registro.vue')
        },
        {
          path: '/producto',
          name: 'producto',
          component: () => import('./views/Producto/index.vue')
        },
        {
          path: 'producto/modificar',
          name: 'modificarProducto',
          component: () => import('./views/Producto/modificar.vue'),
          props: (route) => ({ productorOriginal: route.params.productoOriginal })
        },
        {
          path: '/producto/registro',
          name: 'registroProducto',
          component: () => import('./views/Producto/registro.vue')
        },
        {
          path: 'marca/',
          name: 'marca',
          component: () => import('./views/Marca/index.vue')
        },
        {
          path: 'marca/registrar',
          name: 'registrarMarca',
          component: () => import('./views/Marca/registrar.vue')
        },
        {
          path: 'item/',
          name: 'items',
          component: () => import('./views/ItemProducto/index.vue')
        },
        {
          path: 'factura/',
          name: 'facturas',
          component: () => import('./views/Factura/index.vue')
        },
        {
          path: 'factura/registrar',
          name: 'registrarFactura',
          component: () => import('./views/Factura/registrar.vue')
        },
        {
          path: 'factura/modificar',
          name: 'modificarFactura',
          component: () => import('./views/Factura/modificar.vue'),
          props: (route) => ({ facturaOriginal: route.params.facturaOriginal })
        },
        {
          path: 'almacen/',
          name: 'Almacen',
          component: () => import('./views/Posicion/index.vue')
        },
        {
          path: 'posicion/gestionar',
          name: 'gestionarPosicion',
          component: () => import('./views/Posicion/gestionar.vue'),
          props: (route) => ({ posicion: route.params.posicion })
        },
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
