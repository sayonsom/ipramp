"use client";

import { useState, useEffect } from "react";
import type { Idea, InventorInfo } from "@/lib/types";
import { getIdeaProgress } from "@/lib/utils";
import { Modal, Button, Input, Badge } from "@/components/ui";

const STORAGE_KEY = "ipramp-oss:inventor-info";

interface ExportPDFModalProps {
  open: boolean;
  onClose: () => void;
  idea: Idea;
}

export function ExportPDFModal({ open, onClose, idea }: ExportPDFModalProps) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [generating, setGenerating] = useState(false);

  // Load saved inventor info
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const info = JSON.parse(saved) as InventorInfo;
        setName(info.name || "");
        setDepartment(info.department || "");
        setEmail(info.email || "");
      }
    } catch {
      // ignore
    }
  }, []);

  const progress = getIdeaProgress(idea);
  const isComplete = progress.percent === 100;

  async function handleGenerate() {
    if (!name.trim()) return;

    const inventor: InventorInfo = {
      name: name.trim(),
      department: department.trim(),
      email: email.trim(),
    };

    // Save inventor info
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inventor));
    } catch {
      // ignore
    }

    setGenerating(true);
    try {
      const { generatePatentDisclosurePDF } = await import("@/lib/pdf-generator");
      await generatePatentDisclosurePDF(idea, inventor);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. Check the console for details.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Export Patent Disclosure PDF" maxWidth="md">
      <div className="space-y-5">
        {/* Pipeline completeness */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-ink">Pipeline Completeness</span>
            <Badge
              variant="solid"
              color={isComplete ? "#10b981" : progress.percent >= 50 ? "#f59e0b" : "#6B7280"}
            >
              {progress.completed}/{progress.total} steps ({progress.percent}%)
            </Badge>
          </div>

          {/* Mini pipeline stages */}
          <div className="flex gap-1">
            {progress.stages.map(({ stage, done }) => (
              <div
                key={stage.id}
                title={`${stage.label}: ${done ? "Complete" : "Incomplete"}`}
                className={`flex-1 h-2 rounded-sm transition-colors ${
                  done ? "bg-blue-ribbon" : "bg-neutral-off-white"
                }`}
              />
            ))}
          </div>

          {!isComplete && (
            <p className="text-[11px] text-yellow-600 mt-2">
              Some pipeline steps are incomplete. The PDF will include available data.
            </p>
          )}
        </div>

        {/* Inventor info */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider">Inventor Information</h4>

          <div>
            <label className="block text-xs text-neutral-dark mb-1">Name *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-dark mb-1">Department</label>
            <Input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Engineering"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-dark mb-1">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@company.com"
              type="email"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="accent"
            size="sm"
            onClick={handleGenerate}
            disabled={!name.trim() || generating}
          >
            {generating ? "Generating..." : "Generate PDF"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
