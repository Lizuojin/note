# 安全防范面试题
[[toc]]

## 如何防范 XSS 攻击
`XSS` 是跨站脚本攻击的简写
攻击者的攻击方式：
1. 攻击者编写恶意攻击的脚本
2. 攻击者访问前端页面，在输入框中输入编写好的恶意脚本
3. 攻击者将恶意脚本进行提交，后端将恶意脚本存储在数据库中
4. 当某些合法用户访问该网站的时候，该网站会获取存储在数据库中的恶意脚本，但是浏览器不知道它是恶意脚本所以执行了。

#### 防范
1. 对用户输入的特殊字符串进行转译，针对用户的输入设置标签白名单
2. `cookie` 设置 `HttpOnly` ，配合 `token` 或验证码防范
3. 设置 `CSP安全策略` 可以通过两种方式设置CSP，一种是 `meta` 标签，一种是 `HTTP` 响应头`Content-Security-Policy`
    ```js
    // 在HTTP Header上使用（首选）
    "Content-Security-Policy:" 策略
    "Content-Security-Policy-Report-Only:" 策略

    // 在HTML上使用
    <meta http-equiv="content-security-policy" content="策略">
    <meta http-equiv="content-security-policy-report-only" content="策略">
    ```

## 如何防范 CSRF 攻击
CSRF是跨站请求伪造的简写
击者盗用了你的身份，以你的名义发送恶意请求，请求到达后端时，服务器将无法区分恶意请求和合法请求。。CSRF能够做的事情包括：以你名义发送邮件，发消息，盗取你的账号，甚至于购买商品，虚拟货币转账等。

CSRF攻击必须具备两个流程
- 登录受信任网站A，并在本地生成Cookie。
- 在不登出A的情况下，访问危险网站B。

#### 防范
1. 同源检测，直接禁止外域（受信域可以开白名单）对我们发起请求
2. `CSRF Token`，就把 `Token` 以参数的形式加入请求了，提交给服务器的时候，服务器需要判断 `Token` 的有效性
3. `Samesite Cookie`属性，`Samesite=Strict` 只允许同源网站提交请求携带 `cookie`































