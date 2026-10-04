import React from 'react';
import { 
  Server, 
  Cpu, 
  Activity, 
  Layers, 
  Globe, 
  ArrowUpRight, 
  Plus, 
  Pause, 
  Play, 
  Trash2, 
  Radio, 
  Terminal, 
  ShieldCheck, 
  Key,
  ChevronRight,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { SpawnedWorkforce, CrewAICrew } from '../types';

interface WorkforcesListViewProps {
  workforces: SpawnedWorkforce[];
  allCrews: CrewAICrew[];
  onSelectWorkforce: (workforce: SpawnedWorkforce) => void;
  onOpenSpawnModal: () => void;
  onToggleStatus: (workforceId: string) => void;
  onTerminate: (workforceId: string) => void;
}

export const WorkforcesListView: React.FC<WorkforcesListViewProps> = ({
  workforces,
  allCrews,
  onSelectWorkforce,
  onOpenSpawnModal,
  onToggleStatus,
  onTerminate
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyUrl = (e: React.MouseEvent, url: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatUptime = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wide">
              Live Cloud-Hosted Workforces
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
              {workforces.filter(w => w.status === 'active').length} ACTIVE RUNTIMES
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-world active multi-agent workforces running inside dedicated cloud web apps, orchestrated by Direct OpenAPI management agents.
          </p>
        </div>

        <button
          onClick={onOpenSpawnModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 text-zinc-950 font-bold rounded-lg text-xs font-mono transition-all shadow-lg shadow-cyan-500/20 cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>SPAWN NEW WORKFORCE</span>
        </button>
      </div>

      {/* Grid of Workforces */}
      <div className="grid grid-cols-1 gap-4">
        {workforces.map(wf => {
          const attachedCrews = allCrews.filter(c => wf.crewIds.includes(c.id));
          const isLive = wf.status === 'active';

          return (
            <div
              key={wf.id}
              onClick={() => onSelectWorkforce(wf)}
              className="rounded-xl border border-zinc-800 bg-zinc-950 hover:border-cyan-500/40 p-5 shadow-lg hover:shadow-cyan-500/5 transition-all cursor-pointer group space-y-4"
            >
              {/* Top Row: Name, Host, Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400 group-hover:border-cyan-500/40 transition-colors">
                      <Server className="h-5 w-5" />
                    </div>
                    {isLive && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-white font-mono group-hover:text-cyan-300 transition-colors">
                        {wf.name}
                      </h3>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        isLive 
                          ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60' 
                          : 'bg-amber-950/70 text-amber-400 border border-amber-800/60'
                      }`}>
                        {wf.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 mt-0.5">
                      <span>Cloud: {wf.clusterTarget.toUpperCase()}</span>
                      <span>·</span>
                      <span>Region: {wf.cloudRegion}</span>
                    </div>
                  </div>
                </div>

                {/* Direct App Link & Quick Actions */}
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => onToggleStatus(wf.id)}
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    title={isLive ? 'Pause Runtime' : 'Resume Runtime'}
                  >
                    {isLive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>

                  <button
                    onClick={() => onTerminate(wf.id)}
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors"
                    title="Terminate Container"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => onSelectWorkforce(wf)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold rounded-lg text-xs font-mono transition-colors"
                  >
                    <span>OPEN CONSOLE</span>
                    <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Endpoint URLs */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1 text-cyan-300">
                  <Globe className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-zinc-500">Live App:</span>
                  <span className="font-semibold">{wf.cloudAppUrl}</span>
                  <button
                    onClick={e => copyUrl(e, wf.cloudAppUrl, `app-${wf.id}`)}
                    className="p-1 hover:text-white text-zinc-400"
                  >
                    {copiedId === `app-${wf.id}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>

                <div className="flex items-center gap-1 text-zinc-400">
                  <Radio className="h-3.5 w-3.5 text-purple-400" />
                  <span className="text-zinc-500">Webhook:</span>
                  <span className="truncate max-w-xs">{wf.webhookUrl}</span>
                </div>
              </div>

              {/* Attached CrewAI Crews & Direct OpenAPI Agent Info */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-mono text-zinc-400">Attached Crews:</span>
                {attachedCrews.map(c => (
                  <div
                    key={c.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200"
                  >
                    <Layers className="h-3 w-3 text-cyan-400" />
                    <span>{c.name}</span>
                    <span className="text-[10px] text-zinc-400">({c.agents.length} agents)</span>
                  </div>
                ))}
              </div>

              {/* Telemetry Metrics Footbar */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-zinc-800/60 text-xs font-mono text-zinc-400">
                <div>
                  <span className="text-[10px] uppercase text-zinc-400 block">CPU Load</span>
                  <span className="text-cyan-400 font-bold">{wf.telemetry.cpuPercent}%</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-zinc-400 block">Memory</span>
                  <span className="text-white font-bold">{wf.telemetry.memoryMb} MB</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-zinc-400 block">Active Workers</span>
                  <span className="text-emerald-400 font-bold">{wf.telemetry.activeAgentsCount} agents</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-zinc-400 block">Tasks Closed</span>
                  <span className="text-white font-bold">{wf.telemetry.totalTasksCompleted} completed</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-zinc-400 block">Live Uptime</span>
                  <span className="text-zinc-300 font-bold">{formatUptime(wf.telemetry.uptimeSeconds)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
