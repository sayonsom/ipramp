"use client";

import { useState, useRef } from "react";
import { useSettingsStore } from "@/lib/store";
import { Button, Card } from "@/components/ui";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { toast } from "@/components/ui/Toast";
import {
  JURISDICTION_OPTIONS,
  CLAIM_STYLE_OPTIONS,
  TECHNICAL_DEPTH_OPTIONS,
  TONE_OPTIONS,
  DOMAIN_FOCUS_OPTIONS,
} from "@/lib/types";

export default function SettingsPage() {
  const {
    promptPrefs,
    promptPrefsLoaded,
    initPromptPrefs,
    updatePromptPrefs,
    savePromptPrefs,
    resetPromptPrefs,
    exportAllData,
    importAllData,
  } = useSettingsStore();

  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prefsSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize prompt prefs on mount
  useState(() => {
    initPromptPrefs();
  });

  function handleExport() {
    const json = exportAllData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ipramp-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Data exported successfully.");
  }

  function handleImport() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        importAllData(text);
        toast("Data imported successfully. Refresh to see changes.");
      } catch {
        setImportError("Invalid backup file. Please select a valid IP Ramp JSON export.");
      }
    };
    reader.readAsText(file);
    // Reset so same file can be re-selected
    e.target.value = "";
  }

  function handlePrefChange(updates: Partial<typeof promptPrefs>) {
    updatePromptPrefs(updates);
    if (prefsSaveTimer.current) clearTimeout(prefsSaveTimer.current);
    prefsSaveTimer.current = setTimeout(() => {
      savePromptPrefs();
      toast("Preferences saved.");
    }, 600);
  }

  return (
    <div className="pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif font-bold text-ink">Settings</h1>
        </div>

        <div className="grid gap-6">
          {/* About */}
          <Card>
            <h2 className="text-lg font-medium text-ink mb-2">About</h2>
            <p className="text-sm text-text-secondary mb-3">
              IP Ramp Open Source is a fully client-side patent ideation tool. All data is stored
              in your browser&apos;s localStorage. No backend, no accounts, no tracking.
            </p>
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-muted">Version</dt>
                <dd className="text-neutral-dark font-mono">1.0.0</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-muted">Storage</dt>
                <dd className="text-neutral-dark">Browser localStorage</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-muted">AI Features</dt>
                <dd className="text-neutral-dark">Copy-paste prompts (BYO LLM)</dd>
              </div>
            </dl>
          </Card>

          {/* Data Export / Import */}
          <Card>
            <h2 className="text-lg font-medium text-ink mb-2">Data</h2>
            <p className="text-sm text-text-secondary mb-4">
              Export all your ideas, sprints, and settings as a JSON backup. Import to restore from a backup.
            </p>
            <div className="flex gap-3">
              <Button variant="primary" size="sm" onClick={handleExport}>
                Export All Data
              </Button>
              <Button variant="secondary" size="sm" onClick={handleImport}>
                Import Backup
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            {importError && (
              <p className="text-xs text-danger mt-2">{importError}</p>
            )}
          </Card>

          {/* Prompt Preferences */}
          <Card>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-medium text-ink">Prompt Preferences</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  resetPromptPrefs();
                  toast("Preferences reset to defaults.");
                }}
              >
                Reset to Defaults
              </Button>
            </div>
            <p className="text-sm text-text-secondary mb-5">
              Customize how AI prompts are generated. These preferences are included when you copy prompts to use with any LLM.
            </p>

            {!promptPrefsLoaded ? (
              <div className="text-sm text-text-muted py-6 text-center">Loading preferences...</div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Select
                    label="Jurisdiction"
                    options={JURISDICTION_OPTIONS}
                    value={promptPrefs.jurisdiction}
                    onChange={(v) => handlePrefChange({ jurisdiction: v as typeof promptPrefs.jurisdiction })}
                  />
                  <Select
                    label="Claim Style"
                    options={CLAIM_STYLE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                    value={promptPrefs.claimStyle}
                    onChange={(v) => handlePrefChange({ claimStyle: v as typeof promptPrefs.claimStyle })}
                  />
                  <Select
                    label="Technical Depth"
                    options={TECHNICAL_DEPTH_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                    value={promptPrefs.technicalDepth}
                    onChange={(v) => handlePrefChange({ technicalDepth: v as typeof promptPrefs.technicalDepth })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Tone"
                    options={TONE_OPTIONS}
                    value={promptPrefs.tone}
                    onChange={(v) => handlePrefChange({ tone: v as typeof promptPrefs.tone })}
                  />
                  <Select
                    label="Domain Focus"
                    options={DOMAIN_FOCUS_OPTIONS}
                    value={promptPrefs.domainFocus}
                    onChange={(v) => handlePrefChange({ domainFocus: v as typeof promptPrefs.domainFocus })}
                  />
                </div>

                <div>
                  <Textarea
                    label="Company Context (optional)"
                    value={promptPrefs.companyContext}
                    maxLength={500}
                    placeholder="E.g., We are a fintech company focused on real-time payments using distributed ledger technology..."
                    autoExpand={false}
                    onChange={(e) => handlePrefChange({ companyContext: e.target.value })}
                  />
                  <p className="text-xs text-text-muted mt-1 text-right">
                    {promptPrefs.companyContext.length}/500
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Danger Zone */}
          <Card>
            <h2 className="text-lg font-medium text-ink mb-2">Danger Zone</h2>
            <p className="text-sm text-text-secondary mb-4">
              Clear all local data. This cannot be undone — export a backup first.
            </p>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (window.confirm("Are you sure? This will delete all your ideas, sprints, and settings from this browser.")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
            >
              Clear All Data
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
