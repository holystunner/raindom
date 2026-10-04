import { 
  SpawnedWorkforce, 
  CrewAICrew, 
  IntegrationCredential, 
  ProjectDirectingFile, 
  ManagementAgentConfig, 
  ExecutionLog, 
  AgentStatus 
} from '../types';
import { 
  DEFAULT_CREWS, 
  DEFAULT_INTEGRATIONS, 
  DEFAULT_DIRECTING_FILES, 
  INITIAL_SPAWNED_WORKFORCE,
  DEFAULT_MANAGEMENT_AGENT_CONFIG
} from '../data/defaultData';
import { executeDirectOpenApiTurn } from './openApiAgentService';

const STORAGE_KEY_WORKFORCES = 'aetherops_workforces_v1';
const STORAGE_KEY_CREWS = 'aetherops_crews_v1';
const STORAGE_KEY_INTEGRATIONS = 'aetherops_integrations_v1';
const STORAGE_KEY_DIRECTING_FILES = 'aetherops_directing_files_v1';

export function getStoredWorkforces(): SpawnedWorkforce[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WORKFORCES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading workforces from localStorage', e);
  }
  return [INITIAL_SPAWNED_WORKFORCE];
}

export function saveStoredWorkforces(workforces: SpawnedWorkforce[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_WORKFORCES, JSON.stringify(workforces));
  } catch (e) {
    console.error('Failed writing workforces to localStorage', e);
  }
}

export function getStoredCrews(): CrewAICrew[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CREWS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading crews from localStorage', e);
  }
  return DEFAULT_CREWS;
}

export function saveStoredCrews(crews: CrewAICrew[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CREWS, JSON.stringify(crews));
  } catch (e) {
    console.error('Failed saving crews to localStorage', e);
  }
}

export function getStoredIntegrations(): IntegrationCredential[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INTEGRATIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading integrations from localStorage', e);
  }
  return DEFAULT_INTEGRATIONS;
}

export function saveStoredIntegrations(integrations: IntegrationCredential[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_INTEGRATIONS, JSON.stringify(integrations));
  } catch (e) {
    console.error('Failed saving integrations to localStorage', e);
  }
}

export function getStoredDirectingFiles(): ProjectDirectingFile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DIRECTING_FILES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading directing files from localStorage', e);
  }
  return DEFAULT_DIRECTING_FILES;
}

export function saveStoredDirectingFiles(files: ProjectDirectingFile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_DIRECTING_FILES, JSON.stringify(files));
  } catch (e) {
    console.error('Failed saving directing files to localStorage', e);
  }
}

export function spawnNewWorkforce(params: {
  name: string;
  clusterTarget: 'cloud-run' | 'aws-ecs' | 'fly-io' | 'k8s-cluster' | 'custom-docker';
  cloudRegion: string;
  crewIds: string[];
  integrationIds: string[];
  directingFileIds: string[];
  managementAgent: ManagementAgentConfig;
  allCrews: CrewAICrew[];
}): SpawnedWorkforce {
  const id = `wf-${Math.random().toString(36).substring(2, 7)}-${Date.now().toString().slice(-4)}`;
  const slug = params.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  let cloudDomain = 'aetherops.run.app';
  if (params.clusterTarget === 'aws-ecs') cloudDomain = 'ecs.aetherops.cloud';
  else if (params.clusterTarget === 'fly-io') cloudDomain = 'fly.dev';
  else if (params.clusterTarget === 'k8s-cluster') cloudDomain = 'k8s.internal.cloud';

  const cloudAppUrl = `https://app-${slug}.${cloudDomain}`;
  const webhookUrl = `${cloudAppUrl}/api/v1/webhook`;

  const selectedCrews = params.allCrews.filter(c => params.crewIds.includes(c.id));
  const agentStates: Record<string, any> = {};

  let totalActiveAgents = 0;
  selectedCrews.forEach(crew => {
    crew.agents.forEach(agent => {
      totalActiveAgents++;
      agentStates[agent.id] = {
        status: 'thinking' as AgentStatus,
        currentAction: `Synchronizing runtime context from Directing Files for [${crew.name}]`,
        lastToolUsed: agent.tools[0] || 'Direct_OpenAPI_Hook',
        activeTaskTitle: crew.tasks[0]?.title || 'Awaiting initial delegation',
        lastHeartbeat: 'Just now',
        completedTasksCount: 0
      };
    });
  });

  const now = new Date().toLocaleTimeString();
  const initialLogs: ExecutionLog[] = [
    {
      id: `log-${Date.now()}-1`,
      timestamp: now,
      workforceId: id,
      agentName: 'AetherOps Cloud Provisioner',
      agentRole: 'Infrastructure Orchestrator',
      logType: 'system',
      message: `Container allocated on ${params.clusterTarget.toUpperCase()} [Region: ${params.cloudRegion}]. Exposed live endpoint at ${cloudAppUrl}.`
    },
    {
      id: `log-${Date.now()}-2`,
      timestamp: now,
      workforceId: id,
      agentName: 'Management Agent (Direct OpenAPI)',
      agentRole: 'Autonomous Orchestrator',
      logType: 'system',
      message: `Direct OpenAPI management agent booted with model [${params.managementAgent.model}] via [${params.managementAgent.provider}]. Connected ${params.crewIds.length} CrewAI crews, ${params.integrationIds.length} credentials, and ${params.directingFileIds.length} Directing Files.`
    },
    {
      id: `log-${Date.now()}-3`,
      timestamp: now,
      workforceId: id,
      agentName: 'Management Agent (Direct OpenAPI)',
      agentRole: 'Autonomous Orchestrator',
      logType: 'thought',
      message: `Autonomous workforce online. Listening for inbound webhooks at ${webhookUrl} and Operator directives.`
    }
  ];

  const newWf: SpawnedWorkforce = {
    id,
    name: params.name,
    slug,
    clusterTarget: params.clusterTarget,
    cloudRegion: params.cloudRegion,
    cloudAppUrl,
    webhookUrl,
    status: 'active',
    createdAt: new Date().toISOString(),
    crewIds: params.crewIds,
    integrationIds: params.integrationIds,
    directingFileIds: params.directingFileIds,
    managementAgent: params.managementAgent,
    telemetry: {
      cpuPercent: +(15 + Math.random() * 20).toFixed(1),
      memoryMb: 320,
      allocatedMemoryMb: 2048,
      activeAgentsCount: totalActiveAgents,
      totalTasksCompleted: 0,
      tasksInProgress: selectedCrews.reduce((acc, c) => acc + c.tasks.length, 0),
      tokensConsumed: 12400,
      uptimeSeconds: 0,
      costEstimateUsd: 0.05,
      eventsDispatched: 1
    },
    agentStates,
    executionLogs: initialLogs
  };

  return newWf;
}

export function generateRandomTelemetryTick(wf: SpawnedWorkforce, allCrews: CrewAICrew[]): SpawnedWorkforce {
  if (wf.status !== 'active') return wf;

  const uptime = wf.telemetry.uptimeSeconds + 3;
  const cpuJitter = Math.min(94, Math.max(12, wf.telemetry.cpuPercent + (Math.random() * 6 - 3)));
  const memJitter = Math.min(1850, Math.max(280, wf.telemetry.memoryMb + Math.floor(Math.random() * 8 - 3)));
  const newTokens = wf.telemetry.tokensConsumed + Math.floor(Math.random() * 450 + 50);
  const cost = +(wf.telemetry.costEstimateUsd + 0.0008).toFixed(4);

  // Randomly update an agent's status
  const attachedCrews = allCrews.filter(c => wf.crewIds.includes(c.id));
  const allAgents = attachedCrews.flatMap(c => c.agents);
  const updatedAgentStates = { ...wf.agentStates };

  if (allAgents.length > 0 && Math.random() > 0.6) {
    const randomAgent = allAgents[Math.floor(Math.random() * allAgents.length)];
    const current = updatedAgentStates[randomAgent.id] || {
      status: 'idle',
      currentAction: 'Standby',
      lastHeartbeat: 'Just now',
      completedTasksCount: 0
    };

    const statuses: AgentStatus[] = ['thinking', 'executing', 'reviewing', 'idle'];
    const nextStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const actionsByStatus: Record<AgentStatus, string[]> = {
      thinking: [
        'Evaluating task dependencies against Directing File constraints',
        'Synthesizing contextual embeddings for target prompt',
        'Cross-referencing OpenAPI contract definitions'
      ],
      executing: [
        `Invoking tool [${randomAgent.tools[0] || 'OpenAPI_Runner'}] on runtime target`,
        'Executing async background computation pipeline',
        'Querying PostgreSQL persistent ledger'
      ],
      reviewing: [
        'Validating output against task acceptance criteria',
        'Conducting integrity check on generated artifacts',
        'Preparing completion packet for Management Agent'
      ],
      idle: [
        'Awaiting next mission dispatch from Management Agent',
        'Monitoring event listener channel',
        'Heartbeat standby'
      ],
      completed: ['Task successfully closed'],
      error: ['Handling temporary rate limit, backoff active']
    };

    const actionList = actionsByStatus[nextStatus];
    const pickedAction = actionList[Math.floor(Math.random() * actionList.length)];

    updatedAgentStates[randomAgent.id] = {
      ...current,
      status: nextStatus,
      currentAction: pickedAction,
      lastToolUsed: nextStatus === 'executing' ? (randomAgent.tools[Math.floor(Math.random() * randomAgent.tools.length)] || current.lastToolUsed) : current.lastToolUsed,
      lastHeartbeat: 'Just now'
    };
  }

  return {
    ...wf,
    telemetry: {
      ...wf.telemetry,
      uptimeSeconds: uptime,
      cpuPercent: +cpuJitter.toFixed(1),
      memoryMb: memJitter,
      tokensConsumed: newTokens,
      costEstimateUsd: cost
    },
    agentStates: updatedAgentStates
  };
}
