"use client";

import { useState } from "react";
import { SIT_TEMPLATES } from "@/lib/constants";
import { Card, Textarea } from "@/components/ui";
import { useFrameworkCoach, type CoachPromptDescriptor } from "@/hooks/useFrameworkCoach";
import { AICoachPanel } from "./AICoachPanel";
import { AIPromptModal } from "@/components/ai/AIPromptModal";
import type { SITData, CoachingResponse } from "@/lib/types";

interface SITWorksheetProps {
  data?: SITData;
  onChange?: (data: SITData) => void;
}

const ICONS: Record<string, string> = {
  minus: "\u2796",
  scissors: "\u2702\uFE0F",
  copy: "\uD83D\uDCC4",
  link: "\uD83D\uDD17",
  "arrow-right-left": "\u21C4",
};

export function SITWorksheet({ data, onChange }: SITWorksheetProps) {
  const [local, setLocal] = useState<SITData>(data ?? {});
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const { buildCoachPrompt } = useFrameworkCoach();
  const [prompt, setPrompt] = useState<CoachPromptDescriptor | null>(null);
  const [coaching, setCoaching] = useState<CoachingResponse | null>(null);

  function updateTemplate(id: string, value: string) {
    const next = { ...local, [id]: value };
    setLocal(next);
    onChange?.(next);
  }

  function handleCoach(templateId: string) {
    setActiveTemplate(templateId);
    setCoaching(null);
    const desc = buildCoachPrompt({
      framework: "sit",
      worksheetState: {
        ...Object.fromEntries(
          SIT_TEMPLATES.map((t) => [t.name, local[t.id] ?? ""])
        ),
      },
      focusArea: `template:${templateId}`,
      previousCoaching: coaching ? JSON.stringify(coaching.questions.slice(0, 2)) : null,
    });
    setPrompt(desc);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-serif font-bold text-ink mb-1">SIT Worksheet</h2>
        <p className="text-sm text-neutral-dark">
          Apply each of the 5 SIT templates to your system. Which ones spark inventive ideas?
        </p>
      </div>

      <div className="space-y-4">
        {SIT_TEMPLATES.map((template) => (
          <Card key={template.id}>
            <div className="flex items-start gap-3 mb-3">
              <span className="text-xl">{ICONS[template.icon] ?? "\u2022"}</span>
              <div>
                <h3 className="text-sm font-medium text-ink">{template.name}</h3>
                <p className="text-xs text-blue-ribbon mt-0.5 italic">{template.prompt}</p>
              </div>
            </div>
            <div className="mb-2">
              <span className="text-[10px] text-text-muted">Example: {template.example}</span>
            </div>
            <Textarea
              value={local[template.id] ?? ""}
              onChange={(e) => updateTemplate(template.id, e.target.value)}
              rows={3}
              placeholder={`Apply ${template.name} to your system...`}
            />
            <div className="mt-3">
              {activeTemplate === template.id ? (
                <AICoachPanel
                  coaching={coaching}
                  loading={false}
                  error={null}
                  onCoach={() => handleCoach(template.id)}
                  onClear={() => {
                    setCoaching(null);
                    setActiveTemplate(null);
                  }}
                  buttonLabel={`Coach on ${template.name}`}
                  compact
                />
              ) : (
                <AICoachPanel
                  coaching={null}
                  loading={false}
                  error={null}
                  onCoach={() => handleCoach(template.id)}
                  onClear={() => setCoaching(null)}
                  buttonLabel={`Coach on ${template.name}`}
                  compact
                />
              )}
            </div>
          </Card>
        ))}
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
              setCoaching(parsed as CoachingResponse);
            }
          }}
        />
      )}
    </div>
  );
}
