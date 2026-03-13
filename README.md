# Kou — 日语学习

以《新版中日交流标准日本语》教材为参考制作。
辅助作者顺利通过了日语二级考试。

## 功能特色

- 课文阅读：根据《新版中日交流标准日本语》教材对课文排序，循序渐进学习日语
- 单词展示：单词有假名标注，假名上有直观的重音标志
- 笔记标注：辅助提升的实用学习笔记
- 语法学习：分门别类的语法说明
- 智能回放：有助于学习内容的学习与记忆
- 中文翻译：内嵌课文、单词的中文翻译，方便用户的阅读与理解

## 代码优势

- 开源易用，无门槛，操作简单易于上手
- 创新使用了“假名直接标注”、“单词重音标识”等呈现形式，软件定义了一套纯文本语法规范
- 手机版与电脑版共用核心库，便于移植

# UI展示

## 电脑版

![](images/computer-ui.png)

## 手机版

![](images/mobile-ui1.webp)
![](images/mobile-ui2.webp)
![](images/mobile-ui3.webp)

# 快速开始

## 电脑版

[在线体验](http://japan.icerdesign.com/)

## 手机版

[iOS Store](https://apps.apple.com/jp/app/标准日本语学习日志-初级-笔记-背单词-查语法/id1292939660)

# 本地开发

## 环境要求

- Ruby（用于 Jekyll）：建议通过系统包管理器安装，执行 `gem install jekyll bundler`
- Node.js：**必须使用 v10.x**（手机版依赖 node-sass 原生模块，与高版本不兼容），推荐通过 [nvm](https://github.com/nvm-sh/nvm) 管理版本

## 电脑版（Jekyll）

```bash
# 安装依赖
npm install

# 本地启动（含热重载）
npm run dev
# 或
gulp
```

启动后访问 `http://localhost:3000`

## 手机版（Ionic）

手机版依赖 Jekyll 生成的数据文件，需先构建电脑版。

### 首次安装

```bash
nvm use 10.18

cd ionic
SASS_BINARY_SITE=https://npmmirror.com/mirrors/node-sass npm install --legacy-peer-deps --ignore-scripts

# 手动补充 node-sass 原生模块（macOS，因 node-sass 旧版二进制包已下线，需从缓存复制）
VENDOR=node_modules/@ionic/app-scripts/node_modules/node-sass/vendor/darwin-x64-64
mkdir -p "$VENDOR"
cp ~/.npm/node-sass/4.14.1/darwin-x64-64_binding.node "$VENDOR/binding.node"
```

> 仅首次或 `node_modules` 被删除后需要执行上述步骤。

### 日常开发

```bash
# 第一步：在项目根目录构建 Jekyll，将数据写入 ionic/src/assets/site/
npm run ionic

# 第二步：进入 ionic 目录，启动开发服务器
cd ionic
nvm use 10.18
npm run ionic:serve
```

访问 `http://localhost:8100` 预览手机版。

### 生产构建

```bash
# 根目录执行（构建 Jekyll 数据 + Ionic App）
nvm use 10.18
npm run ionic       # 构建 Jekyll 数据到 ionic/src/assets/site/
cd ionic && npm run build   # 构建 Ionic，产物输出到 www/
```

# License

The MIT License (MIT)