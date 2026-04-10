# 易伴·心迹 Web 初板（Polished MVP）

这是一个可直接放进 GitHub、再接 Vercel 部署的 Next.js 原型站。

这一版保留了你产品草图里的核心闭环：
- 陪伴式对话
- 情绪洞察
- 日记草稿
- ABC 认知分析
- 风险提醒
- 反思问题

## 1. 目录结构

```text
app/
  api/chat/route.js      # 服务端调用 DeepSeek 或 demo 模式
  globals.css            # 全局样式
  layout.js              # 根布局
  page.js                # 首页 + 原型展示
components/
  ChatWorkspace.js       # 主工作台
lib/
  defaults.js            # 默认状态
  mock.js                # 无 API Key 时的演示回包
```

## 2. 本地运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

浏览器打开：

```text
http://localhost:3000
```

## 3. 环境变量

### 真接 DeepSeek
```env
DEEPSEEK_API_KEY=你的key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
DEMO_MODE=false
```

### 只想先看页面效果
```env
DEMO_MODE=true
```

这样即使没有 API key，也能先体验交互与页面。

## 4. 推到 GitHub

```bash
git init
git add .
git commit -m "init: polished mvp"
git branch -M main
git remote add origin https://github.com/你的用户名/yiban-xinji-web.git
git push -u origin main
```

## 5. 外网部署

- 把仓库导入 Vercel
- 在 Vercel 配置环境变量
- 重新部署
- 拿到 `*.vercel.app` 地址

## 6. 这版的策略

这版是 **MVP 展示站**，不是正式医疗产品。

所以它故意没有先做：
- 登录系统
- 数据库
- 支付
- 语音
- 后台管理
- 模型训练

这些东西现在都不是优先级。

## 7. 下一步最值得迭代的内容

1. 接 Supabase 保存历史记录
2. 增加“时间轴 / 周报”页面
3. 增加高风险固定提示条与紧急资源入口
4. 给日记草稿增加复制和导出 PDF
5. 增加会话标签与主题归档

## 8. 风险边界

这个项目涉及心理健康场景，必须从第一版开始明确：
- 不是医疗诊断
- 不替代医生或心理咨询师
- 高风险情形必须建议联系现实支持系统
