"use client";

import { useState, useCallback } from "react";
import {
  SOFTWARE_PARAMETERS,
  lookupContradiction,
  getParameterById,
  getParametersByCategory,
  getPrincipleById,
} from "@/lib/software-principles";
import { Card, Select, Button, Textarea, Badge } from "@/components/ui";
import { useFrameworkCoach, type CoachPromptDescriptor } from "@/hooks/useFrameworkCoach";
import { useAI, type PromptDescriptor } from "@/hooks/useAI";
import { AICoachPanel } from "./AICoachPanel";
import { AIPromptModal } from "@/components/ai/AIPromptModal";
import type {
  SoftwareInventivePrinciple,
  ParameterCategory,
  CoachingResponse,
  LayerDrillState,
  AlicePreScreenChecklist,
  TRIZData,
} from "@/lib/types";

// ─── Category helpers ────────────────────────────────────────

const CATEGORY_LABELS: Record<ParameterCategory, string> = {
  performance: "Performance",
  scale: "Scale",
  reliability: "Reliability",
  security: "Security",
  product: "Product",
  engineering: "Engineering",
  operations: "Operations",
  ai_ml: "AI / ML",
  data: "Data",
  integration: "Integration",
  architecture: "Architecture",
};

const CATEGORY_ORDER: ParameterCategory[] = [
  "performance", "scale", "reliability", "security", "data",
  "architecture", "engineering", "operations", "ai_ml", "product", "integration",
];

function buildSelectOptions() {
  const grouped = getParametersByCategory();
  return CATEGORY_ORDER.flatMap((cat) => {
    const params = grouped[cat] ?? [];
    return params.map((p) => ({
      value: String(p.id),
      label: p.name,
      group: CATEGORY_LABELS[cat],
    }));
  });
}

// ─── Alice verdict helpers ────────────────────────────────────

function computeAliceVerdict(score: number): AlicePreScreenChecklist["verdict"] {
  if (score >= 4) return "strong";
  if (score >= 3) return "promising";
  if (score >= 2) return "risky";
  return "abstract";
}

function getVerdictStyle(verdict: AlicePreScreenChecklist["verdict"]) {
  switch (verdict) {
    case "strong": return { color: "#10b981", bg: "#ecfdf5", label: "Strong patent candidate" };
    case "promising": return { color: "#3b82f6", bg: "#eff6ff", label: "Promising — strengthen Layer 3" };
    case "risky": return { color: "#f59e0b", bg: "#fffbeb", label: "Risky under Alice — needs more technical specificity" };
    case "abstract": return { color: "#ef4444", bg: "#fef2f2", label: "Likely abstract idea — rethink approach" };
  }
}

// ─── Main component ─────────────────────────────────────────

interface ContradictionMatrixProps {
  data?: TRIZData;
  onChange?: (data: TRIZData) => void;
}

export function ContradictionMatrix({ data, onChange }: ContradictionMatrixProps) {
  const [improvingId, setImprovingId] = useState<number | null>(null);
  const [worseningId, setWorseningId] = useState<number | null>(null);
  const { buildCoachPrompt } = useFrameworkCoach();
  const { drillLayers, alicePreScreen } = useAI();
  const [prompt, setPrompt] = useState<CoachPromptDescriptor | PromptDescriptor | null>(null);
  const [promptTarget, setPromptTarget] = useState<"coach" | "drill" | "alice" | null>(null);
  const [coaching, setCoaching] = useState<CoachingResponse | null>(null);

  // Track which principle is being drilled
  const [activeDrillPrincipleId, setActiveDrillPrincipleId] = useState<number | null>(null);

  // Layer drill states (keyed by principleId)
  const [drills, setDrills] = useState<Record<number, LayerDrillState>>(() => {
    const initial: Record<number, LayerDrillState> = {};
    if (data?.layerDrills) {
      for (const d of data.layerDrills) {
        initial[d.principleId] = d;
      }
    }
    return initial;
  });

  // Alice pre-screen checklist
  const [aliceChecklist, setAliceChecklist] = useState<AlicePreScreenChecklist>(
    data?.alicePreScreen ?? {
      technicalProblem: false,
      specificSolution: false,
      technicalImprovement: false,
      notConventional: false,
      score: 0,
      verdict: "abstract",
    }
  );

  const selectOptions = buildSelectOptions();

  const principles: SoftwareInventivePrinciple[] =
    improvingId && worseningId ? lookupContradiction(improvingId, worseningId) : [];

  const improvingParam = improvingId ? getParameterById(improvingId) : null;
  const worseningParam = worseningId ? getParameterById(worseningId) : null;

  // Persist drill data through onChange
  const persistDrills = useCallback(
    (updatedDrills: Record<number, LayerDrillState>, updatedAlice?: AlicePreScreenChecklist) => {
      if (onChange) {
        const layerDrills = Object.values(updatedDrills).filter(
          (d) => d.layer1 || d.layer2 || d.layer3
        );
        onChange({
          improving: improvingParam?.name ?? data?.improving ?? "",
          worsening: worseningParam?.name ?? data?.worsening ?? "",
          principles: principles.map((p) => p.id),
          resolution: data?.resolution ?? "",
          layerDrills: layerDrills.length > 0 ? layerDrills : undefined,
          alicePreScreen: updatedAlice ?? aliceChecklist,
        });
      }
    },
    [onChange, improvingParam, worseningParam, principles, data, aliceChecklist]
  );

  function getDrill(principleId: number): LayerDrillState {
    return drills[principleId] ?? { principleId, layer1: "", layer2: "", layer3: "" };
  }

  function updateDrillLayer(principleId: number, field: keyof LayerDrillState, value: string) {
    const current = getDrill(principleId);
    const updated = { ...current, [field]: value };
    const newDrills = { ...drills, [principleId]: updated };
    setDrills(newDrills);
    persistDrills(newDrills);
  }

  function updateAliceCheckbox(field: keyof Pick<AlicePreScreenChecklist, "technicalProblem" | "specificSolution" | "technicalImprovement" | "notConventional">, value: boolean) {
    const updated = { ...aliceChecklist, [field]: value };
    const score = [updated.technicalProblem, updated.specificSolution, updated.technicalImprovement, updated.notConventional].filter(Boolean).length;
    updated.score = score;
    updated.verdict = computeAliceVerdict(score);
    setAliceChecklist(updated);
    persistDrills(drills, updated);
  }

  function swap() {
    setImprovingId(worseningId);
    setWorseningId(improvingId);
    setActiveDrillPrincipleId(null);
  }

  function handleCoach() {
    const desc = buildCoachPrompt({
      framework: "matrix",
      worksheetState: {
        improvingParameter: improvingParam ? `${improvingParam.name} — ${improvingParam.description}` : "",
        worseningParameter: worseningParam ? `${worseningParam.name} — ${worseningParam.description}` : "",
        suggestedPrinciples: principles.map((p) => `#${p.id} ${p.name}: ${p.description}`),
      },
      focusArea: principles.length > 0 ? "principles" : "contradiction",
      previousCoaching: coaching ? JSON.stringify(coaching.questions.slice(0, 2)) : null,
    });
    setPromptTarget("coach");
    setPrompt(desc);
  }

  function handleDrillAI(principleId: number) {
    const principle = getPrincipleById(principleId);
    if (!principle) return;
    const drill = getDrill(principleId);
    const desc = drillLayers({
      principleName: principle.name,
      principleDescription: principle.description,
      layer1Text: drill.layer1,
      improvingParam: improvingParam?.name,
      worseningParam: worseningParam?.name,
    });
    setPromptTarget("drill");
    setPrompt(desc);
  }

  function handleAliceAI() {
    // Find the most recent layer3 text from active drill
    const activeDrill = activeDrillPrincipleId ? getDrill(activeDrillPrincipleId) : null;
    const layer3Text = activeDrill?.layer3 || "";
    if (!layer3Text) return;

    const desc = alicePreScreen({
      layer3Text,
      ideaContext: improvingParam && worseningParam
        ? `Improving ${improvingParam.name} while managing ${worseningParam.name}`
        : undefined,
    });
    setPromptTarget("alice");
    setPrompt(desc);
  }

  function handlePromptApply(parsed: unknown) {
    if (!parsed || typeof parsed !== "object") return;

    if (promptTarget === "coach") {
      setCoaching(parsed as CoachingResponse);
    } else if (promptTarget === "drill" && activeDrillPrincipleId) {
      const result = parsed as { layer2?: string; layer3?: string; patentabilityHint?: string };
      const current = getDrill(activeDrillPrincipleId);
      const updated = {
        ...current,
        layer2: result.layer2 ?? current.layer2,
        layer3: result.layer3 ?? current.layer3,
      };
      const newDrills = { ...drills, [activeDrillPrincipleId]: updated };
      setDrills(newDrills);
      persistDrills(newDrills);
    } else if (promptTarget === "alice") {
      const result = parsed as {
        technicalProblem?: { answer?: boolean };
        specificSolution?: { answer?: boolean };
        technicalImprovement?: { answer?: boolean };
        notConventional?: { answer?: boolean };
        score?: number;
        verdict?: AlicePreScreenChecklist["verdict"];
      };
      const updated: AlicePreScreenChecklist = {
        technicalProblem: result.technicalProblem?.answer ?? aliceChecklist.technicalProblem,
        specificSolution: result.specificSolution?.answer ?? aliceChecklist.specificSolution,
        technicalImprovement: result.technicalImprovement?.answer ?? aliceChecklist.technicalImprovement,
        notConventional: result.notConventional?.answer ?? aliceChecklist.notConventional,
        score: result.score ?? aliceChecklist.score,
        verdict: result.verdict ?? aliceChecklist.verdict,
      };
      setAliceChecklist(updated);
      persistDrills(drills, updated);
    }
  }

  const activeDrill = activeDrillPrincipleId ? getDrill(activeDrillPrincipleId) : null;
  const activePrinciple = activeDrillPrincipleId ? getPrincipleById(activeDrillPrincipleId) : null;
  const hasLayer3 = activeDrill && activeDrill.layer3.trim().length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-serif font-bold text-ink mb-1">Software Contradiction Matrix</h2>
        <p className="text-sm text-neutral-dark">
          Select the parameter you want to <strong className="text-green-400">improve</strong> and the parameter
          that <strong className="text-red-400">worsens</strong> as a result. The matrix suggests inventive principles
          tailored to software engineering.
        </p>
      </div>

      {/* Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-normal text-green-400 mb-1.5">
            Improving Parameter
          </label>
          <Select
            value={improvingId ? String(improvingId) : ""}
            onChange={(val) => { setImprovingId(val ? Number(val) : null); setActiveDrillPrincipleId(null); }}
            options={selectOptions}
            placeholder="Select parameter..."
          />
          {improvingParam && (
            <p className="text-xs text-text-muted mt-1">{improvingParam.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-normal text-red-400 mb-1.5">
            Worsening Parameter
          </label>
          <Select
            value={worseningId ? String(worseningId) : ""}
            onChange={(val) => { setWorseningId(val ? Number(val) : null); setActiveDrillPrincipleId(null); }}
            options={selectOptions}
            placeholder="Select parameter..."
          />
          {worseningParam && (
            <p className="text-xs text-text-muted mt-1">{worseningParam.description}</p>
          )}
        </div>
      </div>

      {/* Swap button */}
      {improvingId && worseningId && (
        <div className="flex justify-center">
          <Button variant="ghost" size="sm" onClick={swap}>
            {"\u21C4"} Swap Parameters
          </Button>
        </div>
      )}

      {/* Trade-off display */}
      {improvingParam && worseningParam && (
        <Card borderColor="#C69214">
          <h3 className="text-sm font-medium text-ink mb-1">Trade-off</h3>
          <p className="text-xs text-neutral-dark">
            Improving <span className="text-green-400 font-normal">{improvingParam.name}</span>
            {" "}typically worsens{" "}
            <span className="text-red-400 font-normal">{worseningParam.name}</span>.
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <span className="text-text-muted">Example: </span>
              <span className="text-neutral-dark">{improvingParam.exampleTradeoff}</span>
            </div>
            <div>
              <span className="text-text-muted">Example: </span>
              <span className="text-neutral-dark">{worseningParam.exampleTradeoff}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Results */}
      {improvingId && worseningId && principles.length === 0 && (
        <Card>
          <div className="text-center py-4">
            <p className="text-sm text-neutral-dark">
              No specific principles mapped for this combination yet.
            </p>
            <p className="text-xs text-text-muted mt-1">
              Try exploring similar parameters or consult the TRIZ worksheet for general principles.
            </p>
          </div>
        </Card>
      )}

      {principles.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-ink mb-3">
            Suggested Inventive Principles ({principles.length})
          </h3>
          <p className="text-xs text-text-muted mb-3">
            Click a principle card to open the 3-Layer Patent Drill.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {principles.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveDrillPrincipleId(activeDrillPrincipleId === p.id ? null : p.id)}
                className="text-left w-full"
              >
                <Card
                  hover
                  borderColor={activeDrillPrincipleId === p.id ? "#1F4CEB" : undefined}
                >
                  <div className="flex items-start gap-3">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-normal shrink-0 ${
                      activeDrillPrincipleId === p.id
                        ? "bg-blue-ribbon text-white"
                        : "bg-accent-light text-blue-ribbon"
                    }`}>
                      {p.id}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-ink">{p.name}</h4>
                      <p className="text-xs text-neutral-dark mt-0.5">{p.description}</p>
                      {p.softwareExamples.length > 0 && (
                        <div className="mt-2">
                          <span className="text-[10px] text-text-muted font-medium uppercase">Software Examples:</span>
                          <ul className="mt-1 space-y-0.5">
                            {p.softwareExamples.map((ex, i) => (
                              <li key={i} className="text-xs text-neutral-dark flex items-start gap-1">
                                <span className="text-blue-ribbon shrink-0">{"\u2022"}</span>
                                {ex}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {/* Show drill status badge */}
                      {drills[p.id] && (drills[p.id].layer1 || drills[p.id].layer2 || drills[p.id].layer3) && (
                        <div className="mt-2 flex gap-1">
                          {drills[p.id].layer1 && <Badge variant="solid" size="sm" color="#10b981">L1</Badge>}
                          {drills[p.id].layer2 && <Badge variant="solid" size="sm" color="#f59e0b">L2</Badge>}
                          {drills[p.id].layer3 && <Badge variant="solid" size="sm" color="#3b82f6">L3</Badge>}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════ 3-Layer Patent Drill Panel ═══════════ */}
      {activeDrillPrincipleId && activePrinciple && activeDrill && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-bold text-ink">
              3-Layer Patent Drill — #{activePrinciple.id} {activePrinciple.name}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveDrillPrincipleId(null)}
            >
              Close Drill
            </Button>
          </div>

          {/* Layer 1: Obvious */}
          <div className="rounded-lg border-2 border-green-400/40 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="solid" size="sm" color="#10b981">Layer 1</Badge>
              <span className="text-xs font-medium text-ink">Obvious Application</span>
              <span className="text-[10px] text-red-400 font-normal">NOT PATENTABLE</span>
            </div>
            <p className="text-[11px] text-neutral-dark">
              Describe how you&apos;d obviously apply this principle. What&apos;s the straightforward, well-known approach?
            </p>
            <Textarea
              value={activeDrill.layer1}
              onChange={(e) => updateDrillLayer(activeDrillPrincipleId, "layer1", e.target.value)}
              rows={3}
              placeholder="e.g., Add caching to reduce response time..."
            />
          </div>

          {/* AI Drill Button: L1 → L2/L3 */}
          {activeDrill.layer1.trim() && (
            <div className="flex justify-center">
              <Button
                variant="accent"
                size="sm"
                onClick={() => handleDrillAI(activeDrillPrincipleId)}
              >
                &#9660; AI Drill Deeper
              </Button>
            </div>
          )}

          {/* Layer 2: Architectural */}
          <div className="rounded-lg border-2 border-yellow-400/40 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="solid" size="sm" color="#f59e0b">Layer 2</Badge>
              <span className="text-xs font-medium text-ink">Architectural Detail</span>
              <span className="text-[10px] text-yellow-600 font-normal">MAYBE PATENTABLE</span>
            </div>
            <p className="text-[11px] text-neutral-dark">
              What specific data structures, algorithms, or protocols would you use? What architectural decisions make this non-trivial?
            </p>
            <Textarea
              value={activeDrill.layer2}
              onChange={(e) => updateDrillLayer(activeDrillPrincipleId, "layer2", e.target.value)}
              rows={4}
              placeholder="e.g., A two-tier cache with consistent hashing across nodes, using a custom eviction policy that considers both recency and predicted future access patterns..."
            />
          </div>

          {/* Layer 3: Inventive Mechanism */}
          <div className="rounded-lg border-2 border-blue-400/40 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="solid" size="sm" color="#3b82f6">Layer 3</Badge>
              <span className="text-xs font-medium text-ink">Inventive Mechanism</span>
              <span className="text-[10px] text-blue-600 font-normal">INVENTION CANDIDATE</span>
            </div>
            <p className="text-[11px] text-neutral-dark">
              What is the non-obvious technical trick? What surprising technical effect occurs that a skilled practitioner wouldn&apos;t expect?
            </p>
            <Textarea
              value={activeDrill.layer3}
              onChange={(e) => updateDrillLayer(activeDrillPrincipleId, "layer3", e.target.value)}
              rows={4}
              placeholder="e.g., The system uses a novel feedback loop where cache miss patterns are analyzed in real-time to dynamically adjust partition boundaries, resulting in a 40% reduction in cross-partition queries without any increase in memory footprint — a counter-intuitive result..."
            />
          </div>
        </div>
      )}

      {/* ═══════════ Alice / 101 Pre-Screen Checklist ═══════════ */}
      {hasLayer3 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-bold text-ink">Alice / §101 Pre-Screen</h3>
            <Button
              variant="accent"
              size="sm"
              onClick={handleAliceAI}
            >
              AI Alice Analysis
            </Button>
          </div>

          <Card>
            <div className="space-y-3">
              <AliceCheckboxRow
                checked={aliceChecklist.technicalProblem}
                onChange={(v) => updateAliceCheckbox("technicalProblem", v)}
                label="Does it solve a technical problem (not just a business problem)?"
                number={1}
              />
              <AliceCheckboxRow
                checked={aliceChecklist.specificSolution}
                onChange={(v) => updateAliceCheckbox("specificSolution", v)}
                label="Is the solution specific — tied to particular data structures, algorithms, or system architecture?"
                number={2}
              />
              <AliceCheckboxRow
                checked={aliceChecklist.technicalImprovement}
                onChange={(v) => updateAliceCheckbox("technicalImprovement", v)}
                label="Does it improve computer functionality itself (speed, efficiency, security)?"
                number={3}
              />
              <AliceCheckboxRow
                checked={aliceChecklist.notConventional}
                onChange={(v) => updateAliceCheckbox("notConventional", v)}
                label="Is the implementation non-conventional — not just applying a known technique?"
                number={4}
              />

              {/* Verdict */}
              <div className="pt-3 mt-3 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-normal"
                        style={{
                          backgroundColor: n <= aliceChecklist.score
                            ? getVerdictStyle(aliceChecklist.verdict).color
                            : "#e5e7eb",
                          color: n <= aliceChecklist.score ? "#fff" : "#9ca3af",
                        }}
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-normal"
                    style={{
                      backgroundColor: getVerdictStyle(aliceChecklist.verdict).bg,
                      color: getVerdictStyle(aliceChecklist.verdict).color,
                    }}
                  >
                    {aliceChecklist.score}/4 — {getVerdictStyle(aliceChecklist.verdict).label}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* AI Coach — below principles for deeper exploration */}
      {(improvingId || worseningId) && (
        <AICoachPanel
          coaching={coaching}
          loading={false}
          error={null}
          onCoach={handleCoach}
          onClear={() => setCoaching(null)}
        />
      )}

      {/* Quick reference: all parameters */}
      <details className="group">
        <summary className="text-xs text-text-muted cursor-pointer hover:text-neutral-dark">
          Show all {SOFTWARE_PARAMETERS.length} parameters
        </summary>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5">
          {SOFTWARE_PARAMETERS.map((p) => (
            <div
              key={p.id}
              className="text-[10px] text-neutral-dark px-2 py-1 rounded bg-white"
            >
              <span className="text-text-muted font-mono mr-1">{p.id}.</span>
              {p.name}
            </div>
          ))}
        </div>
      </details>

      {/* AI Prompt Modal */}
      {prompt && (
        <AIPromptModal
          open
          onClose={() => { setPrompt(null); setPromptTarget(null); }}
          featureName={prompt.featureName}
          systemPrompt={prompt.systemPrompt}
          userPrompt={prompt.userPrompt}
          responseFormatHint={prompt.responseFormatHint}
          onApply={handlePromptApply}
        />
      )}
    </div>
  );
}

// ─── Alice Checkbox Row ─────────────────────────────────────

function AliceCheckboxRow({
  checked,
  onChange,
  label,
  number,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  number: number;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-5 h-5 rounded border-2 border-border bg-white flex items-center justify-center transition-all peer-checked:bg-blue-ribbon peer-checked:border-blue-ribbon">
          {checked && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <span className="text-xs text-neutral-dark group-hover:text-ink transition-colors">
        <span className="text-text-muted font-mono mr-1">Q{number}.</span>
        {label}
      </span>
    </label>
  );
}
