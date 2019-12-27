# vue example | vue 示例

## usage | 用法

one shell, start the old service (react-scripts on localhost:8080) | 开启一个 shell，启动旧的服务

```
yarn start
```

the other, start proxy | 开启另一个shell，启动代理

```
yarn proxy
```

then open http://localhost:3000 | 然后打开浏览器体验

## notice

```
...
const config = { useHash: true }
...
```

inside [src/App.js](./src/App.js) work together with config [../../src/default-config.js](../../src/default-config.js)

```
    ...
    bodyModifier: function (body, origin, req, res, proxyRes) {
      const result = body
        .split(`${origin}/#/`).join('/') // rewrite url
        .replace(/useHash\s*:\s*true/g, 'useHash: false') // for angular/react
      return result
    },
    ...
```