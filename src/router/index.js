import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import( /* webpackChunkName: "Login_Home_Welcome" */ 'views/login/Login')
const Home = () => import( /* webpackChunkName: "Login_Home_Welcome" */ 'views/home/Home')
const Welcome = () => import( /* webpackChunkName: "Login_Home_Welcome" */ 'views/home/childrenComp/Welcome')

const Users = () => import( /* webpackChunkName: "Users_Rights_Roles" */ 'views/home/childrenComp/user/Users.vue')
const Roles = () => import( /* webpackChunkName: "Users_Rights_Roles" */ 'views/home/childrenComp/role/Roles.vue')
const Rights = () => import( /* webpackChunkName: "Users_Rights_Roles" */ 'views/home/childrenComp/power/Rights.vue')

const Categories = () => import( /* webpackChunkName: "Cate_Params" */ 'views/home/childrenComp/goods/Categories.vue')
const Params = () => import( /* webpackChunkName: "Cate_Params" */ 'views/home/childrenComp/goods/Params.vue')

const Goods = () => import( /* webpackChunkName: "GoodsList_Add" */ 'views/home/childrenComp/goods/Goods.vue')
const Add = () => import( /* webpackChunkName: "GoodsList_Add" */ 'views/home/childrenComp/goods/Add.vue')
const Orders = () => import( /* webpackChunkName: "Order_Report" */ 'views/home/childrenComp/orders/Orders.vue')
const Reports = () => import( /* webpackChunkName: "Order_Report" */ 'views/home/childrenComp/reports/Reports.vue')

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/reports',
        component: Reports
      }
    ]
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//导航守卫（token验证）
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router