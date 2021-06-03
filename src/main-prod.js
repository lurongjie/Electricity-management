import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'assets/css/base.css'
import ElementUI from 'element-ui'
// （CND导入资源无法打包）
import 'element-ui/lib/theme-chalk/index.css'
import 'assets/fonts/iconfont.css'
import axios from 'axios'
import treeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
// 导入拷贝插件
import _ from 'lodash'

// 导入NProgress, 包对应的JS和CSS（CND导入资源无法打包）
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


let t = new TencentCaptcha(this.$appid, (rsp) => {
  console.log(rsp);
  t.destroy();
  if (rsp.ret === 0) {
    // ...
  } else {}
}, {})


//通过请求拦截器，保证获取数据的权限（API的token认证）
axios.interceptors.request.use(config => {
  // console.log(config);
  //开启NProgress
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config

})

axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

// require styles 导入富文本编辑器样式（CND导入资源无法打包）
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


Vue.use(VueQuillEditor)

// Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.component('tree-table', treeTable)

Vue.filter('dataFormat', function (originVal) {
  const time = new Date(originVal)
  const year = time.getFullYear()
  const month = (time.getMonth() + 1 + '').padStart(2, '0')
  const day = (time.getDate() + '').padStart(2, '0')
  const hour = (time.getHours() + '').padStart(2, '0')
  const minute = (time.getUTCMinutes() + '').padStart(2, '0')
  const second = (time.getSeconds() + '').padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`

})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')