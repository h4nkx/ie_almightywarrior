
export enum InterviewTopic {
  LEAN_PRODUCTION_TPS = '精益生产与 TPS 价值流审计',
  OR_OPTIMIZATION = '运筹学决策优化：线性规划与博弈',
  INDUSTRIAL_SECURITY = '工控安全：OT 网络防护与安全准入',
  AUTOMATION_ROBOTICS = '柔性自动化：AGV 调度与协作机器人',
  QUALITY_40_PDM = '质量 4.0：视觉 AI 与设备预测性维护',
  GIGA_RAMP_UP = 'Gigafactory 产能爬坡与极速瓶颈消除',
  SUPPLY_CHAIN_RESILIENCE = '全球供应链抗风险韧性与实时调度',
  DATA_ARCHITECTURE = '工业中台：边缘计算与时序数据架构',
  HUMAN_FACTORS = '人机工程：认知负荷评估与外骨骼集成',
  DIGITAL_TWIN_SIM = '数字孪生：离散事件仿真与虚拟调试',
  EXECUTIVE_MANAGEMENT = '集团级 P&L 财务平衡与 IE 决策',
  ESG_SMART_ENERGY = '零碳工厂：微电网优化与碳中和路径'
}

export interface CompetencyScores {
  modeling: number;
  data: number;
  lean: number;
  finance: number;
  leadership: number;
  optimization: number;
}

export interface Message {
  role: 'interviewer' | 'candidate';
  content: string;
  isThought?: boolean;
  scoreUpdate?: Partial<CompetencyScores>;
  estimatedSalary?: number;
}

export interface InterviewState {
  topic: InterviewTopic;
  difficulty: number;
  messages: Message[];
  isThinking: boolean;
  competencies: CompetencyScores;
  currentSalary: number;
}
