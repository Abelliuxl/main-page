---
title: OpenCode Go's Three New Models — GLM 5.2 vs Kimi K2.7 Code vs MiniMax M3
titleZh: OpenCode Go 三大新模型：GLM 5.2 vs Kimi K2.7 Code vs MiniMax M3
date: 2026-06-18
excerpt: GLM 5.2, Kimi K2.7 Code, and MiniMax M3 all landed on OpenCode Go in mid-June. Same $10/month plan, wildly different limits.
excerptZh: GLM 5.2、Kimi K2.7 Code、MiniMax M3 三款模型六月中旬先后上架 OpenCode Go，同样 $10/月，可用额度差距巨大。
tags: AI, OpenCode, GLM, Kimi, MiniMax, Pricing
---

<!-- lang: en -->

Three models landed on OpenCode Go within the same week in mid-June 2026: Kimi K2.7 Code (June 12), GLM 5.2 (June 13), and MiniMax M3 (June 1). All three are open-weight, all three are on the same $10/month plan ($5 first month), and the limits vary dramatically.

## The Rate Limits

OpenCode Go's limits are defined in dollar amounts: $12 per 5 hours, $30 per week, $60 per month. Since each model has a different per-token price, the same dollar budget buys a very different number of requests.

```text
                    Per 5h     Per Week    Per Month
GLM-5.2               880       2,150       4,300
Kimi K2.7 Code      1,350       4,630       9,250
MiniMax M3          3,200       8,000      16,000
```

MiniMax M3 gets **3.7× more monthly requests** than GLM 5.2, and **1.7× more** than Kimi K2.7 Code. The reason is straightforward: M3 is far cheaper per token, so the same dollar budget stretches further.

```chart
{
  "title": "OpenCode Go Monthly Request Limits",
  "unit": "requests/month",
  "max": 16500,
  "items": [
    {"label": "MiniMax M3", "value": 16000, "display": "16,000", "tone": "green"},
    {"label": "Kimi K2.7 Code", "value": 9250, "display": "9,250", "tone": "blue"},
    {"label": "GLM-5.2", "value": 4300, "display": "4,300", "tone": "orange"}
  ],
  "caption": "Same $10/month plan. M3 gets 3.7× the monthly requests of GLM 5.2."
}
```

## Per-Token Pricing

The limits are driven by these per-token rates:

```text
                    Input/1M    Output/1M    Cache Read/1M
GLM-5.2              $1.40       $4.40         $0.26
Kimi K2.7 Code       $0.95       $4.00         $0.19
MiniMax M3           $0.30       $1.20         $0.06
```

GLM 5.2's input price is **4.7×** M3's, and its output price is **3.7×** M3's. Even Kimi K2.7 Code is over 3× M3 on input. M3 is in a completely different cost tier.

## Context Windows

Two of the three models support 1M-token context:

```text
GLM-5.2           1,000,000 tokens
MiniMax M3        1,000,000 tokens
Kimi K2.7 Code      256,000 tokens
```

If your workflow involves large codebases or long-horizon agent sessions, GLM 5.2 and M3 have a clear structural advantage. K2.7 Code's 256K is still substantial but 4× smaller.

## Typical Request Cost

OpenCode Go estimates these average token counts per request:

```text
GLM-5.2           700 input, 52,000 cache, 150 output
Kimi K2.7 Code    870 input, 55,000 cache, 200 output
MiniMax M3        510 input, 56,000 cache, 190 output
```

Despite having the largest context window, GLM 5.2 has the smallest average input tokens per request (700 vs 870 for K2.7 Code). This suggests GLM 5.2 users may be running shorter, more targeted queries—possibly because hitting the 880 req/5h limit forces efficiency.

## Special Notes

**MiniMax M3** currently has a **3× usage bonus** for a limited time, meaning its effective limits are even higher than shown above.

**Kimi K2.7 Code** claims a ~30% reduction in thinking-token usage compared to K2.6, which means each request consumes fewer tokens and the effective request count may be higher in practice.

**GLM 5.2** is the newest of the three (released June 13) and the most expensive on the plan. Its 1M context with IndexShare architecture is designed specifically for long-horizon engineering tasks.

## Which One to Pick?

| Use Case | Best Pick |
|---|---|
| High-volume daily coding | **MiniMax M3** — 16,000 req/month, cheapest per token |
| Long-horizon agent tasks, large codebase | **GLM 5.2** — 1M context, but 4,300 req/month cap |
| Coding-specific, token-efficient | **Kimi K2.7 Code** — 30% fewer thinking tokens, 9,250 req/month |
| Mixed workload | GLM 5.2 for hard problems, M3 for everything else |

The fundamental tradeoff is simple: **GLM 5.2 is the most capable but the tightest on limits. M3 is the most generous but the least "premium." K2.7 Code sits in the middle.**

## Data and References

- Rate limits and pricing: [OpenCode Go Documentation](https://opencode.ai/docs/go) (official, accessed June 18, 2026)
- GLM 5.2 technical report: [Z.AI Blog](https://z.ai/blog/glm-5.2)
- Kimi K2.7 Code release: [Kimi Resources](https://www.kimi.com/resources/kimi-k2-7-code)
- MiniMax M3 launch: June 1, 2026
- All models available on OpenCode Go as of June 18, 2026

<!-- lang: zh -->

三款模型在 2026 年 6 月中旬先后上架 OpenCode Go：Kimi K2.7 Code（6 月 12 日）、GLM 5.2（6 月 13 日）、MiniMax M3（6 月 1 日）。都是开源权重模型，都在同一个 $10/月的订阅计划里（首月 $5），但可用额度差距巨大。

## 使用限额

OpenCode Go 的限额按美元额度定义：每 5 小时 $12、每周 $30、每月 $60。由于每个模型的 token 单价不同，同样的美元预算能支撑的请求数量完全不同。

```text
                    每 5h      每周        每月
GLM-5.2               880      2,150       4,300
Kimi K2.7 Code      1,350      4,630       9,250
MiniMax M3          3,200      8,000      16,000
```

MiniMax M3 的每月请求数是 GLM 5.2 的 **3.7 倍**，是 Kimi K2.7 Code 的 **1.7 倍**。原因很直接：M3 的 token 单价便宜得多，同样的美元预算能跑更多请求。

```chart
{
  "title": "OpenCode Go 每月请求限额",
  "unit": "次/月",
  "max": 16500,
  "items": [
    {"label": "MiniMax M3", "value": 16000, "display": "16,000", "tone": "green"},
    {"label": "Kimi K2.7 Code", "value": 9250, "display": "9,250", "tone": "blue"},
    {"label": "GLM-5.2", "value": 4300, "display": "4,300", "tone": "orange"}
  ],
  "caption": "同样 $10/月，M3 的月请求量是 GLM 5.2 的 3.7 倍。"
}
```

## Token 单价

限额由以下单价决定：

```text
                    输入/百万    输出/百万    缓存读取/百万
GLM-5.2              $1.40       $4.40         $0.26
Kimi K2.7 Code       $0.95       $4.00         $0.19
MiniMax M3           $0.30       $1.20         $0.06
```

GLM 5.2 的输入价是 M3 的 **4.7 倍**，输出价是 **3.7 倍**。Kimi K2.7 Code 的输入价也是 M3 的 3 倍以上。M3 的成本完全在另一个量级。

## 上下文窗口

三款中有两款支持 100 万 token 上下文：

```text
GLM-5.2           1,000,000 tokens
MiniMax M3        1,000,000 tokens
Kimi K2.7 Code      256,000 tokens
```

如果你的工作流涉及大型代码库或长程 agent 任务，GLM 5.2 和 M3 有明显的结构优势。K2.7 Code 的 256K 也不小，但只有前两者的四分之一。

## 单次请求的典型 Token 消耗

OpenCode Go 估算的单次请求平均 token 数：

```text
GLM-5.2           700 输入, 52,000 缓存, 150 输出
Kimi K2.7 Code    870 输入, 55,000 缓存, 200 输出
MiniMax M3        510 输入, 56,000 缓存, 190 输出
```

尽管上下文窗口最大，GLM 5.2 的平均输入 token 数反而最少（700 vs K2.7 Code 的 870）。可能是因为 880 次/5h 的限额压力迫使用户更精打细算。

## 需要注意的事项

**MiniMax M3** 目前有限时 **3 倍额度加成**，实际可用限额比上表更高。

**Kimi K2.7 Code** 宣称比 K2.6 减少约 30% 的推理 token 消耗，意味着每次请求实际消耗更少，等效请求数可能更高。

**GLM 5.2** 是三者中最新发布的（6 月 13 日），也是计划内最贵的。其 1M 上下文搭配 IndexShare 架构，专门为长程工程任务设计。

## 怎么选？

| 场景 | 推荐 |
|---|---|
| 高频日常编程 | **MiniMax M3** — 16,000 次/月，单价最低 |
| 长程 agent、大型代码库 | **GLM 5.2** — 1M 上下文，但限额 4,300 次/月 |
| 编程专项、省 token | **Kimi K2.7 Code** — 推理 token 减少 30%，9,250 次/月 |
| 混合使用 | GLM 5.2 做困难任务，M3 做日常任务 |

核心取舍很简单：**GLM 5.2 能力最强但限额最紧，M3 额度最充裕但"最平民"，K2.7 Code 居中。**

## 数据与参考

- 限额与定价：[OpenCode Go 官方文档](https://opencode.ai/docs/go)（2026 年 6 月 18 日访问）
- GLM 5.2 技术报告：[Z.AI 博客](https://z.ai/blog/glm-5.2)
- Kimi K2.7 Code 发布：[Kimi 资源页](https://www.kimi.com/resources/kimi-k2-7-code)
- MiniMax M3 上线：2026 年 6 月 1 日
- 以上三款模型截至 2026 年 6 月 18 日均可在 OpenCode Go 中使用
