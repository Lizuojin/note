module.exports = {
  "/JS/":[
    {
      title: "JavaScript基础",
      collapsable: false,
      children: [
        {title: '事件循环机制', path: '/JS/事件循环机制'},
        {title: '作用域', path: '/JS/作用域'},
        {title: '闭包', path: '/JS/闭包'},
      ]
    },
  ],
  '/ES6/':[
    {
      title: "ES6新特性",
      collapsable: false,
      children: [
        {title: '类', path: '/ES6/类'},
        {title: '模块化', path: '/ES6/模块化'},
      ]
    },
  ],
  "/VueAll/":[
    {
      title: "Vue",
      name: "Vue",
      collabsable: true,
      children: [
        {title: 'Vue基础梳理', path: '/VueAll/Vue/Vue基础梳理'},
        {title: 'Vue性能优化', path: '/VueAll/Vue/Vue性能优化'},
        {title: '应该知道的Vue', path: '/VueAll/Vue/应该知道的Vue'},
      ]
    },
    {
      title: "VueRouter",
      name: "VueRouter",
      collabsable: false,
      children: [
        {title: 'Vue Router知识点梳理', path: '/VueAll/VueRouter/知识梳理'},
      ]
    },
    {
      title: "Vuex",
      name: "Vuex",
      collabsable: false,
      children: [
        {title: 'Vuex知识点梳理', path: '/VueAll/Vuex/知识梳理'},
      ]
    },
  ],
}