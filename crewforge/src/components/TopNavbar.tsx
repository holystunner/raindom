import React from 'react';
import { 
  Server, 
  Cpu, 
  Layers, 
  FileCode, 
  Key, 
  Sparkles, 
  Plus, 
  Activity, 
  Radio, 
  ShieldCheck,
  Code2
} from 'lucide-react';
import { SpawnedWorkforce } from '../types';

interface TopNavbarProps {
  activeTab: 'workforces' | 'crews' | 'directing-files' | 'integrations' | 'openapi-spec';
  setActiveTab: (tab: 'workforces' | 'crews' | 'directing-files' | 'integrations' | 'openapi-spec') => void;
  workforces: SpawnedWorkforce[];
  onOpenSpawnModal: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  setActiveTab,
  workforces,
  onOpenSpawnModal
}) => {
  const activeCount = workforces.filter(w => w.status === 'active').length;
  const totalAgents = workforces.reduce((acc, w) => acc + (w.status === 'active' ? w.telemetry.activeAgentsCount : 0), 0);
  const totalTasks = workforces.reduce((acc, w) => acc + w.telemetry.totalTasksCompleted, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Brand & Mission Control ID */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-sm shadow-cyan-500/20">
            <Radio className="h-5 w-5 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-widest uppercase text-white font-mono">
                AETHER<span className="text-cyan-400">//</span>OPS
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-zinc-400">
                v2.4
              </span>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono bg-zinc-900 border border-zinc-700/60 rounded text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                DIRECT OPENAPI ENGINE
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Autonomous CrewAI Workforce Cloud Orchestrator
            </p>
          </div>
        </div>

        {/* Center Nav Tabs */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-zinc-900/80 border border-zinc-800 rounded-lg">
          <button
            onClick={() => setActiveTab('workforces')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'workforces'
                ? 'bg-zinc-800 text-cyan-300 shadow-sm border border-cyan-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Server className="h-3.5 w-3.5" />
            <span>Live Workforces</span>
            {activeCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                {activeCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('crews')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'crews'
                ? 'bg-zinc-800 text-cyan-300 shadow-sm border border-cyan-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>CrewAI Registry</span>
          </button>

          <button
            onClick={() => setActiveTab('directing-files')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'directing-files'
                ? 'bg-zinc-800 text-cyan-300 shadow-sm border border-cyan-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>Directing Files</span>
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'integrations'
                ? 'bg-zinc-800 text-cyan-300 shadow-sm border border-cyan-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Key className="h-3.5 w-3.5" />
            <span>Integrations Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('openapi-spec')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'openapi-spec'
                ? 'bg-zinc-800 text-cyan-300 shadow-sm border border-cyan-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>OpenAPI Spec</span>
          </button>
        </nav>

        {/* Right Stats & Spawn CTA */}
        <div className="flex items-center gap-3">
          {/* Quick Metrics */}
          <div className="hidden xl:flex items-center gap-4 text-xs font-mono text-zinc-400 border-r border-zinc-800 pr-4">
            <div className="flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              <span>{totalAgents}</span>
              <span className="text-zinc-400">Agents</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              <span>{totalTasks}</span>
              <span className="text-zinc-400">Tasks Closed</span>
            </div>
          </div>

          {/* Spawn Workforce CTA */}
          <button
            onClick={onOpenSpawnModal}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-zinc-950 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 rounded-lg shadow-md shadow-cyan-500/20 transition-all cursor-pointer font-mono"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>SPAWN WORKFORCE</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="flex lg:hidden overflow-x-auto border-t border-zinc-800/60 px-4 py-2 gap-2 bg-zinc-950/90 text-xs">
        <button
          onClick={() => setActiveTab('workforces')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'workforces' ? 'bg-zinc-800 text-cyan-300' : 'text-zinc-400'
          }`}
        >
          Live Workforces ({activeCount})
        </button>
        <button
          onClick={() => setActiveTab('crews')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'crews' ? 'bg-zinc-800 text-cyan-300' : 'text-zinc-400'
          }`}
        >
          CrewAI Registry
        </button>
        <button
          onClick={() => setActiveTab('directing-files')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'directing-files' ? 'bg-zinc-800 text-cyan-300' : 'text-zinc-400'
          }`}
        >
          Directing Files
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'integrations' ? 'bg-zinc-800 text-cyan-300' : 'text-zinc-400'
          }`}
        >
          Integrations
        </button>
        <button
          onClick={() => setActiveTab('openapi-spec')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'openapi-spec' ? 'bg-zinc-800 text-cyan-300' : 'text-zinc-400'
          }`}
        >
          OpenAPI Spec
        </button>
      </div>
    </header>
  );
};
