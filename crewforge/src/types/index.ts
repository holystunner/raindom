export type AgentStatus = 'idle' | 'executing' | 'thinking' | 'reviewing' | 'completed' | 'error';

export interface CrewAIAgent {
  id: string;
  name: string;
  role: string;
  goal: string;
  backstory: string;
  tools: string[];
  verbose: boolean;
  allowDelegation: boolean;
  avatarIcon: string;
  color: string;
}

export interface CrewAITask {
  id: string;
  title: string;
  description: string;
  expectedOutput: string;
  agentId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  output?: string;
  asyncExecution?: boolean;
}

export interface CrewAICrew {
  id: string;
  name: string;
  description: string;
  category: 'Intelligence' | 'Engineering' | 'Growth' | 'Security' | 'Operations';
  process: 'sequential' | 'hierarchical';
  managerAgentRole?: string;
  agents: CrewAIAgent[];
  tasks: CrewAITask[];
  memoryEnabled: boolean;
  cacheEnabled: boolean;
  maxRpm: number;
  uploadedAt: string;
  rawConfigCode?: string;
}

export type IntegrationProvider = 
  | 'github' 
  | 'slack' 
  | 'linear' 
  | 'postgres' 
  | 'aws' 
  | 'stripe' 
  | 'discord' 
  | 'custom_webhook' 
  | 'custom_openapi';

export interface IntegrationCredential {
  id: string;
  name: string;
  provider: IntegrationProvider;
  keyName: string;
  maskedValue: string;
  rawValue?: string;
  endpointUrl?: string;
  isHealthy: boolean;
  lastVerified: string;
  description: string;
  category: 'VCS' | 'Communication' | 'Database' | 'Cloud' | 'API Gateway';
}

export interface ProjectDirectingFile {
  id: string;
  filename: string;
  title: string;
  fileType: 'markdown' | 'json' | 'yaml' | 'text' | 'python';
  content: string;
  sizeBytes: number;
  purpose: string;
  updatedAt: string;
  tags: string[];
}

export type OpenApiProvider = 'openai' | 'openrouter' | 'groq' | 'ollama' | 'custom_openapi';

export interface ManagementAgentConfig {
  provider: OpenApiProvider;
  apiEndpoint: string;
  apiKey: string;
  model: string;
  systemPrompt: string;
  autonomousPollingRateSec: number;
  maxAutonomousTurns: number;
  fallbackFailover: boolean;
  openApiSpecUrl?: string;
  customHeaders?: Record<string, string>;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  workforceId: string;
  agentName: string;
  agentRole?: string;
  logType: 'thought' | 'action' | 'tool_call' | 'observation' | 'system' | 'delegation' | 'error' | 'final_answer';
  message: string;
  details?: Record<string, any>;
}

export interface AgentLiveState {
  status: AgentStatus;
  currentAction?: string;
  lastToolUsed?: string;
  activeTaskTitle?: string;
  lastHeartbeat: string;
  completedTasksCount: number;
}

export interface SpawnedWorkforce {
  id: string;
  name: string;
  slug: string;
  clusterTarget: 'cloud-run' | 'aws-ecs' | 'fly-io' | 'k8s-cluster' | 'custom-docker';
  cloudRegion: string;
  cloudAppUrl: string;
  webhookUrl: string;
  status: 'provisioning' | 'active' | 'degraded' | 'paused' | 'terminated';
  createdAt: string;
  crewIds: string[];
  integrationIds: string[];
  directingFileIds: string[];
  managementAgent: ManagementAgentConfig;
  telemetry: {
    cpuPercent: number;
    memoryMb: number;
    allocatedMemoryMb: number;
    activeAgentsCount: number;
    totalTasksCompleted: number;
    tasksInProgress: number;
    tokensConsumed: number;
    uptimeSeconds: number;
    costEstimateUsd: number;
    eventsDispatched: number;
  };
  agentStates: Record<string, AgentLiveState>;
  executionLogs: ExecutionLog[];
}
