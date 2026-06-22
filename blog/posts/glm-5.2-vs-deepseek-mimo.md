---
title: GLM 5.2 vs DeepSeek V4 Pro vs MiMo v2.5 Pro — When 99% Cache Hit Rate Meets 60x Pricing
titleZh: 99% 缓存命中率遇上 60 倍定价：GLM 5.2 划算吗？
date: 2026-06-14
excerpt: GLM 5.2 hits a measured 99% cache hit rate, but priced like GLM 5.1 it still costs 8x as much as DeepSeek even with that edge.
excerptZh: GLM 5.2 实测缓存命中率达到 99%，但按 GLM 5.1 的定价来算，即使命中率碾压对手，总费用仍然是 DeepSeek 的 8 倍。
tags: AI, GLM, DeepSeek, MiMo, API, Pricing, Cache
---

<!-- lang: en -->

The first two articles in this series compared MiMo Token Plan against DeepSeek V4 Flash, and MiMo v2.5 Pro against DeepSeek V4 Pro on a pay-as-you-go basis. The takeaway was straightforward: when unit prices are equal, higher cache hit rates always win.

Now there's a new contender. Zhipu's GLM 5.2 is already in beta, and measured cache hit rates hit `99%`—far above DeepSeek's `95.19%` and MiMo's `90.86%`.

GLM 5.2 pricing hasn't been officially announced yet. But what if we plug in GLM 5.1 rates as a proxy? Can a 99% cache hit rate offset a much higher unit price?

## Pay-As-You-Go Pricing Across All Three Pro Models

As of June 2026, here's what the Pro-tier models cost domestically:

```text
                  Cache Hit         Cache Miss         Output
                  (¥/million)       (¥/million)       (¥/million)
GLM-5.1 (est.)     ~1.5              6                 24
DeepSeek V4 Pro     0.025             3                  6
MiMo v2.5 Pro       0.025             3                  6
```

GLM-5.1 input and output prices are `2×` and `4×` those of DeepSeek/MiMo respectively. The cache hit price gap is even larger: **GLM charges around ¥1.5, while DeepSeek and MiMo charge just ¥0.025—a 60× difference**.

That 60× cache hit price gap is the central tension of this entire analysis.

## Same Workload, But Does 99% Hit Rate Help?

Using the same data from the previous articles—June 8 peak-day volumes sustained over 30 days—total input and output remain constant, only the cache hit rates change:

```text
GLM 5.2 (99% cache hit rate):
  Cache hit input:  31,616,129
  Cache miss input:    319,355
  Output:              168,200

DeepSeek V4 Pro (95.19%):
  Cache hit input:  30,398,592
  Cache miss input: 1,536,892
  Output:             168,200

MiMo v2.5 Pro (90.86%):
  Cache hit input:  29,017,126
  Cache miss input: 2,918,358
  Output:             168,200
```

GLM's 99% hit rate is genuinely dominant—cache-miss tokens are just 1/5 of DeepSeek's and 1/9 of MiMo's. But here's the catch: for every cache-miss token, GLM charges 2× DeepSeek (6 vs 3), and for every cache-hit token, GLM charges **60×** DeepSeek (1.5 vs 0.025).

## Monthly Cost Comparison: Pay-As-You-Go

```text
GLM 5.2 pay-as-you-go:
  Cache hit:     31.62M × 1.5   =  47.42 yuan
  Cache miss:     0.32M × 6      =   1.91 yuan
  Output:         0.17M × 24     =   4.03 yuan
  Daily total:                      53.36 yuan/day
  Monthly total:                 1,600.88 yuan

DeepSeek V4 Pro pay-as-you-go:
  Cache hit:     30.40M × 0.025 =   0.76 yuan
  Cache miss:     1.54M × 3      =   4.62 yuan
  Output:         0.17M × 6      =   1.01 yuan
  Daily total:                       6.39 yuan/day
  Monthly total:                   191.64 yuan

MiMo v2.5 Pro pay-as-you-go:
  Cache hit:     29.01M × 0.025 =   0.73 yuan
  Cache miss:     2.92M × 3      =   8.76 yuan
  Output:         0.17M × 6      =   1.01 yuan
  Daily total:                      10.50 yuan/day
  Monthly total:                   314.85 yuan
```

```chart
{
  "title": "Pro Model Monthly Costs at Equal Workload",
  "unit": "yuan/month",
  "max": 1620,
  "items": [
    {"label": "GLM 5.2 (99% cache)", "value": 1600.88, "display": "1,600.88", "tone": "red"},
    {"label": "MiMo v2.5 Pro", "value": 314.85, "display": "314.85", "tone": "orange"},
    {"label": "DeepSeek V4 Pro", "value": 191.64, "display": "191.64", "tone": "blue"}
  ],
  "caption": "A 99% cache hit rate doesn't save GLM's total bill. GLM costs 8.3× more than DeepSeek and 5.1× more than MiMo."
}
```

**GLM costs `1,409 yuan/month` more than DeepSeek—8.3× as much.**

This is counterintuitive. GLM has the highest cache hit rate (99%), the fewest cache misses, yet the highest total bill. The reason is simple: GLM's cache hit price (¥1.5/M) is 60× DeepSeek's (¥0.025/M). Those 99% of tokens each cost more, the remaining 1% cost more, and the output portion is 4× higher. There isn't a single line item where GLM is cheaper.

## Why a 60× Price Gap Can't Be Offset by Hit Rate

Cache hit rate optimization only reduces the proportion of missed tokens. But GLM's problem isn't on the miss side—that's just 1%, and even if it were free, savings would be negligible. The problem is on the hit side: 99% of input tokens each cost ¥1.475 more than DeepSeek.

```text
GLM cost per 100 input tokens:
  99.0 × 1.5 + 1.0 × 6 = 148.5 + 6 = 154.5

DeepSeek cost per 100 input tokens:
  95.19 × 0.025 + 4.81 × 3 = 2.38 + 14.43 = 16.81

MiMo cost per 100 input tokens:
  90.86 × 0.025 + 9.14 × 3 = 2.27 + 27.42 = 29.69
```

GLM's input cost per 100 tokens is 154.5, DeepSeek's is 16.81, and MiMo's is 29.69. GLM's cache-hit portion alone (148.5) exceeds the total cost of either competitor.

> Cache hit rate optimization reduces "how much of the most expensive component you pay." But if the most expensive component is already cheaper elsewhere, no hit rate can save you.

## Back-Calculating: What Cache Price Would GLM Need to Break Even?

Assuming GLM's miss price (¥6) and output price (¥24) stay unchanged, what cache hit price would make GLM's monthly total match DeepSeek's?

```text
GLM daily cost = DeepSeek daily cost
31.616M × X + 0.319M × 6 + 0.17M × 24 = 6.39
31.616X + 1.91 + 4.03 = 6.39
31.616X = 0.45
X = ¥0.014 / million tokens
```

The cache hit price would need to drop to `¥0.014/M`—even lower than DeepSeek's ¥0.025. Because GLM's miss and output prices are both higher, the cache price must be even lower to close the gap. That's nearly impossible under the current pricing structure.

## But Coding Plan Could Change Everything

All the numbers above are API pay-as-you-go. Zhipu runs a parallel system: **GLM Coding Plan**, a flat monthly subscription charged per prompt count.

```text
Lite:  ¥49/month    80 prompts/5h     400 prompts/week
Pro:   ¥149/month   400 prompts/5h    2,000 prompts/week
Max:   ¥469/month   1,600 prompts/5h  8,000 prompts/week
```

According to industry analysis, Coding Plan quota converts to API pricing as **15–30× the subscription fee**. But there's a catch: GLM-5/5.1 consumes quota at **3×** during peak hours and **2×** off-peak.

Using the June 8 workload of 528 API calls as a baseline: assuming 1 prompt ≈ 15 underlying model calls, plus GLM-5's 2× multiplier, daily consumption works out to roughly 70 prompts, or about 2,100 prompts per month.

```chart
{
  "title": "Monthly Cost Under Three Billing Models",
  "unit": "yuan/month",
  "max": 1620,
  "items": [
    {"label": "GLM-5.1 API pay-as-you-go", "value": 1600.88, "display": "1,600.88", "tone": "red"},
    {"label": "DeepSeek V4 Pro pay-as-you-go", "value": 191.64, "display": "191.64", "tone": "blue"},
    {"label": "GLM Pro plan (¥149)", "value": 149, "display": "149.00", "tone": "green"},
    {"label": "GLM Max plan (¥469)", "value": 469, "display": "469.00", "tone": "green"},
    {"label": "MiMo v2.5 Pro pay-as-you-go", "value": 314.85, "display": "314.85", "tone": "orange"}
  ],
  "caption": "On pay-as-you-go API, GLM is most expensive. Under Coding Plan subscriptions, GLM could actually be the cheapest option."
}
```

If usage fits within the quota, a Pro plan at ¥149 covers an equivalent API value of roughly ¥2,235–4,470—a 15–30× effective discount. Here's the full picture:

| Billing Model       | Monthly Cost | Equivalent API Value |
|---------------------|-------------|---------------------|
| GLM-5.1 API pay-as-you-go | ¥1,601 | ¥1,601 |
| DeepSeek V4 Pro pay-as-you-go | ¥192 | ¥192 |
| GLM Pro plan | ¥149 | ¥2,235–4,470 |
| GLM Max plan | ¥469 | ¥7,035–14,070 |
| MiMo v2.5 Pro pay-as-you-go | ¥315 | ¥315 |

On pay-as-you-go API, GLM is the most expensive. Under Coding Plan subscriptions, GLM could be the cheapest option of all.

## But Plans Aren't a Silver Bullet

The cheap pricing of Coding Plan comes with clear tradeoffs:

**GLM-5/5.1 quota multipliers.** Peak consumption at 3× and off-peak at 2× mean the Max plan's nominal 1,600 prompts/5h drops to just 533–800 prompts/5h when running GLM-5.1. Once quota runs out, the session stops—it doesn't automatically fall back to billing your account balance.

**Weekly quota ceilings.** The Max plan caps at 8,000 prompts per week, or about 1,143 per day. Run 30 complex tasks in a day, each consuming 30+ prompts, and you'll hit the wall mid-week.

**Model restrictions.** Only the Max plan supports GLM-5/5.1. Lite and Pro are limited to GLM-4.7, which lags significantly behind GLM-5.1 in coding capability.

So the "15–30× discount" holds only under specific conditions: your usage fits snugly within quota without overflow, you're running non-GLM-5 models off-peak, or you're willing to absorb GLM-5's multiplier penalty.

## What If GLM 5.2 Prices Drop Significantly?

GLM 5.2 pricing is still pending. If Zhipu chooses to align with DeepSeek/MiMo's pricing tier (0.025/3/6), the picture changes entirely:

```text
GLM 5.2 at same price (0.025/3/6) + 99% cache hit rate:
  Cache hit:     31.62M × 0.025 =   0.79 yuan/day
  Cache miss:     0.32M × 3      =   0.96 yuan/day
  Output:         0.17M × 6      =   1.01 yuan/day
  Daily total:                       2.76 yuan/day
  Monthly total:                     82.75 yuan
```

```chart
{
  "title": "If GLM 5.2 Matches DeepSeek/MiMo Pricing",
  "unit": "yuan/month",
  "max": 320,
  "items": [
    {"label": "GLM 5.2 (same price + 99% cache)", "value": 82.75, "display": "82.75", "tone": "green"},
    {"label": "DeepSeek V4 Pro (95.19%)", "value": 191.64, "display": "191.64", "tone": "blue"},
    {"label": "MiMo v2.5 Pro (90.86%)", "value": 314.85, "display": "314.85", "tone": "orange"}
  ],
  "caption": "If prices align, a 99% cache hit rate would make GLM 5.2 the cheapest of the three—roughly half of DeepSeek and a quarter of MiMo."
}
```

At identical unit prices, a 99% cache hit rate makes GLM 5.2 the cheapest option: ¥83/month, just 43% of DeepSeek and 26% of MiMo. The conclusion from the first two articles—"cache hit rate is the sole deciding factor"—would fully play out here.

## So It All Comes Down to Pricing

Three scenarios, three completely different conclusions:

**Scenario 1: GLM 5.2 keeps 5.1 pricing.**
Most expensive on pay-as-you-go API (¥1,601/month). Coding Plan subscriptions could be cheapest (¥149–469/month). A 99% cache hit rate can't save an expensive unit price on a pay-as-you-go basis.

**Scenario 2: GLM 5.2 drops prices to match DeepSeek/MiMo.**
99% cache hit rate becomes a crushing advantage. Pay-as-you-go monthly cost drops to ¥83—potentially the cheapest of all three.

**Scenario 3: GLM 5.2 drops prices + Coding Plan adjusts.**
If subscription prices stay flat but quotas expand significantly (because unit costs fell), Coding Plan becomes the clear value leader.

While waiting for GLM 5.2 pricing, here's a framework worth keeping in mind:

> **Pay-as-you-go comes down to unit price. Subscriptions come down to quota. Cache hit rate amplifies whichever advantage or disadvantage exists, but it doesn't change the underlying pricing structure itself.**

## Data and References

- Workload data: Same peak-day volume from DeepSeek on June 8, used in the previous two articles.
- GLM-5.1 pricing: Based on ofox.ai's domestic API pricing compilation (input ¥6/M, output ¥24/M). Cache hit price estimated at ¥1.5/M, converted from Z.AI's overseas rate of $0.26/MTok. GLM 5.2 pricing has not been announced; this article uses 5.1 pricing as a reference.
- DeepSeek V4 Pro pricing: Official pricing following the permanent price cut on May 22, 2026. See [DeepSeek Models and Pricing](https://api-docs.deepseek.com/quick_start/pricing).
- MiMo v2.5 Pro pricing: Official pricing following the permanent price cut on May 27, 2026.
- GLM Coding Plan pricing: Post-price-increase subscription tiers as of February 12, 2026.
- "1 Prompt ≈ 15 model calls": Conversion figure from Tencent Cloud Developer Community.
- "Quota converts to 15–30× the subscription fee at API pricing": From a cnblogs developer analysis.
- Previous article: [Same Unit Price, Cache Hit Rate Is the Only Factor](/blog/mimo-v2.5-pro-vs-deepseek-v4-pro.html)
- First article: [Is the 39-yuan MiMo Token Plan Really Cheaper Than DeepSeek V4 Flash?](/blog/mimo-token-plan-vs-deepseek-v4-flash.html)

<!-- lang: zh -->

前两篇文章分别比较了 MiMo Token Plan 与 DeepSeek V4 Flash、MiMo v2.5 Pro 与 DeepSeek V4 Pro 的按量成本。结论是：单价相同时，缓存命中率更高的平台永远更便宜。

但国产大模型赛道又来了一位新选手。智谱的 GLM 5.2 已经可以试用，实测缓存命中率达到 `99%`——远超 DeepSeek 的 `95.19%` 和 MiMo 的 `90.86%`。

GLM 5.2 的定价还没有正式公布。但如果参考 GLM 5.1 的价格，结果会怎样？更高的缓存命中率，能否弥补更高的单价？

## 三家 Pro 模型的按量单价

截至 2026 年 6 月，三家 Pro 级模型的国内按量价格：

```text
                  缓存命中        缓存未命中       输出
                  (元/百万)       (元/百万)       (元/百万)
GLM-5.1 (估)      ~1.5             6              24
DeepSeek V4 Pro    0.025            3               6
MiMo v2.5 Pro      0.025            3               6
```

GLM-5.1 的输入和输出价格分别是 DeepSeek/MiMo 的 `2 倍` 和 `4 倍`。缓存命中价的差距更大：**GLM 约 ¥1.5，而 DeepSeek 和 MiMo 只要 ¥0.025——相差 60 倍**。

这个 60 倍的缓存命中价差距，是整篇文章的核心矛盾。

## 同样的用量，99% 命中率够不够？

沿用前两篇文章的数据——6 月 8 日峰值日用量，连续跑 30 天。总输入量和输出量不变，只替换缓存命中率：

```text
GLM 5.2（99% 缓存命中率）：
  缓存命中输入：31,616,129
  缓存未命中输入：319,355
  输出：168,200

DeepSeek V4 Pro（95.19%）：
  缓存命中输入：30,398,592
  缓存未命中输入：1,536,892
  输出：168,200

MiMo v2.5 Pro（90.86%）：
  缓存命中输入：29,017,126
  缓存未命中输入：2,918,358
  输出：168,200
```

GLM 的 99% 命中率确实碾压——缓存未命中的 token 只有 DeepSeek 的 1/5、MiMo 的 1/9。但问题在于，每多一个未命中的 token，GLM 收费是 DeepSeek 的 2 倍（6 vs 3）；而每多一个命中的 token，GLM 收费是 DeepSeek 的 **60 倍**（1.5 vs 0.025）。

## 按量月费对比

```text
GLM 5.2 按量：
  缓存命中：31.62M × 1.5   = 47.42 元
  缓存未命中：0.32M × 6     =  1.91 元
  输出：0.17M × 24           =  4.03 元
  合计：                      53.36 元/天
  月度合计：                1,600.88 元

DeepSeek V4 Pro 按量：
  缓存命中：30.40M × 0.025  =  0.76 元
  缓存未命中：1.54M × 3     =  4.62 元
  输出：0.17M × 6            =  1.01 元
  合计：                       6.39 元/天
  月度合计：                  191.64 元

MiMo v2.5 Pro 按量：
  缓存命中：29.01M × 0.025  =  0.73 元
  缓存未命中：2.92M × 3     =  8.76 元
  输出：0.17M × 6            =  1.01 元
  合计：                      10.50 元/天
  月度合计：                  314.85 元
```

```chart
{
  "title": "同用量下的 Pro 模型按量月费",
  "unit": "元/月",
  "max": 1620,
  "items": [
    {"label": "GLM 5.2 (99% cache)", "value": 1600.88, "display": "1,600.88", "tone": "red"},
    {"label": "MiMo v2.5 Pro", "value": 314.85, "display": "314.85", "tone": "orange"},
    {"label": "DeepSeek V4 Pro", "value": 191.64, "display": "191.64", "tone": "blue"}
  ],
  "caption": "99% 的缓存命中率没有拯救 GLM 的总费用。GLM 比 DeepSeek 贵 8.3 倍，比 MiMo 贵 5.1 倍。"
}
```

**GLM 比 DeepSeek 贵 `1,409 元/月`，是 DeepSeek 的 8.3 倍。**

这是反直觉的：GLM 的缓存命中率最高（99%），缓存未命中最少，但总费用却最贵。原因很简单——GLM 的缓存命中价（¥1.5/M）是 DeepSeek（¥0.025/M）的 60 倍。99% 的 token 每个都在多花钱，剩下 1% 的未命中也在多花钱，输出部分更是 4 倍。没有任何一项 GLM 更便宜。

## 为什么 60 倍的缓存价差无法被命中率弥补

缓存命中率能优化的，只是未命中部分的比例。但 GLM 的问题不在未命中部分——那只有 1%，即使全免费也省不了多少。问题在命中部分：占总输入 99% 的 token，每个都比 DeepSeek 贵 ¥1.475。

```text
GLM 5.2 每 100 个输入 token 的成本：
  99.0 × 1.5 + 1.0 × 6 = 148.5 + 6 = 154.5

DeepSeek 每 100 个输入 token 的成本：
  95.19 × 0.025 + 4.81 × 3 = 2.38 + 14.43 = 16.81

MiMo 每 100 个输入 token 的成本：
  90.86 × 0.025 + 9.14 × 3 = 2.27 + 27.42 = 29.69
```

GLM 每 100 个 token 的输入成本是 154.5，DeepSeek 是 16.81，MiMo 是 29.69。GLM 的命中部分成本（148.5）就远远超过了另外两家的总成本。

> 缓存命中率优化的是"最贵的部分占多少"，但如果"最贵的部分"本身就是别人最便宜的部分，命中率再高也没用。

## 反算：GLM 缓存价要降到多少才能追平？

假设 GLM 的未命中价（¥6）和输出价（¥24）不变，缓存命中价需要降到多少，才能让月度总费用追平 DeepSeek？

```text
GLM 日费用 = DeepSeek 日费用
31.616M × X + 0.319M × 6 + 0.17M × 24 = 6.39
31.616X + 1.91 + 4.03 = 6.39
31.616X = 0.45
X = ¥0.014 / 百万 tokens
```

缓存命中价需要降到 `¥0.014/M`——甚至比 DeepSeek 的 ¥0.025 还低。考虑到 GLM 的未命中价和输出价都比 DeepSeek 贵，缓存价必须更低才能填坑。这在当前定价体系下几乎不可能。

## 但 Coding Plan 可能改变一切

上面算的都是 API 按量。智谱还有另一套体系：**GLM Coding Plan**，按 prompt 次数收取固定月费。

```text
Lite：¥49/月    80 prompts/5h     每周 400 prompts
Pro：¥149/月    400 prompts/5h    每周 2,000 prompts
Max：¥469/月    1,600 prompts/5h  每周 8,000 prompts
```

根据行业分析，Coding Plan 的额度按 API 定价折算，**相当于月订阅费用的 15～30 倍**。但有一个关键变量：GLM-5/5.1 在高峰时段消耗 **3 倍** 额度，非高峰消耗 **2 倍**。

用 6 月 8 日的 528 次 API 调用来估算：假设 1 prompt ≈ 15 次底层调用，加上 GLM-5 的 2 倍倍率，日均消耗约 70 prompts，月度约 2,100 prompts。

```chart
{
  "title": "三种计费方式下的月度费用",
  "unit": "元/月",
  "max": 1620,
  "items": [
    {"label": "GLM-5.1 API 按量", "value": 1600.88, "display": "1,600.88", "tone": "red"},
    {"label": "DeepSeek V4 Pro 按量", "value": 191.64, "display": "191.64", "tone": "blue"},
    {"label": "GLM Pro 套餐 (¥149)", "value": 149, "display": "149.00", "tone": "green"},
    {"label": "GLM Max 套餐 (¥469)", "value": 469, "display": "469.00", "tone": "green"},
    {"label": "MiMo v2.5 Pro 按量", "value": 314.85, "display": "314.85", "tone": "orange"}
  ],
  "caption": "API 按量下 GLM 最贵；但 Coding Plan 套餐制下，GLM 反而可能最便宜。"
}
```

如果用量能塞进套餐配额，Pro 套餐 ¥149 覆盖的 API 价值约为 ¥2,235～4,470——等效折扣 15～30 倍。这意味着：

| 计费方式 | 月费用 | 等效 API 价值 |
|---------|--------|-------------|
| GLM-5.1 API 按量 | ¥1,601 | ¥1,601 |
| DeepSeek V4 Pro 按量 | ¥192 | ¥192 |
| GLM Pro 套餐 | ¥149 | ¥2,235～4,470 |
| GLM Max 套餐 | ¥469 | ¥7,035～14,070 |
| MiMo v2.5 Pro 按量 | ¥315 | ¥315 |

API 按量下 GLM 最贵；但 Coding Plan 套餐制下，GLM 反而可能是最便宜的选项。

## 但套餐不是万能的

Coding Plan 的便宜有明确的代价：

**GLM-5/5.1 的倍率惩罚**。高峰期 3 倍、非峰 2 倍的额度消耗，意味着 Max 套餐名义 1,600 prompts/5h，实际跑 GLM-5.1 只有 533～800 prompts/5h。额度用完即停，不会自动切到账户余额继续扣费。

**周额度上限**。Max 套餐每周 8,000 prompts，换算到每天约 1,143 prompts。如果一天跑 30 个复杂任务、每个消耗 30+ prompts，周中就可能撞墙。

**模型限制**。Max 套餐才能用 GLM-5/5.1，Lite 和 Pro 只支持 GLM-4.7。而 GLM-4.7 的编程能力和 GLM-5.1 差距不小。

所以 Coding Plan 的"15～30 倍折扣"是在特定条件下成立的：使用量刚好填满配额但不溢出，用的是高峰时段之外的非 GLM-5 模型，或者能接受 GLM-5 的倍率惩罚。

## 如果 GLM 5.2 大幅降价呢？

GLM 5.2 的定价还没有出来。如果智谱选择对齐 DeepSeek/MiMo 的价格带（0.025/3/6），情况会完全不同：

```text
GLM 5.2 同价（0.025/3/6）+ 99% 缓存命中率：
  缓存命中：31.62M × 0.025 =  0.79 元/天
  缓存未命中：0.32M × 3    =  0.96 元/天
  输出：0.17M × 6           =  1.01 元/天
  合计：                       2.76 元/天
  月度合计：                   82.75 元
```

```chart
{
  "title": "如果 GLM 5.2 对齐 DeepSeek/MiMo 价格",
  "unit": "元/月",
  "max": 320,
  "items": [
    {"label": "GLM 5.2 (同价 + 99% cache)", "value": 82.75, "display": "82.75", "tone": "green"},
    {"label": "DeepSeek V4 Pro (95.19%)", "value": 191.64, "display": "191.64", "tone": "blue"},
    {"label": "MiMo v2.5 Pro (90.86%)", "value": 314.85, "display": "314.85", "tone": "orange"}
  ],
  "caption": "如果定价对齐，99% 缓存命中率会让 GLM 5.2 成为三者中最便宜的——大约是 DeepSeek 的一半、MiMo 的四分之一。"
}
```

同样的单价下，99% 的缓存命中率会让 GLM 5.2 成为三者中最便宜的：月费 ¥83，是 DeepSeek 的 43%、MiMo 的 26%。前两篇文章的结论——"缓存命中率是唯一的胜负手"——在这里会完全应验。

## 所以答案取决于定价

三种场景，三个完全不同的结论：

**场景一：GLM 5.2 沿用 5.1 定价**
API 按量最贵（¥1,601/月），Coding Plan 套餐可能最便宜（¥149～469/月）。99% 的缓存命中率无法在按量场景下拯救高昂的单价。

**场景二：GLM 5.2 大幅降价对齐 DeepSeek/MiMo**
99% 缓存命中率成为碾压优势，按量月费低至 ¥83，可能是三家中最便宜的。

**场景三：GLM 5.2 降价 + Coding Plan 调整**
如果套餐价格不变但额度大幅增加（因为单价降低），Coding Plan 会变成真正的性价比之王。

在等 GLM 5.2 定价公布的这段时间里，有一个判断框架可以先记住：

> **API 按量看单价，套餐订阅看额度。缓存命中率放大单价的优势或劣势，但不改变定价结构本身。**

## 数据与参考

- 用量数据：沿用前两篇文章中 DeepSeek 6 月 8 日的峰值日用量。
- GLM-5.1 价格：基于 ofox.ai 整理的国内 API 定价（输入 ¥6/M，输出 ¥24/M），缓存命中价根据 Z.AI 海外价 $0.26/MTok 折算约 ¥1.5/M。GLM 5.2 定价未公布，本文使用 5.1 价格作为参考。
- DeepSeek V4 Pro 价格：2026 年 5 月 22 日永久降价后的官方定价，详见 [DeepSeek 模型与价格](https://api-docs.deepseek.com/quick_start/pricing)。
- MiMo v2.5 Pro 价格：2026 年 5 月 27 日永久降价后的官方定价。
- GLM Coding Plan 价格：2026 年 2 月 12 日涨价后的国内版套餐价格。
- "1 Prompt ≈ 15 次模型调用"：腾讯云开发者社区的换算。
- "额度按 API 定价折算，相当于月订阅费用的 15～30 倍"：博客园开发者对比分析。
- 上一篇文章：[单价完全一样，缓存命中率就是唯一的胜负手](/blog/mimo-v2.5-pro-vs-deepseek-v4-pro.html)
- 第一篇文章：[39 元的 MiMo Token Plan，真的比 DeepSeek V4 Flash 划算吗？](/blog/mimo-token-plan-vs-deepseek-v4-flash.html)
