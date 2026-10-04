import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Upload, 
  Code2, 
  Users, 
  CheckCircle2, 
  Clock, 
  Sliders, 
  ArrowRight,
  ShieldAlert,
  Trash2,
  Copy,
  Terminal,
  FileText
} from 'lucide-react';
import { CrewAICrew, CrewAIAgent, CrewAITask } from '../types';

interface CrewRegistryViewProps {
  crews: CrewAICrew[];
  onAddCrew: (crew: CrewAICrew) => void;
  onSelectCrewToSpawn: (crewId: string) => void;
}

export const CrewRegistryView: React.FC<CrewRegistryViewProps> = ({
  crews,
  onAddCrew,
  onSelectCrewToSpawn
}) => {
  const [selectedCrew, setSelectedCrew] = useState<CrewAICrew>(crews[0] || null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // Upload/New Crew Form State
  const [newCrewName, setNewCrewName] = useState<string>('');
  const [newCrewDesc, setNewCrewDesc] = useState<string>('');
  const [newCrewCategory, setNewCrewCategory] = useState<'Intelligence' | 'Engineering' | 'Growth' | 'Security' | 'Operations'>('Engineering');
  const [newCrewProcess, setNewCrewProcess] = useState<'sequential' | 'hierarchical'>('hierarchical');
  const [pythonCode, setPythonCode] = useState<string>(`# CrewAI Crew Definition
from crewai import Agent, Crew, Process, Task
from crewai_tools import SerperDevTool, ScrapeWebsiteTool

lead_analyst = Agent(
    role="Principal System Auditor",
    goal="Identify operational anomalies and delegate remediation",
    backstory="Senior SRE architect with 10 years experience in distributed agent networks.",
    allow_delegation=True,
    verbose=True
)

security_guard = Agent(
    role="Security Policy Enforcer",
    goal="Validate all outgoing API requests against Directing Files",
    backstory="Specialized compliance agent enforcing cryptographic boundaries.",
    tools=["Token_Inspector_Tool", "CVE_Scanner"],
    verbose=True
)

crew = Crew(
    agents=[lead_analyst, security_guard],
    tasks=[
        Task(description="Perform audit on active microservices and verify zero leaked credentials.", agent=lead_analyst),
        Task(description="Enforce security perimeter compliance against company RFCs.", agent=security_guard)
    ],
    process=Process.hierarchical,
    manager_agent=lead_analyst
)`);

  const handleUploadCrew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrewName.trim()) return;

    // Parse simple agents from Python code or fallback to standard structure
    const parsedAgents: CrewAIAgent[] = [
      {
        id: `agent-${Date.now()}-1`,
        name: 'Alex Vance',
        role: 'Principal System Auditor',
        goal: 'Identify operational anomalies and delegate remediation',
        backstory: 'Senior SRE architect with 10 years experience in distributed agent networks.',
        tools: ['OpenAPI_Delegate_Tool', 'Telemetry_Inspector'],
        verbose: true,
        allowDelegation: true,
        avatarIcon: 'ShieldAlert',
        color: '#06b6d4'
      },
      {
        id: `agent-${Date.now()}-2`,
        name: 'Guard-07',
        role: 'Security Policy Enforcer',
        goal: 'Validate all outgoing API requests against Directing Files',
        backstory: 'Specialized compliance agent enforcing cryptographic boundaries.',
        tools: ['Token_Inspector_Tool', 'CVE_Scanner'],
        verbose: true,
        allowDelegation: false,
        avatarIcon: 'Lock',
        color: '#f43f5e'
      }
    ];

    const parsedTasks: CrewAITask[] = [
      {
        id: `task-${Date.now()}-1`,
        title: 'Perform audit on active microservices',
        description: 'Scan active endpoints and verify zero leaked credentials against company SOPs.',
        expectedOutput: 'Audit signoff memorandum.',
        agentId: parsedAgents[0].id,
        status: 'pending'
      }
    ];

    const newCrew: CrewAICrew = {
      id: `crew-${Date.now()}`,
      name: newCrewName.trim(),
      description: newCrewDesc.trim() || 'Custom CrewAI uploaded to AetherOps dashboard.',
      category: newCrewCategory,
      process: newCrewProcess,
      managerAgentRole: newCrewProcess === 'hierarchical' ? parsedAgents[0].role : undefined,
      agents: parsedAgents,
      tasks: parsedTasks,
      memoryEnabled: true,
      cacheEnabled: true,
      maxRpm: 120,
      uploadedAt: new Date().toISOString(),
      rawConfigCode: pythonCode
    };

    onAddCrew(newCrew);
    setSelectedCrew(newCrew);
    setIsUploadModalOpen(false);
    setNewCrewName('');
    setNewCrewDesc('');
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wide">
            CrewAI Crews Pre-Uploaded Registry
          </h2>
          <p className="text-xs text-zinc-400">
            Browse, inspect, and upload reusable CrewAI crews ready to be attached and spawned into live cloud workforces.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold rounded-lg text-xs font-mono transition-colors shadow-md shadow-cyan-500/10 cursor-pointer"
        >
          <Upload className="h-4 w-4" />
          <span>UPLOAD NEW CREW</span>
        </button>
      </div>

      {/* Main Grid: Crew List & Selected Crew Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Crews List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {crews.map(crew => {
            const isSelected = selectedCrew?.id === crew.id;
            return (
              <div
                key={crew.id}
                onClick={() => setSelectedCrew(crew)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-zinc-900 border-cyan-500/50 shadow-md shadow-cyan-500/5 ring-1 ring-cyan-500/30'
                    : 'bg-zinc-950 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-bold text-sm text-white font-mono">{crew.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-cyan-300">
                    {crew.category}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                  {crew.description}
                </p>

                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-zinc-500" />
                    <span>{crew.agents.length} Agents</span>
                    <span>·</span>
                    <span className="text-cyan-400 uppercase text-[10px]">
                      {crew.process}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400">
                    RPM: {crew.maxRpm}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Col: Detailed Inspection of Selected Crew (7 cols) */}
        <div className="lg:col-span-7">
          {selectedCrew ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-6">
              {/* Crew Banner */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-white font-mono">
                      {selectedCrew.name}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {selectedCrew.process.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {selectedCrew.description}
                  </p>
                </div>

                <button
                  onClick={() => onSelectCrewToSpawn(selectedCrew.id)}
                  className="px-3.5 py-2 bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Spawn In Workforce</span>
                </button>
              </div>

              {/* Agents in this Crew */}
              <div>
                <h4 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider mb-3">
                  Configured Agents ({selectedCrew.agents.length})
                </h4>
                <div className="space-y-3">
                  {selectedCrew.agents.map(agent => (
                    <div
                      key={agent.id}
                      className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs font-mono space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: agent.color }} />
                          <span className="font-bold text-white text-sm">{agent.name}</span>
                          <span className="text-zinc-400">({agent.role})</span>
                        </div>
                        {agent.allowDelegation && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                            DELEGATION ENABLED
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-zinc-300">
                        <span className="text-zinc-500">Goal: </span>
                        {agent.goal}
                      </div>

                      <div className="text-[11px] text-zinc-400 italic">
                        "{agent.backstory}"
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1 border-t border-zinc-800/80">
                        <span className="text-[10px] text-zinc-400">Tools:</span>
                        {agent.tools.map(tool => (
                          <span
                            key={tool}
                            className="px-1.5 py-0.5 rounded bg-zinc-800 text-cyan-300 text-[10px]"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks Defined */}
              <div>
                <h4 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider mb-3">
                  Default Task Pipeline ({selectedCrew.tasks.length})
                </h4>
                <div className="space-y-2">
                  {selectedCrew.tasks.map(task => (
                    <div
                      key={task.id}
                      className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 text-xs font-mono"
                    >
                      <div className="font-bold text-zinc-200 mb-1">{task.title}</div>
                      <p className="text-[11px] text-zinc-400 mb-2">{task.description}</p>
                      <div className="text-[10px] text-emerald-400">
                        <span className="text-zinc-500">Expected Output: </span>
                        {task.expectedOutput}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Python / YAML Crew Definition Preview */}
              {selectedCrew.rawConfigCode && (
                <div>
                  <h4 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Code2 className="h-3.5 w-3.5 text-cyan-400" />
                    <span>CrewAI Python Definition</span>
                  </h4>
                  <pre className="p-3.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-300 overflow-x-auto leading-relaxed">
                    {selectedCrew.rawConfigCode}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-12 text-center text-zinc-500 font-mono text-xs">
              Select a crew to inspect agents and task pipelines.
            </div>
          )}
        </div>
      </div>

      {/* Upload New Crew Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold font-mono text-white uppercase">
                Upload Pre-Configured CrewAI Crew
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadCrew} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-zinc-300 mb-1">Crew Name</label>
                <input
                  type="text"
                  required
                  value={newCrewName}
                  onChange={e => setNewCrewName(e.target.value)}
                  placeholder="e.g. Autonomous Incident Triage Crew"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">Category</label>
                  <select
                    value={newCrewCategory}
                    onChange={e => setNewCrewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white"
                  >
                    <option value="Intelligence">Intelligence</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Growth">Growth</option>
                    <option value="Security">Security</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1">Process Type</label>
                  <select
                    value={newCrewProcess}
                    onChange={e => setNewCrewProcess(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white"
                  >
                    <option value="hierarchical">Hierarchical (Manager Agent)</option>
                    <option value="sequential">Sequential</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Description</label>
                <input
                  type="text"
                  value={newCrewDesc}
                  onChange={e => setNewCrewDesc(e.target.value)}
                  placeholder="Operational objective of this crew..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">CrewAI Python / YAML Definition</label>
                <textarea
                  rows={8}
                  value={pythonCode}
                  onChange={e => setPythonCode(e.target.value)}
                  className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded text-zinc-300 focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold rounded"
                >
                  Save & Ingest Crew
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
