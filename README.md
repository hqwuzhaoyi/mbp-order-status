# 查询 Macbook 订单状态

## 前置

没有编程经验的朋友，先安装环境

[git](https://git-scm.com/downloads)

[nodejs](https://nodejs.org/zh-cn/download/)

安装后打开终端，并执行

```
node -v
```

```
git -v
```

出现版本号则安装成功，接下来执行

```
git clone https://github.com/hqwuzhaoyi/mbp-order-status && cd mbp-order-status && npm install
```

## 配置信息

`config/default.json`

```json
{
  "tgToken": "telegram robot token",
  "tgChartId": "telegram chart id",
  "sourceUrl": "订单链接",
  "scheduleTimes": "定时触发"
}
```

- [tgToken tgChartId 获取方式](https://hellodk.cn/post/743) 记得启用机器人
- [获取机器人](https://t.me/BotFather)
- [获取 chartId](https://t.me/getuserIDbot)

## 如何启动

```Shell
npm run start
```

启动后可以使用`pm2`类似的方式挂在后台
