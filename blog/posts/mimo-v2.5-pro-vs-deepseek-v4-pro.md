---
title: When Both Sides Go Pro — Same Price, Different Cache Hit Rates
titleZh: 单价完全一样，缓存命中率就是唯一的胜负手
date: 2026-06-13
excerpt: MiMo v2.5 Pro and DeepSeek V4 Pro now charge identical per-token rates. The only thing separating their costs is cache hit rate.
excerptZh: MiMo v2.5 Pro 和 DeepSeek V4 Pro 现在单价完全相同，唯一拉开成本差距的变量就是缓存命中率。
tags: AI, MiMo, DeepSeek, API, Pricing, Cache
---

<!-- lang: en -->

The previous article compared MiMo Token Plan Lite against DeepSeek V4 Flash pay-as-you-go pricing, and the conclusion was that DeepSeek was the better deal. But that comparison had an obvious caveat: one side was using Flash while the other was on MiMo v2.5 — different per-token rates.

In late May, both providers rolled out major price cuts. Now, if we compare apples to apples — both using their respective Pro models, MiMo v2.5 Pro and DeepSeek V4 Pro — what does the picture look like?

## Per-Token Rates

As of June 2026, both Pro models charge identical domestic pay-as-you-go rates:

```text
              Cache Hit      Cache Miss      Output
              (CNY/M)        (CNY/M)         (CNY/M)
MiMo v2.5 Pro    0.025          3             6
DeepSeek V4 Pro  0.025          3             6
```

Not a single cent of difference. After MiMo matched the price cut on May 27, both providers are perfectly aligned across all three billing items: cache-hit input, cache-miss input, and output.

With identical per-token rates, the only variable left driving a cost difference is **cache hit rate**.

## Same Usage, Different Hit Rates

Carrying over the same data from the previous article — peak daily usage on June 8, extrapolated over 30 consecutive days:

```text
DeepSeek (95.19% cache hit rate):
  Cache hit input: 911,957,760
  Cache miss input: 46,106,760
  Output: 5,046,000

MiMo (90.86% cache hit rate):
  Cache hit input: 870,505,662
  Cache miss input: 87,558,858
  Output: 5,046,000
```

Total input volume is the same, but because MiMo's cache hit rate is 4.33 percentage points lower, it ends up with nearly double the cache-miss tokens.

## Pay-as-you-go Cost Comparison

Using the same per-token rates:

```text
DeepSeek V4 Pro pay-as-you-go:
  Cache hit: 911.96M × 0.025 =  22.80 CNY
  Cache miss: 46.11M × 3     = 138.32 CNY
  Output: 5.05M × 6           =  30.28 CNY
  Total:                       191.40 CNY/month

MiMo v2.5 Pro pay-as-you-go:
  Cache hit: 870.51M × 0.025 =  21.76 CNY
  Cache miss: 87.56M × 3     = 262.68 CNY
  Output: 5.05M × 6          =  30.28 CNY
  Total:                       314.72 CNY/month
```

```chart
{
  "title": "Pro Model Pay-as-you-go Monthly Cost at Same Usage",
  "unit": "CNY/month",
  "max": 320,
  "items": [
    {"label": "DeepSeek V4 Pro", "value": 191.40, "display": "191.40", "tone": "blue"},
    {"label": "MiMo v2.5 Pro", "value": 314.72, "display": "314.72", "tone": "orange"}
  ],
  "caption": "Identical per-token rates, yet MiMo costs 64% more — entirely due to a 4.33 percentage point gap in cache hit rate."
}
```

MiMo costs `123.32 CNY` more per month on pay-as-you-go — a 64% premium. This isn't a model quality issue; it's purely the cache hit rate gap.

## Can Token Plan Close the Gap?

MiMo v2.5 Pro Token Plan Credits pricing:

```text
Cache hit: 2.5 Credits / token
Cache miss: 300 Credits / token
Output: 600 Credits / token
```

At MiMo's 90.86% hit rate, monthly usage converts to:

```text
Cache hit: 870,505,662 × 2.5  =  2.176B
Cache miss: 87,558,858 × 300 = 26.268B
Output: 5,046,000 × 600       =  3.028B
Total:                          31.47B Credits
```

Matching against the four plan tiers:

```text
Lite: CNY 39, 4.1B Credits       ← Not enough
Standard: CNY 99, 11B Credits    ← Not enough
Pro: CNY 329, 38B Credits        ← Enough, with 6.53B left over
Max: CNY 659, 82B Credits        ← Way more than needed
```

The Pro tier at CNY 329 actually costs slightly more than pay-as-you-go at CNY 314.72 — because the plan quota has some built-in waste.

But here's the real question: if we could use the plan quota with zero waste, is the Token Plan discount enough to overcome the cache hit rate gap?

```text
Pay-as-you-go: 1M Credits = 0.01 CNY
Pro tier: 1M Credits = 329 / 38,000 = 0.00866 CNY
Discount: 13.4%
```

Token Plan saves 13.4% per credit. But because MiMo's cache hit rate is 4.33 points lower, its pay-as-you-go cost is 64.4% higher than DeepSeek's.

A 13.4% discount cannot plug a 64.4% hole.

## Full Calculation: Token Plan vs DeepSeek Pay-as-you-go

Let total monthly input be I (in millions of tokens), with output O = 0.005267 × I. Computing cost at each MiMo tier:

```text
Maximum monthly input each MiMo tier can cover:
  Lite (4.1B): I ≤ 124.8M    → DeepSeek pay-as-you-go 24.92 CNY < 39 CNY ✗
  Standard (11B): I ≤ 334.9M → DeepSeek pay-as-you-go 66.88 CNY < 99 CNY ✗
  Pro (38B): I ≤ 1,157.0M    → DeepSeek pay-as-you-go 231.05 CNY < 329 CNY ✗
  Max (82B): I ≤ 2,496.2M    → DeepSeek pay-as-you-go 498.38 CNY < 659 CNY ✗
```

```chart
{
  "title": "DeepSeek Pay-as-you-go Cost vs MiMo Tier Price at Each Tier's Max Usage",
  "unit": "CNY",
  "max": 660,
  "items": [
    {"label": "Lite Tier Price", "value": 39, "display": "39", "tone": "orange"},
    {"label": "Lite Max DS Cost", "value": 24.92, "display": "24.92", "tone": "blue"},
    {"label": "Pro Tier Price", "value": 329, "display": "329", "tone": "orange"},
    {"label": "Pro Max DS Cost", "value": 231.05, "display": "231.05", "tone": "blue"},
    {"label": "Max Tier Price", "value": 659, "display": "659", "tone": "orange"},
    {"label": "Max Max DS Cost", "value": 498.38, "display": "498.38", "tone": "blue"}
  ],
  "caption": "At each tier's maximum usage, DeepSeek pay-as-you-go still comes out cheaper. There is no crossover point."
}
```

Four tiers, four "not enough." No matter how high the monthly usage, MiMo Token Plan is always more expensive than DeepSeek pay-as-you-go.

## What Would It Take to Break Even?

Working backwards: how high would MiMo's cache hit rate need to be for Token Plan's effective cost to match DeepSeek pay-as-you-go?

```text
(303.16 - 297.5x) × 0.00866 ≤ 0.1997
x ≥ 94.15%
```

MiMo is currently at 90.86% — still **3.29 percentage points** short.

If we look at pay-as-you-go only (no Token Plan), the required hit rate is even higher:

```text
MiMo pay-as-you-go cost = DeepSeek pay-as-you-go cost
0.3285 × I = 0.1997 × I  →  Impossible — the coefficients are fixed
```

Pay-as-you-go can never break even — identical per-token rates but different hit-rate coefficients mean the two cost lines are parallel and diverging.

## Why 4 Percentage Points Matters So Much

Intuitively, 95% and 91% look similar. But cache-miss tokens cost **120 times** more than cache-hit tokens (3 vs 0.025). That means:

```text
DeepSeek cost per 100 input tokens:
  95.19 × 0.025 + 4.81 × 3 = 2.38 + 14.43 = 16.81

MiMo cost per 100 input tokens:
  90.86 × 0.025 + 9.14 × 3 = 2.27 + 27.42 = 29.69
```

DeepSeek's cache-miss cost is 14.43; MiMo's is 27.42 — a 13-point gap on this single line item alone. On the cache-hit side, DeepSeek actually spends 0.11 more (because it has more cache-hit tokens), but that's negligible compared to the miss-side gap.

> A 4 percentage point gap in cache hit rate essentially means the cache-miss volume doubles. And cache-miss is the most expensive part of the bill.

## The Bottom Line

**When per-token rates are identical, the platform with the higher cache hit rate is always cheaper. No usage volume can reverse this outcome.**

Both providers' costs are linear functions whose slopes are determined by cache hit rate. DeepSeek's slope is lower, so the two lines only diverge further as usage grows.

Token Plan's 13.4% discount cannot compensate for a 64.4% cost gap. MiMo's only path to closing the gap is raising its cache hit rate from 90.86% to above 94% — at which point not only would Token Plan win, but even pay-as-you-go would break even.

## Data and References

- Usage data: Peak daily usage from DeepSeek on June 8, carried over from the previous article.
- DeepSeek V4 Pro pricing: Official rates following the permanent price cut on May 22, 2026. See [DeepSeek Models & Pricing](https://api-docs.deepseek.com/quick_start/pricing).
- MiMo v2.5 Pro pricing: Official rates following the permanent price cut on May 27, 2026. See [MiMo V2.5 Price Adjustment Announcement](https://platform.xiaomimimo.com/static/docs/news/v2.5-price-update.md).
- MiMo Token Plan Credits pricing: [MiMo Token Plan Subscription & Credits Rules](https://platform.xiaomimimo.com/static/docs/price/tokenplan/subscription.md).
- Previous article: [Is MiMo Token Plan at CNY 39 Really a Better Deal Than DeepSeek V4 Flash?](/blog/mimo-token-plan-vs-deepseek-v4-flash.html)

<!-- lang: zh -->

上一篇文章比较了 MiMo Token Plan Lite 和 DeepSeek V4 Flash 按量，结论是 DeepSeek 更划算。但那篇文章有个前提：一边用 Flash，一边用 MiMo v2.5，单价不同。

5 月底两家都经历了大幅降价。现在如果两边都用各自的 Pro 模型——MiMo v2.5 Pro 和 DeepSeek V4 Pro——价格会怎样？

## 先看单价

截至 2026 年 6 月，两家 Pro 模型的国内按量价格完全一致：

```text
              缓存命中      缓存未命中      输出
              (元/百万)     (元/百万)      (元/百万)
MiMo v2.5 Pro    0.025          3             6
DeepSeek V4 Pro  0.025          3             6
```

一分钱都不差。MiMo 在 5 月 27 日跟进降价后，两家在缓存命中输入、未命中输入、输出三个计费项上完全对齐。

单价一样，那成本差异就只剩一个变量：**缓存命中率**。

## 同样的用量，不同的命中率

沿用上一篇文章的数据——6 月 8 日峰值日用量，按 30 天连续计算：

```text
DeepSeek（95.19% 缓存命中率）：
  缓存命中输入：911,957,760
  缓存未命中输入：46,106,760
  输出：5,046,000

MiMo（90.86% 缓存命中率）：
  缓存命中输入：870,505,662
  缓存未命中输入：87,558,858
  输出：5,046,000
```

总输入量相同，但因为 MiMo 的缓存命中率低 4.33 个百分点，缓存未命中的 token 多了将近一倍。

## 按量费用对比

用相同的单价计算：

```text
DeepSeek V4 Pro 按量：
  缓存命中：911.96M × 0.025 =  22.80 元
  缓存未命中：46.11M × 3     = 138.32 元
  输出：5.05M × 6            =  30.28 元
  合计：                      191.40 元/月

MiMo v2.5 Pro 按量：
  缓存命中：870.51M × 0.025 =  21.76 元
  缓存未命中：87.56M × 3    = 262.68 元
  输出：5.05M × 6           =  30.28 元
  合计：                     314.72 元/月
```

```chart
{
  "title": "同用量下的 Pro 模型按量月费",
  "unit": "元/月",
  "max": 320,
  "items": [
    {"label": "DeepSeek V4 Pro", "value": 191.40, "display": "191.40", "tone": "blue"},
    {"label": "MiMo v2.5 Pro", "value": 314.72, "display": "314.72", "tone": "orange"}
  ],
  "caption": "单价完全相同，MiMo 贵了 64%，全部来自缓存命中率的 4.33 个百分点差距。"
}
```

MiMo 按量比 DeepSeek 贵 `123.32 元`，贵了 64%。这不是模型的问题，纯粹是缓存命中率的差距。

## Token Plan 能扳回一局吗？

MiMo v2.5 Pro 的 Token Plan Credits 费率：

```text
缓存命中：2.5 Credits / token
缓存未命中：300 Credits / token
输出：600 Credits / token
```

按 MiMo 的 90.86% 命中率，月度用量换算成 Credits：

```text
缓存命中：870,505,662 × 2.5  =  2.176B
缓存未命中：87,558,858 × 300 = 26.268B
输出：5,046,000 × 600        =  3.028B
合计：                        31.47B Credits
```

对照四档套餐：

```text
Lite：39 元，4.1B Credits      ← 不够
Standard：99 元，11B Credits   ← 不够
Pro：329 元，38B Credits       ← 够用，剩余 6.53B
Max：659 元，82B Credits       ← 远超
```

Pro 套餐 329 元，比按量的 314.72 元还贵一点——因为套餐额度有浪费。

那换个角度：假设套餐额度能零浪费地用完，Token Plan 的折扣够不够填上缓存命中率的差距？

```text
按量：1M Credits = 0.01 元
Pro 套餐：1M Credits = 329 / 38,000 = 0.00866 元
折扣幅度：13.4%
```

Token Plan 每 Credit 便宜 13.4%。但因为缓存命中率低 4.33 个百分点，MiMo 的按量成本比 DeepSeek 贵 64.4%。

13.4% 的折扣填不上 64.4% 的坑。

## 从头算到尾：Token Plan vs DeepSeek 按量

设总月输入量为 I（百万 tokens），输出 O = 0.005267 × I。分别计算两家在不同档位下的成本：

```text
MiMo Token Plan 各档位能覆盖的最大月 input：
  Lite（4.1B）：I ≤ 124.8M    → DeepSeek 按量 24.92 元 < 39 元 ✗
  Standard（11B）：I ≤ 334.9M → DeepSeek 按量 66.88 元 < 99 元 ✗
  Pro（38B）：I ≤ 1,157.0M    → DeepSeek 按量 231.05 元 < 329 元 ✗
  Max（82B）：I ≤ 2,496.2M    → DeepSeek 按量 498.38 元 < 659 元 ✗
```

```chart
{
  "title": "各档套餐上限处，DeepSeek 按量费用 vs 套餐价格",
  "unit": "元",
  "max": 660,
  "items": [
    {"label": "Lite 套餐价格", "value": 39, "display": "39", "tone": "orange"},
    {"label": "Lite 上限 DS 费用", "value": 24.92, "display": "24.92", "tone": "blue"},
    {"label": "Pro 套餐价格", "value": 329, "display": "329", "tone": "orange"},
    {"label": "Pro 上限 DS 费用", "value": 231.05, "display": "231.05", "tone": "blue"},
    {"label": "Max 套餐价格", "value": 659, "display": "659", "tone": "orange"},
    {"label": "Max 上限 DS 费用", "value": 498.38, "display": "498.38", "tone": "blue"}
  ],
  "caption": "每个套餐在用满的极限处，DeepSeek 按量都更便宜。不存在交叉点。"
}
```

四个档位，四个"不够"。不管月用量多大，MiMo Token Plan 都比 DeepSeek 按量贵。

## 要追平需要什么条件？

反算一下：MiMo 的缓存命中率需要达到多少，才能让 Token Plan 的等价成本追平 DeepSeek 按量？

```text
(303.16 - 297.5x) × 0.00866 ≤ 0.1997
x ≥ 94.15%
```

当前 MiMo 是 90.86%，还差 **3.29 个百分点**。

如果只看按量（不用 Token Plan），需要的缓存命中率更高：

```text
MiMo 按量成本 = DeepSeek 按量成本
0.3285 × I = 0.1997 × I  →  不可能，系数固定
```

按量永远追不上——单价一样，命中率系数不同，两条线平行发散。

## 为什么 4 个百分点差这么多

直觉上，95% 和 91% 看起来差不多。但缓存未命中的单价是命中的 **120 倍**（3 vs 0.025）。这意味着：

```text
DeepSeek 每 100 个输入 token 的成本：
  95.19 × 0.025 + 4.81 × 3 = 2.38 + 14.43 = 16.81

MiMo 每 100 个输入 token 的成本：
  90.86 × 0.025 + 9.14 × 3 = 2.27 + 27.42 = 29.69
```

DeepSeek 缓存未命中部分的花费是 14.43，MiMo 是 27.42——光这一项就差了 13 元。缓存命中部分 DeepSeek 反而多花 0.11 元（因为命中更多），但和未命中部分的差距比，完全可以忽略。

> 缓存命中率差 4 个百分点，本质上是"未命中部分翻了一倍"。而未命中部分恰好是单价最贵的那部分。

## 所以答案是

**单价一样时，缓存命中率更高的平台永远更便宜。不存在某个用量规模能逆转这个结果。**

两边成本都是线性函数，斜率由缓存命中率决定。DeepSeek 的斜率更低，两条线从原点出发后只会越拉越远。

Token Plan 的 13.4% 折扣无法弥补 64.4% 的成本差距。MiMo 唯一的翻盘路径是把缓存命中率从 90.86% 提升到 94% 以上——到时候不光 Token Plan 会赢，连按量都会打平。

## 数据与参考

- 用量数据：沿用上一篇文章中 DeepSeek 6 月 8 日的峰值日用量。
- DeepSeek V4 Pro 价格：2026 年 5 月 22 日永久降价后的官方定价，详见 [DeepSeek 模型与价格](https://api-docs.deepseek.com/quick_start/pricing)。
- MiMo v2.5 Pro 价格：2026 年 5 月 27 日永久降价后的官方定价，详见 [MiMo V2.5 价格调整公告](https://platform.xiaomimimo.com/static/docs/news/v2.5-price-update.md)。
- MiMo Token Plan Credits 费率：[MiMo Token Plan 订阅与 Credits 规则](https://platform.xiaomimimo.com/static/docs/price/tokenplan/subscription.md)。
- 上一篇文章：[39 元的 MiMo Token Plan，真的比 DeepSeek V4 Flash 划算吗？](/blog/mimo-token-plan-vs-deepseek-v4-flash.html)
