import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import users from '../components/user/users.vue'
import rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import categories from '../components/goods/Cate.vue'
import order from '../components/order/Order.vue'
import Report from '../components/report/Report.vue'
import goods from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'
import params from '../components/goods/Params.vue'
Vue.use(Router)


const router = new Router({
  routes: [
    {path:'/',redirect:'/login'},
    {path:'/login',component:Login},
    {path:'/home',component:Home,
    redirect:'/Welcome',
    children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:users},
      {path:'/rights',component:rights},
      {path:'/roles',component:Roles},
      {path:'/categories',component:categories},
      {path:'/orders',component:order},
      {path:'/reports',component:Report},
      {path:'/goods',component:goods},
      {path:'/goods/add',component:Add},
      {path:'/params',component:params},
    ]
    }
  ]
})

Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)
  
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2,'')
  const mm = (dt.getMinutes() + '').padStart(2, '')
  const ss = (dt.getSeconds() + '').padStart(2, '')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


// 挂载路由导航守卫 to表示要访问的路径 from表示从哪里来 next是下一个要做的操作 
router.beforeEach((to,from,next)=>{
  if(to.path === '/login')
  return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr){
    return next('/login')
    
  }
  next();
})

export default router