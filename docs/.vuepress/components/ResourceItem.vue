<template>
  <div id="resource-item">
      <div class="link-block" v-for="(val,key,index) in list">
        <template v-if="key == title">
          <a target="_blank" class="link-item" v-for="item in val">
            <h1>{{item.title}}</h1>
            <p>{{item.text}}</p>
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
          {title: 'MDN', text: 'MDN 源于开发者，服务开发者'},
          {title: 'MDN', text: 'MDN 源于开发者，服务开发者'},
        ],
        '技术社区': [
          {title: '掘金', text: 'MDN 源于开发者，服务开发者'},
          {title: '博客园', text: 'MDN 源于开发者，服务开发者'},
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
.item-box {

}
</style>
