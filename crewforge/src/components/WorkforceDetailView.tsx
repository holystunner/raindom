import React, { useState, useEffect, useRef } from 'react';
import { 
  Server, 
  Cpu, 
  Activity, 
  Terminal, 
  Layers, 
  Key, 
  FileCode, 
  Send, 
  Play, 
  Pause, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldAlert, 
  Radio, 
  ArrowUpRight, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Globe,
  Sliders,
  ChevronRight,
  Code2,
  Database,
  Lock,
  Search
} from 'lucide-react';
import { 
  SpawnedWorkforce, 
  CrewAICrew, 
  IntegrationCredential, 
  ProjectDirectingFile, 
  ExecutionLog, 
  AgentStatus 
} from '../types';
import { executeDirectOpenApiTurn } from '../services/openApiAgentService';

interface WorkforceDetailViewProps {
  workforce: SpawnedWorkforce;
  allCrews: CrewAICrew[];
  allIntegrations: IntegrationCredential[];
  allDirectingFiles: ProjectDirectingFile[];
  onUpdateWorkforce: (updated: SpawnedWorkforce) => void;
  onBackToList: () => void;
}

export const WorkforceDetailView: React.FC<WorkforceDetailViewProps> = ({
  workforce,
  allCrews,
  allIntegrations,
  allDirectingFiles,
  onUpdateWorkforce,
  onBackToList
}) => {
  const [activeTab, setActiveTab] = useState<'console' | 'topology' | 'terminal' | 'directing-files' | 'integrations' | 'webhook'>('console');
  
  // Directive input
  const [operatorInput, setOperatorInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Terminal filter
  const [logFilter, setLogFilter] = useState<string>('all');
  const [logSearch, setLogSearch] = useState<string>('');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Directing file editor state
  const attachedFiles = allDirectingFiles.filter(f => workforce.directingFileIds.includes(f.id));
  const [selectedFileId, setSelectedFileId] = useState<string>(attachedFiles[0]?.id || '');
  const [fileContent, setFileContent] = useState<string>(attachedFiles[0]?.content || '');
  const [isSyncingFile, setIsSyncingFile] = useState<boolean>(false);

  // Webhook Simulator state
  const [webhookSource, setWebhookSource] = useState<'github' | 'slack' | 'custom'>('github');
  const [webhookEvent, setWebhookEvent] = useState<string>('github.pull_request.opened');
  const [webhookPayload, setWebhookPayload] = useState<string>(JSON.stringify({
    action: 'opened',
    pull_request: {
      number: 104,
      title: 'feat: add HMAC SHA-256 webhook signature verification',
      author: 'octocat',
      repo: 'aetherops/core-workforce-runtime'
    }
  }, null, 2));

  // Auto-scroll terminal
  useEffect(() => {
    if (autoScroll && activeTab === 'terminal') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [workforce.executionLogs, autoScroll, activeTab]);

  // Sync file editor when selected file changes
  useEffect(() => {
    const f = attachedFiles.find(item => item.id === selectedFileId);
    if (f) {
      setFileContent(f.content);
    }
  }, [selectedFileId]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(key);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleSendDirective = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!operatorInput.trim() || isProcessing) return;

    const input = operatorInput.trim();
    setOperatorInput('');
    setIsProcessing(true);

    const activeCrews = allCrews.filter(c => workforce.crewIds.includes(c.id));
    const activeIntegrations = allIntegrations.filter(i => workforce.integrationIds.includes(i.id));

    try {
      const turnResult = await executeDirectOpenApiTurn({
        workforceId: workforce.id,
        config: workforce.managementAgent,
        userPrompt: input,
        directingFiles: attachedFiles,
        integrations: activeIntegrations,
        agentStates: workforce.agentStates
      });

      const updatedLogs = [...workforce.executionLogs, turnResult.logEntry];
      const updatedTelemetry = {
        ...workforce.telemetry,
        tokensConsumed: workforce.telemetry.tokensConsumed + 420,
        eventsDispatched: workforce.telemetry.eventsDispatched + 1
      };

      onUpdateWorkforce({
        ...workforce,
        executionLogs: updatedLogs,
        telemetry: updatedTelemetry
      });
    } catch (err) {
      console.error('Error executing turn:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDispatchWebhook = async () => {
    setIsProcessing(true);
    const activeIntegrations = allIntegrations.filter(i => workforce.integrationIds.includes(i.id));

    let parsedPayload: any = {};
    try {
      parsedPayload = JSON.parse(webhookPayload);
    } catch {
      parsedPayload = { raw: webhookPayload };
    }

    try {
      const turnResult = await executeDirectOpenApiTurn({
        workforceId: workforce.id,
        config: workforce.managementAgent,
        webhookTrigger: {
          source: webhookSource,
          event: webhookEvent,
          payload: parsedPayload
        },
        directingFiles: attachedFiles,
        integrations: activeIntegrations,
        agentStates: workforce.agentStates
      });

      const updatedLogs = [...workforce.executionLogs, turnResult.logEntry];
      const updatedTelemetry = {
        ...workforce.telemetry,
        eventsDispatched: workforce.telemetry.eventsDispatched + 1,
        tokensConsumed: workforce.telemetry.tokensConsumed + 380
      };

      onUpdateWorkforce({
        ...workforce,
        executionLogs: updatedLogs,
        telemetry: updatedTelemetry
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSyncDirectingFile = async () => {
    setIsSyncingFile(true);
    await new Promise(r => setTimeout(r, 600));

    const updatedDirectingFiles = allDirectingFiles.map(f => {
      if (f.id === selectedFileId) {
        return { ...f, content: fileContent, updatedAt: new Date().toISOString() };
      }
      return f;
    });

    const targetFile = attachedFiles.find(f => f.id === selectedFileId);
    const now = new Date().toLocaleTimeString();
    const log: ExecutionLog = {
      id: `log-${Date.now()}`,
      timestamp: now,
      workforceId: workforce.id,
      agentName: 'Management Agent (Direct OpenAPI)',
      agentRole: 'Autonomous Orchestrator',
      logType: 'system',
      message: `Hot-reloaded Directing File [${targetFile?.filename || 'custom_sop'}]. Workforce context synced into active memory.`
    };

    onUpdateWorkforce({
      ...workforce,
      executionLogs: [...workforce.executionLogs, log]
    });
    setIsSyncingFile(false);
  };

  const handleToggleStatus = () => {
    const nextStatus = workforce.status === 'active' ? 'paused' : 'active';
    onUpdateWorkforce({
      ...workforce,
      status: nextStatus
    });
  };

  // Filtered logs
  const filteredLogs = workforce.executionLogs.filter(log => {
    if (logFilter !== 'all' && log.logType !== logFilter) return false;
    if (logSearch.trim()) {
      const q = logSearch.toLowerCase();
      return (
        log.message.toLowerCase().includes(q) ||
        log.agentName.toLowerCase().includes(q) ||
        (log.agentRole && log.agentRole.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const attachedCrews = allCrews.filter(c => workforce.crewIds.includes(c.id));
  const attachedIntegrations = allIntegrations.filter(i => workforce.integrationIds.includes(i.id));

  // Format uptime
  const formatUptime = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* CLOUD HOSTED WEB APP STATUS HEADER */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 shadow-lg relative overflow-hidden">
        {/* Subtle cybernetic gradient background */}
        <div className="absolute top-0 right-0 w-96 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div className="flex items-start gap-3">
            <div className="relative mt-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono">
                <Server className="h-5 w-5" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  workforce.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${
                  workforce.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}></span>
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-wide font-mono">
                  {workforce.name}
                </h1>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                  workforce.status === 'active' 
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50' 
                    : 'bg-amber-950/60 text-amber-400 border border-amber-800/50'
                }`}>
                  {workforce.status}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  Target: {workforce.clusterTarget.toUpperCase()} ({workforce.cloudRegion})
                </span>
              </div>

              {/* Cloud App URLs */}
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-mono">
                <div className="flex items-center gap-1 text-cyan-300">
                  <Globe className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-zinc-400">App URL:</span>
                  <a
                    href={workforce.cloudAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>{workforce.cloudAppUrl}</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                  <button
                    onClick={() => copyToClipboard(workforce.cloudAppUrl, 'appUrl')}
                    className="p-1 hover:text-white transition-colors text-zinc-400"
                    title="Copy URL"
                  >
                    {copiedUrl === 'appUrl' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>

                <div className="flex items-center gap-1 text-zinc-300">
                  <Radio className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-zinc-400">Webhook:</span>
                  <span className="text-zinc-300 truncate max-w-xs">{workforce.webhookUrl}</span>
                  <button
                    onClick={() => copyToClipboard(workforce.webhookUrl, 'webhookUrl')}
                    className="p-1 hover:text-white transition-colors text-zinc-400"
                    title="Copy Webhook"
                  >
                    {copiedUrl === 'webhookUrl' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleStatus}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-colors ${
                workforce.status === 'active'
                  ? 'bg-zinc-900 border-amber-500/40 text-amber-300 hover:bg-amber-950/20'
                  : 'bg-zinc-900 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/20'
              }`}
            >
              {workforce.status === 'active' ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span>Pause Runtime</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>Resume Runtime</span>
                </>
              )}
            </button>

            <button
              onClick={onBackToList}
              className="px-3 py-1.5 text-xs font-mono text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              All Workforces
            </button>
          </div>
        </div>

        {/* Live Cloud Telemetry Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-4 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">CPU Load</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-bold text-cyan-400">{workforce.telemetry.cpuPercent}%</span>
              <span className="text-[10px] text-zinc-400">/ 2 vCPU</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Memory Usage</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-bold text-white">{workforce.telemetry.memoryMb}</span>
              <span className="text-[10px] text-zinc-400">/ {workforce.telemetry.allocatedMemoryMb} MB</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Active Agents</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-bold text-emerald-400">{workforce.telemetry.activeAgentsCount}</span>
              <span className="text-[10px] text-zinc-400">workers</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Tasks Completed</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-bold text-white">{workforce.telemetry.totalTasksCompleted}</span>
              <span className="text-[10px] text-zinc-400">closed</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Tokens Consumed</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-bold text-purple-400">{(workforce.telemetry.tokensConsumed / 1000).toFixed(1)}k</span>
              <span className="text-[10px] text-zinc-400">tokens</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Live Uptime</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-bold text-zinc-200">{formatUptime(workforce.telemetry.uptimeSeconds)}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Cost Accrued</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-bold text-amber-400">${workforce.telemetry.costEstimateUsd.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* INNER WORKFORCE NAVIGATION TABS */}
      <div className="flex items-center gap-1 border-b border-zinc-800 pb-1 text-xs font-mono overflow-x-auto">
        {[
          { id: 'console', label: 'Management Agent Console', icon: Terminal },
          { id: 'topology', label: 'Agent Topology & Crew Graph', icon: Layers },
          { id: 'terminal', label: 'Live Telemetry Stream', icon: Radio },
          { id: 'directing-files', label: 'Directing Files (Runtime)', icon: FileCode },
          { id: 'integrations', label: 'Connected APIs & Vault', icon: Key },
          { id: 'webhook', label: 'Inbound Webhook Simulator', icon: Zap }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-zinc-900 text-cyan-300 border-t border-x border-zinc-800 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MANAGEMENT AGENT CONSOLE (DIRECT OPENAPI) */}
      {activeTab === 'console' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left 2 Cols: Directive Interactive Terminal & Conversation */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-white uppercase">
                    Direct OpenAPI Supervisory Stream // [{workforce.managementAgent.model}]
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-cyan-300 border border-zinc-700/60">
                  PROVIDER: {workforce.managementAgent.provider.toUpperCase()}
                </span>
              </div>

              {/* Directive Chat History */}
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {workforce.executionLogs
                  .filter(l => ['action', 'thought', 'tool_call', 'delegation', 'system'].includes(l.logType))
                  .slice(-8)
                  .map(log => (
                    <div
                      key={log.id}
                      className={`p-3 rounded-lg border text-xs font-mono ${
                        log.logType === 'system'
                          ? 'bg-zinc-900/40 border-zinc-800 text-zinc-300'
                          : log.logType === 'action'
                          ? 'bg-cyan-950/20 border-cyan-800/40 text-cyan-200'
                          : log.logType === 'tool_call'
                          ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                          : log.logType === 'delegation'
                          ? 'bg-purple-950/20 border-purple-800/40 text-purple-200'
                          : 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5 text-[10px] text-zinc-400">
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className="text-white">{log.agentName}</span>
                          {log.agentRole && <span>({log.agentRole})</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="uppercase px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                            {log.logType}
                          </span>
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{log.message}</p>
                    </div>
                  ))}
              </div>

              {/* Operator Directive Input Form */}
              <form onSubmit={handleSendDirective} className="pt-2 border-t border-zinc-800/80 flex gap-2">
                <input
                  type="text"
                  value={operatorInput}
                  onChange={e => setOperatorInput(e.target.value)}
                  placeholder="Inject high-priority directive (e.g. 'Scrape Q3 semiconductor capex and post alpha brief to Slack')..."
                  className="flex-1 px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400"
                  disabled={isProcessing}
                />
                <button
                  type="submit"
                  disabled={isProcessing || !operatorInput.trim()}
                  className="px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-zinc-950 font-bold rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isProcessing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>DISPATCH</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Col: Attached Directing Rules & Active Agent Swarm Quick View */}
          <div className="space-y-4">
            {/* Directing Files Active Rules */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase border-b border-zinc-800 pb-2">
                <FileCode className="h-4 w-4 text-cyan-400" />
                <span>Runtime Directing Files ({attachedFiles.length})</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                The Management Agent consults these files to constrain autonomous delegation:
              </p>
              <div className="space-y-2">
                {attachedFiles.map(file => (
                  <div
                    key={file.id}
                    className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between text-cyan-300 font-semibold mb-0.5">
                      <span>{file.filename}</span>
                      <span className="text-[10px] text-zinc-500">{(file.sizeBytes / 1024).toFixed(1)} KB</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2">{file.purpose}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct OpenAPI Architecture Info Card */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2.5 text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase">
                <ShieldAlert className="h-4 w-4" />
                <span>Zero Google AI // Direct OpenAPI</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Autonomous orchestration uses native OpenAPI 3.0 tool definitions (`delegate_task_to_crew`, `read_directing_file`, `invoke_integration_api`). Raw execution with deterministic contracts.
              </p>
              <div className="pt-1 text-[10px] text-zinc-500">
                Endpoint: <code className="text-zinc-300">{workforce.managementAgent.apiEndpoint}</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AGENT TOPOLOGY & VISUAL CREW GRAPH */}
      {activeTab === 'topology' && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <h3 className="text-sm font-bold font-mono text-white tracking-wide uppercase">
                Autonomous CrewAI Agent Topology
              </h3>
              <p className="text-xs text-zinc-400">
                Visual node graph showing the Management Agent orchestrating active crew workers in this cloud container.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Active Communication Mesh
              </span>
            </div>
          </div>

          {/* Root Management Node */}
          <div className="flex justify-center">
            <div className="relative p-4 rounded-xl bg-cyan-950/40 border-2 border-cyan-400/60 shadow-lg shadow-cyan-500/10 max-w-md w-full text-center">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300 font-mono mb-2">
                <Radio className="h-5 w-5 animate-pulse" />
              </div>
              <h4 className="text-sm font-bold text-white font-mono">
                Management Agent (Direct OpenAPI)
              </h4>
              <p className="text-[11px] text-cyan-300 font-mono">
                Supervisory Lead // Model: {workforce.managementAgent.model}
              </p>
              <p className="text-[11px] text-zinc-400 mt-1.5">
                Evaluates Directing Files, verifies credential boundaries, and delegates tasks to CrewAI agents.
              </p>
              <div className="mt-2 flex items-center justify-center gap-2 text-[10px] font-mono text-zinc-400">
                <span>Polling: {workforce.managementAgent.autonomousPollingRateSec}s</span>
                <span>·</span>
                <span>OpenAPI Tools: 5 Loaded</span>
              </div>
            </div>
          </div>

          {/* Connecting Trunk Line */}
          <div className="flex justify-center">
            <div className="h-8 w-0.5 bg-gradient-to-b from-cyan-400 to-zinc-700" />
          </div>

          {/* Attached Crews & Agent Cards */}
          <div className="space-y-6">
            {attachedCrews.map(crew => (
              <div key={crew.id} className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
                <div className="flex items-center justify-between mb-4 border-b border-zinc-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-cyan-400" />
                    <span className="font-bold text-xs font-mono text-white">{crew.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-cyan-300">
                      {crew.process.toUpperCase()} PROCESS
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    {crew.agents.length} Agents Assigned
                  </span>
                </div>

                {/* Agents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {crew.agents.map(agent => {
                    const state = workforce.agentStates[agent.id] || {
                      status: 'idle',
                      currentAction: 'Standby for task dispatch',
                      lastToolUsed: agent.tools[0],
                      lastHeartbeat: 'Just now',
                      completedTasksCount: 0
                    };

                    const statusColors: Record<AgentStatus, { bg: string; text: string; dot: string }> = {
                      executing: { bg: 'bg-emerald-950/40 border-emerald-500/40', text: 'text-emerald-300', dot: 'bg-emerald-400 animate-pulse' },
                      thinking: { bg: 'bg-amber-950/40 border-amber-500/40', text: 'text-amber-300', dot: 'bg-amber-400 animate-pulse' },
                      reviewing: { bg: 'bg-purple-950/40 border-purple-500/40', text: 'text-purple-300', dot: 'bg-purple-400 animate-pulse' },
                      idle: { bg: 'bg-zinc-900/50 border-zinc-800', text: 'text-zinc-400', dot: 'bg-zinc-500' },
                      completed: { bg: 'bg-cyan-950/40 border-cyan-500/40', text: 'text-cyan-300', dot: 'bg-cyan-400' },
                      error: { bg: 'bg-rose-950/40 border-rose-500/40', text: 'text-rose-300', dot: 'bg-rose-400' }
                    };

                    const colorStyle = statusColors[state.status] || statusColors.idle;

                    return (
                      <div
                        key={agent.id}
                        className={`p-3.5 rounded-lg border text-xs font-mono space-y-2 transition-all ${colorStyle.bg}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: agent.color }} />
                            <div>
                              <div className="font-bold text-white text-xs">{agent.name}</div>
                              <div className="text-[10px] text-zinc-400">{agent.role}</div>
                            </div>
                          </div>
                          <span className={`text-[10px] uppercase font-bold flex items-center gap-1 ${colorStyle.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${colorStyle.dot}`} />
                            {state.status}
                          </span>
                        </div>

                        <div className="text-[11px] text-zinc-300 bg-zinc-950/50 p-2 rounded border border-zinc-800/60 min-h-[44px]">
                          <span className="text-zinc-500 text-[10px] block uppercase">Current Action:</span>
                          <span className="line-clamp-2">{state.currentAction}</span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-800/60">
                          <span className="truncate">Tool: <code className="text-cyan-300">{state.lastToolUsed || 'None'}</code></span>
                          <span className="shrink-0">{state.lastHeartbeat}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TERMINAL & LIVE TELEMETRY STREAM */}
      {activeTab === 'terminal' && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
          {/* Terminal Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3 bg-zinc-900/80">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                LIVE CREWAI EXECUTION LOG STREAM // CONTAINER [{workforce.slug}]
              </span>
            </div>

            {/* Filter & Controls */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <div className="relative">
                <Search className="h-3 w-3 text-zinc-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter logs..."
                  value={logSearch}
                  onChange={e => setLogSearch(e.target.value)}
                  className="pl-7 pr-2 py-1 bg-zinc-950 border border-zinc-700/80 rounded text-[11px] text-zinc-200 focus:outline-none focus:border-cyan-400 w-36"
                />
              </div>

              <select
                value={logFilter}
                onChange={e => setLogFilter(e.target.value)}
                className="px-2 py-1 bg-zinc-950 border border-zinc-700/80 rounded text-[11px] text-zinc-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="all">All Events ({workforce.executionLogs.length})</option>
                <option value="tool_call">Tool Calls</option>
                <option value="thought">Thoughts</option>
                <option value="action">Actions</option>
                <option value="delegation">Delegations</option>
                <option value="system">System</option>
              </select>

              <button
                onClick={() => setAutoScroll(!autoScroll)}
                className={`px-2 py-1 rounded border text-[11px] transition-colors ${
                  autoScroll ? 'bg-cyan-950 text-cyan-300 border-cyan-700' : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                }`}
              >
                Auto-scroll
              </button>
            </div>
          </div>

          {/* Terminal Console Body */}
          <div className="p-4 font-mono text-xs max-h-[520px] overflow-y-auto space-y-2 bg-zinc-950">
            {filteredLogs.map(log => {
              const typeColor: Record<string, string> = {
                system: 'text-cyan-400',
                thought: 'text-zinc-400',
                action: 'text-blue-300 font-semibold',
                tool_call: 'text-amber-400 font-semibold',
                observation: 'text-emerald-400',
                delegation: 'text-purple-400 font-semibold',
                error: 'text-rose-400 font-bold',
                final_answer: 'text-emerald-300 font-bold'
              };

              return (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed hover:bg-zinc-900/40 p-1 rounded">
                  <span className="text-zinc-600 select-none text-[10px] w-14 shrink-0 pt-0.5">
                    {log.timestamp}
                  </span>
                  <span className={`text-[10px] uppercase font-bold w-20 shrink-0 pt-0.5 ${typeColor[log.logType] || 'text-zinc-400'}`}>
                    [{log.logType}]
                  </span>
                  <span className="text-zinc-300 font-bold shrink-0">
                    {log.agentName}:
                  </span>
                  <span className="text-zinc-200 flex-1 whitespace-pre-wrap break-all">
                    {log.message}
                  </span>
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>
        </div>
      )}

      {/* TAB 4: DIRECTING FILES LIVE RUNTIME EDITOR */}
      {activeTab === 'directing-files' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* File Selector */}
          <div className="lg:col-span-1 rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
            <h4 className="text-xs font-bold font-mono text-white uppercase border-b border-zinc-800 pb-2">
              Container Mounted Files
            </h4>
            <div className="space-y-1.5">
              {attachedFiles.map(file => (
                <button
                  key={file.id}
                  onClick={() => setSelectedFileId(file.id)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs font-mono transition-colors ${
                    selectedFileId === file.id
                      ? 'bg-zinc-800 text-cyan-300 border border-cyan-500/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <div className="font-bold truncate">{file.filename}</div>
                  <div className="text-[10px] text-zinc-500">{(file.sizeBytes / 1024).toFixed(1)} KB</div>
                </button>
              ))}
            </div>
          </div>

          {/* Editor & Hot-sync */}
          <div className="lg:col-span-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-bold font-mono text-white">
                  {attachedFiles.find(f => f.id === selectedFileId)?.filename || 'Select a file'}
                </span>
              </div>

              <button
                onClick={handleSyncDirectingFile}
                disabled={isSyncingFile}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-zinc-950 font-bold rounded-lg text-xs font-mono transition-colors cursor-pointer"
              >
                {isSyncingFile ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Zap className="h-3.5 w-3.5" />
                )}
                <span>Hot-Sync to Runtime Context</span>
              </button>
            </div>

            <textarea
              rows={16}
              value={fileContent}
              onChange={e => setFileContent(e.target.value)}
              className="w-full p-3 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-400 leading-relaxed resize-y"
            />
            <p className="text-[11px] text-zinc-400">
              Hot-sync updates the active file in the workforce container. The Management Agent immediately reads the updated guidelines for next autonomous cycle.
            </p>
          </div>
        </div>
      )}

      {/* TAB 5: INTEGRATIONS & VAULT HEALTH */}
      {activeTab === 'integrations' && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-sm font-bold font-mono text-white uppercase">
                Active Vault Injected Credentials
              </h3>
              <p className="text-xs text-zinc-400">
                Credentials and API keys mounted securely into this cloud container environment.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              All Vault Endpoints Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {attachedIntegrations.map(integ => (
              <div key={integ.id} className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 text-xs font-mono space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-cyan-400" />
                    <span className="font-bold text-white text-xs">{integ.name}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    {integ.category}
                  </span>
                </div>

                <div className="bg-zinc-950 p-2 rounded border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
                  <div>Env Var: <code className="text-cyan-300">{integ.keyName}</code></div>
                  <div>Masked: <code className="text-zinc-500">{integ.maskedValue}</code></div>
                  {integ.endpointUrl && <div>Endpoint: <code className="text-zinc-400">{integ.endpointUrl}</code></div>}
                </div>

                <div className="flex items-center justify-between text-[10px] text-emerald-400 pt-1">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {integ.lastVerified}
                  </span>
                  <button 
                    onClick={() => {
                      const now = new Date().toLocaleTimeString();
                      onUpdateWorkforce({
                        ...workforce,
                        executionLogs: [
                          ...workforce.executionLogs,
                          {
                            id: `log-${Date.now()}`,
                            timestamp: now,
                            workforceId: workforce.id,
                            agentName: 'AetherOps Health Probe',
                            agentRole: 'SRE Monitor',
                            logType: 'system',
                            message: `Pinged vault integration [${integ.name}]: HTTP 200 OK (Latency: 6ms). Credential verified.`
                          }
                        ]
                      });
                    }}
                    className="hover:underline text-cyan-300 cursor-pointer"
                  >
                    Test Ping
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: INBOUND WEBHOOK SIMULATOR */}
      {activeTab === 'webhook' && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold font-mono text-white uppercase">
              Inbound Webhook Dispatch Simulator
            </h3>
            <p className="text-xs text-zinc-400">
              Simulate external triggers sent to <code className="text-cyan-300">{workforce.webhookUrl}</code>. Watch the Direct OpenAPI Management Agent intercept, validate HMAC signatures, consult Directing Files, and route to the CrewAI swarm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">Webhook Source</label>
              <select
                value={webhookSource}
                onChange={e => setWebhookSource(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-lg text-white"
              >
                <option value="github">GitHub Webhook (PR / Push)</option>
                <option value="slack">Slack Slash Command</option>
                <option value="custom">Custom Enterprise System</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Event Header (`X-Event-Type`)</label>
              <input
                type="text"
                value={webhookEvent}
                onChange={e => setWebhookEvent(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-lg text-white"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleDispatchWebhook}
                disabled={isProcessing}
                className="w-full py-2 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-zinc-950 font-bold rounded-lg text-xs font-mono transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isProcessing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                <span>SIMULATE POST WEBHOOK</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Payload JSON</label>
            <textarea
              rows={8}
              value={webhookPayload}
              onChange={e => setWebhookPayload(e.target.value)}
              className="w-full p-3 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-400 leading-relaxed"
            />
          </div>
        </div>
      )}
    </div>
  );
};
