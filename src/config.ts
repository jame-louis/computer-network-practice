// Site configuration
export const site = {
  title: '计算机网络实验',
  description: '物联网工程专业核心实践必修课，2周集中授课，24学时纯实验',
  lang: 'zh-CN',
  separator: ' - ',
} as const;

// Course information
export const courseInfo = {
  name: '教学实践Ⅲ:计算机网络实验',
  subtitle: '专业必修',
  description: '面向物联网工程大三学生的网络核心实践课程，基于 Cisco Packet Tracer 7.0 平台，覆盖子网划分、VLAN、路由协议、ACL、NAT 等 12 个实验，培养学生网络设备配置与网络规划设计能力。',
  textbook: '《计算机网络实验指导书》郭雅，电子工业出版社，2018',
  prerequisites: '《计算机网络(计算机)》',
  assessment: '出勤(10%) + 平时(20%) + 期末综合设计(70%)',
} as const;

// Home page actions
export const homeActions = {
  primary: { label: '开始实验', href: '/lectures' },
  secondary: { label: '查看大纲', href: '/syllabus' },
} as const;

// Navigation
export const mainNavItems = [
  { label: '首页', href: '/' },
  { label: '课程大纲', href: '/syllabus' },
  { label: '实验', href: '/lectures' },
  { label: '作业', href: '/assignments' },
  { label: '自我检测', href: '/self-check' },
] as const;

export const footerConfig = {
  text: '教学实践Ⅲ:计算机网络实验 — 专业必修',
  copyright: '教学实践Ⅲ:计算机网络实验',
} as const;

export const pageTitles = {
  home: '首页',
  lectures: '实验列表',
  assignments: '作业',
  syllabus: '课程大纲',
  conceptMap: '知识图谱',
  selfCheck: '自我检测',
} as const;

// Course modules
export const courseModules = [
  { name: 'A. 网络基础', description: '网络诊断命令 + 子网划分与 IP 地址分配' },
  { name: 'B. 交换机', description: '交换机基本配置 + VLAN + 三层交换' },
  { name: 'C. 路由器', description: '路由器配置 + 静态路由/RIP/OSPF + ACL + NAT' },
] as const;

export const moduleNames = courseModules.map(m => m.name);

// Content defaults
export const contentDefaults = {
  duration: '2学时（120分钟）',
  submissionFormat: '学号-HWxx.zip',
} as const;

// Labels
export const labels = {
  viewAll: '查看全部 →',
  viewDetails: '查看详情 →',
  viewLecture: '查看实验 →',
  back: '← 返回',
  previous: '上一实验',
  next: '下一实验',
  none: '没有了',
  markComplete: '标记为已完成',
  completed: '已完成',
  slides: '课件',
  assignment: '作业',
} as const;

export const difficultyLabels = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级',
} as const;

// Section labels
export const lectureLabels = {
  sectionTitle: '实验列表',
  contentSectionTitle: '实验内容',
  countSuffix: '个实验',
  moduleCountTemplate: '包含 {count} 个实验',
  hasSlidesBadge: '有课件',
  hasAssignmentBadge: '有作业',
  slidevBanner: '本讲提供 Slidev 在线课件',
  relatedAssignment: '课后作业',
} as const;

export const assignmentLabels = {
  pageTitle: '实验作业',
  submissionFormat: '作业提交格式：学号-HWxx.zip',
  requirementsTitle: '作业要求',
  requirements: [
    '作业文件命名格式：学号-HWxx.zip',
    '提交截止日期前完成，逾期提交将酌情扣分',
    'Packet Tracer 拓扑文件需包含完整配置与连通性验证结果',
  ],
  downloadButton: '下载作业文件',
} as const;

export const syllabusLabels = {
  objectivesTitle: '实验目标',
  modulesTitle: '模块划分',
  scheduleTitle: '详细安排',
  courseRangeLabel: '课程范围:',
  lectureRangeTemplate: '第{start}-{end}实验',
} as const;

export const infoSectionLabels = {
  courseInfoTitle: '课程信息',
  textbookLabel: '教材',
  prerequisitesLabel: '先修课程',
  assessmentLabel: '考核方式',
} as const;

export const tocConfig = {
  title: '本页目录',
} as const;

// Course objectives (for syllabus)
export const courseObjectives = [
  '熟练掌握常用网络命令（ping/ipconfig/arp/tracert/nslookup）及其参数',
  '熟练掌握子网划分与 IP 地址分配（固定/可变长度子网掩码）',
  '熟练掌握交换机基本配置（配置模式/密码/VTY）与 VLAN 划分',
  '熟练掌握三层交换机配置（接口封装/不同 VLAN 间通信）',
  '熟练掌握路由器基本配置及静态路由、RIP、OSPF 等动态路由协议',
  '熟练掌握标准 ACL 与扩展 ACL 的配置与应用场景',
  '熟练掌握 NAT 配置（静态 NAT/动态 NAT/NAPT）',
  '具备网络设备配置、网络规划设计与故障排查的综合能力',
] as const;

export const categoryLabels: Record<string, string> = {
  lectures: '实验',
  assignments: '作业',
  pages: '页面',
};

export const searchLabels = {
  untitled: '无标题',
} as const;

// Progress
export const progressLabels = {
  label: '实验进度',
} as const;

// Search
export const searchConfig = {
  placeholder: '搜索实验内容...',
  emptyState: '输入关键词开始搜索...',
  noResults: '未找到相关结果',
} as const;
