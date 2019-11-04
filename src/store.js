import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        servidorAcceso: 'http://1a713d1e.ngrok.io/',
        usuarios: [
            {
                nombres: 'JOHN JAIRO',
                apellidos: 'CARRILLO IBARRA',
                numeroDocumento: '1090479106',
                email: 'jjcarrillo9293@gmail.com',
                fechaNacimiento: moment([1994, 6, 20]).format('YYYY-MM-DD'),
                tipoDocumento: 'CC',
                cargoId: '18',
                id: undefined,
                idPersona: undefined,
                telefono: '3004230343',
                contrasena: 'jozhua',
                estadoCuenta: false
            },
            {
                nombres: 'JUAN PEDRO',
                apellidos: 'ESPITIA MEZA',
                numeroDocumento: '10904794106',
                email: 'juanpedroespitia@gmail.com',
                fechaNacimiento: moment([2000, 7, 6]).format('YYYY-MM-DD'),
                tipoDocumento: 'CC',
                cargoId: '2',
                id: undefined,
                idPersona: undefined,
                telefono: '3123445877',
                contrasena: '1234',
                estadoCuenta: false
            }
        ],
        sesionActiva: undefined,
        proveedor: [],
        cargos: [
            {id: '1', nombre: 'Gerente', permisos: ['1', '2', '3']},
            {id: '2', nombre: 'Secretaria', permisos: ['6', '5', '4']},
            {id: '3', nombre: 'Bodeguero', permisos: ['1', '3']}
        ],
        permisos: [
            {id: '1', nombre: 'ver-usuarios', descripcion: 'Tener y desplegar el menu de los usuarios'},
            {id: '2', nombre: 'crear-usuarios', descripcion: 'Poder crear usuarios nuevos para el aplicativo'},
            {id: '3', nombre: 'modificar-usuarios', descripcion: 'Poder modificar usuarios'},
            {id: '4', nombre: 'crear-cargos', descripcion: 'Poder crear cargos'},
            {id: '5', nombre: 'modificar-cargos', descripcion: 'Poder modificar cargos'},
            {id: '6', nombre: 'eliminar-cargos', descripcion: 'Poder eliminar cargos'},
        ]
    },
    mutations: {
        cambiarEstadoCuenta(state, correo) {
            console.log('Si entre ' + correo)
            state.usuarios.forEach(element => {
                if (correo === element.email) {
                    console.log('El correo es ' + element.email)
                    element.estadoCuenta = true
                    state.sesionActiva = element
                }
            })
        },
        cerrarSesion (state) {
            state.usuarios.forEach(element => {
                element.estadoCuenta = false
            })
            state.sesionActiva = undefined
        },
        modificarUsuario (state, usuario) {
            console.log('modificarUsuario  ' + usuario)
            const nuevos = []
            state.usuarios.forEach(element => {
                console.log( 'como entra ' + element )
                if (element.email === usuario.email) {
                    console.log( ' encontre algo ' + usuario.nombres )
                    element = usuario
                }
                console.log( 'como sale ' + element )
                nuevos.push(element)
            })
            state.usuarios = nuevos
        },
        quitarUsuario ( state, email ) {
            console.log('entre a eliminar ' + email)
            const usu = state.usuarios.find(function (u) {
                return u.email === email
            })
            console.log('entre a eliminar ' + usu)
            var i = state.usuarios.indexOf( usu );
            state.usuarios.splice( i, 1 );
        },
        modificarProveedor (state, proveedor) {
            const nuevos = []
            state.proveedor.forEach(element => {
                console.log( 'como entra ' + element )
                if (element.email === proveedor.email) {
                    element = proveedor
                }
                console.log( 'como sale ' + element )
                nuevos.push(element)
            })
            state.proveedor = nuevos
        },
        modificarCargos (state, cargo) {
            const nuevos = []
            state.cargos.forEach(element => {
                console.log( 'cargo.id ' + cargo.id + "   element.id " + element.id )
                console.log( 'como entra ' + element.permisos )
                if (element.id === cargo.id) {
                    element = cargo
                }
                console.log( 'como sale ' + element.permisos )
                nuevos.push(element)
            })
            state.cargos = nuevos
        }
    },
    actions: {
  
    }
})