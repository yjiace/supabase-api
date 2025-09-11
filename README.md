# Supabase API 演示平台

一个专业的 Supabase API 演示和测试平台，为开发者提供完整的 API 学习和实践环境。采用现代化的 Cyberpunk 暗黑主题设计，具备流畅的交互体验和完整的功能模块。

## 🚀 功能特性

### 📖 首页介绍
- Supabase 平台概览和核心特性介绍
- 详细的快速开始指南
- API 密钥获取操作流程
- 响应式设计，适配各种设备

### 📚 API 文档浏览
- 左侧可折叠的 API 分类导航
- 完整的接口文档展示（参数、请求体、响应示例）
- 智能搜索功能，快速定位接口
- 代码示例和复制功能
- 支持的 API 分类：
  - 身份认证 (Authentication)
  - 数据库操作 (Database)
  - 文件存储 (Storage)
  - 实时订阅 (Realtime)

### 🧪 接口测试工具
- 实时配置 Supabase URL 和 API Key
- 支持所有 HTTP 方法（GET、POST、PUT、PATCH、DELETE）
- 动态参数配置和请求体编辑
- 完整的响应展示（状态码、数据、响应头、耗时）
- 测试历史记录
- 错误处理和状态提示

### 🎨 视觉设计
- Cyberpunk Tech Dark 主题风格
- 动态网格背景效果
- 霓虹绿和电光蓝强调色
- 流畅的动画和交互反馈
- 发光边框和悬停效果

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **样式方案**: Tailwind CSS 3.4.17
- **组件库**: 自定义 UI 组件（基于 shadcn/ui 设计理念）
- **HTTP 客户端**: Axios
- **图标库**: Lucide React
- **代码高亮**: 自定义语法高亮

## 📦 安装和运行

### 环境要求
- Node.js 18+ 
- npm 或 yarn

### 本地开发

1. 克隆项目
```bash
git clone <repository-url>
cd supabase-api
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 打开浏览器访问 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录中。

## 🚀 部署指南

本项目支持部署到多个静态托管平台：

### Netlify 部署

1. 将项目推送到 Git 仓库
2. 在 Netlify 中连接仓库
3. 构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
4. 项目已包含 `netlify.toml` 配置文件

### Cloudflare Pages 部署

1. 将项目推送到 Git 仓库
2. 在 Cloudflare Pages 中连接仓库
3. 构建设置：
   - Build command: `npm run build`
   - Build output directory: `dist`
4. 项目已包含 `_redirects` 配置文件

### EdgeOne 部署

1. 构建项目：`npm run build`
2. 将 `dist` 目录上传到 EdgeOne
3. 配置单页应用路由重定向规则

## 📁 项目结构

```
supabase-api/
├── public/                 # 静态资源
├── src/
│   ├── components/         # 组件目录
│   │   ├── ui/            # 基础 UI 组件
│   │   └── layout/        # 布局组件
│   ├── pages/             # 页面组件
│   │   ├── home.tsx       # 首页
│   │   ├── api-docs.tsx   # API 文档页
│   │   └── api-testing.tsx # 接口测试页
│   ├── data/              # 数据文件
│   │   └── api-docs.ts    # API 文档数据
│   ├── lib/               # 工具函数
│   │   └── utils.ts       # 通用工具
│   ├── hooks/             # 自定义 Hooks
│   ├── App.tsx            # 主应用组件
│   ├── main.tsx           # 应用入口
│   └── index.css          # 全局样式
├── netlify.toml           # Netlify 配置
├── _redirects             # Cloudflare Pages 配置
└── README.md              # 项目说明
```

## 🎯 使用指南

### 1. 浏览 API 文档
- 访问"API文档"页面
- 使用左侧导航浏览不同的 API 分类
- 点击具体接口查看详细文档
- 使用搜索功能快速定位接口

### 2. 测试 API 接口
- 访问"接口测试"页面
- 在配置面板中输入您的 Supabase URL 和 API Key
- 选择要测试的 API 分类和具体接口
- 配置请求参数和请求体
- 点击"发送请求"查看响应结果

### 3. 获取 Supabase 配置
- 登录 [Supabase 控制台](https://supabase.com)
- 选择您的项目
- 在"Settings" > "API"页面获取：
  - Project URL
  - API Keys (anon/public key)

## 🔧 自定义配置

### 修改主题色彩
在 `tailwind.config.js` 中修改色彩配置：

```javascript
colors: {
  'neon': {
    'green': '#00FF88',  // 霓虹绿
    'blue': '#00D4FF',   // 电光蓝
  }
}
```

### 添加新的 API 接口
在 `src/data/api-docs.ts` 中添加新的接口定义：

```typescript
{
  id: 'new-endpoint',
  name: '新接口',
  method: 'GET',
  path: '/api/new-endpoint',
  description: '接口描述',
  // ... 其他配置
}
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Supabase](https://supabase.com) - 提供强大的后端即服务平台
- [React](https://reactjs.org) - 用户界面构建库
- [Tailwind CSS](https://tailwindcss.com) - 实用优先的 CSS 框架
- [Vite](https://vitejs.dev) - 下一代前端构建工具
- [Lucide](https://lucide.dev) - 美观的开源图标库

## 📞 支持

如果您在使用过程中遇到问题，请：

1. 查看本 README 文档
2. 检查 [Issues](../../issues) 中是否有相似问题
3. 创建新的 Issue 描述您的问题

---

**享受使用 Supabase API 演示平台！** 🚀