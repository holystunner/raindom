import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Key, 
  FileCode, 
  Cpu, 
  Server, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  Terminal,
  ShieldAlert,
  Radio,
  Zap,
  CheckCircle2,
  Globe,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { 
  CrewAICrew, 
  IntegrationCredential, 
  ProjectDirectingFile, 
  ManagementAgentConfig, 
  OpenApiProvider, 
  SpawnedWorkforce 
} from '../types';
import { testOpenApiConnection } from '../services/openApiAgentService';
import { spawnNewWorkforce } from '../services/workforceEngine';

interface SpawnWorkforceModalProps {
  isOpen: boolean;
  onClose: () => void;
  crews: CrewAICrew[];
  integrations: IntegrationCredential[];
  directingFiles: ProjectDirectingFile[];
  onWorkforceSpawned: (workforce: SpawnedWorkforce) => void;
}

export const SpawnWorkforceModal: React.FC<SpawnWorkforceModalProps> = ({
  isOpen,
  onClose,
  crews,
  integrations,
  directingFiles,
  onWorkforceSpawned
}) => {
  const [step, setStep] = useState<number>(1);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploymentStep, setDeploymentStep] = useState<string>('');

  // Form State
  const [name, setName] = useState<string>('Vanguard-01 // Live Operations');
  const [clusterTarget, setClusterTarget] = useState<'cloud-run' | 'aws-ecs' | 'fly-io' | 'k8s-cluster'>('cloud-run');
  const [cloudRegion, setCloudRegion] = useState<string>('us-central1 (Iowa)');
  const [selectedCrewIds, setSelectedCrewIds] = useState<string[]>(['crew-market-alpha']);
  const [selectedIntegrationIds, setSelectedIntegrationIds] = useState<string[]>(['int-github', 'int-slack', 'int-postgres']);
  const [selectedDirectingFileIds, setSelectedDirectingFileIds] = useState<string[]>(['file-mission-directive', 'file-rfc-arch']);

  // Management Agent State (Direct OpenAPI - Zero Google AI)
  const [provider, setProvider] = useState<OpenApiProvider>('openai');
  const [apiEndpoint, setApiEndpoint] = useState<string>('https://api.openai.com/v1');
  const [apiKey, setApiKey] = useState<string>('');
  const [model, setModel] = useState<string>('gpt-4o');
  const [systemPrompt, setSystemPrompt] = useState<string>(
    'You are the Autonomous Operations Management Agent supervising CrewAI workers in a containerized web application. Strictly adhere to Directing Files and enforce zero-defect execution.'
  );
  const [pollingRate, setPollingRate] = useState<number>(5);

  // Connection Test
  const [testStatus, setTestStatus] = useState<{ testing: boolean; result?: { success: boolean; message: string; latencyMs: number } }>({ testing: false });

  if (!isOpen) return null;

  const handleProviderChange = (newProvider: OpenApiProvider) => {
    setProvider(newProvider);
    if (newProvider === 'openai') {
      setApiEndpoint('https://api.openai.com/v1');
      setModel('gpt-4o');
    } else if (newProvider === 'openrouter') {
      setApiEndpoint('https://openrouter.ai/api/v1');
      setModel('anthropic/claude-3.5-sonnet');
    } else if (newProvider === 'groq') {
      setApiEndpoint('https://api.groq.com/openai/v1');
      setModel('llama-3.3-70b-versatile');
    } else if (newProvider === 'ollama') {
      setApiEndpoint('http://localhost:11434/v1');
      setModel('llama3.3:latest');
    } else if (newProvider === 'custom_openapi') {
      setApiEndpoint('https://api.your-domain.com/v1');
      setModel('custom-agent-v1');
    }
  };

  const toggleCrew = (id: string) => {
    setSelectedCrewIds(prev => 
      prev.includes(id) ? (prev.length > 1 ? prev.filter(c => c !== id) : prev) : [...prev, id]
    );
  };

  const toggleIntegration = (id: string) => {
    setSelectedIntegrationIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleDirectingFile = (id: string) => {
    setSelectedDirectingFileIds(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleRunTest = async () => {
    setTestStatus({ testing: true });
    const config: ManagementAgentConfig = {
      provider,
      apiEndpoint,
      apiKey,
      model,
      systemPrompt,
      autonomousPollingRateSec: pollingRate,
      maxAutonomousTurns: 30,
      fallbackFailover: true
    };
    const res = await testOpenApiConnection(config);
    setTestStatus({ testing: false, result: res });
  };

  const handleLaunchWorkforce = async () => {
    setIsDeploying(true);

    const steps = [
      'Allocating isolated container on ' + clusterTarget.toUpperCase() + '...',
      'Synthesizing and mounting pre-uploaded CrewAI definitions...',
      'Injecting ' + selectedIntegrationIds.length + ' credentials from vault...',
      'Writing ' + selectedDirectingFileIds.length + ' Directing Files into active context...',
      'Bootstrapping Direct OpenAPI Management Agent [' + model + ']...',
      'Establishing webhook ingress listener...',
      'Workforce operational! Directing live control center...'
    ];

    for (const s of steps) {
      setDeploymentStep(s);
      await new Promise(r => setTimeout(r, 450));
    }

    const managementAgent: ManagementAgentConfig = {
      provider,
      apiEndpoint,
      apiKey,
      model,
      systemPrompt,
      autonomousPollingRateSec: pollingRate,
      maxAutonomousTurns: 30,
      fallbackFailover: true
    };

    const newWf = spawnNewWorkforce({
      name,
      clusterTarget,
      cloudRegion,
      crewIds: selectedCrewIds,
      integrationIds: selectedIntegrationIds,
      directingFileIds: selectedDirectingFileIds,
      managementAgent,
      allCrews: crews
    });

    onWorkforceSpawned(newWf);
    setIsDeploying(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                SPAWN ACTIVE AUTONOMOUS WORKFORCE
              </h2>
              <p className="text-xs text-zinc-400">
                Deploy a live cloud-hosted web app with attached CrewAI crews, vault credentials & OpenAPI orchestration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeploying}
            className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wizard Steps Navigation Bar */}
        <div className="grid grid-cols-5 border-b border-zinc-800 bg-zinc-950 text-xs font-mono">
          {[
            { num: 1, label: '1. Cloud Target' },
            { num: 2, label: '2. CrewAI Crews' },
            { num: 3, label: '3. Credentials' },
            { num: 4, label: '4. Directing Files' },
            { num: 5, label: '5. OpenAPI Agent' }
          ].map(s => (
            <button
              key={s.num}
              onClick={() => !isDeploying && setStep(s.num)}
              className={`py-2.5 px-2 text-center transition-colors border-r border-zinc-800 last:border-r-0 ${
                step === s.num
                  ? 'bg-zinc-800/80 text-cyan-300 font-bold border-b-2 border-b-cyan-400'
                  : step > s.num
                  ? 'text-zinc-300 bg-zinc-900/40'
                  : 'text-zinc-500'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Step Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* STEP 1: CLOUD CONTAINER TARGET */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5 uppercase">
                  Workforce Name / Cluster Identifier
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Titan-Alpha // Enterprise Financial Core"
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                />
                <p className="mt-1 text-[11px] text-zinc-400">
                  This spawns a dedicated container instance with public webhook listener and direct web app console.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-zinc-300 mb-2 uppercase">
                  Target Cloud Host Runtime
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'cloud-run', name: 'Google Cloud Run Container', desc: 'Fully managed serverless container runtime with zero-idle scaling', badge: 'Auto-scaled' },
                    { id: 'aws-ecs', name: 'AWS ECS Fargate Cluster', desc: 'Dedicated cloud VPC container with microsecond network latency', badge: 'VPC Peered' },
                    { id: 'fly-io', name: 'Fly.io Global MicroVMs', desc: 'Edge distributed agent runtime with global low-latency dispatch', badge: 'Edge-native' },
                    { id: 'k8s-cluster', name: 'Kubernetes (K8s) Cluster Pod', desc: 'High-availability autonomous StatefulSet with dedicated storage', badge: 'Enterprise' }
                  ].map(c => (
                    <div
                      key={c.id}
                      onClick={() => setClusterTarget(c.id as any)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                        clusterTarget === c.id
                          ? 'bg-cyan-950/30 border-cyan-500/60 ring-1 ring-cyan-500/40 text-white'
                          : 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs font-mono">{c.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-cyan-300 font-mono">
                          {c.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400">{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5 uppercase">
                    Cloud Region
                  </label>
                  <select
                    value={cloudRegion}
                    onChange={e => setCloudRegion(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  >
                    <option value="us-central1 (Iowa)">us-central1 (Iowa - Lowest Latency)</option>
                    <option value="us-east-1 (N. Virginia)">us-east-1 (N. Virginia)</option>
                    <option value="eu-west-1 (Ireland)">eu-west-1 (Ireland)</option>
                    <option value="ap-southeast-1 (Singapore)">ap-southeast-1 (Singapore)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5 uppercase">
                    Container Memory / vCPU Limit
                  </label>
                  <div className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 font-mono flex items-center justify-between">
                    <span>2 vCPU / 2048 MB RAM</span>
                    <span className="text-emerald-400 text-[10px]">OPTIMAL FOR CREWAI</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CREWAI CREWS SELECTION */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Select Pre-Uploaded CrewAI Crews</h3>
                  <p className="text-xs text-zinc-400">
                    Attach one or more pre-uploaded crews to be orchestrated together in this cloud web app.
                  </p>
                </div>
                <span className="text-xs font-mono text-cyan-400">
                  {selectedCrewIds.length} Selected
                </span>
              </div>

              <div className="space-y-3">
                {crews.map(crew => {
                  const isSelected = selectedCrewIds.includes(crew.id);
                  return (
                    <div
                      key={crew.id}
                      onClick={() => toggleCrew(crew.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-cyan-950/20 border-cyan-500/50 ring-1 ring-cyan-500/30'
                          : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-white">{crew.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                              {crew.category}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-cyan-400">
                              {crew.process.toUpperCase()} PROCESS
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 mb-3">{crew.description}</p>
                          
                          {/* Agents List */}
                          <div className="flex flex-wrap gap-2">
                            {crew.agents.map(agent => (
                              <div
                                key={agent.id}
                                className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-300"
                              >
                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: agent.color }} />
                                <span>{agent.name}</span>
                                <span className="text-zinc-500">({agent.role})</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-1">
                          <div
                            className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-cyan-500 border-cyan-400 text-zinc-950'
                                : 'border-zinc-700 bg-zinc-900'
                            }`}
                          >
                            {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: INTEGRATIONS & CREDENTIALS VAULT */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Connect Vault Credentials & APIs</h3>
                <p className="text-xs text-zinc-400">
                  Select external services to inject securely as environment secrets into the workforce runtime container.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {integrations.map(integ => {
                  const isSelected = selectedIntegrationIds.includes(integ.id);
                  return (
                    <div
                      key={integ.id}
                      onClick={() => toggleIntegration(integ.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-cyan-950/20 border-cyan-500/50 ring-1 ring-cyan-500/30'
                          : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/70'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-2">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="font-semibold text-xs text-white">{integ.name}</span>
                            <span className="text-[10px] font-mono text-zinc-400">
                              [{integ.provider}]
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2">
                            {integ.description}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] font-mono">
                            <span className="text-emerald-400 flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              {integ.lastVerified}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-cyan-500 border-cyan-400 text-zinc-950'
                              : 'border-zinc-700 bg-zinc-900'
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: DIRECTING FILES */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Attach Project & Directing Files</h3>
                <p className="text-xs text-zinc-400">
                  These files dictate mission rules, operational constraints, and SOP procedures for the Management Agent.
                </p>
              </div>

              <div className="space-y-2.5">
                {directingFiles.map(file => {
                  const isSelected = selectedDirectingFileIds.includes(file.id);
                  return (
                    <div
                      key={file.id}
                      onClick={() => toggleDirectingFile(file.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-cyan-950/20 border-cyan-500/50 ring-1 ring-cyan-500/30'
                          : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/70'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-3">
                          <div className="flex items-center gap-2 mb-1">
                            <FileCode className="h-4 w-4 text-cyan-400" />
                            <span className="font-bold text-xs font-mono text-white">{file.filename}</span>
                            <span className="text-[10px] text-zinc-400">
                              ({(file.sizeBytes / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <p className="text-xs text-zinc-300 font-medium">{file.title}</p>
                          <p className="text-[11px] text-zinc-400 mt-1">{file.purpose}</p>
                          
                          <div className="flex gap-1.5 mt-2">
                            {file.tags.map(t => (
                              <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div
                          className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-cyan-500 border-cyan-400 text-zinc-950'
                              : 'border-zinc-700 bg-zinc-900'
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: DIRECT OPENAPI MANAGEMENT AGENT ("ZERO GOOGLE AI") */}
          {step === 5 && (
            <div className="space-y-5">
              <div className="p-3 bg-zinc-900/80 border border-emerald-500/30 rounded-lg flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold font-mono text-emerald-400 uppercase">
                    DIRECT OPENAPI ORCHESTRATION // ZERO PROPRIETARY AI FLUFF
                  </h4>
                  <p className="text-[11px] text-zinc-300 mt-0.5">
                    The management agent talks directly to standard OpenAPI 3.0 / OpenAI compatible endpoints (OpenAI, OpenRouter, Groq, Ollama, or your custom URL). No Google AI wrappers or vendor lock-in.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-zinc-300 mb-2 uppercase">
                  OpenAPI Provider
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
                  {[
                    { id: 'openai', label: 'OpenAI v1' },
                    { id: 'openrouter', label: 'OpenRouter' },
                    { id: 'groq', label: 'Groq Cloud' },
                    { id: 'ollama', label: 'Local Ollama' },
                    { id: 'custom_openapi', label: 'Custom OpenAPI' }
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleProviderChange(p.id as any)}
                      className={`py-2 px-2 rounded-md border text-center transition-all ${
                        provider === p.id
                          ? 'bg-cyan-500 text-zinc-950 font-bold border-cyan-400'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5 uppercase">
                    Direct OpenAPI Endpoint URL
                  </label>
                  <input
                    type="text"
                    value={apiEndpoint}
                    onChange={e => setApiEndpoint(e.target.value)}
                    placeholder="https://api.openai.com/v1"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5 uppercase">
                    Model Identifier
                  </label>
                  <input
                    type="text"
                    value={model}
                    onChange={e => setModel(e.target.value)}
                    placeholder="gpt-4o or claude-3-5-sonnet"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono font-medium text-zinc-300 uppercase">
                    API Key (Optional for Live External Calls)
                  </label>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Leave blank to use built-in synthetic OpenAPI engine
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="sk-••••••••••••••••••••••••••••"
                    className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={handleRunTest}
                    disabled={testStatus.testing}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    {testStatus.testing ? (
                      <Radio className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Terminal className="h-3.5 w-3.5" />
                    )}
                    <span>Ping Spec</span>
                  </button>
                </div>
                {testStatus.result && (
                  <div className={`mt-2 p-2.5 rounded text-xs font-mono flex items-center gap-2 ${
                    testStatus.result.success ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40' : 'bg-rose-950/40 text-rose-300 border border-rose-800/40'
                  }`}>
                    {testStatus.result.success ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                    <span>{testStatus.result.message} ({testStatus.result.latencyMs}ms)</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-zinc-300 mb-1.5 uppercase">
                  Management Agent Directive Prompt
                </label>
                <textarea
                  rows={3}
                  value={systemPrompt}
                  onChange={e => setSystemPrompt(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs text-zinc-300 font-mono focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-900/60 border border-zinc-800 rounded-lg">
                <div>
                  <span className="text-xs font-medium text-white">Autonomous Loop Cycle Rate</span>
                  <p className="text-[11px] text-zinc-400">Frequency of telemetry checks and queue dispatch</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={2}
                    max={30}
                    value={pollingRate}
                    onChange={e => setPollingRate(+e.target.value)}
                    className="w-24 accent-cyan-400"
                  />
                  <span className="text-xs font-mono text-cyan-300 w-10 text-right">{pollingRate}s</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Deploying Progress Overlay */}
        {isDeploying && (
          <div className="p-6 border-t border-zinc-800 bg-zinc-900/90 flex flex-col items-center justify-center space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-semibold">
              <Radio className="h-5 w-5 animate-pulse text-cyan-400" />
              <span>SPAWNING LIVE WORKFORCE CONTAINER...</span>
            </div>
            <div className="w-full max-w-md bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full w-3/4 animate-pulse" />
            </div>
            <p className="text-xs font-mono text-zinc-300 animate-pulse">
              &gt; {deploymentStep}
            </p>
          </div>
        )}

        {/* Modal Footer Controls */}
        {!isDeploying && (
          <div className="flex items-center justify-between border-t border-zinc-800 px-6 py-4 bg-zinc-900/40">
            <div>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => s - 1)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <span className="text-xs font-mono text-zinc-500">Step 1 of 5</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>

              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => s + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-mono font-medium transition-colors"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLaunchWorkforce}
                  className="flex items-center gap-2 px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 text-zinc-950 font-bold rounded-lg text-xs font-mono transition-all shadow-lg shadow-cyan-500/20"
                >
                  <Zap className="h-4 w-4 stroke-[2.5]" />
                  <span>LAUNCH & DEPLOY WORKFORCE</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
