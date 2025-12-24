# 贡献指南

感谢您考虑为企业级密码生成器做出贡献！本文档概述了如何参与项目开发。

## 行为准则

本项目采用[Mozilla 行为准则](https://github.com/mozilla/inclusion)。参与本项目即表示您同意遵守其条款。

## 如何贡献

### 1. Fork 项目

点击 GitHub 上的 Fork 按钮创建您自己的项目副本。

### 2. 克隆到本地

```bash
git clone https://github.com/YOUR_USERNAME/yv-passwd.git
cd yv-passwd
```

### 3. 添加上游远程仓库

```bash
git remote add upstream https://github.com/original-owner/yv-passwd.git
```

### 4. 创建特性分支

```bash
git checkout -b feature/your-feature-name
```

分支命名规范：
- `feature/功能描述` - 新功能
- `fix/问题描述` - bug修复
- `docs/文档描述` - 文档更新
- `refactor/重构描述` - 代码重构
- `test/测试描述` - 测试相关

### 5. 开发规范

#### 代码风格

- 使用 2 个空格缩进
- 使用单引号字符串
- 语句结尾添加分号
- 函数和变量使用驼峰命名法
- 类名使用帕斯卡命名法

#### 提交规范

**必须使用约定式提交规范**：

```
<类型>[可选的作用域]: <描述>

[可选的正文]

[可选的脚注]
```

**类型枚举**：
- `feat`: 新功能
- `fix`: bug修复
- `docs`: 文档变更
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 添加测试
- `chore`: 构建过程或辅助工具的变动
- `ci`: CI配置文件和脚本的变动
- `revert`: 回滚commit
- `security`: 安全相关

**示例**：
```bash
feat(generator): 添加生物识别密码生成算法
fix(api): 修复密码强度计算边界条件
docs(readme): 更新 Docker 部署说明
security(auth): 增强随机数生成安全性
```

#### 提交前检查

提交前会自动运行以下检查：
- 代码风格检查 (ESLint)
- 提交信息格式检查 (Commitlint)
- 暂存文件格式化 (lint-staged)

### 6. 测试

在提交前请确保：
- 代码逻辑正确
- 添加必要的测试用例
- 本地测试通过

```bash
npm test
npm run lint
```

### 7. 同步上游变更

```bash
git fetch upstream
 git rebase upstream/main
```

### 8. 推送和提交 PR

```bash
git push origin feature/your-feature-name
```

然后在 GitHub 上创建 Pull Request。

## Pull Request 规范

### PR 标题

使用与提交信息相同的格式：

```
feat: 添加多语言支持
```

### PR 描述模板

```markdown
## 变更说明
简要描述本次变更的内容

## 变更类型
- [ ] Bug修复
- [ ] 新功能
- [ ] 破坏性变更
- [ ] 文档更新
- [ ] 代码重构
- [ ] 性能优化

## 测试情况
- [ ] 本地测试通过
- [ ] 添加了单元测试
- [ ] 添加了集成测试

## 截图（如适用）

## 相关 Issue
Closes #123
```

### PR 检查清单

- [ ] 代码符合项目风格
- [ ] 提交信息格式正确
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 没有引入新的 lint 错误
- [ ] 向后兼容（除非是破坏性变更）

## 开发环境设置

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

### 生产模式运行

```bash
npm start
```

### Docker 开发环境

```bash
docker-compose up -d
```

## 代码审查流程

1. **自动化检查**: CI/CD 流水线自动运行测试、lint 检查
2. **维护者审查**: 项目维护者审查代码质量和设计
3. **社区讨论**: 重大变更会进行社区讨论
4. **合并**: 通过审查后由维护者合并

## 发布流程

1. 创建发布分支 `release/v1.x.x`
2. 更新版本号和 CHANGELOG.md
3. 创建 Pull Request 到 main 分支
4. 合并后打 Tag 发布

## 联系方式

- 提交 Issue 讨论问题
- 发起 Discussion 进行深入交流
- 联系维护团队：your-email@example.com

感谢您的贡献！ 🎉