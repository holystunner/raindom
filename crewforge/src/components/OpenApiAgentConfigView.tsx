import React, { useState } from 'react';
import { 
  Code2, 
  ShieldAlert, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  Radio, 
  Copy, 
  Check, 
  Sliders, 
  Zap,
  Globe,
  Lock,
  Layers
} from 'lucide-react';
import { MANAGEMENT_AGENT_OPENAPI_TOOLS, testOpenApiConnection } from '../services/openApiAgentService';
import { ManagementAgentConfig, OpenApiProvider } from '../types';

interface OpenApiAgentConfigViewProps {
  currentConfig: ManagementAgentConfig;
  onUpdateConfig: (config: ManagementAgentConfig) => void;
}

export const OpenApiAgentConfigView: React.FC<OpenApiAgentConfigViewProps> = ({
  currentConfig,
  onUpdateConfig
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [provider, setProvider] = useState<OpenApiProvider>(currentConfig.provider);
  const [apiEndpoint, setApiEndpoint] = useState<string>(currentConfig.apiEndpoint);
  const [apiKey, setApiKey] = useState<string>(currentConfig.apiKey);
  const [model, setModel] = useState<string>(currentConfig.model);
  const [testResult, setTestResult] = useState<{ testing: boolean; res?: any }>({ testing: false });

  const handleProviderSelect = (p: OpenApiProvider) => {
    setProvider(p);
    if (p === 'openai') {
      setApiEndpoint('https://api.openai.com/v1');
      setModel('gpt-4o');
    } else if (p === 'openrouter') {
      setApiEndpoint('https://openrouter.ai/api/v1');
      setModel('anthropic/claude-3.5-sonnet');
    } else if (p === 'groq') {
      setApiEndpoint('https://api.groq.com/openai/v1');
      setModel('llama-3.3-70b-versatile');
    } else if (p === 'ollama') {
      setApiEndpoint('http://localhost:11434/v1');
      setModel('llama3.3:latest');
    } else if (p === 'custom_openapi') {
      setApiEndpoint('https://api.enterprise.internal/v1');
      setModel('custom-orchestrator-v1');
    }
  };

  const handleTest = async () => {
    setTestResult({ testing: true });
    const cfg: ManagementAgentConfig = {
      ...currentConfig,
      provider,
      apiEndpoint,
      apiKey,
      model
    };
    const res = await testOpenApiConnection(cfg);
    setTestResult({ testing: false, res });
    onUpdateConfig(cfg);
  };

  const copySpec = () => {
    navigator.clipboard.writeText(JSON.stringify(MANAGEMENT_AGENT_OPENAPI_TOOLS, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wide">
            Direct OpenAPI Architecture & Orchestration Specs
          </h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
            ZERO PROPRIETARY WRAPPERS
          </span>
        </div>
        <p className="text-xs text-zinc-400">
          The cloud-hosted workforce management agent uses standard OpenAPI 3.0 / OpenAI compatible execution schemas. Connect directly to OpenAI, OpenRouter, Groq, local Ollama, or custom private gateways without Google AI intermediary layers.
        </p>
      </div>

      {/* Zero AI Fluff Banner */}
      <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/30 font-mono text-xs space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase">
          <ShieldAlert className="h-4 w-4" />
          <span>Core Guarantee: Native OpenAPI Standard Execution</span>
        </div>
        <p className="text-[11px] text-zinc-300 leading-relaxed">
          Every tool invocation, directive prompt, and agent delegation is dispatched via standardized REST/JSON payloads conforming strictly to the OpenAPI specification. You maintain full ownership of credentials, models, and execution logs.
        </p>
      </div>

      {/* Provider Selector & Endpoint Tester */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-4 font-mono text-xs">
        <h3 className="text-sm font-bold text-white uppercase">
          Configure Direct OpenAPI Management Provider
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { id: 'openai', label: 'OpenAI Direct' },
            { id: 'openrouter', label: 'OpenRouter.ai' },
            { id: 'groq', label: 'Groq Cloud' },
            { id: 'ollama', label: 'Local Ollama' },
            { id: 'custom_openapi', label: 'Custom OpenAPI' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => handleProviderSelect(p.id as any)}
              className={`py-2 px-3 rounded-lg border text-center transition-all ${
                provider === p.id
                  ? 'bg-cyan-500 text-zinc-950 font-bold border-cyan-400 shadow-sm shadow-cyan-500/20'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-zinc-400 mb-1">OpenAPI Base URL</label>
            <input
              type="text"
              value={apiEndpoint}
              onChange={e => setApiEndpoint(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Model String</label>
            <input
              type="text"
              value={model}
              onChange={e => setModel(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">
            API Secret Key (Optional for external calls)
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-••••••••••••••••••••••••••••"
              className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleTest}
              disabled={testResult.testing}
              className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-zinc-950 font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {testResult.testing ? <Radio className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
              <span>Test Endpoint Spec</span>
            </button>
          </div>
        </div>

        {testResult.res && (
          <div className={`p-3 rounded-lg flex items-center gap-2 text-xs ${
            testResult.res.success 
              ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40' 
              : 'bg-rose-950/40 text-rose-300 border border-rose-800/40'
          }`}>
            {testResult.res.success ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
            <div>
              <span className="font-bold">{testResult.res.message}</span>
              <span className="ml-2 text-[10px] text-zinc-400">({testResult.res.latencyMs}ms roundtrip)</span>
            </div>
          </div>
        )}
      </div>

      {/* OpenAPI Tools Definition Viewer */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 font-mono">
            <Code2 className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase">
              Management Agent OpenAPI 3.0 Tools Schema ({MANAGEMENT_AGENT_OPENAPI_TOOLS.length} Registered)
            </h3>
          </div>

          <button
            onClick={copySpec}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-mono text-xs transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Schema JSON'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {MANAGEMENT_AGENT_OPENAPI_TOOLS.map(t => (
            <div
              key={t.function.name}
              className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 font-mono text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300 text-xs">
                  {t.function.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                  TOOL CALL
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                {t.function.description}
              </p>
              <div className="pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-500">
                Required params: <code className="text-zinc-300">{t.function.parameters.required.join(', ')}</code>
              </div>
            </div>
          ))}
        </div>

        {/* Raw JSON Spec Drawer */}
        <div className="mt-4">
          <pre className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300 max-h-72 overflow-y-auto leading-relaxed">
            {JSON.stringify(MANAGEMENT_AGENT_OPENAPI_TOOLS, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
