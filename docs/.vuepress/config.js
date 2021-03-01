const slidebar = require('./config.sidebar')

module.exports = {
    title: '前端知识梳理',
    base: '/',
    head: [
        [
            'link',
            {rel: 'icon', href: 'logo.png'}
        ]
    ],
    themeConfig: {
        nav: [
            {
                text: 'JavaScript',
                items: [
                    { text: 'JavaScript基础', link: '/javaScript/JS/' },
                    { text: 'ECMAScript 6', link: '/javaScript/ES6/导读' }
                ]
            },
            {
                text: "Vue生态",
                items: [
                    { text: 'Vue2', link: '/vue/vue2/Vue基础梳理' },
                    { text: 'Vue3', link: '/vue/vue3/newFeature' },
                    { text: 'VueRouter', link: '/vue/vueRouter/知识梳理' },
                    { text: 'Vuex', link: '/vue/vuex/知识梳理' },

                ]
            },
            {
                text: '大前端',
                items: [
                    { text: 'Webpack', link: '/webAll/webpack/' },
                    { text: 'Node', link: '/webAll/node/introduce'},
                    { text: 'TypeScript', link: '/webAll/ts/ts'},
                    { text: 'Axios', link: '/webAll/axios/'},
                    {
                        text: '方法论',
                        items: [
                            { text: '设计模式', link: '/webAll/methodology/designMode' },
                        ],
                    },
                ]
            },
            {
                text: '看书取经',
                items: [
                    {
                        text: 'JavaScript',
                        items: [
                            { text: '你不知道的JS(上)', link: '/book/JavaScript/你不知道的JS上/' },
                            { text: '你不知道的JS(中)', link: '/book/JavaScript/你不知道的JS中/' },
                            { text: '你不知道的JS(下)', link: '/book/JavaScript/你不知道的JS下/' }
                        ],
                    },
                    {
                        text: 'HTTP',
                        items: [
                            { text: '图解HTTP', link: '/book/http/图解HTTP/' },
                        ],
                    }
                ],
            },
            {
                text: '日积月累',
                items: [
                    { text: '面试收集', link: '/amass/jobInterview/' },
                    { text: '好文学习', link: '/amass/article/' },
                    { text: '代码片段', link: '/amass/codeChunk/tool/tool' },
                ]
            },
            { text: '资源工具', link: '/resource/resource/' }
        ],
        sidebar: slidebar,
    },
    markdown: {
        lineNumbers: true,
    }
}