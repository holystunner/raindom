import React, { useState } from 'react';
import { 
  Key, 
  Plus, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Lock, 
  ExternalLink,
  Globe,
  Database,
  Terminal,
  Radio
} from 'lucide-react';
import { IntegrationCredential, IntegrationProvider } from '../types';

interface IntegrationsVaultViewProps {
  integrations: IntegrationCredential[];
  onAddIntegration: (integration: IntegrationCredential) => void;
}

export const IntegrationsVaultView: React.FC<IntegrationsVaultViewProps> = ({
  integrations,
  onAddIntegration
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [pingingId, setPingingId] = useState<string | null>(null);

  // New integration state
  const [name, setName] = useState<string>('');
  const [provider, setProvider] = useState<IntegrationProvider>('github');
  const [keyName, setKeyName] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [endpointUrl, setEndpointUrl] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<'VCS' | 'Communication' | 'Database' | 'Cloud' | 'API Gateway'>('VCS');

  const handlePing = async (id: string) => {
    setPingingId(id);
    await new Promise(r => setTimeout(r, 650));
    setPingingId(null);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !keyName.trim()) return;

    const masked = value.length > 8 
      ? `${value.slice(0, 4)}••••••••••••••••${value.slice(-4)}`
      : '••••••••••••';

    const created: IntegrationCredential = {
      id: `int-${Date.now()}`,
      name: name.trim(),
      provider,
      keyName: keyName.trim().toUpperCase(),
      maskedValue: masked,
      endpointUrl: endpointUrl.trim() || undefined,
      isHealthy: true,
      lastVerified: 'Just now (HTTP 200 OK)',
      description: description.trim() || 'Custom API integration for autonomous workforce',
      category
    };

    onAddIntegration(created);
    setIsAddModalOpen(false);
    setName('');
    setKeyName('');
    setValue('');
    setEndpointUrl('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wide">
            Integrations & Credentials Vault
          </h2>
          <p className="text-xs text-zinc-400">
            Securely stored credentials and connection endpoints mounted into cloud-hosted web apps to enable real-world CrewAI tools.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold rounded-lg text-xs font-mono transition-colors shadow-md shadow-cyan-500/10 cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>ADD CREDENTIAL / API</span>
        </button>
      </div>

      {/* Grid of Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map(integ => (
          <div
            key={integ.id}
            className="p-5 rounded-xl border border-zinc-800 bg-zinc-950 space-y-3 font-mono text-xs shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400">
                  <Key className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-xs">{integ.name}</h3>
                  <span className="text-[10px] text-zinc-400 uppercase">[{integ.provider}]</span>
                </div>
              </div>

              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-cyan-300 border border-zinc-800">
                {integ.category}
              </span>
            </div>

            <p className="text-[11px] text-zinc-400 line-clamp-2">
              {integ.description}
            </p>

            <div className="bg-zinc-900/80 p-2.5 rounded-lg border border-zinc-800 text-[11px] space-y-1">
              <div>
                <span className="text-zinc-500">ENV VAR: </span>
                <code className="text-cyan-300 font-bold">{integ.keyName}</code>
              </div>
              <div className="truncate">
                <span className="text-zinc-500">VALUE: </span>
                <code className="text-zinc-400">{integ.maskedValue}</code>
              </div>
              {integ.endpointUrl && (
                <div className="truncate">
                  <span className="text-zinc-500">HOST: </span>
                  <code className="text-zinc-300">{integ.endpointUrl}</code>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-[10px]">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>{integ.lastVerified}</span>
              </span>

              <button
                onClick={() => handlePing(integ.id)}
                disabled={pingingId === integ.id}
                className="flex items-center gap-1 text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer"
              >
                <RefreshCw className={`h-3 w-3 ${pingingId === integ.id ? 'animate-spin' : ''}`} />
                <span>Ping Endpoint</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Credential Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase">
                Add Integration Credential to Vault
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-zinc-300 mb-1">Friendly Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Production GitHub Deploy Key"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">Provider</label>
                  <select
                    value={provider}
                    onChange={e => {
                      const p = e.target.value as IntegrationProvider;
                      setProvider(p);
                      if (p === 'github') setCategory('VCS');
                      else if (p === 'slack') setCategory('Communication');
                      else if (p === 'postgres') setCategory('Database');
                      else if (p === 'aws') setCategory('Cloud');
                      else setCategory('API Gateway');
                    }}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white"
                  >
                    <option value="github">GitHub</option>
                    <option value="slack">Slack</option>
                    <option value="linear">Linear</option>
                    <option value="postgres">PostgreSQL</option>
                    <option value="aws">AWS Cloud</option>
                    <option value="stripe">Stripe</option>
                    <option value="discord">Discord</option>
                    <option value="custom_openapi">Custom OpenAPI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white"
                  >
                    <option value="VCS">VCS</option>
                    <option value="Communication">Communication</option>
                    <option value="Database">Database</option>
                    <option value="Cloud">Cloud</option>
                    <option value="API Gateway">API Gateway</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Target Environment Variable Name</label>
                <input
                  type="text"
                  required
                  value={keyName}
                  onChange={e => setKeyName(e.target.value)}
                  placeholder="e.g. GITHUB_TOKEN"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-cyan-400 uppercase"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Secret Value / API Key / Token</label>
                <input
                  type="password"
                  required
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  placeholder="ghp_••••••••••••••••••••••••••••"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Endpoint URL (Optional)</label>
                <input
                  type="text"
                  value={endpointUrl}
                  onChange={e => setEndpointUrl(e.target.value)}
                  placeholder="https://api.github.com"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Purpose Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Used by Dev & Code QA Crew to create pull requests"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold rounded"
                >
                  Store in Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
