---
title: When Ctrl+Arrow Would Not Switch Spaces
displayTitle: 当 Ctrl+方向键就是不肯切换桌面
date: 2026-05-07
excerpt: A debugging note on SideClick, CGEvent, Hammerspoon, and why macOS Mission Control only accepted the final private-source event sequence.
tags: macOS, Swift, CGEvent, SideClick
---

SideClick 是一个很小的 macOS 菜单栏工具：监听鼠标侧键，然后发送一个用户配置好的键盘快捷键。最开始的目标非常朴素：把鼠标后退/前进侧键映射成 `Ctrl+Left` 和 `Ctrl+Right`，用来切换 Spaces 桌面。

这个需求听起来像是几行 `CGEvent` 就能完成。实际调试过程证明，macOS 的系统级快捷键比普通应用快捷键挑剔得多。

## 现象

普通快捷键很快就工作了，例如：

- `Cmd+C` 能复制。
- `Cmd+V` 能粘贴。
- 单独发送方向键，也能被网页键盘检测工具识别。
- 单独发送 Ctrl，后来也能被识别。

但只要组合成 `Ctrl+Left` 或 `Ctrl+Right`，Mission Control 就不切桌面。期间还出现过一个特别迷惑的状态：网页能看到 Ctrl，却看不到方向键。

## 走过的弯路

### 1. 只给方向键加 flags

最直觉的做法是创建方向键事件，然后把 Control flag 塞进去：

```swift
event.flags = [.maskControl]
event.post(tap: .cghidEventTap)
```

这对某些普通应用快捷键有用，但对 Spaces 切换不稳定。系统好像看到了一个“带 Ctrl 标记的方向键”，但没有把它当成一次真实的 Ctrl+方向键输入。

### 2. 真的发 Ctrl down/up，但主键没有 flags

于是换成物理键盘顺序：

```text
Ctrl down
Arrow down
Arrow up
Ctrl up
```

这让“Ctrl 被按下”更真实，但如果主键那一帧没有正确被系统归类，系统快捷键匹配器仍然可能把它当成普通方向键。类似问题在测试 `Ctrl+Space` 时也出现过：输入法切换会变得不稳定，甚至走到长按选择器那条路径。

### 3. 直接切 Spaces

我们还试过绕开快捷键，动态调用 SkyLight 私有 API 读取和切换 Space。终端里同一套 API 能切，但放进 app 后体验很别扭，也会引入“已经在最左/最右边”等额外状态。

这条路线最后被撤掉了。SideClick 的目标还是键盘映射工具，不应该为了一个快捷键把自己变成半个窗口管理器。

## 转折点：看 Hammerspoon 怎么做

最后去看成熟工具的实现。Hammerspoon 的 `hs.eventtap.event.newKeyEventSequence` 很接近 Apple 文档建议的模型：为每个 modifier 和主键生成一组有顺序的 key down / key up 事件。

它的核心思路不是“给主键伪造 flags”，而是构造一组完整的虚拟按键序列：

```text
Ctrl down
Arrow down
Arrow up
Ctrl up
```

关键差异在事件来源和投递位置：

- 使用 private `CGEventSource`，也就是 `CGEventSourceStateID(rawValue: -1)`。
- 投递到 `.cgSessionEventTap`。
- 不手动给每个事件塞 flags，让系统从完整事件序列里维护 modifier 状态。

## 最终可用的实现

最终 SideClick 的发送逻辑变成这样：

```swift
let source = CGEventSource(stateID: CGEventSourceStateID(rawValue: -1)!)

postKey(source: source, keyCode: controlKeyCode, keyDown: true)
postKey(source: source, keyCode: arrowKeyCode, keyDown: true)
postKey(source: source, keyCode: arrowKeyCode, keyDown: false)
postKey(source: source, keyCode: controlKeyCode, keyDown: false)
```

每个事件都投递到 session event tap：

```swift
event.post(tap: .cgSessionEventTap)
```

改完以后，`Ctrl+Left` / `Ctrl+Right` 开始能稳定触发 Spaces 切换。这次成功不是因为某个神奇延迟，而是事件模型终于像一个系统愿意接受的虚拟键盘输入。

## 为什么 Karabiner 更稳

Karabiner-Elements 走的是另一条更底层的路：它通过虚拟 HID 键盘把事件发给系统。换句话说，它不是像普通 app 一样“post CGEvent”，而是更接近真正插了一把键盘。

> 如果目标是生产级键盘重映射，虚拟 HID 是更稳的架构；如果目标是一个小工具，Hammerspoon 风格的 private source + session tap 已经是 CGEvent 路线里相当实用的做法。

## 这次学到的东西

- 普通应用快捷键能工作，不代表系统级快捷键也会工作。
- 网页键盘检测工具只能证明事件是否到达网页，不能完全代表 Mission Control 的系统热键路径。
- 对 macOS 组合键，flags、event source、event tap、按键顺序都可能影响结果。
- 遇到系统输入问题时，直接看 Hammerspoon、Karabiner、yabai 这类成熟项目，比继续猜更快。

> 最终修复并不复杂。复杂的是确认哪一层在吞事件：鼠标侧键、Input Monitoring、Accessibility、CGEvent flags、Mission Control，还是 Spaces 本身。

## 参考

- [Hammerspoon hs.eventtap](https://www.hammerspoon.org/docs/hs.eventtap.html)
- [Hammerspoon hs.eventtap.event](https://www.hammerspoon.org/docs/hs.eventtap.event.html)
- [Karabiner-Elements event modification chain](https://karabiner-elements.pqrs.org/docs/manual/misc/event-modification-chaining/)
- [Apple CGEvent keyboard event documentation](https://developer.apple.com/documentation/coregraphics/1456564-cgeventcreatekeyboardevent)
