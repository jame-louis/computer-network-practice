---
title: "实验10 标准访问控制列表（ACL）"
lectureNumber: 10
module: "C. 路由器"
description: "标准ACL配置与验证，包括ACL编号、源IP过滤、接口方向应用、隐式deny与匹配计数。"
duration: "120分钟"
difficulty: intermediate
prerequisites: ["lecture09"]
tags: ["ACL", "标准ACL", "访问控制", "Cisco", "网络安全"]
hasSlides: true
hasAssignment: true
draft: false
---


## 学习目标

学完本节后，学生能够：

- 说明ACL的作用和工作原理
- 区分标准ACL与扩展ACL
- 配置标准ACL（1-99）过滤基于源IP的流量
- 将ACL应用到接口的in/out方向
- 使用`show access-lists`验证ACL效果

## 回顾：网络通了之后还有什么问题？

场景：使用RIP或OSPF，LAN A和LAN B的所有PC已经互通。

```mermaid
flowchart LR
    subgraph "LAN A 172.1.1.0/24"
        PC1["PC1"]
        PC2["PC2"]
        PC3["PC3"]
    end
    subgraph "LAN B 172.2.2.0/24"
        PC4["PC4"]
        PC5["PC5"]
        PC6["PC6"]
    end
    PC1 <--> PC4
    PC2 <--> PC5
    PC3 <--> PC6
```

问题：

> 现在所有PC都能互相访问。如果只想禁止PC6访问LAN A，怎么办？

答案：使用访问控制列表（ACL）。

## ACL：网络世界的门卫

> Feynman类比：ACL像大楼的门卫或小区门禁。每个人（数据包）进门时，门卫检查其身份证（源IP），决定放行还是拒绝。

```mermaid
flowchart LR
    A["数据包\n源IP: 172.2.2.4"] --> B{"ACL检查"}
    B -->|"允许"| C["进入LAN A"]
    B -->|"拒绝"| D["丢弃"]
```

ACL = Access Control List，访问控制列表。

## 标准ACL vs 扩展ACL

| 特性 | 标准ACL | 扩展ACL |
|---|---|---|
| 编号范围 | 1-99 | 100-199 |
| 过滤依据 | 源IP | 源IP、目的IP、协议、端口 |
| 放置位置 | 靠近目的地 | 靠近源 |
| 复杂度 | 简单 | 复杂 |
| 应用场景 | 快速隔离某个源 | 精细控制某种服务 |

本节课先学习**标准ACL**。

## 实验拓扑

```mermaid
flowchart LR
    subgraph "LAN A 172.1.1.0/24"
        PC1["PC1\n172.1.1.2/24"]
        PC2["PC2\n172.1.1.3/24"]
        PC3["PC3\n172.1.1.4/24"]
    end
    RA["RouterA\nSe0/3/0: 192.168.1.1/24\nF0/1: 172.1.1.1/24"]
    RB["RouterB\nF0/1: 172.2.2.1/24\nSe0/3/0: 192.168.1.2/24"]
    subgraph "LAN B 172.2.2.0/24"
        PC4["PC4\n172.2.2.2/24"]
        PC5["PC5\n172.2.2.3/24"]
        PC6["PC6\n172.2.2.4/24"]
    end
    PC1 --> RA
    PC2 --> RA
    PC3 --> RA
    RA <-->|"192.168.1.0/24"| RB
    RB --> PC4
    RB --> PC5
    RB --> PC6
```

### 地址规划

| 设备 | 接口 | IP地址 |
|---|---|---|
| RouterA | Se0/3/0 | 192.168.1.1/24 |
| RouterA | F0/1 | 172.1.1.1/24 |
| RouterB | F0/1 | 172.2.2.1/24 |
| RouterB | Se0/3/0 | 192.168.1.2/24 |
| PC1-PC3 | — | 172.1.1.0/24，网关 172.1.1.1 |
| PC4-PC6 | — | 172.2.2.0/24，网关 172.2.2.1 |

## 实验要求

**目标：禁止主机PC6（172.2.2.4）访问 172.1.1.0/24 网段。**

要求：

1. 先配置RIP或OSPF，使所有PC互通。
2. 在RouterA上配置标准ACL。
3. 应用到合适的接口和方向。
4. 验证PC6无法访问LAN A，但其他PC可以。

## 标准ACL配置

## 在 RouterA 上

```txt
RouterA(config)# access-list 1 deny 172.2.2.4 0.0.0.0
RouterA(config)# access-list 1 permit any
RouterA(config)# interface fastethernet 0/1
RouterA(config-if)# ip access-group 1 out
RouterA(config-if)# end
```

命令解读：

| 命令 | 含义 |
|---|---|
| `access-list 1` | 标准ACL，编号1 |
| `deny 172.2.2.4 0.0.0.0` | 拒绝源IP为172.2.2.4（PC6）的流量 |
| `permit any` | 允许其他所有流量 |
| `ip access-group 1 out` | 在F0/1接口的出方向应用ACL 1 |

> ⚠️ **ACL末尾默认有隐式 deny any**，所以必须显式写`permit any`！

## 为什么放在 RouterA F0/1 的 out 方向？

```mermaid
flowchart LR
    PC6["PC6\n172.2.2.4"] --> RB["RouterB"] --> RA["RouterA"] -->|"F0/1 out"| LAN_A["LAN A"]
```

标准ACL只能根据源IP过滤。如果放在靠近源的位置（RouterB），可能会误伤PC6访问其他网络的流量。

因此标准ACL应**靠近目的地**放置，避免误伤。

| 放置位置 | 方向 | 效果 |
|---|---|---|
| RouterA F0/1 | out | ✅ 只阻止进入LAN A，不影响PC6去其他地方 |
| RouterB F0/1 | in | ❌ 会阻止PC6的所有出站流量，包括去其他合法网络 |

## 验证ACL效果

## 查看ACL

```txt
RouterA# show access-lists

Standard IP access list 1
    10 deny 172.2.2.4 (5 match(es))
    20 permit any (15 match(es))
```

## ping测试

| 测试 | 预期结果 | 说明 |
|---|---|---|
| PC6 ping PC1 | 失败 | ACL匹配deny规则 |
| PC6 ping PC2 | 失败 | 同上 |
| PC5 ping PC1 | 成功 | ACL permit any |
| PC4 ping PC3 | 成功 | ACL permit any |

## Demo Checkpoint 1

## 预测输出

如果标准ACL配置如下：

```txt
access-list 1 deny 172.2.2.4 0.0.0.0
```

没有写`access-list 1 permit any`，就应用到接口。此时PC5 ping PC1会怎样？

A. 成功
B. 失败
C. 有时成功有时失败

> 答案：**B** — ACL末尾隐式deny any，没有显式permit any时，所有流量都被拒绝。

## 通配符掩码速查

| 要匹配的地址 | 通配符掩码 | 含义 |
|---|---|---|
| 单个主机 172.2.2.4 | `0.0.0.0` | 每一位都必须匹配 |
| 整个网段 172.2.2.0/24 | `0.0.0.255` | 前24位匹配，后8位任意 |
| 任意地址 | `255.255.255.255` | 所有位都不检查 |

也可以写成：

```txt
access-list 1 deny host 172.2.2.4
! 等价于
access-list 1 deny 172.2.2.4 0.0.0.0
```

## 常见错误排查

```mermaid
flowchart TD
    A["PC6 仍能 ping 通 PC1"] --> B{"ACL已应用到接口?"}
    B -->|"否"| C["使用 ip access-group 1 out 应用"]
    B -->|"是"| D{"方向正确?"}
    D -->|"否"| E["调整为 out 方向"]
    D -->|"是"| F{"源IP和通配符正确?"}
    F -->|"否"| G["修正为 172.2.2.4 0.0.0.0"]
    F -->|"是"| H["检查是否其他ACL或路由问题"]

    I["PC5 也无法 ping 通 PC1"] --> J{"有 permit any?"}
    J -->|"否"| K["添加 access-list 1 permit any"]
    J -->|"是"| L["检查路由配置"]
```

## 删除ACL

正确顺序：

```txt
RouterA(config)# interface fastethernet 0/1
RouterA(config-if)# no ip access-group 1 out
RouterA(config-if)# exit
RouterA(config)# no access-list 1
```

> 如果直接从接口移除ACL但未删除access-list，配置仍然保留在 running-config 中。

## 学生实验任务

🔵 基础任务：

- 配置RIP或OSPF，使所有PC互通
- 配置标准ACL禁止PC6访问172.1.1.0/24网段
- 将ACL应用到RouterA F0/1接口out方向
- 验证PC6被隔离，其他PC正常
- 截图`show access-lists`

🟡 进阶任务：

- 使用`show access-lists`观察匹配计数变化
- 理解隐式deny any
- 讨论：为什么标准ACL要靠近目的地？

🔴 挑战任务：

- 配置标准ACL禁止整个172.2.2.0/24网段访问172.1.1.0/24
- 但允许172.2.2.0/24访问其他网络
- 分析放置位置对流量的影响

## 思考点

1. ACL在哪些场合会用到？
2. 标准ACL和扩展ACL的主要区别是什么？
3. 为什么标准ACL建议放在靠近目的地的地方？
4. 如果忘记写`permit any`会出现什么后果？
5. `ip access-group 1 out`中的out方向是什么意思？
6. 如何查看ACL的匹配次数？

## 小结

```mermaid
flowchart LR
    A["网络已互通"] --> B["使用ACL控制访问"]
    B --> C["标准ACL基于源IP过滤"]
    C --> D["配置 access-list + ip access-group"]
    D --> E["验证 show access-lists"]
```

今日要点：

- ACL = 访问控制列表，决定流量允许/拒绝
- 标准ACL编号1-99，只根据源IP过滤
- 标准ACL应靠近目的地放置
- 必须显式写`permit any`，否则隐式deny any拒绝所有
- `show access-lists`查看匹配计数

## 下节课预告

### 实验11 扩展ACL

问题：

> 标准ACL只能根据源IP过滤。如果想"只允许PC1访问PC3的Web服务，但禁止PC1访问PC3的FTP"，怎么办？

答案：使用扩展ACL，可以基于源IP、目的IP、协议、端口进行精细控制。

预习：扩展ACL编号、协议关键字、端口号、放置位置。
