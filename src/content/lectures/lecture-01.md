---
title: 实验1 常用网络命令的使用
lectureNumber: 1
week: 1
module: 'A. 网络基础'
description: 'ping / ipconfig / arp / tracert / nslookup'
duration: '2学时（120分钟）'
difficulty: 'beginner'
prerequisites: []
tags: ['计算机网络', '网络命令', '网络诊断']
hasAssignment: true
slidevUrl: https://jame-louis.github.io/slidev/network/lecture01 
---


# 学习目标

学完本节后，学生能够：

- 说明5个网络命令的工作原理（ping / ipconfig / arp / tracert / nslookup）
- 使用各命令及常用参数进行网络诊断
- 根据输出判断网络故障的大致位置

---

# 回顾：协议栈与命令

```mermaid
graph LR
    A[应用层<br/>DNS/HTTP] --> B[传输层<br/>TCP/UDP]
    B --> C[网络层<br/>ICMP/IP/ARP]
    C --> D[链路层<br/>MAC]
```

今天的命令分别工作在哪一层？

| 命令 | 协议层 | 作用 |
|---|---|---|
| ping | ICMP | 连通性测试 |
| tracert | ICMP | 路由跟踪 |
| ipconfig | IP配置 | 查看网络参数 |
| arp | ARP | IP→MAC映射 |
| nslookup | DNS | 域名解析 |

---

# ping：连通性检测

**原理：** ICMP回送请求/应答

> Feynman类比：像打电话，"喂，能听到吗？""能！"=连通 ✅

**故障检测五步法 — 从内到外，层层排除：**

```mermaid
flowchart LR
    A["127.0.0.1<br/>自己"] --> B["本机IP<br/>自己家"]
    B --> C["网关<br/>小区门"]
    C --> D["远程IP<br/>城市"]
    D --> E["域名<br/>外地"]
```

哪一步开始不通，故障就出在哪一步之前！

---

# ping 参数演示

```bash {*|1|2|3}{maxHeight:'440px'}
ping -t www.baidu.com        ← 一直ping，Ctrl+C停止
ping -n 10 www.baidu.com     ← 只ping 10次
ping -a 8.8.8.8              ← 反向解析主机名
```

**TTL值速算：**

| 返回TTL | 操作系统初值 | 跳数 |
|---|---|---|
| 128 | Windows | 0 |
| 64 | Linux | 0 |
| 54 | ? | 64-54=**10跳** |

> 规则：向上取整到2的幂（初值）- 返回TTL = 跳数

---

# ipconfig：查看IP配置

```bash {*|1}{maxHeight:'440px'}
ipconfig             ← 仅显示IP/掩码/网关
ipconfig /all        ← 完整信息：MAC/DNS/DHCP/租约时间
```

> Feynman类比：ipconfig=身份证摘要，`/all`=身份证原件

**重点看这些行：**
- `IPv4 地址` — 你的IP
- `子网掩码` — 网络大小
- `默认网关` — 出小区的"门"
- `DNS 服务器` — 电话台号码
- `物理地址` — 网卡MAC（全球唯一）

---

# ipconfig DHCP操作

```bash {*|1|2}{maxHeight:'440px'}
ipconfig /release    ← 释放IP（退房）
ipconfig /renew      ← 重新获取IP（重新办入住）
```

释放后IP变成 `0.0.0.0`，网络中断。执行 `/renew` 后立即恢复。

> ⚠️ 演示后务必 `/renew` 恢复！

---

# arp：IP→MAC映射

```bash {*|1|2}{maxHeight:'440px'}
ping <网关IP>        ← 先通信触发ARP请求
arp -a               ← 查看缓存内容
```

> Feynman类比：ARP=问路"XX家住哪？"→记住答案→下次直接去

**为什么要先ping再arp？**

ARP缓存是动态的，2-10分钟失效。不通信就没有缓存条目。

```
Internet Address    Physical Address    Type
192.168.32.1        00-11-09-46-d8-f4   dynamic
```

---

# tracert：路由跟踪

```bash {*|1|2}{maxHeight:'440px'}
tracert www.baidu.com       ← 跟踪到百度的路由路径
tracert -d www.163.com      ← -d=不解析域名，更快
```

> Feynman类比：快递物流跟踪，每经过一个中转站记一笔

**输出解读：**

```
 1 <1 ms <1 ms <1 ms 192.168.32.100     ← 第1跳，本地网关
 2 <1 ms <1 ms <1 ms 192.168.33.1       ← 第2跳
11 * * * Request timed out.             ← ⚠️ 超时！断了？
12 8 ms 7 ms 7 ms 183.60.136.64         ← 第12跳，目标到了！
```

> **`* * *`不一定是断了！** 可能是路由器屏蔽了ICMP，像快递驿站"已到达"但不扫码

---

# nslookup：DNS查询

**非交互模式：**

```bash
nslookup www.baidu.com
```

直接查一个域名，返回IP地址。

**交互模式（查不同类型记录）：**

```bash
nslookup
> set type=mx    ← 查邮件服务器
> google.com
```

> Feynman类比：非交互=直接问一个号码，交互=进了电话台想查什么查什么

---

# 实验任务发布

- 🔵 **基础任务**（必做，30分钟）
  - ping五步法 + ipconfig /all + arp -a

- 🟡 **进阶任务**（选做，25分钟）
  - tracert路由跟踪 + nslookup DNS查询

- 🔴 **挑战任务**（选做，15分钟）
  - 网络故障诊断实战

**提交：** 实验报告（按教材附录A格式）

---

# 思考点

1. 这些命令在什么场合下使用？

> 引导方向：网络管理员日常监控 / 普通用户报修前自测 / 安全审计发现ARP欺骗

2. 为什么`arp -a`只显示很少几条记录？

> 因为ARP缓存是动态的，只保留最近通信过的IP→MAC映射

3. `tracert` 中出现 `* * *` 一定代表链路断了吗？

> 不一定！可能是路由器防火墙屏蔽了ICMP超时消息

---

# 小结 + 预告

**本课要点：**
- 学了5个命令：ping / ipconfig / arp / tracert / nslookup
- 核心方法：**从内到外，层层排除**（127.0.0.1→域名）

**下次课：Exp 2 子网划分与IP地址分配** ❗难点

**预习：** IP地址分类、子网掩码计算
