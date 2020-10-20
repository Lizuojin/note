const slidebar = require('./config.sidebar')
module.exports = {
  title: '前端知识梳理',
  base: '/',
  themeConfig: {
    nav: [
      {
        text: 'JavaScript', 
        items: [
          { text: 'JavaScript基础', link: '/JS/'},
          { text: 'ECMAScript 6', link: '/ES6/' },
          {
            text: '看书取经', 
            items: [
              { text: '你不知道的JS(上)', link: '/book/你不知道的JS上/'},
              { text: '你不知道的JS(中)', link: '/book/你不知道的JS中/'},
              { text: '你不知道的JS(下)', link: '/book/你不知道的JS下/'}
            ],
          }

        ]
      },
      { 
        text: "Vue生态",
        link: '/VueAll/',
      },
      {
        text: '日积月累', 
        items: [
          { text: '面试收集', link: '/jobInterview/'},
          { text: '好文收集', link: '/article/'},
        ]
      },
      { text: '资源工具', link: '/resource/resource/' }
    ],
    sidebar: slidebar,
  },
  markdown: {
    lineNumbers: true
  }
}