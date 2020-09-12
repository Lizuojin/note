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
        ]
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
