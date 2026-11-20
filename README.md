# Hui.dev · Java 开发工具箱

四个纯浏览器工具：无损 JSON 格式化/压缩/校验/排序/导入导出，毫秒及秒时间戳双向转换，Spring 6 字段与 Unix 5 字段 Cron 解析，带超时中止的 JavaScript 正则匹配/捕获组/替换。

用户输入不发往服务端，不写入 localStorage、Cookie 或数据库。依赖打包在本站，无第三方 CDN、字体或分析请求。

## 开发

- `npm ci`
- `npm test`
- `npm run build`
- `npm run dev`（127.0.0.1:4173）

静态页面及样式在 dist/，逻辑在 src/，构建产物 app.js 和 regex-worker.js 也输出到 dist/。推送 main 分支后，GitHub Actions 自动运行测试、构建并发布 dist/ 到 GitHub Pages。自定义域名在仓库 Settings → Pages 配置。

## 明确边界

- Cron 采用 cron-parser 计算；Spring 模式支持常用六字段语法、L 和 #。暂不支持 W、L-n、日和星期同时限制；并非 Quartz 引擎。
- 正则采用 JavaScript RegExp，并非 Java Pattern。Web Worker 超过 1.5 秒中止，显示前 1000 个匹配。
- JSON 输入限 2 MB；正则文本限 200000 字符。日期转换对重复和不存在的夏令时时段给出错误。
- 暂不持久化用户输入，也无账户或服务端业务逻辑。

## v1.1 新增工具

- 文本 / JSON 差异对比（JSON 大整数保真、可忽略字段顺序）
- Base64、URL、Unicode、Java 字符串编码转义
- 批量文本去重、排序、集合运算、SQL IN、JSON 数组
- MySQL、PostgreSQL、Oracle、SQL Server、SQLite 格式化
- MyBatis Preparing / Parameters 单组日志还原（MySQL 默认字符串规则）
- JWT Header / Payload 查看、UTC 时间与过期提示（不验证签名）

所有输入只保留在页面内存中，无上传、持久化或外部 API 调用。新增库随页面打包，不依赖第三方 CDN。
