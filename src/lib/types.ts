// ═══════════════════════════════════════════════════════════════════
// Core Domain Types for IP Ramp Open Source
// ═══════════════════════════════════════════════════════════════════

export interface User {
  id: string;
  email: string;
  name: string;
  interests: string[];
  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════════════════════════════
// Prompt Preferences (Structured AI Modifiers)
// ═══════════════════════════════════════════════════════════════════

export type Jurisdiction = "uspto" | "epo" | "wipo" | "jpo";
export type ClaimStyle = "broad" | "narrow" | "balanced";
export type TechnicalDepth = "high" | "medium" | "accessible";
export type Tone = "formal" | "plain";
export type DomainFocus =
  | "general"
  | "cloud_infrastructure"
  | "ai_ml"
  | "security"
  | "iot"
  | "data_analytics"
  | "fintech"
  | "healthcare"
  | "blockchain"
  | "edge_computing"
  | "devtools";

export interface PromptPreferences {
  jurisdiction: Jurisdiction;
  claimStyle: ClaimStyle;
  technicalDepth: TechnicalDepth;
  tone: Tone;
  domainFocus: DomainFocus;
  companyContext: string;
}

export const DEFAULT_PROMPT_PREFERENCES: PromptPreferences = {
  jurisdiction: "uspto",
  claimStyle: "balanced",
  technicalDepth: "medium",
  tone: "formal",
  domainFocus: "general",
  companyContext: "",
};

export const JURISDICTION_OPTIONS: { value: Jurisdiction; label: string }[] = [
  { value: "uspto", label: "USPTO (United States)" },
  { value: "epo", label: "EPO (European Patent Office)" },
  { value: "wipo", label: "WIPO (International / PCT)" },
  { value: "jpo", label: "JPO (Japan Patent Office)" },
];

export const CLAIM_STYLE_OPTIONS: { value: ClaimStyle; label: string; description: string }[] = [
  { value: "broad", label: "Broad", description: "Maximize claim scope for portfolio leverage" },
  { value: "balanced", label: "Balanced", description: "Defensible scope with fallback positions" },
  { value: "narrow", label: "Narrow", description: "Highly specific claims for faster allowance" },
];

export const TECHNICAL_DEPTH_OPTIONS: { value: TechnicalDepth; label: string; description: string }[] = [
  { value: "high", label: "High", description: "Staff/principal engineer level" },
  { value: "medium", label: "Medium", description: "Senior engineer level" },
  { value: "accessible", label: "Accessible", description: "Plain English for non-technical stakeholders" },
];

export const TONE_OPTIONS: { value: Tone; label: string }[] = [
  { value: "formal", label: "Formal Patent Language" },
  { value: "plain", label: "Plain English Draft" },
];

export const DOMAIN_FOCUS_OPTIONS: { value: DomainFocus; label: string }[] = [
  { value: "general", label: "General Software" },
  { value: "cloud_infrastructure", label: "Cloud & Infrastructure" },
  { value: "ai_ml", label: "AI & Machine Learning" },
  { value: "security", label: "Security & Privacy" },
  { value: "iot", label: "Internet of Things" },
  { value: "data_analytics", label: "Data & Analytics" },
  { value: "fintech", label: "Fintech & Payments" },
  { value: "healthcare", label: "Healthcare & Biotech" },
  { value: "blockchain", label: "Blockchain & Web3" },
  { value: "edge_computing", label: "Edge Computing" },
  { value: "devtools", label: "Developer Tools & DevOps" },
];

// ═══════════════════════════════════════════════════════════════════
// Idea & Pipeline Types
// ═══════════════════════════════════════════════════════════════════

export type IdeaStatus = "draft" | "developing" | "scored" | "filed" | "archived";
export type IdeaPhase = "foundation" | "validation" | "filing";
export type FrameworkType = "triz" | "sit" | "ck" | "analogy" | "fmea" | "none";
export type SessionMode = "quantity" | "quality" | "destroy";
export type SprintPhase = "foundation" | "validation" | "filing";
export type AliceRiskLevel = "low" | "medium" | "high";

export interface IdeaScore {
  inventiveStep: number;
  defensibility: number;
  productFit: number;
}

export interface AliceScore {
  overallScore: number;
  abstractIdeaRisk: AliceRiskLevel;
  abstractIdeaAnalysis: string;
  practicalApplication: string;
  inventiveConcept: string;
  recommendations: string[];
  comparableCases: string[];
}

export interface ClaimDependentClaim {
  claimNumber: number;
  text: string;
}

export interface ClaimSet {
  independentClaim: string;
  dependentClaims: ClaimDependentClaim[];
}

export interface ClaimDraft {
  methodClaim: string;
  systemClaim: string;
  crmClaim: string;
  methodDependentClaims: ClaimDependentClaim[];
  systemDependentClaims: ClaimDependentClaim[];
  crmDependentClaims: ClaimDependentClaim[];
  abstractText: string;
  claimStrategy: string;
  aliceMitigationNotes: string;
  prosecutionTips: string[];
  notes: string;
}

// ═══════════════════════════════════════════════════════════════════
// Patent Filing Analysis Types
// ═══════════════════════════════════════════════════════════════════

export interface InventiveStepAnalysis {
  primaryInventiveStep: string;
  secondarySteps: string[];
  nonObviousnessArgument: string;
  closestPriorArt: string[];
  differentiatingFactors: string[];
  technicalAdvantage: string;
}

export interface MarketNeedsAnalysis {
  marketSize: string;
  targetSegments: string[];
  painPointsSolved: string[];
  competitiveLandscape: string;
  commercializationPotential: string;
  licensingOpportunities: string[];
  strategicValue: string;
}

export interface PatentReport {
  executiveSummary: string;
  inventiveStepAnalysis: InventiveStepAnalysis;
  marketNeedsAnalysis: MarketNeedsAnalysis;
  claimStrategy: string;
  filingRecommendation: string;
  riskAssessment: string;
  nextSteps: string[];
}

export interface LayerDrillState {
  principleId: number;
  layer1: string;  // Obvious description (NOT PATENTABLE)
  layer2: string;  // Architectural detail (MAYBE PATENTABLE)
  layer3: string;  // Inventive mechanism (INVENTION CANDIDATE)
}

export interface AlicePreScreenChecklist {
  technicalProblem: boolean;   // Does it solve a technical problem?
  specificSolution: boolean;   // Is the solution specific (not abstract)?
  technicalImprovement: boolean; // Does it improve computer functionality?
  notConventional: boolean;    // Is the implementation non-conventional?
  score: number;               // 0-4 count of true values
  verdict: "strong" | "promising" | "risky" | "abstract";
}

export interface InventorInfo {
  name: string;
  department: string;
  email: string;
}

export interface TRIZData {
  improving: string;
  worsening: string;
  principles: number[];
  resolution: string;
  layerDrills?: LayerDrillState[];
  alicePreScreen?: AlicePreScreenChecklist;
}

export interface SITData {
  [templateId: string]: string;
}

export interface CKData {
  concepts: string;
  knowledge: string;
  opportunity: string;
}

export interface FMEAEntry {
  id: string;
  failureMode: string;
  effect: string;
  severity: number;
  novelMitigation: string;
  patentCandidate: boolean;
}

export type FrameworkData = {
  triz?: TRIZData;
  sit?: SITData;
  ck?: CKData;
  fmea?: FMEAEntry[];
};

// ═══════════════════════════════════════════════════════════════════
// AI Framework Coach Types
// ═══════════════════════════════════════════════════════════════════

export type CoachableFramework = "triz" | "sit" | "ck" | "fmea" | "matrix";

export interface CoachingRequest {
  framework: CoachableFramework;
  worksheetState: Record<string, unknown>;
  focusArea?: string;
  previousCoaching?: string | null;
}

export interface CoachingResponse {
  questions: string[];
  suggestions: string[];
  angles: string[];
  frameworkTip: string;
}

export interface Idea {
  id: string;
  userId: string;
  sprintId: string | null;
  teamId: string | null;
  title: string;
  problemStatement: string;
  existingApproach: string;
  proposedSolution: string;
  technicalApproach: string;
  contradictionResolved: string;
  priorArtNotes: string;
  status: IdeaStatus;
  phase: IdeaPhase;
  techStack: string[];
  tags: string[];

  score: IdeaScore | null;
  aliceScore: AliceScore | null;

  frameworkUsed: FrameworkType;
  frameworkData: FrameworkData;

  claimDraft: ClaimDraft | null;
  inventiveStepAnalysis: InventiveStepAnalysis | null;
  marketNeedsAnalysis: MarketNeedsAnalysis | null;
  patentReport: PatentReport | null;

  redTeamNotes: string;
  alignmentScores: AlignmentScore[];

  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════════════════════════════
// Business Alignment Types (kept for Idea compatibility)
// ═══════════════════════════════════════════════════════════════════

export interface AlignmentScore {
  id: string;
  ideaId: string;
  goalId: string;
  score: number;
  rationale: string;
}

// ═══════════════════════════════════════════════════════════════════
// Red Team Result
// ═══════════════════════════════════════════════════════════════════

export interface RedTeamResult {
  critique: string;
  weaknesses: string[];
  priorArtConcerns: string[];
  aliceRisks: string[];
  recommendations: string[];
}

// ═══════════════════════════════════════════════════════════════════
// Sprint / Team Types
// ═══════════════════════════════════════════════════════════════════

export type MemberRole = "member" | "data_minister" | "lead";

export interface Member {
  id: string;
  name: string;
  email: string;
  interests: string[];
}

export interface TeamTimer {
  budgetSeconds: number;
  spentSeconds: number;
  runningSinceMs: number | null;
  startedAtMs: number | null;
  startedStage: string | null;
}

export interface Team {
  id: string;
  name: string;
  members: Member[];
  dataMinister: string | null;
  ideas: Idea[];
  sessionMode: SessionMode;
  sprintPhase: SprintPhase;
  lastActivityAt: number;
  timer: TeamTimer;
}

export interface Sprint {
  id: string;
  name: string;
  ownerId: string;
  teamId: string | null;
  description: string;
  theme: string;
  status: "active" | "paused" | "completed";
  sessionMode: SessionMode;
  phase: SprintPhase;
  timerSecondsRemaining: number;
  timerRunning: boolean;
  startedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SprintMemberRecord {
  sprintId: string;
  userId: string;
  role: string;
  user?: Pick<User, "id" | "name" | "email">;
}

// ═══════════════════════════════════════════════════════════════════
// Software Principles Types
// ═══════════════════════════════════════════════════════════════════

export type ParameterCategory =
  | "performance"
  | "scale"
  | "reliability"
  | "security"
  | "product"
  | "engineering"
  | "operations"
  | "ai_ml"
  | "data"
  | "integration"
  | "architecture";

export interface SoftwareParameter {
  id: number;
  name: string;
  category: ParameterCategory;
  description: string;
  exampleTradeoff: string;
}

export interface SoftwareInventivePrinciple {
  id: number;
  name: string;
  description: string;
  softwareExamples: string[];
  patentExamples?: string[];
}

export interface ContradictionEntry {
  improvingParam: number;
  worseningParam: number;
  suggestedPrinciples: number[];
}

// ═══════════════════════════════════════════════════════════════════
// Patent / Prior Art Types
// ═══════════════════════════════════════════════════════════════════

export interface PatentResult {
  patentNumber: string;
  title: string;
  abstract: string;
  filingDate: string | null;
  grantDate: string | null;
  cpcClasses: string[];
  relevanceNote: string;
  url: string;
}

export interface PriorArtSearch {
  id: string;
  ideaId: string;
  queryText: string;
  results: PatentResult[];
  searchedAt: string;
}

// ═══════════════════════════════════════════════════════════════════
// Constants Types (for framework/UI data)
// ═══════════════════════════════════════════════════════════════════

export interface InterestCategory {
  color: string;
  tags: string[];
}

export interface InterestTag {
  tag: string;
  category: string;
  color: string;
}

export interface TRIZPrinciple {
  id: number;
  name: string;
  hint: string;
}

export interface SITTemplate {
  id: string;
  name: string;
  icon: string;
  prompt: string;
  example: string;
}

export interface CKPrompts {
  concept: string;
  knowledge: string;
  expansion: string;
}

export interface SprintPhaseConfig {
  key: SprintPhase;
  label: string;
  weeks: string;
  target: string;
  targetCount: number;
  color: string;
  icon: string;
}

export interface PatentMatrixDimension {
  key: keyof IdeaScore;
  label: string;
  icon: string;
  levels: {
    score: number;
    label: string;
    desc: string;
  }[];
}

export interface SessionModeConfig {
  key: SessionMode;
  label: string;
  icon: string;
  color: string;
  rules: string[];
  target: string;
}

// ═══════════════════════════════════════════════════════════════════
// AI Request/Response Types
// ═══════════════════════════════════════════════════════════════════

export interface IdeateRequest {
  problemStatement: string;
  techStack: string[];
  framework: FrameworkType | "open";
  existingApproach?: string;
  numIdeas: number;
}

export interface GeneratedIdea {
  title: string;
  problemReframed: string;
  proposedSolution: string;
  technicalApproach: string;
  contradictionResolved: string | null;
  inventivePrincipleUsed: string | null;
  estimatedCpcClass: string | null;
  aliceRiskHint: AliceRiskLevel;
}

export interface IdeateResponse {
  ideas: GeneratedIdea[];
  frameworkUsed: string;
}

export interface AliceScoreRequest {
  title: string;
  problemStatement: string;
  proposedSolution: string;
  technicalApproach: string;
}

export interface ClaimDraftRequest {
  title: string;
  problemStatement: string;
  existingApproach: string;
  proposedSolution: string;
  technicalApproach: string;
  contradictionResolved: string;
  techStack: string[];
  frameworkUsed: string;
  frameworkData: FrameworkData;
  aliceScore: AliceScore | null;
  score: IdeaScore | null;
}

// ═══════════════════════════════════════════════════════════════════
// Team Formation Types
// ═══════════════════════════════════════════════════════════════════

export interface TeamFormationResult {
  teams: Team[];
  stats: TeamFormationStats;
}

export interface TeamFormationStats {
  teamScores: number[];
  totalDiversity: number;
  maxPossible: number;
  avgDiversity: string;
  coveragePercent: number;
}

export interface TeamCategoryBreakdown {
  count: number;
  total: number;
  details: {
    category: string;
    color: string;
    members: string[];
  }[];
  missing: string[];
}
