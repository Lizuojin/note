module.exports = {
    "/JS/": [
        {
            title: "目录",
            collapsable: false,
            children: [
                { title: 'JS基础思维导图', path: '/JS/JavaScript思维导图' },
            ]
        },
        {
            title: "JavaScript基础",
            collapsable: false,
            children: [
                { title: '原型与原型链', path: '/JS/原型与原型链' },
                { title: '作用域', path: '/JS/作用域' },
                { title: '执行上下文栈', path: '/JS/执行上下文栈' },
                { title: '变量对象', path: '/JS/变量对象' },
                { title: '作用域链', path: '/JS/作用域链' },
                { title: 'this', path: '/JS/this' },
                { title: '执行上下文', path: '/JS/执行上下文' },
                { title: '闭包', path: '/JS/闭包' },
                { title: '参数按值传递', path: '/JS/参数按值传递' },
                { title: '事件循环机制', path: '/JS/事件循环机制' },
            ]
        },
        {
            title: "持续更新中...",
            collapsable: false,
        }

    ],
    '/ES6/': [
        {
            title: "目录",
            collapsable: false,
            children: [
                { title: '导读', path: '/ES6/导读' },
                { title: 'ECMAScript 6 新特性', path: '/ES6/ES6新特性' },
            ]
        },
    ],
    '/article/': [
        {
            title: "Vue 相关",
            collapsable: false,
            children: [
                { title: 'Vue 源码的一些函数', path: '/article/vue/vueSoundCodeFun' },
                { title: 'Vue3.0里为什么要用 Proxy API 替代 defineProperty API', path: '/article/vue/proxyDefineProtype' },
            ]
        },
        {
            title: "JavaScript 相关",
            collapsable: false,
            children: [
                { title: '你应该知道的一些JS数组技巧', path: '/article/JavaScript/arraySkill' },
                { title: 'ES 2021 新特性提前知', path: '/article/JavaScript/ES2021' },
            ]
        },
        {
            title: "其他",
            collapsable: false,
            children: [
                { title: '聊聊cookie', path: '/article/other/cookie' },
                { title: '记记这200条git命令', path: '/article/other/git' },
            ]
        },
    ],
    '/codeChunk/': [
        {
            title: "目录",
            collapsable: false,
            children: [
                { title: '工具函数', path: '/codeChunk/tool/tool' },
            ]
        },
    ],
    '/jobInterview/': [
        {
            title: "JavaScript相关",
            collapsable: false,
            children: [
                { title: '基础题', path: '/jobInterview/js/jsBase' },
                { title: '手写题', path: '/jobInterview/js/jsAdvance' },
                { title: 'ES6', path: '/jobInterview/js/ES6' },
                { title: 'DOM', path: '/jobInterview/js/dom' },
            ]
        },
        {
            title: "Vue全家桶相关",
            collapsable: false,
            children: [
                { title: 'Vue', path: '/jobInterview/vue/vue' },
                { title: 'VueRouter', path: '/jobInterview/vue/vueRouter' },
                { title: 'Vuex', path: '/jobInterview/vue/vuex' },
            ]
        },
        {
            title: "性能优化相关",
            collapsable: false,
            children: [
                { title: '性能优化', path: '/jobInterview/optimize/optimize' },
                { title: 'Vue性能优化', path: '/jobInterview/optimize/optimizeVue' },
            ]
        },
        {
            title: "网络相关",
            collapsable: false,
            children: [
                { title: 'HTTP', path: '/jobInterview/network/http' },
                { title: 'TCP', path: '/jobInterview/network/tcp' },
                { title: 'CDN', path: '/jobInterview/network/cdn' },
            ]
        },
        {
            title: "工程化相关",
            collapsable: false,
            children: [
                { title: '构建工具', path: '/jobInterview/engineer/build' },
            ]
        },
        {
            title: "安全相关",
            collapsable: false,
            children: [
                { title: '安全防范', path: '/jobInterview/safety/safetyPrecaution' },
            ]
        },
        {
            title: "浏览器相关",
            collapsable: false,
            children: [
                { title: '浏览器基础', path: '/jobInterview/browser/browserBase' },
            ]
        },
        {
            title: "算法相关",
            collapsable: false,
            children: [
                { title: '排序算法', path: '/jobInterview/arithmetic/sort' },
            ]
        },
        {
            title: "CSS相关",
            collapsable: true,
            path: '/jobInterview/css/css'
        },
        {
            title: "实战相关",
            collapsable: false,
            path: '/jobInterview/other/'
        },
    ],
    "/vue2/": [
        {
            title: "目录",
            collabsable: false,
            children: [
                { title: 'Vue基础梳理', path: '/vue2/Vue基础梳理' },
                { title: 'Vue性能优化', path: '/vue2/Vue性能优化' },
                // { title: '应该知道的Vue', path: '/vue2/应该知道的Vue' },
                { title: 'Vue源码阅读准备', path: '/vue2/Vue源码阅读准备' },
                { title: 'Vue源码', path: '/vue2/Vue源码' }
            ]
        },
    ],
    "/vue3/": [
        {
            title: "目录",
            collabsable: true,
            children: [
                { collabsable: true, title: '新特性', path: '/vue3/newFeature' },
            ]
        },
    ],
    "/vueRouter/": [
        {
            title: "目录",
            collabsable: false,
            children: [
                { title: 'Vue Router知识点梳理', path: '/vueRouter/知识梳理' },
            ]
        },
    ],
    "/vuex/": [
        {
            title: "目录",
            collabsable: false,
            children: [
                { title: 'Vuex知识点梳理', path: '/vuex/知识梳理' },
            ]
        },
    ],
    "/webpack/":[
        {
            title: "目录",
            collapsable: false,
            children: [
                { title: '安装', path: '/webpack/install' },
                { title: '起步', path: '/webpack/start' },
                { title: '打包静态资源', path: '/webpack/static' },
                { title: 'webpack 核心', path: '/webpack/core' },
                { title: 'webpack 进阶', path: '/webpack/advanced' },
            ]
        },
    ],
    "/node/":[
        {
            title: "目录",
            collapsable: false,
            children: [
                { title: 'Node简介', path: '/node/introduce' },
            ]
        },
    ],
    "/ts/":[
        {
            title: "目录",
            collapsable: false,
            children: [
                { title: '学习笔记', path: '/ts/ts' },
            ]
        },
    ]
}