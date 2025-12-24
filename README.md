# 企业级密码生成器 - 完整文档

## 📋 目录

1. [项目简介](#项目简介)
2. [功能特点](#功能特点)
3. [技术栈](#技术栈)
4. [项目结构](#项目结构)
5. [安装部署](#安装部署)
6. [使用说明](#使用说明)
7. [API 接口文档](#api-接口文档)
8. [配置说明](#配置说明)
9. [安全建议](#安全建议)
10. [常见问题](#常见问题)

---

## 项目简介

企业级密码生成器是一个专业、安全、易用的密码生成工具，适用于企业和个人使用。采用现代化的界面设计，提供多种密码生成方式，确保密码的安全性和易用性。

### 在线演示

访问 `http://localhost:3001` 查看演示

---

## 功能特点

### 🔐 三种密码类型

#### 1. 随机强密码
- 高强度随机字符组合
- 可自定义长度（8-64位）
- 支持大小写字母、数字、特殊符号
- 可排除易混淆字符

#### 2. 易记密码
- 使用单词组合形式
- 便于记忆和输入
- 可自定义单词数量
- 支持多种分隔符

#### 3. PIN码
- 纯数字密码
- 适用于手机、门禁等场景
- 可自定义位数（4-12位）

### 🛡️ 安全特性

- ✅ 使用加密安全的随机数生成器 (crypto.getRandomValues)
- ✅ 实时密码强度评估
- ✅ 可排除易混淆字符 (i, l, 1, O, 0)
- ✅ API 速率限制保护（15分钟100次请求）
- ✅ 所有密码生成均可在本地完成
- ✅ 不存储任何密码到服务器

### 💎 用户体验

- 🎨 现代化专业界面设计
- ⚡ 实时配置预览
- 📋 一键复制功能
- 📝 密码历史记录（本地存储，最多20条）
- 📱 响应式设计，完美支持移动端
- 🔌 离线可用（前端包含完整生成逻辑）

---

## 技术栈

### 后端技术

- **Node.js**: JavaScript 运行环境
- **Express**: Web 应用框架
- **Helmet**: 安全头部中间件
- **CORS**: 跨域资源共享
- **express-rate-limit**: API 速率限制

### 前端技术

- **HTML5**: 语义化标签
- **CSS3**: 现代化样式（渐变、动画、Grid/Flexbox）
- **JavaScript ES6+**: 原生 JavaScript
- **Web Crypto API**: 加密安全的随机数生成
- **LocalStorage**: 本地数据存储

### 安全技术

- **Node.js Crypto**: 服务端加密
- **Web Crypto API**: 客户端加密
- **CSP**: 内容安全策略
- **Rate Limiting**: 请求频率限制

---

## 项目结构

```
password-generator/
├── server.js              # 后端服务器主文件
├── package.json           # 项目依赖配置
├── package-lock.json      # 依赖版本锁定
├── node_modules/          # 依赖包目录
├── public/                # 前端静态文件目录
│   ├── index.html        # 主页面
│   ├── style.css         # 样式文件
│   └── script.js         # 前端逻辑
└── README.md             # 项目说明文档
```

### 文件说明

#### server.js
- Express 服务器配置
- 密码生成核心逻辑
- API 路由定义
- 安全中间件配置

#### public/index.html
- 页面结构
- 用户界面布局
- SVG 图标

#### public/style.css
- 界面样式
- 响应式布局
- 动画效果
- 主题配色

#### public/script.js
- 前端交互逻辑
- API 调用
- 本地密码生成
- 历史记录管理

---

## 安装部署

### 方式一：传统部署

#### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

#### 安装步骤

##### 1. 克隆或下载项目

```bash
# 如果使用 Git
 git clone <repository-url>
 cd password-generator

# 或直接解压下载的文件
```

##### 2. 安装依赖

```bash
npm install
```

依赖包列表：
- express: ^4.18.2
- cors: ^2.8.5
- helmet: ^7.0.0
- express-rate-limit: ^6.10.0

##### 3. 启动服务器

**生产模式：**
```bash
npm start
```

**开发模式（需要先安装 nodemon）：**
```bash
npm install --save-dev nodemon
npm run dev
```

##### 4. 访问应用

打开浏览器访问：
```
http://localhost:3001
```

### 方式二：Docker 容器化部署 ⭐ 推荐

#### 环境要求

- Docker >= 20.10.0
- Docker Compose >= 1.29.0（可选，用于编排）

#### 快速开始

##### 1. 构建并启动容器

```bash
# 构建镜像
 docker build -t yv-passwd .

# 启动容器
 docker run -d -p 3001:3001 --name yv-passwd-app yv-passwd
```

##### 2. 使用 Docker Compose（推荐）

```bash
# 启动服务
 docker-compose up -d

# 查看运行状态
 docker-compose ps

# 查看日志
 docker-compose logs -f

# 停止服务
 docker-compose down
```

##### 3. 访问应用

打开浏览器访问：
```
http://localhost:3001
```

#### Docker 部署详情

##### 镜像特点

- ✅ 基于 Node.js 18 Alpine 镜像，体积小巧（~100MB）
- ✅ 多阶段构建优化，生产环境只包含必要依赖
- ✅ 内置健康检查，自动监控服务状态
- ✅ 支持环境变量配置
- ✅ 无需额外 Web 服务器（如 Nginx），直接运行

##### 环境变量配置

可通过环境变量自定义配置：

```bash
docker run -d \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e PORT=3001 \
  --name yv-passwd-app \
  yv-passwd
```

支持的变量：
- `NODE_ENV`: 运行环境（development/production）
- `PORT`: 服务端口（默认：3001）

##### 生产环境建议

**使用 Docker Compose 部署到生产环境：**

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  password-generator:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "node -e \"require('http').get('http://localhost:3001', (r) => {if (r.statusCode !== 200) throw new Error()})\" || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    container_name: yv-passwd-prod
    # 如果需要持久化日志
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

启动生产环境：
```bash
docker-compose -f docker-compose.prod.yml up -d
```

##### 容器管理命令

```bash
# 查看容器状态
docker ps

# 查看容器日志
docker logs -f yv-passwd-app

# 重启容器
docker restart yv-passwd-app

# 停止并删除容器
docker stop yv-passwd-app
docker rm yv-passwd-app

# 更新镜像
docker pull node:18-alpine  # 确保基础镜像最新
docker build -t yv-passwd . --no-cache
docker-compose up -d --force-recreate
```

##### 故障排查

**容器无法启动：**
```bash
# 查看详细日志
docker logs yv-passwd-app

# 进入容器调试
docker exec -it yv-passwd-app sh
```

**端口冲突：**
```bash
# 检查端口占用
lsof -i :3001

# 使用其他端口
docker run -d -p 8080:3001 --name yv-passwd-app yv-passwd
```

### 端口配置

默认端口为 3001，如需修改：

**方式1：环境变量**
```bash
PORT=8080 npm start
```

**方式2：修改代码**

在 `server.js` 中修改：
```javascript
const PORT = process.env.PORT || 3001; // 改为你想要的端口
```

---

## 使用说明

### 基本使用流程

#### 1. 选择密码类型

点击顶部的三个按钮之一：
- 🎲 随机强密码
- 💡 易记密码
- \# PIN码

#### 2. 配置密码参数

根据选择的类型，调整相应参数：

**随机强密码：**
- 拖动滑块设置密码长度
- 勾选需要的字符类型
- 可选择排除易混淆字符

**易记密码：**
- 设置单词数量
- 选择分隔符
- 设置首字母大写
- 选择是否包含数字

**PIN码：**
- 设置位数（4-12位）

#### 3. 生成密码

- 点击"生成密码"按钮
- 或修改任何配置项自动生成

#### 4. 复制密码

- 点击密码框右侧的复制按钮
- 或点击下方的"复制密码"按钮
- 成功后会显示提示消息

#### 5. 查看历史记录

- 所有生成的密码自动保存到历史记录
- 最多保存20条记录
- 可以复制或删除单条记录
- 可以清除所有历史记录

### 密码强度说明

系统会实时评估密码强度，分为三个等级：

#### 弱（0-59分）
- 颜色：红色
- 建议：增加长度和复杂度

#### 中等（60-79分）
- 颜色：橙色
- 建议：可以使用，建议更强

#### 强（80-100分）
- 颜色：绿色
- 说明：非常安全

### 强度评分规则

- 长度 >= 12位：+20分
- 包含小写字母：+15分
- 包含大写字母：+15分
- 包含数字：+15分
- 包含特殊符号：+20分
- 长度 >= 16位：+15分

---

## API 接口文档

### 基础信息

- **Base URL**: `http://localhost:3001/api`
- **Content-Type**: `application/json`
- **Rate Limit**: 100 requests per 15 minutes

### 1. 生成随机密码

**接口地址**
```
POST /api/generate
```

**请求参数**
```json
{
  "length": 16,
  "includeUppercase": true,
  "includeLowercase": true,
  "includeNumbers": true,
  "includeSymbols": true,
  "excludeAmbiguous": false
}
```

**参数说明**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| length | number | 否 | 16 | 密码长度（8-64） |
| includeUppercase | boolean | 否 | true | 包含大写字母 |
| includeLowercase | boolean | 否 | true | 包含小写字母 |
| includeNumbers | boolean | 否 | true | 包含数字 |
| includeSymbols | boolean | 否 | true | 包含特殊符号 |
| excludeAmbiguous | boolean | 否 | false | 排除易混淆字符 |

**响应示例**
```json
{
  "success": true,
  "password": "aB3$xY9#mK2@pL5",
  "strength": {
    "score": 85,
    "level": "strong",
    "checks": {
      "length": true,
      "lowercase": true,
      "uppercase": true,
      "numbers": true,
      "symbols": true,
      "longLength": true
    }
  }
}
```

### 2. 生成易记密码

**接口地址**
```
POST /api/generate-memorable
```

**请求参数**
```json
{
  "wordCount": 4,
  "separator": "-",
  "capitalize": true,
  "includeNumber": true
}
```

**参数说明**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| wordCount | number | 否 | 4 | 单词数量（2-6） |
| separator | string | 否 | "-" | 分隔符 |
| capitalize | boolean | 否 | true | 首字母大写 |
| includeNumber | boolean | 否 | true | 包含数字 |

**响应示例**
```json
{
  "success": true,
  "password": "Apple-Dragon-Forest-Ocean-742",
  "strength": {
    "score": 75,
    "level": "medium",
    "checks": {
      "length": true,
      "lowercase": true,
      "uppercase": true,
      "numbers": true,
      "symbols": false,
      "longLength": true
    }
  }
}
```

### 3. 生成PIN码

**接口地址**
```
POST /api/generate-pin
```

**请求参数**
```json
{
  "length": 6
}
```

**参数说明**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| length | number | 否 | 6 | PIN码位数（4-12） |

**响应示例**
```json
{
  "success": true,
  "password": "847293"
}
```

### 4. 检查密码强度

**接口地址**
```
POST /api/check-strength
```

**请求参数**
```json
{
  "password": "YourPassword123!"
}
```

**响应示例**
```json
{
  "success": true,
  "strength": {
    "score": 85,
    "level": "strong",
    "checks": {
      "length": true,
      "lowercase": true,
      "uppercase": true,
      "numbers": true,
      "symbols": true,
      "longLength": false
    }
  }
}
```

### 错误响应

**格式**
```json
{
  "success": false,
  "error": "错误信息"
}
```

**常见错误**

| HTTP状态码 | 错误信息 | 说明 |
|-----------|---------|------|
| 400 | 至少需要选择一种字符类型 | 所有字符类型都未选中 |
| 429 | Too many requests | 超过速率限制 |
| 500 | Internal server error | 服务器内部错误 |

---

## 配置说明

### 服务器配置

#### 修改端口

在 `server.js` 中：
```javascript
const PORT = process.env.PORT || 3001;
```

#### 修改速率限制

在 `server.js` 中：
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 时间窗口（毫秒）
  max: 100 // 最大请求数
});
```

#### 自定义单词列表

在 `server.js` 的 `generateMemorable` 方法中修改 `words` 数组：
```javascript
const words = [
  'apple', 'banana', 'cherry', // 添加你的单词
  // ...
];
```

### 前端配置

#### 修改API地址

在 `public/script.js` 中：
```javascript
const API_BASE_URL = 'http://your-domain.com';
```

#### 修改历史记录数量

在 `public/script.js` 的 `addToHistory` 函数中：
```javascript
if (passwordHistory.length > 20) { // 修改这个数字
  passwordHistory = passwordHistory.slice(0, 20);
}
```

### 样式配置

#### 修改主题颜色

在 `public/style.css` 中修改渐变色：
```css
.hdr {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

#### 修改字体

在 `public/style.css` 的 `body` 选择器中：
```css
body {
  font-family: 'Your Font', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

---

## 安全建议

### 密码使用建议

1. ✅ **长度要求**
   - 个人账户：至少 12 位
   - 重要账户：至少 16 位
   - 企业账户：至少 20 位

2. ✅ **复杂度要求**
   - 包含大小写字母
   - 包含数字
   - 包含特殊符号
   - 避免使用个人信息

3. ✅ **使用习惯**
   - 不要在多个账户使用相同密码
   - 定期更换重要账户密码（3-6个月）
   - 使用密码管理器存储密码
   - 启用双因素认证（2FA）

4. ⚠️ **安全警告**
   - 不要与他人分享密码
   - 不要在公共场所输入密码
   - 不要将密码保存在明文文件中
   - 不要通过邮件或即时通讯发送密码

### 系统安全特性

1. **加密随机数生成**
   - 使用 `crypto.getRandomValues()` 生成随机数
   - 确保密码的不可预测性

2. **本地生成**
   - 密码生成可完全在本地完成
   - 不依赖网络连接
   - 不向服务器发送敏感数据

3. **速率限制**
   - 防止暴力破解
   - 限制 API 调用频率

4. **安全头部**
   - 使用 Helmet 中间件
   - 防止常见 Web 攻击

---

## 常见问题

### Q1: 为什么端口被占用？

**A:** 端口 3001 可能被其他程序占用。

**解决方案：**

方法1：更改端口
```bash
PORT=3002 npm start
```

方法2：关闭占用端口的进程
```bash
# macOS/Linux
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Q2: 如何在生产环境部署？

**A:** 推荐使用 PM2 进行进程管理。

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name password-generator

# 设置开机自启
pm2 startup
pm2 save
```

### Q3: 密码历史记录存储在哪里？

**A:** 历史记录存储在浏览器的 LocalStorage 中，仅在本地保存，不会上传到服务器。

清除方法：
- 点击"清除历史"按钮
- 或清除浏览器缓存

### Q4: 是否支持离线使用？

**A:** 是的。前端包含完整的密码生成逻辑，即使服务器不可用或离线状态下也能正常生成密码。

### Q5: 生成的密码安全吗？

**A:** 非常安全。系统使用加密安全的随机数生成器（Web Crypto API），确保密码的随机性和不可预测性。

### Q6: 如何自定义界面样式？

**A:** 修改 `public/style.css` 文件中的样式。主要配色在文件开头的 CSS 变量中定义。

### Q7: 支持哪些浏览器？

**A:** 支持所有现代浏览器：
- Chrome/Edge (最新版)
- Firefox (最新版)
- Safari (最新版)

需要浏览器支持 Web Crypto API。

### Q8: 如何备份密码历史？

**A:** 密码历史存储在 LocalStorage 中，可以通过浏览器开发者工具导出：

1. 打开开发者工具（F12）
2. 进入 Application/Storage 标签
3. 找到 LocalStorage
4. 复制 `passwordHistory` 的值

### Q9: 可以集成到其他系统吗？

**A:** 可以。系统提供完整的 REST API，可以轻松集成到其他应用中。参考 API 接口文档部分。

### Q10: 如何报告问题或提出建议？

**A:** 请通过以下方式：
- 提交 GitHub Issue
- 发送邮件反馈
- 提交 Pull Request

---

## 提交规范和授权

### 代码提交规范

本项目采用 [Conventional Commits](https://www.conventionalcommits.org/) 规范，所有提交必须通过 commitlint 检查。

#### 提交格式

```
<类型>[可选的作用域]: <描述>

[可选的正文]

[可选的脚注]
```

#### 类型枚举

- `feat`: 新功能
- `fix`: bug修复
- `docs`: 文档变更
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构（既不是新增功能，也不是修改bug的代码变动）
- `perf`: 性能优化
- `test`: 添加测试
- `chore`: 构建过程或辅助工具的变动
- `ci`: CI配置文件和脚本的变动
- `revert`: 回滚commit
- `security`: 安全相关

#### 提交示例

```bash
feat(generator): 添加生物识别密码生成算法
fix(api): 修复密码强度计算边界条件
docs(readme): 更新 Docker 部署说明
security(auth): 增强随机数生成安全性
```

#### 本地开发流程

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启用 Git Hooks**
   ```bash
   npm run prepare
   ```

3. **提交代码**
   ```bash
   git add .
   npm run commit  # 或使用 git commit
   ```

#### Git Hooks 说明

- `pre-commit`: 自动运行 lint-staged，检查暂存区代码
- `commit-msg`: 验证提交信息格式
- `pre-push`: 推送前运行测试

### 授权协议

本项目采用 **MIT 许可证**，详细信息请参阅 [LICENSE](LICENSE) 文件。

#### 使用权限

- ✅ 可以自由使用、复制、修改、合并、发布、分发、再许可和销售软件
- ✅ 可以用于商业目的
- ✅ 可以修改源代码
- ✅ 可以闭源分发修改后的版本

#### 限制条件

- ⚠️ 必须在所有副本或重要部分中包含版权声明和许可声明
- ⚠️ 软件按"原样"提供，无任何明示或暗示的担保
- ⚠️ 作者不对因使用该软件而产生的任何索赔、损害或其他责任负责

### 行为准则

本项目遵循 [Contributor Covenant](https://www.contributor-covenant.org/) 行为准则。参与项目即表示同意遵守相关条款。详细信息请参阅 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)。

## 贡献指南

欢迎贡献代码！请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细的贡献流程和要求。

主要步骤：
1. Fork 项目并创建特性分支
2. 遵循代码风格和提交规范
3. 添加必要的测试
4. 提交 Pull Request

## 更新日志

### v1.0.0 (2024-01-XX)

**初始版本发布**

- ✨ 支持三种密码类型生成
- ✨ 实时密码强度评估
- ✨ 密码历史记录功能
- ✨ 响应式界面设计
- ✨ 离线可用
- 🔒 加密安全的随机数生成
- 🔒 API 速率限制
- 📱 移动端适配

---

## 许可证

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 使用 2 空格缩进
- 遵循 ESLint 规则
- 添加必要的注释
- 编写清晰的提交信息

---

## 联系方式

- **项目主页**: [GitHub Repository](https://github.com/AaronYang233/yv-passwd)
- **问题反馈**: [GitHub Issues](https://github.com/AaronYang233/yv-passwd/issues)
- **邮箱**: 3300390005@qq.com

---

**感谢使用企业级密码生成器！**
