---
sidebarDepth: 1
---

# css 面试题
## 水平垂直居中
### 水平居中
使用绝对定位居中，可以用
```css
.container{
  width: 300px;
  height: 200px;
  background: pink;
  position: relative;
}
.inner{
  width: 100px;
  height: 50px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -25px;
  margin-left: -50px;
  background: #fff;
} 
```
```css
.container{
  width: 300px;
  height: 200px;
  background: pink;
  position: relative;
}
.inner{
  width: 100px;
  height: 50px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
} 
```

### 垂直居中
使用弹性布局
```css
.container {
  height: 400px;
  background: pink;
  display: flex;
  align-items: center;
}
.inner {
  width: 100px;
  height: 200px;
  background: #fff;
}
```














