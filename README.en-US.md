<div align="center">

<a href="https://github.com/oljc/arco-admin">
  <img width="180" src="./docs/logo.svg" alt="Arco admin logo">
</a>

<h1>Arco Admin</h1>
<p>An out-of-the-box, feature-rich middle and back-office management system framework, standardized with the latest technology stack.</p>

English | [简体中文](./README.md)

[![Preview](https://img.shields.io/badge/%E9%A2%84%E8%A7%88%E5%9C%B0%E5%9D%80-8A2BE2?color=%2314C9C9)](https://arco-admin.cn)
<a href="https://nodejs.org/en/about/previous-releases" target="_blank"><img src="https://img.shields.io/node/v/vite.svg" alt="node compatibility"></a>
<img alt="License" src="https://img.shields.io/github/license/oljc/arco-admin">
<img src="https://img.shields.io/github/last-commit/oljc/arco-admin.svg" alt="node compatibility">
<img alt="Version" src="https://img.shields.io/github/package-json/v/oljc/arco-admin/main">

*📌The project is still under rapid development, stay tuned! Currently usable as a starter template👈🏻*

</div>

## Features
+ New version built with [Vite 5](https://vitejs.dev) for lightning-fast response in frontend development.
+ [Vue 3](https://vuejs.org) + officially recommended [Vue Router](https://router.vuejs.org) + [Pinia](https://pinia.vuejs.org) state manager.
+ Enterprise-level design ecosystem [ArcoDesign](https://arco.design/) component library by ByteDance.
+ [Less](http://lesscss.org/) CSS preprocessor.
+ Utilizing [i18n](https://github.com/intlify/vue-i18n-next/tree/master/packages/vue-i18n#readme) + [i18n-ally](https://github.com/lokalise/i18n-ally) for a simpler, standardized automated internationalization solution.
+ Encapsulated common and convenient request methods based on [Axios](https://axios-http.com).
+ Built-in various business scenario pages, components, and framework support configurations for easy customization.
+ Fully adopted the `ESM` standard modular syntax, following the trend in modern frontend development.
+ Continuously optimized configurations to keep up with updates, deprecations, and merged features of dependencies and `Vite`, ensuring the best bundling optimization.


## Standards
Enhance code quality, reduce errors, and ensure consistency in the entire project's code style to facilitate easier code quality and style management.

+ **Code Standards:**  [ESLint](https://eslint.org/) + [Stylelint](https://stylelint.io) + [Prettier](https://prettier.io)<br/>
    *Static checking and standardization of code syntax, style, and formatting through predefined standards to ensure code quality and readability*

+ **Commit Standards:**  [Husky](https://typicode.github.io/husky/#/) + [Lint-Staged](https://github.com/okonet/lint-staged) + [Commitlint](https://commitlint.js.org)<br/>
  *Ensure consistent code quality and style for each commit through predefined code style checks, formatting, and message validation upon code submission*

## Browser Support

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" /><br/>Edge | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" /><br/>Firefox | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" /><br/>Chrome | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" /><br/>Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/samsung-internet/samsung-internet_48x48.png" alt="Samsung" width="24px" height="24px" /><br/>Samsung | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" /><br/>Opera | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/electron/electron_48x48.png" alt="Electron" width="24px" height="24px" /><br/>Electron |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| >=16| >= 31 | >= 49| >= 31| last 2 versions| >= 36 | last 2 versions

## Usage
1. Install dependencies
```bash
pnpm i
```
2. Run
```bash
pnpm run dev
```
