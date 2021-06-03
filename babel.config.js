//判断项目是否为发布阶段追加label插件
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  'plugins': [
    // [
    //   'component',
    //   {
    //     'libraryName': 'element-ui',
    //     'styleLibraryName': 'theme-chalk'
    //   }
    // ],
    // 发布产品时候的插件数组
    ...prodPlugins,
    '@babel/plugin-syntax-dynamic-import'
  ]
}