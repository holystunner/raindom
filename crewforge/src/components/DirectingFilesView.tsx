import React, { useState } from 'react';
import { 
  FileCode, 
  Plus, 
  Save, 
  Download, 
  Copy, 
  Check, 
  Clock, 
  Tag, 
  CheckCircle2, 
  Trash2,
  FileText
} from 'lucide-react';
import { ProjectDirectingFile } from '../types';

interface DirectingFilesViewProps {
  files: ProjectDirectingFile[];
  onSaveFile: (file: ProjectDirectingFile) => void;
  onAddFile: (file: ProjectDirectingFile) => void;
}

export const DirectingFilesView: React.FC<DirectingFilesViewProps> = ({
  files,
  onSaveFile,
  onAddFile
}) => {
  const [selectedFile, setSelectedFile] = useState<ProjectDirectingFile>(files[0] || null);
  const [editorContent, setEditorContent] = useState<string>(files[0]?.content || '');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isNewFileModal, setIsNewFileModal] = useState<boolean>(false);

  // New file form
  const [newFilename, setNewFilename] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newPurpose, setNewPurpose] = useState<string>('');
  const [newFileType, setNewFileType] = useState<'markdown' | 'json' | 'yaml' | 'text'>('markdown');
  const [newContent, setNewContent] = useState<string>('# NEW DIRECTING DIRECTIVE\n\n1. Autonomous rule:\n2. Safety bounds:');

  const handleSelect = (file: ProjectDirectingFile) => {
    setSelectedFile(file);
    setEditorContent(file.content);
    setIsSaved(false);
  };

  const handleSave = () => {
    if (!selectedFile) return;
    const updated: ProjectDirectingFile = {
      ...selectedFile,
      content: editorContent,
      sizeBytes: new Blob([editorContent]).size,
      updatedAt: new Date().toISOString()
    };
    onSaveFile(updated);
    setSelectedFile(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editorContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateNewFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFilename.trim()) return;

    const created: ProjectDirectingFile = {
      id: `file-${Date.now()}`,
      filename: newFilename.trim(),
      title: newTitle.trim() || newFilename.trim(),
      fileType: newFileType,
      content: newContent,
      sizeBytes: new Blob([newContent]).size,
      purpose: newPurpose.trim() || 'Custom directive for workforce orchestration',
      updatedAt: new Date().toISOString(),
      tags: ['Custom', newFileType.toUpperCase()]
    };

    onAddFile(created);
    setSelectedFile(created);
    setEditorContent(created.content);
    setIsNewFileModal(false);
    setNewFilename('');
    setNewTitle('');
    setNewPurpose('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wide">
            Project & Directing Files Repository
          </h2>
          <p className="text-xs text-zinc-400">
            SOPs, Mission Directives, and Architecture RFCs mounted into containerized web app runtimes to guide autonomous CrewAI execution.
          </p>
        </div>

        <button
          onClick={() => setIsNewFileModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold rounded-lg text-xs font-mono transition-colors shadow-md shadow-cyan-500/10 cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>NEW DIRECTING FILE</span>
        </button>
      </div>

      {/* Main Grid: Files List & Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: File List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          {files.map(file => {
            const isSelected = selectedFile?.id === file.id;
            return (
              <div
                key={file.id}
                onClick={() => handleSelect(file)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-zinc-900 border-cyan-500/50 shadow-md shadow-cyan-500/5 ring-1 ring-cyan-500/30'
                    : 'bg-zinc-950 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-cyan-400" />
                    <span className="font-bold text-xs font-mono text-white truncate max-w-[200px]">
                      {file.filename}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                    {(file.sizeBytes / 1024).toFixed(1)} KB
                  </span>
                </div>

                <div className="text-xs text-zinc-300 font-medium line-clamp-1 mb-1">
                  {file.title}
                </div>

                <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2">
                  {file.purpose}
                </p>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {file.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Col: Editor & Preview (8 cols) */}
        <div className="lg:col-span-8">
          {selectedFile ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2 font-mono">
                  <FileCode className="h-5 w-5 text-cyan-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedFile.filename}</h3>
                    <p className="text-[11px] text-zinc-400">{selectedFile.purpose}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleSave}
                    className="px-3.5 py-1.5 rounded bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isSaved ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
                    <span>{isSaved ? 'Saved to Vault' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={18}
                value={editorContent}
                onChange={e => {
                  setEditorContent(e.target.value);
                  setIsSaved(false);
                }}
                className="w-full p-4 bg-zinc-900/90 border border-zinc-700/80 rounded-lg text-xs font-mono text-zinc-200 focus:outline-none focus:border-cyan-400 leading-relaxed resize-y"
              />

              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t border-zinc-800/80">
                <span>Type: {selectedFile.fileType.toUpperCase()}</span>
                <span>Size: {(new Blob([editorContent]).size / 1024).toFixed(1)} KB</span>
                <span>Last Modified: {new Date(selectedFile.updatedAt).toLocaleTimeString()}</span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-12 text-center text-zinc-500 font-mono text-xs">
              Select a directing file to inspect and edit.
            </div>
          )}
        </div>
      </div>

      {/* New File Modal */}
      {isNewFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase">
                Create New Directing File
              </h3>
              <button
                onClick={() => setIsNewFileModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewFile} className="space-y-3">
              <div>
                <label className="block text-zinc-300 mb-1">Filename</label>
                <input
                  type="text"
                  required
                  value={newFilename}
                  onChange={e => setNewFilename(e.target.value)}
                  placeholder="e.g. COMPLIANCE_POLICY_v2.md"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Document Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Operational Security Guardrails"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Purpose / Scope</label>
                <input
                  type="text"
                  value={newPurpose}
                  onChange={e => setNewPurpose(e.target.value)}
                  placeholder="Instructs agents on allowable SQL query limits..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Initial Content</label>
                <textarea
                  rows={6}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded text-zinc-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsNewFileModal(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold rounded"
                >
                  Create & Mount File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
