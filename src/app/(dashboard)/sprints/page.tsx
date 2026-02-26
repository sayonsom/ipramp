"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSprintStore, useAuthStore } from "@/lib/store";
import { SESSION_MODES } from "@/lib/constants";
import { Button, Card, EmptyState, Modal, Input, Textarea } from "@/components/ui";
import type { Sprint } from "@/lib/types";

export default function SprintsPage() {
  const userId = useAuthStore((s) => s.user.id);
  const { sprints, loading, loadSprints } = useSprintStore();
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    loadSprints(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-ink">Invention Sprints</h1>
        <Button variant="accent" size="sm" onClick={() => setShowCreate(true)}>
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Sprint
        </Button>
      </div>

      {/* Process overview */}
      <div className="bg-white rounded-lg border border-border p-4 mb-6">
        <div className="text-xs font-medium text-blue-ribbon mb-2">THE PROCESS</div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {SESSION_MODES.map((m) => (
            <div key={m.key}>
              <div className="text-sm font-medium" style={{ color: m.color }}>{m.label}</div>
              <div className="text-xs text-text-muted">{m.target}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sprint list */}
      {loading ? (
        <div className="text-center text-text-muted py-12">Loading sprints...</div>
      ) : sprints.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          }
          title="No sprints yet"
          description="Run structured invention sprints to generate and curate patent ideas. Sprints give you a time-boxed process to brainstorm, evaluate, and promote the best ideas."
          action={
            <Button variant="accent" onClick={() => setShowCreate(true)}>Create your first sprint</Button>
          }
        />
      ) : (
        <div className="grid gap-3">
          {sprints.map((sprint) => (
            <Link key={sprint.id} href={`/sprints/${sprint.id}`}>
              <Card className="hover:border-blue-ribbon/30 transition-colors cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-ribbon text-lg">{"\u25B3"}</span>
                      <h3 className="text-base font-medium text-ink">{sprint.name}</h3>
                    </div>
                    {sprint.theme && (
                      <p className="text-xs text-text-muted mt-0.5 ml-6">{sprint.theme}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <SessionModeBadge mode={sprint.sessionMode} />
                    <PhaseBadge phase={sprint.phase} />
                    <SprintStatusBadge status={sprint.status} />
                  </div>
                </div>
                {sprint.description && (
                  <p className="text-xs text-text-muted mb-2 line-clamp-1">{sprint.description}</p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Create sprint modal */}
      {showCreate && (
        <CreateSprintModal
          open={showCreate}
          userId={userId}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}

// ─── Session Mode Badge ──────────────────────────────────────────

function SessionModeBadge({ mode }: { mode: Sprint["sessionMode"] }) {
  const colors: Record<Sprint["sessionMode"], string> = {
    quantity: "bg-blue-50 text-blue-700 border-blue-200",
    quality: "bg-purple-50 text-purple-700 border-purple-200",
    destroy: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${colors[mode] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
      {mode}
    </span>
  );
}

// ─── Phase Badge ─────────────────────────────────────────────────

function PhaseBadge({ phase }: { phase: Sprint["phase"] }) {
  const colors: Record<Sprint["phase"], string> = {
    foundation: "bg-indigo-50 text-indigo-700 border-indigo-200",
    validation: "bg-orange-50 text-orange-700 border-orange-200",
    filing: "bg-teal-50 text-teal-700 border-teal-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${colors[phase] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
      {phase}
    </span>
  );
}

// ─── Sprint Status Badge ──────────────────────────────────────────

function SprintStatusBadge({ status }: { status: Sprint["status"] }) {
  const colors: Record<Sprint["status"], string> = {
    active: "bg-green-50 text-green-700 border-green-200",
    paused: "bg-amber-50 text-amber-700 border-amber-200",
    completed: "bg-gray-50 text-gray-500 border-gray-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${colors[status]}`}>
      {status}
    </span>
  );
}

// ─── Create Sprint Modal ──────────────────────────────────────────

function CreateSprintModal({
  open,
  userId,
  onClose,
}: {
  open: boolean;
  userId: string;
  onClose: () => void;
}) {
  const { createSprint } = useSprintStore();

  const [name, setName] = useState("");
  const [theme, setTheme] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      await createSprint({
        name: name.trim(),
        ownerId: userId,
        description: description.trim(),
        theme: theme.trim(),
      });
      setName("");
      setTheme("");
      setDescription("");
      onClose();
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal open={open} title="Create Invention Sprint" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-neutral-dark mb-1">Sprint Name *</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Q1 Patent Sprint"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-dark mb-1">Theme</label>
          <Input
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="e.g., Cloud Security Patents"
          />
          <p className="text-[10px] text-text-muted mt-1">Focus area for this sprint</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-dark mb-1">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this sprint about? What kinds of ideas are you looking for?"
            rows={2}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="accent" onClick={handleCreate} disabled={!name.trim() || creating}>
            {creating ? "Creating..." : "Create Sprint"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
