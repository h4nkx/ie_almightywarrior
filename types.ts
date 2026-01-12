
export enum InterviewTopic {
  // --- 核心基础与进阶精益 ---
  LEAN_PRODUCTION_TPS = '精益生产：全价值流审计与 JIT 极限挑战',
  OR_OPTIMIZATION = '运筹决策：千万级变量下的排产非线性优化',
  GIGA_RAM_UP = 'Gigafactory 极速扩产：瓶颈漂移预测与全要素生产率审计',
  AGILE_IE_PODS = '敏捷 IE：跨职能战术小组 (IE Pods) 的敏捷变革领导力',

  // --- 数字架构、AI 与元宇宙 ---
  INDUSTRIAL_LLM_GEN_AI = '工业大模型：生成式 AI 驱动的工艺参数自动调优',
  DATA_ARCHITECTURE = '工业中台：边缘计算与 5G+TSN 时序数据湖架构',
  DIGITAL_TWIN_SIM = '数字孪生：CPS 实时同步与离散事件仿真压力测试',
  PLM_DIGITAL_ASSET = '工业元宇宙：数字资产库 (Digital Asset) 与 PLM 深度集成',
  EDGE_IE_LOAD = '边缘 IE：多级边缘计算节点 (Edge Computing) 的负荷均衡',

  // --- 自动化、机器人与黑灯工厂 ---
  LIGHTS_OUT_FACTORY = '黑灯工厂：无人化架构设计与跨工序协同控制',
  AUTOMATION_ROBOTICS = '柔性自动化：群智 AGV 调度与多机协作控制协议',
  ADDITIVE_MANUFACTURING = '增材制造：分布式 3D 打印集群的物流网格优化',
  COBOT_SAFETY_AUDIT = '安全 IE：机器人协作空间 (Collaborative Workspace) 安全审计',

  // --- 垂直行业深度挑战 (新增) ---
  SEMICONDUCTOR_FAB = '半导体晶圆厂：FOUP 传输与洁净室物流极限优化',
  BIOPHARMA_FLOW = '制药工程：无菌生产线流向与冷链物流合规审计',
  SHIPBUILDING_MODULAR = '船舶工业：模块化造船与重型板材流转路径规划',
  AEROSPACE_ORBITAL = '航空航天：轨道制造环境下的 IE 建模与零重力物流',
  PREFAB_CONSTRUCTION = '建筑 IE：装配式建筑部件生产与现场吊装物流同步',
  RETAIL_FULFILLMENT = '零售 IE：前置仓自动补货与最后 1 公里配送网络优化',

  // --- 质量、维护、安全与人机工程 ---
  QUALITY_40_PDM = '质量 4.0：计算机视觉 AI 与设备全生命周期预测性维护',
  INDUSTRIAL_SECURITY = '工控安全：基于 IEC 62443 的 OT 网络纵深防护',
  COGNITIVE_HUMAN_FACTORS = '认知 IE：自动化环境下的一线员工心理负荷与人机界面优化',
  HUMAN_FACTORS_AR = '工业元宇宙：AR 辅助远程运维与认知负荷定量评估',
  SPARE_PARTS_SPIO = '维护 IE：基于备件周转率 (ITO) 的全球备件库存策略',

  // --- 供应链、物流与能源治理 ---
  SUPPLY_CHAIN_CONTROL_TOWER = '供应链控制塔：实时风险感知与自愈式全球调度',
  ESG_SMART_ENERGY = '低碳工厂：微电网 VPP 优化与碳足迹动态追踪',
  SMART_PORT_LOGISTICS = '智能港口：自动化码头 (ACT) 与多时序物流枢纽协同',
  HYDROGEN_VAL_STREAM = '氢能 IE：绿氢生产、储存与运输的全价值流风险审计',
  GEOPOLITICAL_RESILIENCE = '柔性供应链：面对地缘政治冲突的韧性恢复力仿真',

  // --- 战略决策与循环经济 ---
  EXECUTIVE_MANAGEMENT = '集团 P&L 治理：资本开支 Capex 决策与 IRR 回收审计',
  FINANCIAL_ABC = '金融 IE：基于作业成本法 (ABC) 的智能工厂盈利分析',
  RESHORING_MIGRATION = '战略 IE：后全球化背景下的“回流”生产线快速迁移',
  REMANUFACTURING_CIRCULAR = '循环经济：再制造逆向物流与全生命周期碳减排策略',
  RECYCLING_E_WASTE = '逆向 IE：电子废弃物自动拆解与贵金属回收闭环物流',
  COMPOSITE_MATERIALS = '材料 IE：新型复合材料生产流程中的能耗与效率平衡',
  DFM_PARALLEL_ENG = '设计 IE：面向制造的设计 (DFM) 与并行工程的组织优化'
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
