"use client";

import {
  IDEATE_SYSTEM_PROMPT, buildIdeateUserPrompt,
  ALICE_SCORE_SYSTEM_PROMPT, buildAliceScoreUserPrompt,
  CLAIM_DRAFT_SYSTEM_PROMPT, buildClaimDraftUserPrompt,
  RED_TEAM_SYSTEM_PROMPT, buildRedTeamUserPrompt,
  REFINE_SYSTEM_PROMPT, buildRefineUserPrompt,
  INVENTIVE_STEP_SYSTEM_PROMPT, buildInventiveStepUserPrompt,
} from "@/lib/prompts";

/**
 * Descriptor returned by every AI function.
 * Pass this to <AIPromptModal> to show the prompt to the user.
 */
export interface PromptDescriptor {
  featureName: string;
  systemPrompt: string;
  userPrompt: string;
  responseFormatHint?: string;
}

/**
 * Hook for AI-powered features (ideation, Alice scoring, claim drafting, etc.)
 *
 * OSS version: instead of calling an API, each function builds a prompt
 * descriptor. The calling component shows an AIPromptModal so the user
 * can copy the prompt into any LLM and paste the result back.
 */
export function useAI() {
  function ideate(req: {
    problemStatement: string;
    techStack?: string[];
    framework?: string;
    existingApproach?: string;
    numIdeas?: number;
  }): PromptDescriptor {
    return {
      featureName: "AI Ideation",
      systemPrompt: IDEATE_SYSTEM_PROMPT,
      userPrompt: buildIdeateUserPrompt(req),
      responseFormatHint:
        'Paste the JSON response. Expected shape: { "ideas": [{ title, proposedSolution, technicalApproach, contradictionResolved, estimatedCpcClass, aliceRiskHint, inventivePrincipleUsed }] }',
    };
  }

  function scoreAlice(req: {
    title: string;
    problemStatement: string;
    proposedSolution: string;
    technicalApproach: string;
  }): PromptDescriptor {
    return {
      featureName: "Alice / 101 Pre-Screen",
      systemPrompt: ALICE_SCORE_SYSTEM_PROMPT,
      userPrompt: buildAliceScoreUserPrompt(req),
      responseFormatHint:
        'Paste the JSON response. Expected shape: { overallScore, abstractIdeaRisk, practicalApplication, inventiveConcept, recommendations, comparableCases }',
    };
  }

  function draftClaims(req: {
    title: string;
    problemStatement: string;
    existingApproach: string;
    proposedSolution: string;
    technicalApproach: string;
    contradictionResolved: string;
    techStack: string[];
    frameworkUsed: string;
    frameworkData: Record<string, unknown>;
    aliceScore?: { overallScore?: number; abstractIdeaRisk?: string; practicalApplication?: string; inventiveConcept?: string; recommendations?: string[] } | null;
    score?: { inventiveStep: number; defensibility: number; productFit: number } | null;
  }): PromptDescriptor {
    return {
      featureName: "Claim Draft Generation",
      systemPrompt: CLAIM_DRAFT_SYSTEM_PROMPT,
      userPrompt: buildClaimDraftUserPrompt(req),
      responseFormatHint:
        'Paste the JSON response. Expected shape: { methodClaim, systemClaim, crmClaim, methodDependentClaims, systemDependentClaims, crmDependentClaims, abstractText, claimStrategy, aliceMitigationNotes, prosecutionTips, notes }',
    };
  }

  function redTeam(req: {
    title: string;
    problemStatement: string;
    proposedSolution: string;
    technicalApproach: string;
    aliceScoreSummary?: string;
  }): PromptDescriptor {
    return {
      featureName: "Red Team Critique",
      systemPrompt: RED_TEAM_SYSTEM_PROMPT,
      userPrompt: buildRedTeamUserPrompt(req),
      responseFormatHint:
        'Paste the JSON response. Expected shape: { critique, weaknesses, priorArtConcerns, aliceRisks, recommendations }',
    };
  }

  function refine(req: {
    field: string;
    value: string;
    context: string;
  }): PromptDescriptor {
    return {
      featureName: `Refine: ${req.field}`,
      systemPrompt: REFINE_SYSTEM_PROMPT,
      userPrompt: buildRefineUserPrompt(req),
      responseFormatHint:
        'Paste the refined text. Can be plain text or JSON: { "refined": "..." }',
    };
  }

  function analyzeInventiveStep(req: {
    title: string;
    problemStatement: string;
    proposedSolution: string;
    technicalApproach: string;
    existingApproach: string;
  }): PromptDescriptor {
    return {
      featureName: "Inventive Step Analysis",
      systemPrompt: INVENTIVE_STEP_SYSTEM_PROMPT,
      userPrompt: buildInventiveStepUserPrompt(req),
      responseFormatHint:
        'Paste the JSON response. Expected shape: { nonObviousElements, priorArtDelta, technicalEffect, suggestedClaimAngle, overallAssessment }',
    };
  }

  return {
    ideate,
    scoreAlice,
    draftClaims,
    refine,
    redTeam,
    analyzeInventiveStep,
  };
}
