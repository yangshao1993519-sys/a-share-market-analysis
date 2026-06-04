# A股复盘网站 (Stock Review)

基于 EdgeOne Pages 构建的 A 股复盘交流平台，支持日复盘、周复盘、交易心得分享与社区交流。

## 技术栈

- **前端**: 原生 HTML/CSS/JS（无框架依赖）
- **后端**: EdgeOne Edge Functions
- **存储**: EdgeOne KV
- **认证**: JWT (HMAC-SHA256)
- **部署**: EdgeOne Pages

## 功能特性

- 市场数据展示：上证/深证/创业板/科创50 指数实时卡片
- 日复盘 & 周复盘：游客可看最近7天，登录后可浏览全部
- 交易心得：需登录才能查看的深度复盘内容
- 交流区：游客可浏览留言，登录后可发言，敏感词自动过滤
- 用户系统：注册/登录/找回密码（密保问题），首个注册用户自动成为管理员
- 管理员功能：可删除不当留言

## 目录结构

```
stock-review/
├── index.html                  # 首页
├── login.html                  # 登录/注册/找回密码
├── daily/                      # 日复盘
│   ├── index.html              # 列表页
│   └── detail.html             # 详情页
├── weekly/                     # 周复盘
├── thoughts/                   # 交易心得
├── chat/                       # 交流区
├── assets/css/style.css        # 全局样式
├── js/                         # JS 模块
│   ├── auth.js                 # 认证管理
│   ├── api.js                  # API 请求
│   └── ui.js                   # UI 组件
├── edge-functions/             # Edge Functions
│   ├── middleware.js           # 全局鉴权中间件
│   └── api/                    # API 实现
├── data/sensitive-words.json   # 敏感词库
└── edgeone.json                # 部署配置
```

## 部署步骤

### 1. 前置准备

确保已安装 EdgeOne Pages CLI 并登录：

```bash
npm install -g @tencent/edgeone-pages-cli
edgeone-pages login
```

### 2. 配置 KV 命名空间

在 EdgeOne 控制台创建 KV 命名空间 `STOCK_REVIEW_KV`，并设置环境变量 `JWT_SECRET`。

### 3. 初始化数据

管理员登录后访问 `/api/admin/init-data` 可初始化模拟市场数据。

### 4. 部署

```bash
edgeone-pages deploy
```

或通过 Git 仓库连接 EdgeOne Pages 自动部署。

## 添加复盘内容

### 通过 KV 手动添加

在 EdgeOne 控制台的 KV 管理页面添加：

- **日复盘**: Key 格式 `daily:2026-05-28`，Value 为 JSON: `{"date":"2026-05-28","title":"...","content":"..."}`
- **周复盘**: Key 格式 `weekly:2026-W22`，Value 为 JSON: `{"date":"2026-W22","title":"...","content":"..."}`
- **交易心得**: Key 格式 `thoughts:1`，Value 为 JSON: `{"id":1,"title":"...","content":"...","date":"2026-05-28"}`

### 市场数据

Key `market:today`，Value 为 JSON 格式的市场数据快照。

## 环境变量

| 变量名 | 说明 |
|--------|------|
| `JWT_SECRET` | JWT 签名密钥（必须设置） |
| `STOCK_REVIEW_KV` | KV 命名空间绑定 |

## 注意事项

- 首个注册用户自动获得 admin 角色
- 游客只能查看最近 7 天的复盘内容
- 交易心得页面需要登录才能访问
- 交流区发言会自动过滤敏感词
- 所有密码使用 SHA-256 哈希存储