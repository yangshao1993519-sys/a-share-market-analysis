# A股每日和每周市场分析系统

基于 Web 的 A 股市场每日与每周数据分析工具，提供大盘概览、板块轮动、个股筛选与专业复盘等一站式市场分析功能。

## 功能特性

- **大盘概览**：展示上证指数、深证成指、创业板指等主要指数的实时行情与历史走势
- **板块分析**：行业板块涨跌排行、资金流向、轮动热力图
- **个股筛选**：多维度条件筛选（量价、财务、技术指标），快速定位潜力标的
- **每日复盘**：自动汇总当日市场关键数据，生成结构化复盘报告
- **每周综述**：周线级别趋势分析，辅助中长期策略制定
- **专业复盘**：提供深度复盘模板，支持自定义指标与笔记记录
- **响应式布局**：适配桌面端与移动端浏览器

## 项目结构

```
A股每日和每周市场分析/
├── index.html                  # 首页 / 大盘概览
├── dashboard.html              # 数据仪表盘（板块、个股筛选）
├── professional_review.html    # 专业复盘页面
├── daily/                      # 每日复盘报告目录
├── weekly/                     # 每周复盘报告目录
├── templates/                  # 模板文件
├── assets/
│   └── css/
│       └── style.css           # 全局样式表
├── .gitignore                  # Git 忽略文件
├── LICENSE                     # 许可证文件 (AGPL-3.0)
└── README.md                   # 项目说明文档
```

## 使用说明

### 本地运行

1. 克隆项目到本地：

```bash
git clone https://gitee.com/yang-the-quiet-mind/a-share-daily-and-weekly-market-analysis.git
```

2. 直接用浏览器打开 `index.html` 即可使用，无需额外构建步骤。

3. 推荐使用 Chrome、Edge 或 Firefox 等现代浏览器访问。

### 页面导航

| 页面 | 路径 | 功能 |
|------|------|------|
| 首页 | `index.html` | 大盘指数概览、市场情绪指标 |
| 汇总面板 | `dashboard.html` | 日复盘+周复盘整合，图表嵌入 |
| 专业复盘 | `professional_review.html` | K线走势、情绪周期、连板梯队分析 |

## 部署指南

### Gitee Pages 部署

1. 将项目推送至 Gitee 仓库：

```bash
git init
git remote add origin https://gitee.com/yang-the-quiet-mind/a-share-daily-and-weekly-market-analysis.git
git add .
git commit -m "初始化项目"
git push -u origin master
```

2. 在 Gitee 仓库页面进入「服务」→「Gitee Pages」。

3. 选择部署分支（如 `master`），部署目录选择根目录 `/`，点击「启动」。

4. 部署完成后，通过 `https://yang-the-quiet-mind.gitee.io/a-share-daily-and-weekly-market-analysis` 访问。

> **注意**：首次部署需要 1-3 分钟，后续更新代码后需在 Gitee Pages 页面手动点击「更新」按钮。

### 推送更新

```bash
git add .
git commit -m "描述本次更新内容"
git push origin master
```

推送后进入 Gitee Pages 设置页面，点击「更新」使改动生效。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | 原生 HTML5 + CSS3 + JavaScript (ES6+) |
| 图表可视化 | 自定义 CSS 图表 |
| 样式方案 | 自定义 CSS（Flexbox / Grid 布局） |
| 部署平台 | Gitee Pages |

## 贡献指南

欢迎提交 Issue 和 Pull Request。

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m "添加：xxx 功能"`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request

提交前请确保：
- 代码风格与项目保持一致
- HTML / CSS 通过 W3C 验证
- 在主流浏览器中测试通过

## 许可证

本项目采用 [AGPL-3.0 License](LICENSE) 开源。

## 免责声明

- 本项目仅提供市场数据展示与分析工具，**不构成任何投资建议**。
- 所有行情数据来源于公开接口，开发者不对数据的准确性、完整性或时效性做任何保证。
- 股市有风险，投资需谨慎。使用者应独立判断并承担投资决策的全部风险。
- 因使用本项目产生的任何直接或间接损失，开发者不承担任何责任。