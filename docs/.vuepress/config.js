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
        // items: [
        //   {
        //     text: 'Vue', 
        //     link: '/VueAll/Vue/Vue梳理/'
        //   },
        //   {
        //     text: 'VueRouter',
        //     link: '/VueAll/VueRouter/知识梳理/' 
        //   },
        //   {
        //     text: 'Vuex',
        //     link: '/VueAll/Vuex/知识梳理/' 
        //   }
        // ]
      },
      { text: '资源工具', link: '/resource/resource/' }
    ],
    sidebar: slidebar,
  },
  markdown: {
    lineNumbers: true
  }
}