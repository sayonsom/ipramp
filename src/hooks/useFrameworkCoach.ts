"use client";

import type { CoachableFramework } from "@/lib/types";
import { FRAMEWORK_COACH_PROMPTS, buildFrameworkCoachUserPrompt } from "@/lib/prompts";

export interface CoachPromptDescriptor {
  featureName: string;
  systemPrompt: string;
  userPrompt: string;
  responseFormatHint: string;
}

/**
 * Hook for AI-guided brainstorming within framework worksheets.
 *
 * OSS version: builds a prompt descriptor for the AIPromptModal
 * instead of calling an API.
 */
export function useFrameworkCoach() {
  function buildCoachPrompt(req: {
    framework: CoachableFramework;
    worksheetState: Record<string, unknown>;
    focusArea?: string;
    previousCoaching?: string | null;
  }): CoachPromptDescriptor {
    return {
      featureName: `${req.framework.toUpperCase()} Coach`,
      systemPrompt: FRAMEWORK_COACH_PROMPTS[req.framework],
      userPrompt: buildFrameworkCoachUserPrompt({
        worksheetState: req.worksheetState,
        focusArea: req.focusArea,
        previousCoaching: req.previousCoaching ?? undefined,
      }),
      responseFormatHint:
        'Paste the JSON response. Expected shape: { questions: [...], suggestions: [...], angles: [...], frameworkTip: "..." }',
    };
  }

  return { buildCoachPrompt };
}
