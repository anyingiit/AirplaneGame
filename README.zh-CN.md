[English](README.md) · **简体中文**

> 英文版是规范版本。本页与 [README.md](README.md) 不一致时，以英文版为准。

<!-- translation-of: README.md sha256:ba3a15ad5f769bdc -->

<!-- Source: Best-README-Template BLANK_README (Unlicense) — https://github.com/othneildrew/Best-README-Template -->
<a id="readme-top"></a>

# AirplaneGame

一款使用 PixiJS 和 TypeScript 构建的横版飞机射击游戏：玩家操控的飞机会自动开火，攻击从屏幕顶部不断出现的敌机。

[![CI](https://github.com/anyingiit/AirplaneGame/actions/workflows/ci.yml/badge.svg)](https://github.com/anyingiit/AirplaneGame/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/anyingiit/AirplaneGame)](LICENSE)

[报告问题](https://github.com/anyingiit/AirplaneGame/issues/new?template=bug_report.yml) · [提出需求](https://github.com/anyingiit/AirplaneGame/issues/new?template=feature_request.yml)

<details>
  <summary>目录</summary>
  <ol>
    <li><a href="#about-the-project">关于本项目</a></li>
    <li><a href="#getting-started">开始使用</a></li>
    <li><a href="#usage">用法</a></li>
    <li><a href="#contributing">参与贡献</a></li>
    <li><a href="#license">许可证</a></li>
    <li><a href="#contact">联系方式</a></li>
  </ol>
</details>

## 关于本项目

AirplaneGame 是一款基于 [pixi.js](https://pixijs.com/) 4.8.2 渲染的纵版清版射击游戏。玩家的飞机会跟随鼠标在一块固定的 512x768 画布上移动，`src/js/index.ts` 中的游戏主循环负责自动开火、在屏幕顶部随机生成若干架敌机，并用简单的圆形距离碰撞检测逐一判断子弹是否击中敌机。

击毁敌机会增加角落显示的分数。飞过掉落的道具会提升开火速度，并在两个阈值处将飞机贴图切换为明显升级过的样式；而撞上敌机则会让游戏暂停在一层半透明遮罩后面，并显示一个继续按钮。游戏没有胜利条件或菜单——它会一直运行，直到玩家坠毁为止。

仓库中同时保留了两份内容：`src/` 是构建所依据的源代码，而 `docs/` 是预先构建好的一份拷贝（打包文件和素材），放在那里是为了让 GitHub Pages 无需构建步骤即可直接提供游戏。

## 开始使用

### 环境要求

- Node.js 和 npm，用于安装 `package.json` 中声明的依赖——包括 pixi.js
  本身，以及把 `src/` 编译打包成可运行文件的 webpack 工具链
  （`webpack`、`ts-loader`、`html-webpack-plugin`、`copy-webpack-plugin`、
  `clean-webpack-plugin`、`image-minimizer-webpack-plugin`）

### 安装

```sh
git clone https://github.com/anyingiit/AirplaneGame.git
cd AirplaneGame
npm install
```

仓库中还提交了 `yarn.lock`；执行 `yarn install` 会直接读取它，持续集成
也正是用它来保证构建可复现。

## 用法

启动开发服务器，它会在保存时自动重新构建，并携带 source map 提供服务：

```sh
npm run dev
```

在浏览器中打开 `http://localhost:9000`——把鼠标移到画布上即可操纵飞机。

如果想构建生产环境的打包文件到 `dist/`，并预览最终发布的内容：

```sh
npm run build
npm run start
```

`npm run start` 会用 `http-server` 提供 `dist/` 目录的服务，它会打印出
选定的本地地址（默认是 `http://localhost:8080`）。

## 参与贡献

欢迎参与。[CONTRIBUTING.md](CONTRIBUTING.md) 说明如何提交 issue 或 pull request，[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) 说明对所有参与者的行为要求。

请不要在公开的 issue 或 pull request 中报告安全问题。[SECURITY.md](SECURITY.md) 说明了私下报告的方式。

## 许可证

以 MIT 许可证分发。详见 [LICENSE](LICENSE)。

## 联系方式

项目地址：[https://github.com/anyingiit/AirplaneGame](https://github.com/anyingiit/AirplaneGame)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
