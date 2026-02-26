"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Idea, IdeaScore, RedTeamResult, FrameworkType, ClaimDraft } from "@/lib/types";
import { useIdeaStore } from "@/lib/store";
import { useAI, type PromptDescriptor } from "@/hooks/useAI";
import { useDebouncedField } from "@/hooks/useDebouncedField";
import { usePriorArt } from "@/hooks/usePriorArt";
import { Button, Tabs, TabPanel, Input, Textarea, Badge, Card, TagInput, Modal } from "@/components/ui";
import { ScoreMatrix } from "./ScoreMatrix";
import { PipelineProgress } from "./PipelineProgress";
import { ClaimDraftDisplay } from "./ClaimDraft";
import { InventiveStepCard } from "./InventiveStepCard";
import { SearchForm } from "@/components/prior-art/SearchForm";
import { TRIZWorksheet } from "@/components/frameworks/TRIZWorksheet";
import { SITWorksheet } from "@/components/frameworks/SITWorksheet";
import { CKWorksheet } from "@/components/frameworks/CKWorksheet";
import { FMEAInversion } from "@/components/frameworks/FMEAInversion";
import { AIPromptModal } from "@/components/ai/AIPromptModal";
import { getStatusColor, getTotalScore, getScoreVerdict, timeAgo, getAliceRiskColor } from "@/lib/utils";

interface IdeaDetailProps {
  idea: Idea;
}

const STATUS_OPTIONS: { value: Idea["status"]; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "developing", label: "Developing" },
  { value: "scored", label: "Scored" },
  { value: "filed", label: "Filed" },
  { value: "archived", label: "Archived" },
];

const DETAIL_TABS = [
  { id: "overview", label: "Overview" },
  { id: "framework", label: "Framework" },
  { id: "claims", label: "Claims" },
  { id: "patent-filing", label: "Patent Filing" },
  { id: "red-team", label: "Red Team" },
  { id: "prior-art", label: "Prior Art" },
];

const emptyClaimDraft: ClaimDraft = {
  methodClaim: "",
  systemClaim: "",
  crmClaim: "",
  methodDependentClaims: [],
  systemDependentClaims: [],
  crmDependentClaims: [],
  abstractText: "",
  claimStrategy: "",
  aliceMitigationNotes: "",
  prosecutionTips: [],
  notes: "",
};

const FRAMEWORK_OPTIONS: { value: FrameworkType; label: string; desc: string }[] = [
  { value: "triz", label: "TRIZ", desc: "Contradiction analysis with inventive principles" },
  { value: "sit", label: "SIT", desc: "Systematic Inventive Thinking templates" },
  { value: "ck", label: "C-K Theory", desc: "Concept-Knowledge space mapping" },
  { value: "fmea", label: "FMEA Inversion", desc: "Turn failure modes into patent candidates" },
];

export function IdeaDetail({ idea }: IdeaDetailProps) {
  const router = useRouter();
  const updateIdea = useIdeaStore((s) => s.updateIdea);
  const removeIdea = useIdeaStore((s) => s.removeIdea);
  const [activeTab, setActiveTab] = useState("overview");
  const [editing, setEditing] = useState(false);

  const update = useCallback(
    (updates: Partial<Idea>) => {
      updateIdea(idea.id, updates);
    },
    [idea.id, updateIdea]
  );

  const saveTitle = useCallback((v: string) => update({ title: v }), [update]);
  const title = useDebouncedField(idea.title, saveTitle);

  function handleDelete() {
    if (window.confirm("Delete this idea? This cannot be undone.")) {
      removeIdea(idea.id);
      router.push("/ideas");
    }
  }

  function handleStageClick(tabId: string) {
    setActiveTab(tabId);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left: tabbed content */}
      <div className="flex-1 min-w-0">
        {/* Pipeline progress */}
        <PipelineProgress idea={idea} onStageClick={handleStageClick} />

        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            {editing ? (
              <Input
                value={title.localValue}
                onChange={(e) => title.onChange(e.target.value)}
                onBlur={title.flush}
                className="text-xl font-semibold"
              />
            ) : (
              <h1 className="text-xl font-serif font-bold text-ink truncate">
                {idea.title || "Untitled Idea"}
              </h1>
            )}
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="solid" color={getStatusColor(idea.status)}>
                {idea.status}
              </Badge>
              <span className="text-xs text-text-muted">Updated {timeAgo(idea.updatedAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4 shrink-0">
            <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>
              {editing ? "Done" : "Edit"}
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>

        <Tabs tabs={DETAIL_TABS} activeTab={activeTab} onChange={setActiveTab}>
          <TabPanel id="overview" activeTab={activeTab}>
            <OverviewTab idea={idea} update={update} editing={editing} />
          </TabPanel>
          <TabPanel id="framework" activeTab={activeTab}>
            <FrameworkTab idea={idea} update={update} />
          </TabPanel>
          <TabPanel id="claims" activeTab={activeTab}>
            <ClaimsTab idea={idea} update={update} editing={editing} />
          </TabPanel>
          <TabPanel id="patent-filing" activeTab={activeTab}>
            <PatentFilingTab idea={idea} update={update} />
          </TabPanel>
          <TabPanel id="red-team" activeTab={activeTab}>
            <RedTeamTab idea={idea} update={update} editing={editing} />
          </TabPanel>
          <TabPanel id="prior-art" activeTab={activeTab}>
            <PriorArtTab idea={idea} update={update} />
          </TabPanel>
        </Tabs>
      </div>

      {/* Right sidebar */}
      <div className="w-full lg:w-80 shrink-0 space-y-4">
        {/* Score matrix */}
        <Card>
          <ScoreMatrix
            score={idea.score}
            onChange={(score: IdeaScore) => update({ score })}
          />
          {idea.score && (
            <div className="mt-3 pt-3 border-t border-border">
              <div
                className="text-sm font-normal"
                style={{ color: getScoreVerdict(getTotalScore(idea.score)).color }}
              >
                {getScoreVerdict(getTotalScore(idea.score)).label} ({getTotalScore(idea.score)}/9)
              </div>
            </div>
          )}
        </Card>

        {/* Alice score */}
        {idea.aliceScore ? (
          <Card>
            <h3 className="text-sm font-medium text-ink mb-2">Alice / 101 Score</h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-normal text-ink">{idea.aliceScore.overallScore}</span>
              <span className="text-xs text-text-muted">/100</span>
              <Badge
                variant="solid"
                color={getAliceRiskColor(idea.aliceScore.abstractIdeaRisk)}
              >
                {idea.aliceScore.abstractIdeaRisk} risk
              </Badge>
            </div>
            <p className="text-xs text-neutral-dark">{idea.aliceScore.practicalApplication}</p>
          </Card>
        ) : (
          <AliceCheckButton idea={idea} update={update} />
        )}

        {/* Sprint Association */}
        {idea.sprintId && (
          <Card>
            <h3 className="text-sm font-medium text-ink mb-2">Sprint</h3>
            <div className="flex items-center justify-between">
              <Link
                href={`/sprints/${idea.sprintId}`}
                className="inline-flex items-center gap-1.5 text-xs text-blue-ribbon hover:underline"
              >
                <span>&#9651;</span>
                View Sprint
              </Link>
              <button
                onClick={async () => {
                  const { unlinkFromSprint } = await import("@/lib/api");
                  await unlinkFromSprint(idea.id);
                  update({ sprintId: null });
                }}
                className="text-[11px] text-text-muted hover:text-red-500 transition-colors"
              >
                Remove from Sprint
              </button>
            </div>
          </Card>
        )}

        {/* Status */}
        <Card>
          <h3 className="text-sm font-medium text-ink mb-2">Status</h3>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update({ status: opt.value })}
                className={`px-2.5 py-1 rounded text-xs font-normal transition-colors ${
                  idea.status === opt.value
                    ? "bg-accent-light text-blue-ribbon"
                    : "bg-white text-neutral-dark hover:text-ink"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Tags */}
        <Card>
          <h3 className="text-sm font-medium text-ink mb-2">Tags</h3>
          <TagInput
            tags={idea.tags}
            onChange={(tags) => update({ tags })}
            placeholder="Add tags..."
          />
        </Card>

        {/* Metadata */}
        <Card>
          <h3 className="text-sm font-medium text-ink mb-2">Metadata</h3>
          <dl className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <dt className="text-text-muted">Created</dt>
              <dd className="text-neutral-dark">{timeAgo(idea.createdAt)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Framework</dt>
              <dd className="text-neutral-dark">{idea.frameworkUsed === "none" ? "Freeform" : idea.frameworkUsed.toUpperCase()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Phase</dt>
              <dd className="text-neutral-dark capitalize">{idea.phase}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">ID</dt>
              <dd className="text-text-muted font-mono">{idea.id.slice(0, 8)}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}

// ─── Alice Check Button (sidebar) ─────────────────────────────

function AliceCheckButton({ idea, update }: { idea: Idea; update: (u: Partial<Idea>) => void }) {
  const { scoreAlice } = useAI();
  const [prompt, setPrompt] = useState<PromptDescriptor | null>(null);

  function handleRunAlice() {
    const desc = scoreAlice({
      title: idea.title,
      problemStatement: idea.problemStatement,
      proposedSolution: idea.proposedSolution,
      technicalApproach: idea.technicalApproach,
    });
    setPrompt(desc);
  }

  return (
    <>
      <Card>
        <h3 className="text-sm font-medium text-ink mb-2">Alice / 101 Score</h3>
        <p className="text-xs text-neutral-dark mb-3">
          Run an AI pre-screen to assess Section 101 eligibility risks.
        </p>
        <Button
          variant="accent"
          size="sm"
          onClick={handleRunAlice}
          disabled={!idea.problemStatement}
        >
          Run Alice Check
        </Button>
        {!idea.problemStatement && (
          <p className="text-[10px] text-text-muted mt-1">Add a problem statement first.</p>
        )}
      </Card>
      {prompt && (
        <AIPromptModal
          open
          onClose={() => setPrompt(null)}
          featureName={prompt.featureName}
          systemPrompt={prompt.systemPrompt}
          userPrompt={prompt.userPrompt}
          responseFormatHint={prompt.responseFormatHint}
          onApply={(parsed) => {
            if (parsed && typeof parsed === "object") {
              update({ aliceScore: parsed as Idea["aliceScore"] });
            }
          }}
        />
      )}
    </>
  );
}

// ─── Tab Components ────────────────────────────────────────────

function OverviewTab({ idea, update, editing }: { idea: Idea; update: (u: Partial<Idea>) => void; editing: boolean }) {
  const saveProblem = useCallback((v: string) => update({ problemStatement: v }), [update]);
  const saveExisting = useCallback((v: string) => update({ existingApproach: v }), [update]);
  const saveSolution = useCallback((v: string) => update({ proposedSolution: v }), [update]);
  const saveTechnical = useCallback((v: string) => update({ technicalApproach: v }), [update]);
  const saveContradiction = useCallback((v: string) => update({ contradictionResolved: v }), [update]);

  const problem = useDebouncedField(idea.problemStatement, saveProblem);
  const existing = useDebouncedField(idea.existingApproach, saveExisting);
  const solution = useDebouncedField(idea.proposedSolution, saveSolution);
  const technical = useDebouncedField(idea.technicalApproach, saveTechnical);
  const contradiction = useDebouncedField(idea.contradictionResolved, saveContradiction);

  return (
    <div className="space-y-6">
      <Section label="Problem Statement">
        {editing ? (
          <Textarea
            value={problem.localValue}
            onChange={(e) => problem.onChange(e.target.value)}
            onBlur={problem.flush}
            rows={4}
          />
        ) : (
          <p className="text-sm text-neutral-dark whitespace-pre-wrap">
            {idea.problemStatement || "No problem statement yet."}
          </p>
        )}
      </Section>

      <Section label="Existing Approach">
        {editing ? (
          <Textarea
            value={existing.localValue}
            onChange={(e) => existing.onChange(e.target.value)}
            onBlur={existing.flush}
            rows={3}
          />
        ) : (
          <p className="text-sm text-neutral-dark whitespace-pre-wrap">
            {idea.existingApproach || "Not described."}
          </p>
        )}
      </Section>

      <Section label="Proposed Solution">
        {editing ? (
          <Textarea
            value={solution.localValue}
            onChange={(e) => solution.onChange(e.target.value)}
            onBlur={solution.flush}
            rows={3}
          />
        ) : (
          <p className="text-sm text-neutral-dark whitespace-pre-wrap">
            {idea.proposedSolution || "Not described."}
          </p>
        )}
      </Section>

      <Section label="Technical Approach">
        {editing ? (
          <Textarea
            value={technical.localValue}
            onChange={(e) => technical.onChange(e.target.value)}
            onBlur={technical.flush}
            rows={4}
          />
        ) : (
          <p className="text-sm text-neutral-dark whitespace-pre-wrap">
            {idea.technicalApproach || "Not described."}
          </p>
        )}
      </Section>

      <Section label="Contradiction Resolved">
        {editing ? (
          <Textarea
            value={contradiction.localValue}
            onChange={(e) => contradiction.onChange(e.target.value)}
            onBlur={contradiction.flush}
            rows={2}
          />
        ) : (
          <p className="text-sm text-neutral-dark whitespace-pre-wrap">
            {idea.contradictionResolved || "No contradiction noted."}
          </p>
        )}
      </Section>

      {idea.techStack.length > 0 && (
        <Section label="Tech Stack">
          <div className="flex flex-wrap gap-1.5">
            {idea.techStack.map((t) => (
              <Badge key={t} variant="outline">{t}</Badge>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function FrameworkTab({ idea, update }: { idea: Idea; update: (u: Partial<Idea>) => void }) {
  const [worksheetOpen, setWorksheetOpen] = useState(false);

  function selectFramework(fw: FrameworkType) {
    update({ frameworkUsed: fw });
  }

  // No framework selected — show selection cards
  if (idea.frameworkUsed === "none") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-neutral-dark">
          Choose an inventive framework to structure your thinking:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FRAMEWORK_OPTIONS.map((fw) => (
            <button
              key={fw.value}
              onClick={() => selectFramework(fw.value)}
              className="text-left p-4 rounded-xl border border-border bg-white hover:border-blue-ribbon/50 hover:bg-neutral-off-white transition-all"
            >
              <h4 className="text-sm font-medium text-ink mb-1">{fw.label}</h4>
              <p className="text-xs text-neutral-dark">{fw.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Framework selected — show data + open worksheet button
  const worksheetTitle = `${idea.frameworkUsed.toUpperCase()} Worksheet`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-dark">
          Framework: <span className="font-normal text-ink">{idea.frameworkUsed.toUpperCase()}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="accent" size="sm" onClick={() => setWorksheetOpen(true)}>
            Open Worksheet
          </Button>
          <Button variant="ghost" size="sm" onClick={() => update({ frameworkUsed: "none", frameworkData: {} })}>
            Change
          </Button>
        </div>
      </div>

      {/* Inline data preview */}
      {idea.frameworkData.triz && idea.frameworkUsed === "triz" && (
        <Card>
          <h4 className="text-sm font-medium text-ink mb-2">TRIZ Data</h4>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-text-muted">Improving:</dt><dd className="text-neutral-dark">{idea.frameworkData.triz.improving || "\u2014"}</dd></div>
            <div><dt className="text-text-muted">Worsening:</dt><dd className="text-neutral-dark">{idea.frameworkData.triz.worsening || "\u2014"}</dd></div>
            <div><dt className="text-text-muted">Resolution:</dt><dd className="text-neutral-dark">{idea.frameworkData.triz.resolution || "\u2014"}</dd></div>
          </dl>
        </Card>
      )}
      {idea.frameworkData.ck && idea.frameworkUsed === "ck" && (
        <Card>
          <h4 className="text-sm font-medium text-ink mb-2">C-K Theory</h4>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-text-muted">Concepts:</dt><dd className="text-neutral-dark whitespace-pre-wrap">{idea.frameworkData.ck.concepts || "\u2014"}</dd></div>
            <div><dt className="text-text-muted">Knowledge:</dt><dd className="text-neutral-dark whitespace-pre-wrap">{idea.frameworkData.ck.knowledge || "\u2014"}</dd></div>
            <div><dt className="text-text-muted">Opportunity:</dt><dd className="text-neutral-dark whitespace-pre-wrap">{idea.frameworkData.ck.opportunity || "\u2014"}</dd></div>
          </dl>
        </Card>
      )}
      {idea.frameworkData.sit && idea.frameworkUsed === "sit" && (
        <Card>
          <h4 className="text-sm font-medium text-ink mb-2">SIT Templates</h4>
          <dl className="space-y-2 text-sm">
            {Object.entries(idea.frameworkData.sit).map(([k, v]) => (
              <div key={k}><dt className="text-text-muted capitalize">{k}:</dt><dd className="text-neutral-dark whitespace-pre-wrap">{v || "\u2014"}</dd></div>
            ))}
          </dl>
        </Card>
      )}
      {idea.frameworkData.fmea && idea.frameworkUsed === "fmea" && (
        <Card>
          <h4 className="text-sm font-medium text-ink mb-2">FMEA Entries</h4>
          <p className="text-xs text-neutral-dark">{idea.frameworkData.fmea.length} failure mode(s) analyzed</p>
        </Card>
      )}

      {/* Worksheet modal */}
      <Modal open={worksheetOpen} onClose={() => setWorksheetOpen(false)} title={worksheetTitle} maxWidth="xl">
        {idea.frameworkUsed === "triz" && (
          <TRIZWorksheet
            data={idea.frameworkData.triz}
            onChange={(data) => update({ frameworkData: { ...idea.frameworkData, triz: data } })}
          />
        )}
        {idea.frameworkUsed === "sit" && (
          <SITWorksheet
            data={idea.frameworkData.sit}
            onChange={(data) => update({ frameworkData: { ...idea.frameworkData, sit: data } })}
          />
        )}
        {idea.frameworkUsed === "ck" && (
          <CKWorksheet
            data={idea.frameworkData.ck}
            onChange={(data) => update({ frameworkData: { ...idea.frameworkData, ck: data } })}
          />
        )}
        {idea.frameworkUsed === "fmea" && (
          <FMEAInversion
            data={idea.frameworkData.fmea}
            onChange={(data) => update({ frameworkData: { ...idea.frameworkData, fmea: data } })}
          />
        )}
      </Modal>
    </div>
  );
}

function ClaimsTab({ idea, update, editing }: { idea: Idea; update: (u: Partial<Idea>) => void; editing: boolean }) {
  const { draftClaims } = useAI();
  const [prompt, setPrompt] = useState<PromptDescriptor | null>(null);

  function handleGenerate() {
    const desc = draftClaims({
      title: idea.title,
      problemStatement: idea.problemStatement,
      existingApproach: idea.existingApproach,
      proposedSolution: idea.proposedSolution,
      technicalApproach: idea.technicalApproach,
      contradictionResolved: idea.contradictionResolved,
      techStack: idea.techStack,
      frameworkUsed: idea.frameworkUsed,
      frameworkData: idea.frameworkData,
      aliceScore: idea.aliceScore,
      score: idea.score,
    });
    setPrompt(desc);
  }

  const claim = idea.claimDraft;

  return (
    <div className="space-y-6">
      {/* Generate button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-dark">
          AI-generated claim skeletons for method, system, and CRM claims.
        </p>
        <Button
          variant="accent"
          size="sm"
          onClick={handleGenerate}
          disabled={!idea.technicalApproach}
        >
          {claim ? "Regenerate Claims" : "Generate Claims"}
        </Button>
      </div>

      {!idea.technicalApproach && (
        <p className="text-xs text-text-muted">Add a technical approach in the Overview tab first.</p>
      )}

      {/* Display generated claims */}
      {claim && (
        <ClaimDraftDisplay
          claims={claim}
          onRegenerate={handleGenerate}
          loading={false}
        />
      )}

      {/* Manual editing fallback */}
      {editing && (
        <ClaimsManualEdit claim={claim} update={update} />
      )}

      {/* No claims and not editing */}
      {!claim && !editing && (
        <div className="py-8 text-center">
          <p className="text-sm text-neutral-dark">No claim drafts yet.</p>
          <p className="text-xs text-text-muted mt-1">Click &quot;Generate Claims&quot; above to create AI-drafted claim skeletons.</p>
        </div>
      )}

      {/* AI Prompt Modal */}
      {prompt && (
        <AIPromptModal
          open
          onClose={() => setPrompt(null)}
          featureName={prompt.featureName}
          systemPrompt={prompt.systemPrompt}
          userPrompt={prompt.userPrompt}
          responseFormatHint={prompt.responseFormatHint}
          onApply={(parsed) => {
            if (parsed && typeof parsed === "object") {
              update({ claimDraft: parsed as ClaimDraft });
            }
          }}
        />
      )}
    </div>
  );
}

function ClaimsManualEdit({ claim, update }: { claim: ClaimDraft | null | undefined; update: (u: Partial<Idea>) => void }) {
  const base = claim ?? emptyClaimDraft;

  const saveMethod = useCallback(
    (v: string) => update({ claimDraft: { ...base, methodClaim: v } }),
    [update, base]
  );
  const saveSystem = useCallback(
    (v: string) => update({ claimDraft: { ...base, systemClaim: v } }),
    [update, base]
  );
  const saveCrm = useCallback(
    (v: string) => update({ claimDraft: { ...base, crmClaim: v } }),
    [update, base]
  );

  const method = useDebouncedField(base.methodClaim, saveMethod);
  const system = useDebouncedField(base.systemClaim, saveSystem);
  const crm = useDebouncedField(base.crmClaim, saveCrm);

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider">Manual Editing</h4>
      <Section label="Method Claim">
        <Textarea
          value={method.localValue}
          onChange={(e) => method.onChange(e.target.value)}
          onBlur={method.flush}
          rows={5}
          placeholder="A method for [verb]-ing ... comprising: [step a], [step b]..."
        />
      </Section>
      <Section label="System Claim">
        <Textarea
          value={system.localValue}
          onChange={(e) => system.onChange(e.target.value)}
          onBlur={system.flush}
          rows={5}
          placeholder="A system comprising: a processor; a memory storing instructions..."
        />
      </Section>
      <Section label="Computer-Readable Medium Claim">
        <Textarea
          value={crm.localValue}
          onChange={(e) => crm.onChange(e.target.value)}
          onBlur={crm.flush}
          rows={5}
          placeholder="A non-transitory computer-readable medium storing instructions..."
        />
      </Section>
    </div>
  );
}

function RedTeamTab({ idea, update, editing }: { idea: Idea; update: (u: Partial<Idea>) => void; editing: boolean }) {
  const { redTeam } = useAI();
  const [prompt, setPrompt] = useState<PromptDescriptor | null>(null);
  const [result, setResult] = useState<RedTeamResult | null>(null);

  function handleRedTeam() {
    const desc = redTeam({
      title: idea.title,
      problemStatement: idea.problemStatement,
      proposedSolution: idea.proposedSolution,
      technicalApproach: idea.technicalApproach,
      aliceScoreSummary: idea.aliceScore
        ? `Score: ${idea.aliceScore.overallScore}/100, Risk: ${idea.aliceScore.abstractIdeaRisk}`
        : undefined,
    });
    setPrompt(desc);
  }

  function handleApplyRedTeam(parsed: unknown) {
    if (parsed && typeof parsed === "object") {
      const res = parsed as RedTeamResult;
      setResult(res);
      // Append AI critique to red team notes
      const aiSummary = `--- AI Red Team Critique ---\n${res.critique}\n\nWeaknesses:\n${(res.weaknesses || []).map((w) => `- ${w}`).join("\n")}\n\nPrior Art Concerns:\n${(res.priorArtConcerns || []).map((p) => `- ${p}`).join("\n")}\n\nAlice/101 Risks:\n${(res.aliceRisks || []).map((a) => `- ${a}`).join("\n")}\n\nRecommendations:\n${(res.recommendations || []).map((r) => `- ${r}`).join("\n")}`;
      const existing = idea.redTeamNotes ? idea.redTeamNotes + "\n\n" : "";
      update({ redTeamNotes: existing + aiSummary });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-dark">
          Play devil&apos;s advocate. What are the weaknesses? Why might this <em>not</em> be patentable?
        </p>
        <Button
          variant="accent"
          size="sm"
          onClick={handleRedTeam}
          disabled={!idea.problemStatement}
        >
          AI Red Team Critique
        </Button>
      </div>

      {/* AI result display */}
      {result && (
        <div className="space-y-3">
          <Card>
            <h4 className="text-xs font-medium text-blue-ribbon uppercase tracking-wider mb-2">AI Critique</h4>
            <p className="text-sm text-neutral-dark whitespace-pre-wrap">{result.critique}</p>
          </Card>

          <CollapsibleList title="Weaknesses" items={result.weaknesses} color="#ef4444" />
          <CollapsibleList title="Prior Art Concerns" items={result.priorArtConcerns} color="#f59e0b" />
          <CollapsibleList title="Alice / 101 Risks" items={result.aliceRisks} color="#f97316" />
          <CollapsibleList title="Recommendations" items={result.recommendations} color="#10b981" />
        </div>
      )}

      {/* Freeform notes */}
      <div className="pt-2">
        <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Your Notes</h4>
        {editing ? (
          <RedTeamNotesEditor idea={idea} update={update} />
        ) : (
          <p className="text-sm text-neutral-dark whitespace-pre-wrap">
            {idea.redTeamNotes || "No red team notes yet."}
          </p>
        )}
      </div>

      {/* AI Prompt Modal */}
      {prompt && (
        <AIPromptModal
          open
          onClose={() => setPrompt(null)}
          featureName={prompt.featureName}
          systemPrompt={prompt.systemPrompt}
          userPrompt={prompt.userPrompt}
          responseFormatHint={prompt.responseFormatHint}
          onApply={handleApplyRedTeam}
        />
      )}
    </div>
  );
}

function RedTeamNotesEditor({ idea, update }: { idea: Idea; update: (u: Partial<Idea>) => void }) {
  const saveNotes = useCallback((v: string) => update({ redTeamNotes: v }), [update]);
  const notes = useDebouncedField(idea.redTeamNotes, saveNotes);

  return (
    <Textarea
      value={notes.localValue}
      onChange={(e) => notes.onChange(e.target.value)}
      onBlur={notes.flush}
      rows={8}
      placeholder="List potential weaknesses, prior art concerns, Alice/101 risks, claim ambiguities..."
    />
  );
}

function PriorArtTab({ idea, update }: { idea: Idea; update: (u: Partial<Idea>) => void }) {
  const { search } = usePriorArt();
  const [notesEditing, setNotesEditing] = useState(false);

  return (
    <div className="space-y-4">
      {/* Search form — opens Google Patents in a new tab */}
      <SearchForm
        onSearch={search}
        loading={false}
      />

      <p className="text-xs text-text-muted">
        Search opens Google Patents in a new tab. Review results there and document your findings below.
      </p>

      {/* Prior art notes */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider">Prior Art Notes</h4>
          <button
            onClick={() => setNotesEditing(!notesEditing)}
            className="text-[10px] text-blue-ribbon hover:underline"
          >
            {notesEditing ? "Done" : "Edit"}
          </button>
        </div>
        {notesEditing ? (
          <PriorArtNotesEditor idea={idea} update={update} />
        ) : (
          <p className="text-sm text-neutral-dark whitespace-pre-wrap">
            {idea.priorArtNotes || "No prior art notes yet. Search above and document your findings here."}
          </p>
        )}
      </div>
    </div>
  );
}

function PriorArtNotesEditor({ idea, update }: { idea: Idea; update: (u: Partial<Idea>) => void }) {
  const saveNotes = useCallback((v: string) => update({ priorArtNotes: v }), [update]);
  const notes = useDebouncedField(idea.priorArtNotes, saveNotes);

  return (
    <Textarea
      value={notes.localValue}
      onChange={(e) => notes.onChange(e.target.value)}
      onBlur={notes.flush}
      rows={5}
      placeholder="Document prior art findings, relevant patents, and differentiation points..."
    />
  );
}

// ─── Patent Filing Tab ────────────────────────────────────────

function PatentFilingTab({ idea, update }: { idea: Idea; update: (u: Partial<Idea>) => void }) {
  const { analyzeInventiveStep } = useAI();
  const [prompt, setPrompt] = useState<PromptDescriptor | null>(null);

  function handleAnalyzeInventiveStep() {
    const desc = analyzeInventiveStep({
      title: idea.title,
      problemStatement: idea.problemStatement,
      proposedSolution: idea.proposedSolution,
      technicalApproach: idea.technicalApproach,
      existingApproach: idea.existingApproach,
    });
    setPrompt(desc);
  }

  const hasInventiveStep = !!idea.inventiveStepAnalysis;

  return (
    <div className="space-y-6">
      <p className="text-sm text-neutral-dark">
        Analyze the inventive step of your idea to strengthen your patent filing strategy.
      </p>

      {/* Inventive Step Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider">
            Inventive Step Analysis
          </h4>
          <Button
            variant="accent"
            size="sm"
            onClick={handleAnalyzeInventiveStep}
            disabled={!idea.problemStatement}
          >
            {hasInventiveStep ? "Re-analyze" : "Analyze Inventive Step"}
          </Button>
        </div>
        {!idea.problemStatement && (
          <p className="text-[10px] text-text-muted">Add a problem statement in the Overview tab first.</p>
        )}
        {hasInventiveStep && <InventiveStepCard analysis={idea.inventiveStepAnalysis!} />}
        {!hasInventiveStep && (
          <div className="py-6 text-center rounded-lg border border-dashed border-border">
            <p className="text-sm text-neutral-dark">No inventive step analysis yet.</p>
            <p className="text-xs text-text-muted mt-1">
              Click &quot;Analyze Inventive Step&quot; to identify non-obvious contributions.
            </p>
          </div>
        )}
      </div>

      {/* AI Prompt Modal */}
      {prompt && (
        <AIPromptModal
          open
          onClose={() => setPrompt(null)}
          featureName={prompt.featureName}
          systemPrompt={prompt.systemPrompt}
          userPrompt={prompt.userPrompt}
          responseFormatHint={prompt.responseFormatHint}
          onApply={(parsed) => {
            if (parsed && typeof parsed === "object") {
              update({ inventiveStepAnalysis: parsed as Idea["inventiveStepAnalysis"] });
            }
          }}
        />
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">{label}</h4>
      {children}
    </div>
  );
}

function CollapsibleList({ title, items, color }: { title: string; items: string[]; color: string }) {
  const [open, setOpen] = useState(true);

  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white hover:bg-neutral-off-white transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-xs font-normal text-ink">{title}</span>
          <Badge variant="outline" size="sm">{items.length}</Badge>
        </div>
        <svg
          className={`w-3.5 h-3.5 text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="px-3 py-2 space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="text-xs text-neutral-dark flex gap-2">
              <span className="text-text-muted shrink-0">{i + 1}.</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
