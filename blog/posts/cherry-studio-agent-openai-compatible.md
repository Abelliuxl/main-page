---
title: Why Cherry Studio Agent Mode Won't Show Your OpenAI Compatible Models
titleZh: 为什么 Cherry Studio Agent 模式不显示你的 OpenAI Compatible 模型
date: 2026-06-22
excerpt: Cherry Studio's Agent mode only shows Anthropic-compatible providers. Here's why, and what you can actually do about it.
excerptZh: Cherry Studio 的 Agent 模式只显示 Anthropic 兼容的 provider。这是为什么，以及你能做什么。
tags: Cherry Studio, Agent, OpenAI Compatible, Anthropic, SDK
---

<!-- lang: en -->

Cherry Studio's Agent mode is powerful — it runs Claude Code SDK under the hood, giving you a full agentic coding experience. But if you've tried adding a custom "OpenAI Compatible" provider and wondered why it doesn't show up in the Agent model dropdown, you're not alone.

This isn't a bug. It's a design constraint rooted deep in the protocol layer.

## The Symptom

You add a custom provider of type "OpenAI Compatible" in Cherry Studio's settings. You can see its models in the normal chat mode. But switch to Agent mode, and the model dropdown only shows Anthropic providers — the native `anthropic` provider and any custom providers with an `anthropic-messages` endpoint configured.

Your OpenAI Compatible provider's models? Invisible.

## The Root Cause

The problem lives in `src/renderer/hooks/agents/useAgentModelFilter.ts`. The `claude-code` branch does a whitelist filter:

```typescript
const claudeCompatibleProviderIds = useMemo(() => {
  const ids = new Set<string>(NATIVE_ANTHROPIC_PROVIDER_IDS) // only 'anthropic'
  for (const provider of providers) {
    if (provider.endpointConfigs?.[ENDPOINT_TYPE.ANTHROPIC_MESSAGES]) {
      ids.add(provider.id)
    }
  }
  return ids
}, [providers])
```

OpenAI Compatible providers typically have `openai` or `openai-chat-completions` in their `endpointConfigs`, not `anthropic-messages`. So they get filtered out.

But this filter isn't arbitrary — it's protecting you from a guaranteed runtime error.

## The Real Constraint: Protocol Hardcoding

Cherry Studio's Agent mode uses `@anthropic-ai/claude-agent-sdk` v0.3.168. This SDK is hardcoded to the Anthropic Messages API protocol:

- **Request format**: Anthropic Messages format (`messages[]` + `system` + `max_tokens`)
- **Response parsing**: Anthropic SSE events (`message_start` / `content_block_delta` / `message_delta`)
- **Tool protocol**: `tool_use` / `tool_result`, not OpenAI's `tool_calls` / function calling

The SDK reads environment variables (`ANTHROPIC_API_KEY`, `ANTHROPIC_BASE_URL`, `ANTHROPIC_MODEL`) and makes HTTP requests in Anthropic protocol format. There's no adapter layer — the protocol is baked into the binary.

## Why You Can't Just Remove the Filter

Option 1 seems obvious: remove the whitelist filter in `useAgentModelFilter`. But this would make things worse:

- Your OpenAI Compatible provider would appear in the dropdown
- You'd select it, thinking it works
- The runtime would fail with 4xx errors or response parsing failures
- You'd blame Cherry Studio for a "bug" that's actually a protocol mismatch

The filter is a UX safety net. It prevents you from selecting something that will definitely fail.

## What Actually Works

If you want to use a non-Anthropic LLM in Agent mode, you need a provider that implements the Anthropic Messages protocol. Several services already do this:

- **OpenRouter**: Has an `anthropic-messages` endpoint
- **GLM (Zhipu)**: Offers Anthropic-compatible endpoints
- **SiliconFlow**: Supports Anthropic protocol
- **BigModel**: Another Anthropic-compatible option

The workflow:

1. Choose a provider that supports Anthropic Messages protocol
2. Configure it in Cherry Studio with `endpointConfigs['anthropic-messages']`
3. The filter automatically picks it up

The `resolveAnthropicBaseUrl` function in `agentSessionWarmup.ts` will use your provider's `anthropic-messages` endpoint baseUrl, falling back to `provider.apiHost` if not set.

## The Long-Term Solution

If Cherry Studio wants to support OpenAI Agent natively, there's really only one clean path:

**New `OpenAIRuntimeDriver`** — a separate runtime driver using `@ai-sdk/openai-compatible` with full Agent capabilities.

This would require:

1. New `OpenAIRuntimeDriver` (following the structure of `ClaudeCodeRuntimeDriver.ts`)
2. Extended `AgentType` enum: `['claude-code', 'openai-code']`
3. Registration in `runtimeDriverRegistry`
4. Updated `useAgentModelFilter` with per-agent-type whitelists
5. UI option to choose agent backend type
6. i18n, tests, documentation

The alternative — a protocol转换 adapter between Anthropic and OpenAI — sounds appealing but is a maintenance nightmare. Tool protocol bidirectional conversion has semantic losses, streaming SSE conversion needs chunk boundary handling, and every edge case needs testing.

## Short-Term Advice

For now, the best path forward:

1. Use a provider that implements Anthropic Messages protocol
2. Configure `anthropic-messages` in its `endpointConfigs`
3. Let the filter do its job

Don't fight the protocol. The constraint isn't in the UI — it's in the SDK layer.

## Key Files

| File | Role |
|------|------|
| `useAgentModelFilter.ts` | Agent mode model filtering (whitelist logic) |
| `ClaudeCodeRuntimeDriver.ts` | Claude Agent SDK entry point |
| `runtimeDriverRegistry.ts` | Runtime driver registry |
| `listModels.ts` | Model list fetching (multi-fetcher strategy) |
| `agent.ts` | AgentType enum definition |
| `agentSessionWarmup.ts` | Environment variable injection & baseUrl resolution |

<!-- lang: zh -->

Cherry Studio 的 Agent 模式很强大——底层跑的是 Claude Code SDK，给你完整的 agentic coding 体验。但如果你试过添加自定义的 "OpenAI Compatible" provider，却发现它在 Agent 模式下拉菜单里不显示，你不是一个人。

这不是 bug。这是协议层深处的设计约束。

## 症状

你在 Cherry Studio 设置里添加了一个 "OpenAI Compatible" 类型的自定义 provider。在普通聊天模式下能看到它的模型。但切到 Agent 模式，模型下拉菜单只显示 Anthropic 的 provider——原生 `anthropic` provider 和任何配置了 `anthropic-messages` endpoint 的自定义 provider。

你的 OpenAI Compatible provider 的模型？看不见。

## 根本原因

问题出在 `src/renderer/hooks/agents/useAgentModelFilter.ts` 的 `claude-code` 分支，它做了白名单过滤：

```typescript
const claudeCompatibleProviderIds = useMemo(() => {
  const ids = new Set<string>(NATIVE_ANTHROPIC_PROVIDER_IDS) // 只包含 'anthropic'
  for (const provider of providers) {
    if (provider.endpointConfigs?.[ENDPOINT_TYPE.ANTHROPIC_MESSAGES]) {
      ids.add(provider.id)
    }
  }
  return ids
}, [providers])
```

OpenAI Compatible provider 的 `endpointConfigs` 通常是 `openai` 或 `openai-chat-completions`，没有 `anthropic-messages`，所以被排除在外。

但这个过滤不是随意的——它在保护你免受必然的运行时错误。

## 真正的约束：协议硬编码

Cherry Studio 的 Agent 模式使用 `@anthropic-ai/claude-agent-sdk` v0.3.168。这个 SDK 硬编码为 Anthropic Messages API 协议：

- **请求格式**：Anthropic Messages 格式（`messages[]` + `system` + `max_tokens`）
- **响应解析**：Anthropic SSE 事件（`message_start` / `content_block_delta` / `message_delta`）
- **Tool 协议**：`tool_use` / `tool_result`，不是 OpenAI 的 `tool_calls` / function calling

SDK 读取环境变量（`ANTHROPIC_API_KEY`、`ANTHROPIC_BASE_URL`、`ANTHROPIC_MODEL`），然后以 Anthropic 协议格式发起 HTTP 请求。没有适配层——协议是写死在二进制文件里的。

## 为什么不能简单去掉过滤器

选项 1 看起来很简单：去掉 `useAgentModelFilter` 的白名单过滤。但这会让事情变得更糟：

- 你的 OpenAI Compatible provider 会出现在下拉菜单中
- 你会选中它，以为能用
- 运行时会报 4xx 错误或响应解析失败
- 你会怪 Cherry Studio 有 "bug"，实际上这是协议不匹配

过滤器是 UX 安全网。它防止你选择一个肯定会失败的选项。

## 实际可行的方案

如果你想在 Agent 模式下使用非 Anthropic 的 LLM，你需要一个实现了 Anthropic Messages 协议的 provider。已经有几个服务做到了：

- **OpenRouter**：有 `anthropic-messages` endpoint
- **GLM（智谱）**：提供 Anthropic 兼容的 endpoint
- **SiliconFlow**：支持 Anthropic 协议
- **BigModel**：另一个 Anthropic 兼容选项

工作流程：

1. 选择一个支持 Anthropic Messages 协议的 provider
2. 在 Cherry Studio 中配置 `endpointConfigs['anthropic-messages']`
3. 过滤器会自动放行

`agentSessionWarmup.ts` 中的 `resolveAnthropicBaseUrl` 函数会使用你 provider 的 `anthropic-messages` endpoint baseUrl，如果没有设置则 fallback 到 `provider.apiHost`。

## 长期解决方案

如果 Cherry Studio 想要原生支持 OpenAI Agent，只有一条干净的路径：

**新增 `OpenAIRuntimeDriver`**——一个独立的 runtime driver，使用 `@ai-sdk/openai-compatible` 实现完整的 Agent 能力。

这需要：

1. 新增 `OpenAIRuntimeDriver`（参考 `ClaudeCodeRuntimeDriver.ts` 的结构）
2. 扩展 `AgentType` 枚举：`['claude-code', 'openai-code']`
3. 在 `runtimeDriverRegistry` 注册新 driver
4. 更新 `useAgentModelFilter`，按 agent 类型选择不同白名单
5. 新增 UI 选项让用户选择 agent 后端类型
6. i18n、测试、文档

另一个选项——Anthropic 和 OpenAI 之间的协议转换 adapter——听起来诱人，但是维护噩梦。Tool 协议双向转换有语义损失，流式 SSE 转换需要处理 chunk 边界，每个边界情况都需要测试。

## 短期建议

目前最好的路径：

1. 使用一个实现了 Anthropic Messages 协议的 provider
2. 在 `endpointConfigs` 中配置 `anthropic-messages`
3. 让过滤器做它的工作

不要对抗协议。约束不在 UI 层——在 SDK 层。

## 关键文件

| 文件 | 作用 |
|------|------|
| `useAgentModelFilter.ts` | Agent 模式 model 过滤（白名单逻辑） |
| `ClaudeCodeRuntimeDriver.ts` | Claude Agent SDK 入口 |
| `runtimeDriverRegistry.ts` | Runtime driver 注册表 |
| `listModels.ts` | 模型列表获取（多 fetcher 策略） |
| `agent.ts` | AgentType enum 定义 |
| `agentSessionWarmup.ts` | 环境变量注入与 baseUrl 解析 |
