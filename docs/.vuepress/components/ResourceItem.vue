<template>
  <div id="resource-item">
      <div class="link-block" v-for="(val,key,index) in list">
        <template v-if="key == title">
          <a target="_blank" class="link-item" v-for="item in val" :href="item.url">
            <p class="title">{{item.title}}</p>
            <p class="intro">{{item.text}}</p>
          </a>
        </template>
      </div>
  </div>
</template>

<script>
export default {
  name: "ResourceItem",
  props: ['title'],
  data() {
    return {
      list: {
        '基础教程': [
          {
            title: 'MDN', 
            text: 'MDN 源于开发者，服务开发者', 
            url: 'https://developer.mozilla.org/zh-CN/docs/Learn'
          },
          {
            title: 'W3School', 
            text: 'W3School 是因特网上最大的 WEB 开发者资源',
            url: 'https://www.w3school.com.cn/',
          },
          {
            title: '菜鸟教程', 
            text: '菜鸟教程集合',
            url: 'https://www.runoob.com/',
          }
        ],
        '技术社区': [
          {
            title: '掘金', 
            text: '掘金是一个帮助开发者成长的社区，是一个面向互联网技术人的内容分享平台',
            url: 'https://juejin.im/',
          },
          {
            title: '博客园', 
            text: '博客园开发者的网上家园',
            url: 'https://www.cnblogs.com/',
          },
          {
            title: 'CDSN', 
            text: 'CDSN 中国专业IT社区CSDN',
            url: 'https://www.csdn.net/',
          },
          {
            title: '开源中国', 
            text: 'OSChina 中国最大的开源技术社区',
            url: 'https://www.oschina.net/',
          },
          {
            title: 'segmentfault', 
            text: '思否 中国领先的开发者技术社区',
            url: 'https://segmentfault.com/',
          },
          {
            title: 'IBM 开发者', 
            text: 'IBM 开发者 IBM开发者社区',
            url: 'https://developer.ibm.com/zh/',
          },
          {
            title: 'StackOverflow', 
            text: ' Stack Overflow是一个与程序相关的IT技术问答网站',
            url: 'https://stackoverflow.com/',
          }
        ],
        'UI组件库': [
          {
            title: 'Element UI', 
            text: '基于 Vue 2.0 的桌面端组件库',
            url: 'https://element.eleme.cn/#/zh-CN/component/installation',
          },
          {
            title: 'AntDesignPro', 
            text: 'AntDesignPro 开箱即用的中台前端/设计解决方案',
            url: 'https://pro.ant.design/index-cn',
          },
          {
            title: 'Web Components', 
            text: '浏览器的原生组件',
            url: 'https://css-tricks.com/modular-future-web-components/',
          },
          {
            title: 'View UI', 
            text: ' View UI 是一套基于 Vue.js 的高质量UI组件库',
            url: 'https://www.iviewui.com/',
          }
        ],
        'CSS样式': [
          {
            title: 'Less', 
            text: '一门向后兼容的 CSS 扩展语言',
            url: 'https://less.bootcss.com/#overview',
          },
          {
            title: 'Sass', 
            text: '最成熟、稳定和强大的专业级 CSS 扩展语言',
            url: 'https://www.sass.hk/docs/',
          },
          {
            title: 'Stylus', 
            text: '富于表现力、动态的、健壮的 CSS 扩展语言',
            url: 'https://stylus.bootcss.com/',
          },
          {
            title: 'zeplin', 
            text: 'zeplin 前端和设计师神器，有标注、Style Guide、版本管理、简单的团队协作',
            url: 'https://stylus.bootcss.com/',
          },
        ],
        'Vue 生态': [
          {
            title: 'Vue.js', 
            text: '渐进式 JavaScript 框架',
            url: 'https://cn.vuejs.org/',
          },
          {
            title: 'Vue-Cli', 
            text: 'Vue.js 开发的标准工具',
            url: 'https://cli.vuejs.org/zh/guide/',
          },
          {
            title: 'Vue Router', 
            text: 'Vue.js 官方的路由管理器',
            url: 'https://router.vuejs.org/zh/guide/',
          },
          {
            title: 'Vuex', 
            text: 'Vue.js 开发的状态管理模式',
            url: 'https://vuex.vuejs.org/zh/guide/',
          }
        ],
        'React 生态': [
          {
            title: 'React.js', 
            text: '用于构建用户界面的 JavaScript 库',
            url: 'https://react.docschina.org/',
          },
          {
            title: 'Redux', 
            text: 'JavaScript 状态容器，提供可预测化的状态管理；除了和 React 一起用外，还支持其它界面库',
            url: 'https://www.redux.org.cn/',
          },
          {
            title: 'React Router', 
            text: 'React.js 官方的路由管理器',
            url: 'https://github.com/ReactTraining/react-router#readme',
          },
        ],
        'Angular 生态': [
          {
            title: 'Angular.js', 
            text: '一款优秀的前端JS框架',
            url: 'https://www.angularjs.net.cn/',
          }
        ],
        '常用插件': [
          {
            title: 'resize-detector', 
            text: '监听元素大小变化',
            url: 'https://www.jianshu.com/p/b9004cb2fa2c',
          },
          {
            title: 'slidePage', 
            text: '轻量无依赖的全屏滚动组件',
            url: 'https://www.jianshu.com/p/dfe78a5983f8',
          },
          {
            title: 'Typed.js', 
            text: '页面文字的打字机效果',
            url: 'https://www.jianshu.com/p/37ff22decc62',
          },
          {
            title: 'Typed.js', 
            text: '页面文字的打字机效果',
            url: 'https://www.jianshu.com/p/37ff22decc62',
          },
          {
            title: 'Instantclick', 
            text: '鼠标 hover 超链接时预加载资源',
            url: 'https://www.jianshu.com/p/dc61cda475cc',
          },
          {
            title: 'svg-sprite-loader', 
            text: '将加载的 svg 图片拼接成 雪碧图',
            url: 'https://www.jianshu.com/p/70f9c9268c83',
          },
          {
            title: 'Animate.css', 
            text: '预设 CSS3 动画库',
            url: 'http://www.animate.net.cn/',
          },
          {
            title: 'Anime.js', 
            text: '轻量型 JavsScript 动画库',
            url: 'https://www.animejs.cn/',
          },
          {
            title: 'Anime.js', 
            text: '轻量型 JavsScript 动画库',
            url: 'https://www.animejs.cn/',
          },
          {
            title: 'Skrollr', 
            text: '视差滚动',
            url: 'https://www.jianshu.com/p/ffe6eb46bb8f',
          },
          {
            title: 'Shepherd.js', 
            text: '为应用创建新手引导',
            url: 'https://github.com/shipshapecode/shepherd',
          },
          {
            title: 'vue-grid-layout', 
            text: '桌面拖拽布局',
            url: 'https://segmentfault.com/a/1190000015303823?utm_source=tag-newest',
          },
          {
            title: 'Vue.Draggable', 
            text: '基于Sortable.js的vue组件，用以实现拖拽功能',
            url: 'https://www.jianshu.com/p/382ac5f9d6ff',
          },
          {
            title: 'handsontable', 
            text: '在线Excel表格',
            url: 'https://handsontable.com/',
          },
          {
            title: 'vue-count-to', 
            text: '数字滚动',
            url: 'https://www.npmjs.com/package/vue-count-to',
          },
          {
            title: 'codrops', 
            text: '上面的交互都很酷...',
            url: 'https://tympanus.net/codrops/',
          },
          {
            title: 'TweenMax.js', 
            text: '适用于移动端和现代互联网的超高性能专业级动画插件',
            url: 'https://www.tweenmax.com.cn/',
          },
        ],
        '构建工具/包管理器': [
          {
            title: 'webpack', 
            text: 'JavaScript 应用程序的静态模块打包器',
            url: 'https://www.webpackjs.com/concepts/',
          },
          {
            title: 'Grunt', 
            text: 'JavaScript 世界的构建工具',
            url: 'https://gruntjs.com/',
          },
          {
            title: 'Bower', 
            text: '依赖包（前端）管理工具',
            url: 'http://bower.io/',
          },
          {
            title: 'NPM', 
            text: '世界上最大的软件注册表（依赖包）',
            url: 'https://www.npmjs.cn/',
          },
          {
            title: 'Yarn', 
            text: '快速、可靠、安全的依赖管理工具',
            url: 'https://yarn.bootcss.com/',
          },
        ],
        'Web安全': [
          {
            title: 'XSS', 
            text: '跨站脚本攻击',
            url: 'https://segmentfault.com/a/1190000013315450',
          },
          {
            title: 'CSRF', 
            text: '跨站点伪造请求攻击',
            url: 'https://www.jianshu.com/p/67408d73c66d',
          },
          {
            title: '跨 iframe 攻击', 
            text: '网页中被插入恶意 iframe 造成攻击',
            url: 'https://blog.csdn.net/u011121146/article/details/52872143',
          },
          {
            title: 'Clickjacking 安全漏洞', 
            text: '当你访问一个恶意网站的时候，攻击者可以控制你的浏览器对一些链接的访问',
            // url: '#',
          },
        ],
        '代码规范': [
          {
            title: '编写可维护的CSS', 
            text: 'SF : 参与大型团队开发项目时，遵守一致的规则极为重要',
            url: 'https://segmentfault.com/a/1190000000388784',
          },
          {
            title: 'CSS Lint', 
            text: 'NEC : 更好的 CSS 样式解决方案',
            url: 'http://nec.netease.com/standard/',
          },
        ],
        'Web服务': [
          {
            title: 'Node.js', 
            text: '一个基于 Chrome V8 引擎 的 JavaScript 运行时',
            url: 'https://nodejs.org/zh-cn/docs/',
          },
          {
            title: 'Nginx', 
            text: '一个高性能的HTTP和反向代理web服务器，同时也提供了IMAP/POP3/SMTP服务',
            url: 'http://nginx.org/en/docs/',
          },
          {
            title: 'Express', 
            text: '基于 Node.js 平台，快速、开放、极简的 Web 开发框架',
            url: 'https://www.expressjs.com.cn/',
          },
          {
            title: 'Koa', 
            text: '基于 Node.js 平台的下一代 web 开发框架',
            url: 'https://koa.bootcss.com/',
          },
          {
            title: 'ThinkJS', 
            text: '一款面向未来开发的 Node.js 框架',
            url: 'https://thinkjs.org/',
          },
          {
            title: 'Egg', 
            text: '为企业级框架和应用而生',
            url: 'https://eggjs.org/zh-cn/',
          },
        ],
        '代码托管': [
          {
            title: 'Github', 
            text: 'GitHub是一个面向开源及私有软件项目的托管平台',
            url: 'https://github.com/',
          },
          {
            title: 'Gitee', 
            text: 'GitHub是一个面向开源及私有软件项目的托管平台',
            url: 'https://gitee.com/',
          },
          {
            title: 'Coding', 
            text: 'Coding 一站式 DevOps，提升研发效能',
            url: 'https://coding.net/',
          }
        ],
        '数据可视化': [
          {
            title: 'Echarts', 
            text: 'Echarts 百度开发的可定制的数据可视化图表, 已经捐给Apache',
            url: 'https://echarts.apache.org/examples/zh/index.html',
          },
          {
            title: 'AntV', 
            text: 'AntV 蚂蚁金服全新一代数据可视化解决方案，致力于提供一套简单方便、专业可靠、无限可能的数据可视化最佳实践',
            url: 'https://antv.vision/zh/',
          },
          {
            title: 'D3', 
            text: 'D3 用动态图形显示数据的JavaScript库',
            url: 'https://d3js.org/',
          },
          {
            title: 'HighCharts', 
            text: 'HighCharts 兼容 IE6+、支持移动端、图表类型丰富的HTML5交互性图表库',
            url: 'https://www.highcharts.com/',
          },
          {
            title: 'ChartJs', 
            text: 'ChartJs 基于 HTML5 的 JavaScript 图表库',
            url: 'https://www.chartjs.org/',
          },
          {
            title: 'Web 图形开发', 
            text: '绘制出动态图像，或者是对图像进行巧妙处理',
            url: 'https://developer.mozilla.org/zh-CN/docs/Web/Guide/Graphics',
          },
          {
            title: 'WebGL', 
            text: '一种JavaScript API，用于在任何兼容的Web浏览器中呈现交互式3D和2D图形，而无需使用插件',
            url: 'https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API',
          },
        ],
        '常用搜索': [
          {
            title: '百度', 
            text: '百度 百度——全球最大的中文搜索引擎及最大的中文网站，全球领先的人工智能公司。',
            url: 'https://www.baidu.com/',
          },
          {
            title: 'Bing', 
            text: 'Bing 微软公司推出的用以取代Live Search的搜索引擎',
            url: 'https://cn.bing.com/',
          },
          {
            title: 'Magi Magi', 
            text: 'Magi Magi 是由 Peak Labs 研发的基于机器学习的信息抽取和检索系统，它能将任何领域的自然语言文本中的知识提取成结构化的数据，通过终身学习持续聚合和纠错，进而为人类用户和其他人工智能提供可解析、可检索、可溯源的知识体系。',
            url: 'https://cn.bing.com/',
          },
        ],
      }
    }
  },
  methods:{

  }
}
</script>

<style lang="scss" scoped>
ul,li {
  list-style: none;
}
.link-block {
  .link-item {
    margin: 15px 7px 0;
    display: inline-block;
    width: 190px;
    height: 100px;
    text-align: center;
    cursor: pointer;
    text-decoration: none !important;
    border: 1px solid transparent;
    box-sizing: border-box;
    overflow: hidden;
    padding: 10px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.1);
    .title {
      font-weight: bold;
      padding-top: 10px;
      padding-bottom: 5px;
    }
    .intro {
      font-size: .8em;
      color: #666;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    p {
      margin: 0;
      line-height: inherit;
    }
  }
}
</style>
