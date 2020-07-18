// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '../src/assets/css/global.css'
import '../src/assets/fonts/iconfont.css'
import {Form,FormItem,Input,Button,Container,Header,Aside,Main,Menu,
  Submenu,MenuItem,Breadcrumb,BreadcrumbItem,Card,Row,
  Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog,MessageBox,
  Tag,Tree,Select,Option,Cascader,Alert,Tabs,TabPane,Steps,Step,CheckboxGroup,Checkbox,Upload} from 'element-ui'
import {Message} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

import TimelineItem from '../node_modules/element-ui/packages/timeline-item/index.js'
import  Timeline from    '../node_modules/element-ui/packages/timeline/index.js'

Vue.use(Timeline)
Vue.use(TimelineItem)

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor)
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
Vue.config.productionTip = false

// 请求在到达服务之前 先会调用 use中的这个回调函数来添加请求头信息 
axios.interceptors.request.use(config => {
  NProgress.start()  //显示进度条
  // 为请求头对象 添加token验证的Authorization字段 
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config 
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config 
})
Vue.component('tree-table',TreeTable)
Vue.use(Message)
Vue.prototype.$message = Message 
Vue.prototype.$confirm = MessageBox.confirm

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Menu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Step)
Vue.use(Steps)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render:h=>h(App)
})
