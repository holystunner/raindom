import { CrewAICrew, IntegrationCredential, ProjectDirectingFile, SpawnedWorkforce, ManagementAgentConfig } from '../types';

export const DEFAULT_CREWS: CrewAICrew[] = [
  {
    id: 'crew-market-alpha',
    name: 'Market Intelligence & Quantitative Alpha Crew',
    description: 'Autonomous financial analyst crew that scrapes regulatory filings, competitor earnings calls, and sentiment indexes to generate actionable market briefs.',
    category: 'Intelligence',
    process: 'hierarchical',
    managerAgentRole: 'Executive Quant Lead',
    memoryEnabled: true,
    cacheEnabled: true,
    maxRpm: 120,
    uploadedAt: '2026-09-18T10:14:00Z',
    rawConfigCode: `# CrewAI Definition - Market Alpha Intelligence
from crewai import Agent, Crew, Process, Task
from crewai_tools import SerperDevTool, ScrapeWebsiteTool

quant_lead = Agent(
    role="Executive Quant Lead",
    goal="Synthesize raw intelligence and delegate signal verification",
    backstory="Former hedge fund director of research specializing in automated market signals.",
    allow_delegation=True,
    verbose=True
)

data_scout = Agent(
    role="SEC Filings & Data Scout",
    goal="Extract quantitative metrics and 10-K risk disclosures",
    backstory="Expert forensic accountant and algorithmic data crawler.",
    tools=["SEC_Crawler_Tool", "Financial_Ratio_Tool"],
    verbose=True
)

sentiment_analyst = Agent(
    role="Sentiment & Catalyst Analyst",
    goal="Analyze public sentiment, insider transactions, and earnings calls",
    backstory="Natural language quantitative specialist with deep market micro-structure knowledge.",
    tools=["News_Sentiment_Tool", "Social_Signal_Tool"],
    verbose=True
)

crew = Crew(
    agents=[quant_lead, data_scout, sentiment_analyst],
    tasks=[
        Task(description="Scrape target sector 10-Q/10-K filings and extract balance sheet changes.", agent=data_scout),
        Task(description="Gauge market sentiment trends and flag divergence catalysts.", agent=sentiment_analyst),
        Task(description="Compile unified executive alpha briefing with risk ratings.", agent=quant_lead)
    ],
    process=Process.hierarchical,
    manager_agent=quant_lead
)`,
    agents: [
      {
        id: 'agent-quant-lead',
        name: 'Victor Vance',
        role: 'Executive Quant Lead',
        goal: 'Synthesize raw intelligence and delegate signal verification with strict risk thresholds.',
        backstory: 'Former hedge fund director of quantitative research with 15 years in automated alpha modeling.',
        tools: ['OpenAPI_Delegate_Tool', 'Risk_Matrix_Calculator', 'Executive_Briefing_Generator'],
        verbose: true,
        allowDelegation: true,
        avatarIcon: 'ShieldAlert',
        color: '#38bdf8' // sky-400
      },
      {
        id: 'agent-data-scout',
        name: 'Elena Rostova',
        role: 'SEC Filings & Data Scout',
        goal: 'Extract financial disclosures, capital expenditure shifts, and regulatory filings.',
        backstory: 'Expert forensic accountant and algorithmic crawler who spots anomalies between GAAP and non-GAAP figures.',
        tools: ['SEC_EDGAR_Scraper', 'Financial_Statement_Parser', 'PostgreSQL_Timescale_Writer'],
        verbose: true,
        allowDelegation: false,
        avatarIcon: 'Database',
        color: '#34d399' // emerald-400
      },
      {
        id: 'agent-sentiment-analyst',
        name: 'Kaito Tanaka',
        role: 'Sentiment & Catalyst Analyst',
        goal: 'Gauge institutional sentiment shifts, social alpha signals, and supply-chain earnings mentions.',
        backstory: 'NLP quantitative researcher specializing in high-frequency sentiment scoring and executive tone analysis.',
        tools: ['Earnings_Call_Transcriber', 'Alternative_Data_Stream', 'Sentiment_Classifier'],
        verbose: true,
        allowDelegation: false,
        avatarIcon: 'TrendingUp',
        color: '#f59e0b' // amber-500
      }
    ],
    tasks: [
      {
        id: 'task-market-1',
        title: 'Extract Q3 balance sheet anomalies and capital investments',
        description: 'Scan all filed 10-Q and 8-K reports across designated cloud infrastructure providers for unexpected capex increases.',
        expectedOutput: 'Clean JSON summary table of capex variance, debt maturities, and liquidity ratios.',
        agentId: 'agent-data-scout',
        status: 'completed',
        output: 'Found +18.4% YoY surge in GPU datacenter capex across Tier-1 hyperscalers.'
      },
      {
        id: 'task-market-2',
        title: 'Compute institutional positioning and insider disposition',
        description: 'Cross-reference Form 4 insider transactions against recent earnings call tonality scores.',
        expectedOutput: 'Categorized sentiment scores with high-confidence bullish/bearish flags.',
        agentId: 'agent-sentiment-analyst',
        status: 'in_progress'
      },
      {
        id: 'task-market-3',
        title: 'Publish Executive Alpha Memorandum',
        description: 'Synthesize data scout outputs into actionable risk-weighted strategy recommendations.',
        expectedOutput: 'Markdown formatted memorandum ready for dispatch to Slack / Linear.',
        agentId: 'agent-quant-lead',
        status: 'pending'
      }
    ]
  },
  {
    id: 'crew-devops-qa',
    name: 'Full-Stack Dev & Code QA Autonomous Crew',
    description: 'Autonomous development crew that breaks down feature RFCs, writes production pull requests, executes test suites, and conducts static security analysis.',
    category: 'Engineering',
    process: 'sequential',
    memoryEnabled: true,
    cacheEnabled: true,
    maxRpm: 180,
    uploadedAt: '2026-09-19T14:30:00Z',
    rawConfigCode: `# CrewAI Definition - Full-Stack Dev & QA
from crewai import Agent, Crew, Process, Task

architect = Agent(role="Lead Software Architect", goal="Breakdown feature specs into modular atomic PRs", backstory="10x architect who designs clean OpenAPI interfaces.")
engineer = Agent(role="Autonomous Senior Software Engineer", goal="Implement type-safe TypeScript/Go code with unit tests", backstory="Hardcore coder obsessed with test coverage.")
qa_auditor = Agent(role="Security & Pentest Auditor", goal="Audit PRs for OWASP vulnerabilities and code smells", backstory="Red-team hacker turned automated code reviewer.")

crew = Crew(agents=[architect, engineer, qa_auditor], process=Process.sequential)
`,
    agents: [
      {
        id: 'agent-arch-lead',
        name: 'Dr. Evelyn Cross',
        role: 'Lead Software Architect',
        goal: 'Deconstruct complex functional requirements into strict OpenAPI contracts and atomic pull requests.',
        backstory: 'Ex-Staff Architect at high-throughput payments company, obsessed with idempotency and clean interfaces.',
        tools: ['OpenAPI_Contract_Validator', 'GitHub_PR_Decomposer', 'Directing_File_Reader'],
        verbose: true,
        allowDelegation: true,
        avatarIcon: 'Cpu',
        color: '#818cf8' // indigo-400
      },
      {
        id: 'agent-eng-worker',
        name: 'Dev-Agent 09',
        role: 'Autonomous Senior Software Engineer',
        goal: 'Write clean, resilient TypeScript & Go microservices code with 90%+ unit test coverage.',
        backstory: 'High-speed synthetic engineer with deep fluency in distributed systems, async runtimes, and ORMs.',
        tools: ['GitHub_Commit_Pusher', 'Docker_Container_Runner', 'Vitest_Test_Executor'],
        verbose: true,
        allowDelegation: false,
        avatarIcon: 'Terminal',
        color: '#22d3ee' // cyan-400
      },
      {
        id: 'agent-sec-qa',
        name: 'Cipher-7',
        role: 'Security & Pentest Auditor',
        goal: 'Examine diffs for OWASP Top 10 vulnerabilities, unauthorized credential exposure, and race conditions.',
        backstory: 'Former black-hat security researcher specializing in taint analysis, AST vulnerability scanners, and fuzzing.',
        tools: ['Semgrep_SAST_Scanner', 'Dependency_CVE_Checker', 'Linear_Issue_Creator'],
        verbose: true,
        allowDelegation: false,
        avatarIcon: 'Lock',
        color: '#f43f5e' // rose-500
      }
    ],
    tasks: [
      {
        id: 'task-dev-1',
        title: 'Generate OpenAPI 3.1 Spec for Workforce Webhooks',
        description: 'Read the Directing Files and synthesize JSON schemas for incoming event triggers.',
        expectedOutput: 'Valid OpenAPI 3.1 document with request/response definitions and status codes.',
        agentId: 'agent-arch-lead',
        status: 'completed',
        output: 'Drafted and validated OpenAPI 3.1 schemas across 6 event routes.'
      },
      {
        id: 'task-dev-2',
        title: 'Implement Webhook Verification Middleware',
        description: 'Implement HMAC-SHA256 signature verification in Express/TypeScript runtime with test fixtures.',
        expectedOutput: 'Merged PR with 10 passing unit tests and zero lint errors.',
        agentId: 'agent-eng-worker',
        status: 'in_progress'
      },
      {
        id: 'task-dev-3',
        title: 'Execute SAST Security Audit & Fuzz Testing',
        description: 'Run static analysis against new cryptographic verification logic to prevent timing attacks.',
        expectedOutput: 'Clean security audit clearance sign-off.',
        agentId: 'agent-sec-qa',
        status: 'pending'
      }
    ]
  },
  {
    id: 'crew-saas-growth',
    name: 'Autonomous SaaS Outbound & Growth Crew',
    description: 'High-conversion growth team that maps Ideal Customer Profiles, discovers key decision makers, drafts customized value briefs, and coordinates pipeline sequences.',
    category: 'Growth',
    process: 'hierarchical',
    managerAgentRole: 'VP of Growth Operations',
    memoryEnabled: true,
    cacheEnabled: false,
    maxRpm: 90,
    uploadedAt: '2026-09-20T08:00:00Z',
    rawConfigCode: `# CrewAI Definition - Autonomous SaaS Outbound
from crewai import Agent, Crew, Process, Task

growth_lead = Agent(role="VP of Growth Operations", goal="Orchestrate outbound experiments and validate lead quality")
prospector = Agent(role="ICP Lead Prospector", goal="Identify high-intent enterprise targets from trigger events")
copywriter = Agent(role="Hyper-Personalized Copywriter", goal="Draft compelling, non-generic messaging referencing real pain points")

crew = Crew(agents=[growth_lead, prospector, copywriter], process=Process.hierarchical, manager_agent=growth_lead)
`,
    agents: [
      {
        id: 'agent-growth-lead',
        name: 'Sarah Chen',
        role: 'VP of Growth Operations',
        goal: 'Orchestrate pipeline experiments, enforce brand voice from Directing Files, and monitor conversion metrics.',
        backstory: 'Early growth hire at 3 hyper-growth B2B developer tool unicorns with extensive cohort modeling experience.',
        tools: ['HubSpot_Pipeline_API', 'Growth_Experiment_Tracker', 'Slack_Notification_Tool'],
        verbose: true,
        allowDelegation: true,
        avatarIcon: 'Flame',
        color: '#fb923c' // orange-400
      },
      {
        id: 'agent-prospector',
        name: 'Atlas Scout',
        role: 'ICP Lead Prospector',
        goal: 'Identify enterprise engineering teams expanding Kubernetes or multi-agent workloads from public signals.',
        backstory: 'B2B intelligence miner who tracks company job postings, open source repositories, and executive changes.',
        tools: ['GitHub_Org_Analyzer', 'Clearbit_Enrichment_API', 'Tech_Stack_Fingerprinter'],
        verbose: true,
        allowDelegation: false,
        avatarIcon: 'Search',
        color: '#a78bfa' // purple-400
      },
      {
        id: 'agent-copywriter',
        name: 'Maya Lin',
        role: 'Hyper-Personalized Copywriter',
        goal: 'Draft crisp, problem-first email and LinkedIn messages with zero boilerplate fluff.',
        backstory: 'Award-winning technical copywriter who writes like an engineer talking to an engineer.',
        tools: ['Directing_File_Tone_Guide', 'Deliverability_Spam_Checker', 'Outreach_Draft_Sequencer'],
        verbose: true,
        allowDelegation: false,
        avatarIcon: 'PenTool',
        color: '#ec4899' // pink-500
      }
    ],
    tasks: [
      {
        id: 'task-growth-1',
        title: 'Filter Top 50 FinTechs with active AI Ops job listings',
        description: 'Query enrichment endpoints for companies with 50+ engineers hiring for Agentic Infrastructure roles.',
        expectedOutput: 'Enriched CSV/JSON list of 50 target accounts with verified decision maker emails.',
        agentId: 'agent-prospector',
        status: 'completed',
        output: '50 target companies identified; 42 verified CTO/VP Eng contacts stored in vault.'
      },
      {
        id: 'task-growth-2',
        title: 'Draft contextual cold brief referencing recent infra outages',
        description: 'Read Directing Files for our product differentiation and draft 3-touch sequence.',
        expectedOutput: 'Personalized 3-step sequence ready for review.',
        agentId: 'agent-copywriter',
        status: 'in_progress'
      }
    ]
  },
  {
    id: 'crew-incident-ops',
    name: 'Cyber Incident Response & Infra SRE Crew',
    description: 'Mission-critical autonomous crew that monitors real-time telemetry, mitigates DDoS/abnormal load spikes, and executes automated runbooks.',
    category: 'Security',
    process: 'hierarchical',
    managerAgentRole: 'Lead Incident Commander',
    memoryEnabled: true,
    cacheEnabled: true,
    maxRpm: 240,
    uploadedAt: '2026-09-22T11:15:00Z',
    agents: [
      {
        id: 'agent-sre-commander',
        name: 'Major Marcus Vance',
        role: 'Lead Incident Commander',
        goal: 'Maintain 99.999% cloud service availability and orchestrate automated failovers under DDoS/anomalies.',
        backstory: 'Ex-military network systems officer and principal site reliability engineer.',
        tools: ['PagerDuty_Escalator', 'AWS_ECS_Scaler', 'Cloudflare_WAF_Blocker'],
        verbose: true,
        allowDelegation: true,
        avatarIcon: 'Radio',
        color: '#ef4444' // red-500
      },
      {
        id: 'agent-telemetry-watcher',
        name: 'Sentinel-01',
        role: 'Distributed Telemetry Watcher',
        goal: 'Detect microsecond latency spikes, database connection pool exhaustion, and memory leaks.',
        backstory: 'High-frequency metric ingest agent tracking 50,000 datapoints/sec with statistical outlier detection.',
        tools: ['Prometheus_PromQL_Tool', 'PostgreSQL_PG_Stat_Inspector', 'AWS_CloudWatch_Metrics'],
        verbose: true,
        allowDelegation: false,
        avatarIcon: 'Activity',
        color: '#06b6d4' // cyan-500
      }
    ],
    tasks: [
      {
        id: 'task-sre-1',
        title: 'Monitor P99 latency across all active cluster ingress pods',
        description: 'Continuously sample response times and trigger alert if P99 exceeds 180ms over 3 minutes.',
        expectedOutput: 'Real-time telemetry stream and automated mitigations logged.',
        agentId: 'agent-telemetry-watcher',
        status: 'in_progress'
      }
    ]
  }
];

export const DEFAULT_INTEGRATIONS: IntegrationCredential[] = [
  {
    id: 'int-github',
    name: 'GitHub Enterprise Org Token',
    provider: 'github',
    keyName: 'GITHUB_PAT_CREW_RUNNER',
    maskedValue: 'ghp_••••••••••••••••••••••••••••7F2b',
    endpointUrl: 'https://api.github.com',
    isHealthy: true,
    lastVerified: 'Just now (HTTP 200 OK)',
    description: 'Provides repo access, commit pushing, and pull request management for software engineering crews.',
    category: 'VCS'
  },
  {
    id: 'int-slack',
    name: 'Slack Mission Control Webhook',
    provider: 'slack',
    keyName: 'SLACK_WEBHOOK_OPS_CHANNEL',
    maskedValue: 'https://hooks.slack.com/services/T09•••/B08•••/••••99',
    endpointUrl: 'https://hooks.slack.com/services/...',
    isHealthy: true,
    lastVerified: '2 mins ago (HTTP 200 OK)',
    description: 'Dispatches real-time agent thoughts, critical incident escalations, and executive summaries to #ai-ops-war-room.',
    category: 'Communication'
  },
  {
    id: 'int-linear',
    name: 'Linear Engineering Workspace',
    provider: 'linear',
    keyName: 'LINEAR_API_KEY',
    maskedValue: 'lin_api_••••••••••••••••••••••••••48kL',
    endpointUrl: 'https://api.linear.app/graphql',
    isHealthy: true,
    lastVerified: '12 mins ago (HTTP 200 OK)',
    description: 'Automates issue assignment, bug ticket creation, and project status tracking.',
    category: 'Communication'
  },
  {
    id: 'int-postgres',
    name: 'PostgreSQL Timescale Read/Write Node',
    provider: 'postgres',
    keyName: 'DATABASE_URL_ANALYTICS',
    maskedValue: 'postgresql://aether_ops:••••••••@db.us-east-1.cloud.net:5432/telemetry_db',
    endpointUrl: 'db.us-east-1.cloud.net:5432',
    isHealthy: true,
    lastVerified: 'Just now (Latency 4ms)',
    description: 'Central persistence store for market scraping, agent memory vectors, and telemetry dumps.',
    category: 'Database'
  },
  {
    id: 'int-aws',
    name: 'AWS CloudWatch & ECS Orchestrator',
    provider: 'aws',
    keyName: 'AWS_ACCESS_KEY_SECRET',
    maskedValue: 'AKIA••••••••••••••••4N7Q',
    endpointUrl: 'https://ecs.us-east-1.amazonaws.com',
    isHealthy: true,
    lastVerified: '5 mins ago (HTTP 200 OK)',
    description: 'Used for dynamic cluster auto-scaling, container provisioning, and log sink shipping.',
    category: 'Cloud'
  },
  {
    id: 'int-custom-openapi',
    name: 'Enterprise Internal Microservices Gateway',
    provider: 'custom_openapi',
    keyName: 'INTERNAL_GATEWAY_BEARER_TOKEN',
    maskedValue: 'int_jwt_••••••••••••••••••••••••••11cE',
    endpointUrl: 'https://internal-api.corp.enterprise.net/v2/openapi.json',
    isHealthy: true,
    lastVerified: '18 mins ago (HTTP 200 OK)',
    description: 'Direct OpenAPI 3.0 gateway exposing CRM, billing, and internal microservice endpoints to the Management Agent.',
    category: 'API Gateway'
  }
];

export const DEFAULT_DIRECTING_FILES: ProjectDirectingFile[] = [
  {
    id: 'file-mission-directive',
    filename: 'MISSION_DIRECTIVES_v4.md',
    title: 'Autonomous Workforce Mission Directives & Guardrails',
    fileType: 'markdown',
    sizeBytes: 4180,
    purpose: 'Core operating rules, human-in-the-loop escalation criteria, and decision authority limits for the Management Agent.',
    updatedAt: '2026-09-23T16:40:00Z',
    tags: ['Governance', 'Safety', 'Directives'],
    content: `# AETHEROPS // WORKFORCE DIRECTING DIRECTIVES v4.2

## SECTION 1: AUTONOMOUS OPERATIONAL BOUNDARIES
1. The Management Agent holds supervisory authority over attached CrewAI Crews.
2. Under NO circumstances shall an autonomous agent deploy destructive SQL commands (DROP, TRUNCATE, DELETE without WHERE clause) to production databases.
3. Every external API invocation involving financial balances (> $100) or public announcements requires explicit Operator Confirmation via Slack or the Management Console.

## SECTION 2: HIERARCHICAL ESCALATION LADDER
- LEVEL 1 (Sub-agent hesitation / Tool failure): Attempt retry with secondary tool or alternate provider up to 3 times.
- LEVEL 2 (Task ambiguity / conflicting inputs): Escalate to Executive Management Agent for synthetic arbitration.
- LEVEL 3 (Security vulnerability / credential breach detection): IMMEDIATE EMERGENCY HALT on worker node + dispatch webhook alert.

## SECTION 3: DIRECT OPENAPI INTERACTION POLICY
- The Management Agent interacts strictly via standard OpenAPI 3.0 specification endpoints.
- No proprietary cloud wrappers or black-box reasoning layers.
- Full inspection of tool call payloads must be recorded to the Execution Log.`
  },
  {
    id: 'file-rfc-arch',
    filename: 'SYSTEM_ARCHITECTURE_RFC_09.md',
    title: 'System Architecture & Schema Contracts',
    fileType: 'markdown',
    sizeBytes: 6240,
    purpose: 'Technical blueprint outlining container endpoints, database schema relations, and API payload expectations.',
    updatedAt: '2026-09-22T09:12:00Z',
    tags: ['Architecture', 'Contracts', 'Engineering'],
    content: `# RFC 09: AUTONOMOUS CONTAINER RUNTIME SPECIFICATION

## Overview
This document defines the containerized web app runtime into which the workforce is spawned.

### Runtime Endpoints
- GET  /healthz        - Health probe & cluster readiness
- POST /api/v1/webhook - Dynamic event ingestion (GitHub, Slack, Custom)
- POST /api/v1/direct  - High-priority Operator directive injection
- GET  /api/v1/metrics - Prometheus-compatible telemetry stream

### Concurrency Limits
- Maximum concurrent active agents per container: 8
- In-memory event queue depth: 500 tasks
- Task timeout ceiling: 120,000ms (2 minutes)`
  },
  {
    id: 'file-sec-sop',
    filename: 'SECURITY_COMPLIANCE_SOP.json',
    title: 'Security Compliance Rules & Secret Redaction SOP',
    fileType: 'json',
    sizeBytes: 2890,
    purpose: 'Machine-readable JSON schema of disallowed regex patterns, secret maskers, and compliance audit flags.',
    updatedAt: '2026-09-21T18:00:00Z',
    tags: ['Security', 'JSON', 'Compliance'],
    content: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "version": "2.4.0",
  "policyName": "AetherOps Zero-Leak Enforcer",
  "disallowedPatterns": [
    "(?i)sk-[a-zA-Z0-9]{20,}",
    "(?i)ghp_[a-zA-Z0-9]{36}",
    "(?i)xoxb-[a-zA-Z0-9-]{24,}",
    "(?i)AKIA[0-9A-Z]{16}"
  ],
  "auditRequirements": {
    "logRedaction": true,
    "requireHmacWebhookVerification": true,
    "sandboxFilesystemAccess": true,
    "maxTokenWindowPerTurn": 16384
  }
}`
  },
  {
    id: 'file-sop-deployment',
    filename: 'CREW_DELEGATION_PROTOCOL.yaml',
    title: 'CrewAI Hierarchical Delegation Protocols',
    fileType: 'yaml',
    sizeBytes: 1980,
    purpose: 'YAML configuration mapping which crew agents receive tasks based on incoming webhook event topics.',
    updatedAt: '2026-09-20T12:00:00Z',
    tags: ['CrewAI', 'Delegation', 'YAML'],
    content: `version: "1.2"
routing_matrix:
  - event_type: "github.pull_request.opened"
    target_crew: "crew-devops-qa"
    primary_agent: "agent-sec-qa"
    fallback_agent: "agent-eng-worker"
    auto_acknowledge: true

  - event_type: "market.sec_filing.detected"
    target_crew: "crew-market-alpha"
    primary_agent: "agent-data-scout"
    fallback_agent: "agent-quant-lead"
    auto_acknowledge: true

  - event_type: "pipeline.lead.inbound"
    target_crew: "crew-saas-growth"
    primary_agent: "agent-growth-lead"
    auto_acknowledge: false`
  }
];

export const DEFAULT_MANAGEMENT_AGENT_CONFIG: ManagementAgentConfig = {
  provider: 'openai',
  apiEndpoint: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o',
  systemPrompt: `You are the Autonomous Operations Management Agent orchestrating a deployed CrewAI workforce inside a cloud-hosted web application.
Your role:
1. Receive high-level operator directives and external webhook triggers.
2. Consult attached Directing Files (SOPs, Mission Directives, System Architecture) before delegating.
3. Coordinate and supervise CrewAI agents (Executive Quant, Data Scout, Senior Dev, Security Auditor, Growth Lead).
4. Direct tool execution through standard OpenAPI 3.0 contracts.
5. Report concise execution telemetry, state transitions, and anomaly resolutions.
You operate with direct OpenAPI execution: zero proprietary fluff, deterministic, transparent, and proactive.`,
  autonomousPollingRateSec: 5,
  maxAutonomousTurns: 25,
  fallbackFailover: true,
  openApiSpecUrl: 'https://api.aetherops.cloud/v1/management-agent-spec.json'
};

export const INITIAL_SPAWNED_WORKFORCE: SpawnedWorkforce = {
  id: 'wf-alpha-7729',
  name: 'Titan Alpha // Live Cloud Operations',
  slug: 'titan-alpha',
  clusterTarget: 'cloud-run',
  cloudRegion: 'us-central1 (Iowa)',
  cloudAppUrl: 'https://wf-titan-alpha-live.aetherops.run.app',
  webhookUrl: 'https://wf-titan-alpha-live.aetherops.run.app/api/v1/webhook',
  status: 'active',
  createdAt: '2026-09-24T06:12:30Z',
  crewIds: ['crew-market-alpha', 'crew-devops-qa'],
  integrationIds: ['int-github', 'int-slack', 'int-postgres', 'int-custom-openapi'],
  directingFileIds: ['file-mission-directive', 'file-rfc-arch', 'file-sec-sop'],
  managementAgent: {
    ...DEFAULT_MANAGEMENT_AGENT_CONFIG,
    model: 'gpt-4o'
  },
  telemetry: {
    cpuPercent: 34.2,
    memoryMb: 418,
    allocatedMemoryMb: 2048,
    activeAgentsCount: 6,
    totalTasksCompleted: 48,
    tasksInProgress: 3,
    tokensConsumed: 284120,
    uptimeSeconds: 1620,
    costEstimateUsd: 1.42,
    eventsDispatched: 194
  },
  agentStates: {
    'agent-quant-lead': {
      status: 'reviewing',
      currentAction: 'Validating hedge ratio delta from Q3 hyperscaler Capex disclosures',
      lastToolUsed: 'Risk_Matrix_Calculator',
      activeTaskTitle: 'Publish Executive Alpha Memorandum',
      lastHeartbeat: '12s ago',
      completedTasksCount: 14
    },
    'agent-data-scout': {
      status: 'executing',
      currentAction: 'Executing PostgreSQL bulk query for trailing 12-month GPU datacenter depreciation',
      lastToolUsed: 'PostgreSQL_Timescale_Writer',
      activeTaskTitle: 'Extract Q3 balance sheet anomalies and capital investments',
      lastHeartbeat: '4s ago',
      completedTasksCount: 22
    },
    'agent-sentiment-analyst': {
      status: 'thinking',
      currentAction: 'Analyzing earnings call transcripts across semiconductor supply chain',
      lastToolUsed: 'Alternative_Data_Stream',
      activeTaskTitle: 'Compute institutional positioning and insider disposition',
      lastHeartbeat: '8s ago',
      completedTasksCount: 12
    },
    'agent-arch-lead': {
      status: 'idle',
      currentAction: 'Standby for incoming webhook dispatch',
      lastToolUsed: 'OpenAPI_Contract_Validator',
      lastHeartbeat: '15s ago',
      completedTasksCount: 9
    },
    'agent-eng-worker': {
      status: 'executing',
      currentAction: 'Compiling TypeScript test suite for HMAC webhook signature verification',
      lastToolUsed: 'Vitest_Test_Executor',
      activeTaskTitle: 'Implement Webhook Verification Middleware',
      lastHeartbeat: '3s ago',
      completedTasksCount: 18
    },
    'agent-sec-qa': {
      status: 'thinking',
      currentAction: 'Parsing git diff AST for timing attack vulnerabilities',
      lastToolUsed: 'Semgrep_SAST_Scanner',
      activeTaskTitle: 'Execute SAST Security Audit & Fuzz Testing',
      lastHeartbeat: '6s ago',
      completedTasksCount: 16
    }
  },
  executionLogs: [
    {
      id: 'log-1',
      timestamp: '06:35:12',
      workforceId: 'wf-alpha-7729',
      agentName: 'Management Agent (Direct OpenAPI)',
      agentRole: 'Autonomous Orchestrator',
      logType: 'system',
      message: 'Workforce initialized in Cloud Run container [wf-titan-alpha-live]. Direct OpenAPI controller online. Injected 4 credentials and 3 directing files into runtime memory.'
    },
    {
      id: 'log-2',
      timestamp: '06:35:14',
      workforceId: 'wf-alpha-7729',
      agentName: 'Management Agent (Direct OpenAPI)',
      agentRole: 'Autonomous Orchestrator',
      logType: 'thought',
      message: 'Reading Directing File [MISSION_DIRECTIVES_v4.md]. Identified requirement: cross-crew arbitration must maintain strict audit logging and level-2 escalation hooks.'
    },
    {
      id: 'log-3',
      timestamp: '06:35:40',
      workforceId: 'wf-alpha-7729',
      agentName: 'Victor Vance',
      agentRole: 'Executive Quant Lead',
      logType: 'delegation',
      message: 'Delegated task "Extract Q3 balance sheet anomalies" to Elena Rostova (Data Scout). Awaiting raw SEC EDGAR filing parse.'
    },
    {
      id: 'log-4',
      timestamp: '06:36:01',
      workforceId: 'wf-alpha-7729',
      agentName: 'Elena Rostova',
      agentRole: 'SEC Filings & Data Scout',
      logType: 'tool_call',
      message: 'Invoked tool [SEC_EDGAR_Scraper] on CIK 0001018724 (Amazon), 0001652044 (Alphabet), 0000789019 (Microsoft). Target item: Item 2 MD&A Capex commitments.'
    },
    {
      id: 'log-5',
      timestamp: '06:36:22',
      workforceId: 'wf-alpha-7729',
      agentName: 'Elena Rostova',
      agentRole: 'SEC Filings & Data Scout',
      logType: 'observation',
      message: 'Extracted +18.4% YoY surge in GPU datacenter hardware lease commitments. Committing normalized timeseries to PostgreSQL replica.'
    },
    {
      id: 'log-6',
      timestamp: '06:36:45',
      workforceId: 'wf-alpha-7729',
      agentName: 'Dev-Agent 09',
      agentRole: 'Autonomous Senior Software Engineer',
      logType: 'tool_call',
      message: 'Invoked tool [GitHub_Commit_Pusher] on branch `feat/webhook-hmac-verifier`. Committed 4 files with zero syntax errors.'
    },
    {
      id: 'log-7',
      timestamp: '06:37:10',
      workforceId: 'wf-alpha-7729',
      agentName: 'Cipher-7',
      agentRole: 'Security & Pentest Auditor',
      logType: 'thought',
      message: 'Inspecting HMAC comparison logic. Verifying crypto.timingSafeEqual is used instead of standard === to prevent timing attacks.'
    },
    {
      id: 'log-8',
      timestamp: '06:37:32',
      workforceId: 'wf-alpha-7729',
      agentName: 'Management Agent (Direct OpenAPI)',
      agentRole: 'Autonomous Orchestrator',
      logType: 'action',
      message: 'Dispatched execution status heartbeat to Slack [#ai-ops-war-room] via webhook integration. All 6 agents healthy.'
    }
  ]
};
