---
title: Is MiMo's Token Plan Cheaper Than DeepSeek V4 Flash?
titleZh: 39 元的 MiMo Token Plan，真的比 DeepSeek V4 Flash 划算吗？
date: 2026-06-09
excerpt: I used my busiest DeepSeek API day to calculate whether MiMo V2.5's Token Plan would actually reduce my monthly AI bill.
excerptZh: 我用 DeepSeek 用量最高的一天来算，看 MiMo V2.5 的 Token Plan 到底能不能让每月的 AI 账单更便宜。
tags: AI, MiMo, DeepSeek, API, Token Plan
---

<!-- lang: en -->
I've been paying for DeepSeek V4 Flash by the token — actual usage, no commitment. When I saw MiMo V2.5's Token Plan, with the Lite tier at just ¥39/month, my first thought was: if the model is good enough, could I lock my entire monthly AI spend to the price of a coffee?

But the plan page shows `4.1B Credits`, and Credits aren't tokens. So I exported my DeepSeek June bill, picked June 8 — my busiest day — as a stress test, and recalculated everything using the cache hit rate I'd observed when I first tried MiMo.

The result didn't match the "¥39 all-you-can-eat" intuition.

## Bottom Line

Running my June 8 peak usage every day for 30 days straight:

- At DeepSeek's June 8 cache hit rate of `95.19%`, pay-as-you-go costs about `¥74.44/month`.
- At MiMo's trial-period cache hit rate of `90.86%`, pay-as-you-go costs about `¥115.06/month`.
- The same MiMo usage would consume roughly `11.51B Credits`, overshooting the Standard plan's `11B` cap.
- Without the night discount, you'd need the ¥329 Pro plan to cover it all — clearly worse than pay-as-you-go.

So for my current usage pattern, sticking with DeepSeek V4 Flash pay-as-you-go makes more sense.

One important caveat: MiMo charges only 0.8× Credits during Beijing time 0:00–8:00. If roughly `22%` or more of your usage consistently falls in that window, the Standard plan might actually fit, and ¥99 would beat the ¥115 pay-as-you-go estimate.

```chart
{
  "title": "Monthly Cost at Peak Usage for 30 Consecutive Days",
  "unit": "CNY/month",
  "max": 120,
  "items": [
    {"label": "DeepSeek V4 Flash (Pay-as-you-go)", "value": 74.44, "display": "74.44", "tone": "blue"},
    {"label": "MiMo Standard Plan", "value": 99, "display": "99.00", "tone": "slate"},
    {"label": "MiMo V2.5 (Pay-as-you-go)", "value": 115.06, "display": "115.06", "tone": "orange"}
  ],
  "caption": "Standard's ¥99 is shown for reference only; under normal hours, the estimated 11.51B Credits slightly exceeds its 11B cap."
}
```

## Which Day I Picked

The exported DeepSeek bill covers June 1–9. Ranked by total input and output tokens, June 8 was the highest:

```text
Cache-hit input:     30,398,592
Cache-miss input:     1,536,892
Output:                 168,200
Total:               32,103,684 tokens
Requests:                  528
```

Total input was `31,935,484 tokens`, giving a cache hit rate of:

```text
30,398,592 / 31,935,484 = 95.19%
```

The actual bill for that day was ¥2.78 — ¥2.30 for DeepSeek V4 Flash and ¥0.48 for a handful of V4 Pro calls.

The calculations below don't simply multiply ¥2.78 by 30. Instead, they assume all work migrates to a single model tier and recalculate using Flash or MiMo V2.5 unit prices. This compares the same token volume under two billing schemes, without mixing in V4 Pro pricing.

## Unit Prices: Head to Head

As of June 9, 2026, MiMo V2.5 domestic pay-as-you-go rates are:

- Cache-hit input: `¥0.02 / million tokens`
- Cache-miss input: `¥1 / million tokens`
- Output: `¥2 / million tokens`

My DeepSeek bill export shows V4 Flash charged at the same three tiers in RMB. DeepSeek's public docs list USD prices: cache-hit `$0.0028`, miss `$0.14`, output `$0.28`, all per million tokens. The two pricing schemes align within their respective domestic and international billing frameworks.

So when comparing pay-as-you-go rates, the real variable isn't the model name — it's the cache hit rate.

## Why 4 Percentage Points Make Such a Big Difference

When I first started using MiMo, the dashboard showed:

```text
Cache-hit input:   7,347,776
Cache-miss input:     739,068
Output:                57,347
Cache hit rate:       90.86%
```

If I keep the same daily input volume as June 8 but swap DeepSeek's `95.19%` hit rate for MiMo's `90.86%`, projecting over 30 days gives:

```text
Cache-hit input:   870,505,662
Cache-miss input:    87,558,858
Output:              5,046,000
```

The corresponding MiMo pay-as-you-go cost:

```text
Cache hit:   870.51M × ¥0.02 =  ¥17.41
Cache miss:   87.56M × ¥1.00 =  ¥87.56
Output:        5.05M × ¥2.00 =  ¥10.09
Total:                       = ¥115.06
```

The hit rate dropped just 4.33 percentage points, yet monthly cost jumped from ¥74.44 to ¥115.06. The reason is simple: a single cache-miss input token costs 50× more than a cache-hit token.

## Token Plan Isn't 4.1B tokens

MiMo Token Plan deducts a Credits-based quota. For `mimo-v2.5`:

- Each cache-hit input token consumes `2 Credits`
- Each cache-miss input token consumes `100 Credits`
- Each output token consumes `200 Credits`

So `4.1B Credits` absolutely does not mean `4.1 billion tokens`. The same token type — whether cache-hit, cache-miss, or output — can burn 2, 100, or 200 Credits respectively.

Converting the monthly MiMo usage above into Credits:

```text
Cache hit:    870,505,662 × 2   = 1.741B
Cache miss:    87,558,858 × 100 = 8.756B
Output:         5,046,000 × 200 = 1.009B
Total:                          = 11.506B Credits
```

```chart
{
  "title": "How 11.506B Credits Get Consumed",
  "unit": "B Credits",
  "max": 9,
  "items": [
    {"label": "Cache-hit input", "value": 1.741, "display": "1.741", "tone": "blue"},
    {"label": "Cache-miss input", "value": 8.756, "display": "8.756", "tone": "orange"},
    {"label": "Output", "value": 1.009, "display": "1.009", "tone": "slate"}
  ],
  "caption": "Cache misses are only ~9.14% of input tokens but consume ~76% of Credits."
}
```

The four monthly tiers are:

- Lite: ¥39, `4.1B Credits`
- Standard: ¥99, `11B Credits`
- Pro: ¥329, `38B Credits`
- Max: ¥659, `82B Credits`

My estimate overshoots Standard by about `0.51B Credits`. Under normal hours, Standard isn't enough, so the next option up is Pro at ¥329 — far above the ¥115.06 pay-as-you-go cost.

## Night Discount Shifts the Boundary

MiMo charges 0.8× Credits during Beijing time 0:00–8:00. That's worth taking seriously.

If all usage fell in the discounted window, `11.506B` Credits would drop to roughly `9.205B`, fitting within Standard. More practically, if about `22%` of Credits occur at night, total consumption stays under `11B`.

This means my conclusion about Token Plan isn't absolute:

- If work happens mainly during the day, Standard won't fit, and pay-as-you-go is cheaper.
- If an Agent regularly runs in the early morning, Standard might suffice, with ¥99 edging out the ¥115 pay-as-you-go estimate.
- But the night share needs to stay stable month to month — otherwise you risk running out of quota before the billing cycle ends.

When Token Plan credits run out, service stops. It won't automatically draw from your account balance. For Agents that run continuously, that's a real operational risk.

## Is There a Sweet Spot for the Lite Plan?

The cache hit rate is determined by the platform and your workload. It fluctuates, but it won't jump from 90% to 99% just because you want to fit a particular plan. A fairer comparison is to fix the cache structure both sides have already demonstrated, and vary only the monthly token volume:

- DeepSeek keeps its June 8 hit rate of `95.19%`.
- MiMo keeps its trial-period hit rate of `90.86%`.
- The input-to-output ratio stays the same as June 8.

Under those constraints, two meaningful boundaries emerge.

The first is where DeepSeek pay-as-you-go reaches ¥39:

```text
~505 million tokens / month
```

Only above this volume does the ¥39 flat rate start beating DeepSeek pay-as-you-go.

The second is where MiMo Lite's `4.1B Credits` run out:

```text
~343 million tokens / month
```

At that point, the equivalent DeepSeek pay-as-you-go cost is about `¥26.52` — still well below Lite's ¥39.

The two boundaries don't overlap:

```text
MiMo Lite quota range: 0 ~ 343M tokens
DeepSeek monthly cost exceeds ¥39: after 505M tokens
```

```chart
{
  "title": "Lite's Capacity Ceiling vs. DeepSeek's ¥39 Threshold",
  "unit": "100M tokens/month",
  "max": 5.05,
  "items": [
    {"label": "Lite capacity (normal hours)", "value": 3.43, "display": "3.43", "tone": "slate"},
    {"label": "Lite capacity (all night)", "value": 4.29, "display": "4.29", "tone": "blue"},
    {"label": "DeepSeek pay-as-you-go hits ¥39", "value": 5.05, "display": "5.05", "tone": "orange"}
  ],
  "caption": "Even if every MiMo request qualifies for the 0.8× night discount, Lite still can't reach the volume at which DeepSeek costs ¥39/month."
}
```

By the time DeepSeek becomes more expensive than Lite, Lite has already been oversubscribed. Given my current cache hit rate and input/output mix, Lite doesn't have a token range that both fits within its quota and costs less than DeepSeek pay-as-you-go.

Even in the best-case scenario, the conclusion holds. If all MiMo usage fell in the night discount window, Lite could handle up to roughly `429M tokens`, but the equivalent DeepSeek cost would only be about `¥33.16` — still under ¥39.

With a first-purchase or annual 12% discount, Lite works out to `¥34.32/month`. That's still above the DeepSeek cost at full night-coverage capacity; the gap just narrows.

## Why I Didn't Switch

This exercise made me realize that judging whether a Token Plan is worth it requires more than the monthly price tag — and certainly more than equating Credits with tokens. Four variables actually matter:

- Daily input and output token volumes
- Cache hit rate
- The ratio of cache-miss input to output
- How much work happens during night discount hours

For my data, DeepSeek V4 Flash has a higher cache hit rate, and its pay-as-you-go prices are low enough. MiMo V2.5 is an excellent model with competitive unit pricing, but the Token Plan doesn't automatically translate into lower cost.

> A plan's value isn't "the quota looks generous" — it's whether your actual traffic pattern fits neatly within its billing boundaries.

For now, I'm staying with DeepSeek V4 Flash pay-as-you-go. Lite has no cost sweet spot under my workload mix. If Standard proves capable of covering all my work through stable night-hour usage, I'd reconsider — but that's a question for another month.

## Data and References

- DeepSeek data: personal account export `usage_data_2026_6.zip`, covering June 1–9, 2026.
- MiMo data: trial dashboard token breakdown from June 9, 2026.
- [MiMo Pay-as-you-go Pricing](https://platform.xiaomimimo.com/static/docs/price/pay-as-you-go.md)
- [MiMo Token Plan Subscription & Credits Rules](https://platform.xiaomimimo.com/static/docs/price/tokenplan/subscription.md)
- [MiMo V2.5 Price Update Announcement](https://platform.xiaomimimo.com/static/docs/news/v2.5-price-update.md)
- [DeepSeek Models and Pricing](https://api-docs.deepseek.com/quick_start/pricing)

<!-- lang: zh -->
我之前一直在用 DeepSeek V4 Flash 的 API，按实际 token 用量付费。最近看到 MiMo V2.5 的 Token Plan，Lite 套餐每月只要 39 元，第一反应是：如果模型够用，换过去是不是能把每月成本直接锁死在一杯咖啡的钱？

但套餐页上的 `4.1B Credits` 看起来很大，Credits 又不等于 token。于是我把 DeepSeek 6 月账单导了出来，挑了 6 月 8 日这一天做压力测试，再用刚开始试用 MiMo 时观察到的缓存命中率重新算了一遍。

结果和"39 元包月"给人的第一印象不太一样。

## 先说结论

以我 6 月 8 日的峰值用量连续跑 30 天：

- 按 DeepSeek 当天 `95.19%` 的缓存命中率计算，按量费用约为每月 `74.44 元`。
- 按 MiMo 试用期间 `90.86%` 的缓存命中率计算，按量费用约为每月 `115.06 元`。
- 同样的 MiMo 用量会消耗约 `11.51B Credits`，超过 Standard 套餐的 `11B` 额度。
- 不考虑夜间优惠时，需要购买 `329 元`的 Pro 套餐才能完整覆盖，显然不如按量付费。

所以对我现在的使用方式，继续使用 DeepSeek V4 Flash 按量付费更合适。

不过这里有一个重要例外：MiMo 在北京时间 0:00–8:00 只按 0.8 倍消耗 Credits。如果大约 `22%` 以上的用量稳定发生在这个时间段，Standard 套餐就可能装得下，此时 99 元会比预计的 115 元按量费用便宜一点。

```chart
{
  "title": "峰值用量连续 30 天的月度成本",
  "unit": "元/月",
  "max": 120,
  "items": [
    {"label": "DeepSeek V4 Flash 按量", "value": 74.44, "display": "74.44", "tone": "blue"},
    {"label": "MiMo Standard 套餐", "value": 99, "display": "99.00", "tone": "slate"},
    {"label": "MiMo V2.5 按量", "value": 115.06, "display": "115.06", "tone": "orange"}
  ],
  "caption": "Standard 的 99 元只是价格对照；正常时段下，预计 11.51B Credits 会略超其 11B 额度。"
}
```

## 我拿哪一天来算

DeepSeek 导出的 6 月账单包含 6 月 1 日到 9 日的数据。按输入和输出 token 总量排序，6 月 8 日是这段时间里的最高值：

```text
缓存命中输入：30,398,592
缓存未命中输入：1,536,892
输出：168,200
总计：32,103,684 tokens
请求数：528
```

输入部分一共是 `31,935,484 tokens`，缓存命中率为：

```text
30,398,592 / 31,935,484 = 95.19%
```

这一天的实际账单是 2.78 元，其中 DeepSeek V4 Flash 为 2.30 元，少量 V4 Pro 调用为 0.48 元。

后面的计算不是拿 2.78 元直接乘 30，而是假设这些工作全部迁移到同一档模型，再按 Flash 或 MiMo V2.5 的单价重算。这样比较的是同一批 token 在两种计费方式下的成本，而不是混入 V4 Pro 的价格。

## 两家的按量单价

截至 2026 年 6 月 9 日，MiMo V2.5 国内按量价格是：

- 缓存命中输入：`0.02 元 / 百万 tokens`
- 缓存未命中输入：`1 元 / 百万 tokens`
- 输出：`2 元 / 百万 tokens`

我的 DeepSeek 账单导出文件中，V4 Flash 使用的人民币单价也是这三档。DeepSeek 公共文档展示的是美元价格：缓存命中 `$0.0028`、未命中 `$0.14`、输出 `$0.28`，都是每百万 tokens。两者在各自公开的国内或海外计费口径下基本对齐。

因此，单看按量价时，真正影响结果的不是模型名字，而是缓存命中率。

## 为什么 4 个百分点会差这么多

我刚开始使用 MiMo 时，后台显示：

```text
缓存命中输入：7,347,776
缓存未命中输入：739,068
输出：57,347
缓存命中率：90.86%
```

如果保持 6 月 8 日相同的每日总输入量，只把缓存命中率从 DeepSeek 的 `95.19%` 换成 MiMo 的 `90.86%`，连续计算 30 天，月度输入会变成：

```text
缓存命中输入：870,505,662
缓存未命中输入：87,558,858
输出：5,046,000
```

对应的 MiMo 按量费用是：

```text
缓存命中：870.51M × 0.02 元 = 17.41 元
缓存未命中：87.56M × 1 元 = 87.56 元
输出：5.05M × 2 元 = 10.09 元
合计：115.06 元
```

命中率只下降了约 4.33 个百分点，月费却从 74.44 元上升到 115.06 元。原因很简单：一次缓存未命中的输入价格，是缓存命中的 50 倍。

## Token Plan 不是 4.1B tokens

MiMo Token Plan 使用 Credits 扣减额度。对于 `mimo-v2.5`：

- 每个缓存命中输入 token 消耗 `2 Credits`
- 每个缓存未命中输入 token 消耗 `100 Credits`
- 每个输出 token 消耗 `200 Credits`

所以 `4.1B Credits` 绝不等于 `41 亿 tokens`。同一个 token 因为类型不同，可能消耗 2、100 或 200 Credits。

把上面的 MiMo 月度用量换成 Credits：

```text
缓存命中：870,505,662 × 2 = 1.741B
缓存未命中：87,558,858 × 100 = 8.756B
输出：5,046,000 × 200 = 1.009B
合计：11.506B Credits
```

```chart
{
  "title": "11.506B Credits 是怎么被消耗的",
  "unit": "B Credits",
  "max": 9,
  "items": [
    {"label": "缓存命中输入", "value": 1.741, "display": "1.741", "tone": "blue"},
    {"label": "缓存未命中输入", "value": 8.756, "display": "8.756", "tone": "orange"},
    {"label": "输出", "value": 1.009, "display": "1.009", "tone": "slate"}
  ],
  "caption": "缓存未命中只占输入 token 的约 9.14%，却贡献了约 76% 的 Credits 消耗。"
}
```

四档月度套餐分别是：

- Lite：39 元，`4.1B Credits`
- Standard：99 元，`11B Credits`
- Pro：329 元，`38B Credits`
- Max：659 元，`82B Credits`

我的估算值比 Standard 多了约 `0.51B Credits`。正常时段下 Standard 不够，往上就只能买 Pro，但 329 元又远高于 115.06 元的按量费用。

## 夜间优惠会改变边界

MiMo 在北京时间 0:00–8:00 按 0.8 倍消耗 Credits。这个条件不能忽略。

如果全部用量都发生在优惠时段，`11.506B` 会降到约 `9.205B Credits`，Standard 就足够。更实际地反推，只需要约 `22%` 的 Credits 发生在夜间，预计总消耗就能压到 `11B` 以内。

这意味着 Token Plan 对我的判断不是绝对的：

- 如果工作主要发生在白天，Standard 不够，按量更划算。
- 如果 Agent 经常在凌晨自动运行，Standard 可能够用，99 元会略低于 115 元的按量估算。
- 但夜间占比必须长期稳定，否则月底仍可能提前耗尽额度。

Token Plan 用完后会停止服务，不会自动切到账户余额继续扣费。对持续运行的 Agent 来说，这也是需要考虑的风险。

## Lite 套餐存在用量甜蜜区间吗

缓存命中率是平台和工作负载共同决定的。它会波动，但通常不会为了迁就某个套餐从 90% 突然变成 99%。所以更实用的比较方式，是固定两边已经观察到的缓存结构，只让每月 token 用量变化：

- DeepSeek 继续使用 6 月 8 日的 `95.19%` 缓存命中率。
- MiMo 使用试用期间的 `90.86%` 缓存命中率。
- 输入和输出比例保持与 6 月 8 日相同。

在这个前提下，可以得到两个真正有意义的边界。

第一个边界是 DeepSeek 按量费用达到 39 元：

```text
约 5.05 亿 tokens / 月
```

只有月用量超过这个数字，39 元的固定套餐价格才开始低于 DeepSeek 按量费用。

第二个边界是 MiMo Lite 的 `4.1B Credits` 被用完：

```text
约 3.43 亿 tokens / 月
```

也就是说，Lite 能承载的最大月用量只有约 3.43 亿 tokens。到这个位置时，同等用量的 DeepSeek 按量费用约为 `26.52 元`，仍然明显低于 Lite 的 39 元。

两个边界没有重叠：

```text
MiMo Lite 额度范围：0 ～ 3.43 亿 tokens
DeepSeek 月费超过 39 元：5.05 亿 tokens 以后
```

```chart
{
  "title": "Lite 的容量边界与 DeepSeek 的 39 元边界",
  "unit": "亿 tokens/月",
  "max": 5.05,
  "items": [
    {"label": "Lite 正常时段容量", "value": 3.43, "display": "3.43", "tone": "slate"},
    {"label": "Lite 全部夜间容量", "value": 4.29, "display": "4.29", "tone": "blue"},
    {"label": "DeepSeek 按量达到 39 元", "value": 5.05, "display": "5.05", "tone": "orange"}
  ],
  "caption": "即使所有 MiMo 用量都享受夜间 0.8 倍消耗，Lite 的容量仍到不了 DeepSeek 月费超过 39 元的边界。"
}
```

等到 DeepSeek 变得比 Lite 贵时，Lite 早已超出额度。因此按我目前的缓存命中率和输入输出结构，Lite 并不存在一个既装得下、又比 DeepSeek 按量便宜的 token 用量区间。

即使把最有利的情况算进去，结论也没有改变。如果全部 MiMo 用量都发生在夜间优惠时段，Lite 最多可以承载约 `4.29 亿 tokens`，但同等 DeepSeek 费用也只有约 `33.16 元`，仍低于 39 元。

首购或包年 88 折后，Lite 可折算为 `34.32 元/月`。这个价格依然高于夜间满额度对应的 DeepSeek 费用，差距只是缩小了。

## 最后我为什么没有换

这次计算让我意识到，判断 Token Plan 是否划算，不能只看每月多少钱，也不能把 Credits 当成 tokens。真正需要看的有四个变量：

- 每天实际处理多少输入和输出 token
- 缓存命中率
- 未命中输入和输出所占的比例
- 有多少工作发生在夜间优惠时段

对我当前的数据来说，DeepSeek V4 Flash 的缓存命中率更高，按量价格又足够低。MiMo V2.5 的模型本身和按量价格都很有吸引力，但 Token Plan 并没有自动带来更低成本。

> 套餐的价值不是"额度看起来很大"，而是你的真实流量结构刚好能落在它的计费边界里。

所以现阶段我的选择是继续使用 DeepSeek V4 Flash 按量付费。Lite 在我的负载结构下没有成本甜蜜区间；如果后续 Standard 能依靠稳定的夜间用量覆盖全部工作，再考虑切换会更稳妥。

## 数据与参考

- DeepSeek 数据：个人账户导出的 `usage_data_2026_6.zip`，统计区间为 2026 年 6 月 1 日至 9 日。
- MiMo 数据：2026 年 6 月 9 日试用后台的 token 分类统计。
- [MiMo 按量计费说明](https://platform.xiaomimimo.com/static/docs/price/pay-as-you-go.md)
- [MiMo Token Plan 订阅与 Credits 规则](https://platform.xiaomimimo.com/static/docs/price/tokenplan/subscription.md)
- [MiMo V2.5 价格调整公告](https://platform.xiaomimimo.com/static/docs/news/v2.5-price-update.md)
- [DeepSeek 模型与价格](https://api-docs.deepseek.com/quick_start/pricing)
