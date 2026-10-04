import React, { useState, useEffect } from 'react';
import { 
  SpawnedWorkforce, 
  CrewAICrew, 
  IntegrationCredential, 
  ProjectDirectingFile, 
  ManagementAgentConfig 
} from './types';
import { 
  getStoredWorkforces, 
  saveStoredWorkforces, 
  getStoredCrews, 
  saveStoredCrews, 
  getStoredIntegrations, 
  saveStoredIntegrations, 
  getStoredDirectingFiles, 
  saveStoredDirectingFiles,
  generateRandomTelemetryTick
} from './services/workforceEngine';
import { DEFAULT_MANAGEMENT_AGENT_CONFIG } from './data/defaultData';
import { TopNavbar } from './components/TopNavbar';
import { WorkforcesListView } from './components/WorkforcesListView';
import { WorkforceDetailView } from './components/WorkforceDetailView';
import { SpawnWorkforceModal } from './components/SpawnWorkforceModal';
import { CrewRegistryView } from './components/CrewRegistryView';
import { DirectingFilesView } from './components/DirectingFilesView';
import { IntegrationsVaultView } from './components/IntegrationsVaultView';
import { OpenApiAgentConfigView } from './components/OpenApiAgentConfigView';

export default function App() {
  const [workforces, setWorkforces] = useState<SpawnedWorkforce[]>(getStoredWorkforces);
  const [crews, setCrews] = useState<CrewAICrew[]>(getStoredCrews);
  const [integrations, setIntegrations] = useState<IntegrationCredential[]>(getStoredIntegrations);
  const [directingFiles, setDirectingFiles] = useState<ProjectDirectingFile[]>(getStoredDirectingFiles);
  const [managementAgentConfig, setManagementAgentConfig] = useState<ManagementAgentConfig>(DEFAULT_MANAGEMENT_AGENT_CONFIG);

  const [activeTab, setActiveTab] = useState<'workforces' | 'crews' | 'directing-files' | 'integrations' | 'openapi-spec'>('workforces');
  const [selectedWorkforceId, setSelectedWorkforceId] = useState<string | null>(workforces[0]?.id || null);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);

  // Synchronize state changes to localStorage
  useEffect(() => {
    saveStoredWorkforces(workforces);
  }, [workforces]);

  useEffect(() => {
    saveStoredCrews(crews);
  }, [crews]);

  useEffect(() => {
    saveStoredIntegrations(integrations);
  }, [integrations]);

  useEffect(() => {
    saveStoredDirectingFiles(directingFiles);
  }, [directingFiles]);

  // Live telemetry pulse tick for active workforces
  useEffect(() => {
    const timer = setInterval(() => {
      setWorkforces(prev => 
        prev.map(wf => (wf.status === 'active' ? generateRandomTelemetryTick(wf, crews) : wf))
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [crews]);

  // Handle workforce spawn
  const handleWorkforceSpawned = (newWf: SpawnedWorkforce) => {
    setWorkforces(prev => [newWf, ...prev]);
    setSelectedWorkforceId(newWf.id);
    setActiveTab('workforces');
  };

  // Handle single workforce update (logs, state, directive)
  const handleUpdateWorkforce = (updated: SpawnedWorkforce) => {
    setWorkforces(prev => prev.map(w => (w.id === updated.id ? updated : w)));
  };

  // Handle pause/resume
  const handleToggleStatus = (id: string) => {
    setWorkforces(prev =>
      prev.map(w => {
        if (w.id === id) {
          const nextStatus = w.status === 'active' ? 'paused' : 'active';
          return { ...w, status: nextStatus };
        }
        return w;
      })
    );
  };

  // Handle terminate
  const handleTerminate = (id: string) => {
    if (confirm('Are you sure you want to terminate this cloud workforce container?')) {
      setWorkforces(prev => prev.filter(w => w.id !== id));
      if (selectedWorkforceId === id) {
        setSelectedWorkforceId(null);
      }
    }
  };

  // Add crew
  const handleAddCrew = (newCrew: CrewAICrew) => {
    setCrews(prev => [newCrew, ...prev]);
  };

  // Add integration
  const handleAddIntegration = (newInteg: IntegrationCredential) => {
    setIntegrations(prev => [newInteg, ...prev]);
  };

  // Directing file save/create
  const handleSaveDirectingFile = (updatedFile: ProjectDirectingFile) => {
    setDirectingFiles(prev => prev.map(f => (f.id === updatedFile.id ? updatedFile : f)));
  };

  const handleAddDirectingFile = (newFile: ProjectDirectingFile) => {
    setDirectingFiles(prev => [newFile, ...prev]);
  };

  const selectedWorkforce = workforces.find(w => w.id === selectedWorkforceId) || null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <TopNavbar
        activeTab={activeTab}
        setActiveTab={tab => {
          setActiveTab(tab);
          if (tab !== 'workforces') {
            setSelectedWorkforceId(null);
          }
        }}
        workforces={workforces}
        onOpenSpawnModal={() => setIsSpawnModalOpen(true)}
      />

      {/* Main Mission Control Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'workforces' && (
          selectedWorkforce ? (
            <WorkforceDetailView
              workforce={selectedWorkforce}
              allCrews={crews}
              allIntegrations={integrations}
              allDirectingFiles={directingFiles}
              onUpdateWorkforce={handleUpdateWorkforce}
              onBackToList={() => setSelectedWorkforceId(null)}
            />
          ) : (
            <WorkforcesListView
              workforces={workforces}
              allCrews={crews}
              onSelectWorkforce={wf => setSelectedWorkforceId(wf.id)}
              onOpenSpawnModal={() => setIsSpawnModalOpen(true)}
              onToggleStatus={handleToggleStatus}
              onTerminate={handleTerminate}
            />
          )
        )}

        {activeTab === 'crews' && (
          <CrewRegistryView
            crews={crews}
            onAddCrew={handleAddCrew}
            onSelectCrewToSpawn={crewId => {
              setIsSpawnModalOpen(true);
            }}
          />
        )}

        {activeTab === 'directing-files' && (
          <DirectingFilesView
            files={directingFiles}
            onSaveFile={handleSaveDirectingFile}
            onAddFile={handleAddDirectingFile}
          />
        )}

        {activeTab === 'integrations' && (
          <IntegrationsVaultView
            integrations={integrations}
            onAddIntegration={handleAddIntegration}
          />
        )}

        {activeTab === 'openapi-spec' && (
          <OpenApiAgentConfigView
            currentConfig={managementAgentConfig}
            onUpdateConfig={setManagementAgentConfig}
          />
        )}
      </main>

      {/* Spawn Workforce Modal Wizard */}
      <SpawnWorkforceModal
        isOpen={isSpawnModalOpen}
        onClose={() => setIsSpawnModalOpen(false)}
        crews={crews}
        integrations={integrations}
        directingFiles={directingFiles}
        onWorkforceSpawned={handleWorkforceSpawned}
      />
    </div>
  );
}
