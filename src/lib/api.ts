/**
 * API Abstraction Layer — OSS Edition
 *
 * All data is stored in localStorage. No backend, no Prisma, no server actions.
 * Same function signatures (async) so the rest of the app doesn't need to change.
 */

import type {
  Idea,
  Sprint,
  SprintMemberRecord,
  IdeaStatus,
  SessionMode,
  SprintPhase,
} from "./types";

// ─── Helpers ──────────────────────────────────────────────────────

const PREFIX = "ipramp-oss";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Ideas ────────────────────────────────────────────────────────

const IDEAS_KEY = `${PREFIX}:ideas`;

export async function listIdeas(userId: string): Promise<Idea[]> {
  const all = readJSON<Idea[]>(IDEAS_KEY, []);
  return all.filter((i) => i.userId === userId);
}

export async function getIdea(id: string): Promise<Idea | null> {
  const all = readJSON<Idea[]>(IDEAS_KEY, []);
  return all.find((i) => i.id === id) ?? null;
}

export async function createIdea(idea: Idea): Promise<Idea> {
  const all = readJSON<Idea[]>(IDEAS_KEY, []);
  all.unshift(idea);
  writeJSON(IDEAS_KEY, all);
  return idea;
}

export async function updateIdea(id: string, updates: Partial<Idea>): Promise<Idea | null> {
  const all = readJSON<Idea[]>(IDEAS_KEY, []);
  const idx = all.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  const updated = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
  all[idx] = updated;
  writeJSON(IDEAS_KEY, all);
  return updated;
}

export async function deleteIdea(id: string): Promise<boolean> {
  const all = readJSON<Idea[]>(IDEAS_KEY, []);
  const filtered = all.filter((i) => i.id !== id);
  if (filtered.length === all.length) return false;
  writeJSON(IDEAS_KEY, filtered);
  return true;
}

export async function filterIdeas(
  userId: string,
  opts: {
    status?: IdeaStatus;
    search?: string;
    sortBy?: "updatedAt" | "createdAt" | "title";
    sortDir?: "asc" | "desc";
  }
): Promise<Idea[]> {
  let ideas = await listIdeas(userId);

  if (opts.status) {
    ideas = ideas.filter((i) => i.status === opts.status);
  }
  if (opts.search) {
    const q = opts.search.toLowerCase();
    ideas = ideas.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.problemStatement.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  const sortBy = opts.sortBy ?? "updatedAt";
  const sortDir = opts.sortDir ?? "desc";
  ideas.sort((a, b) => {
    const aVal = a[sortBy] as string;
    const bVal = b[sortBy] as string;
    const cmp = aVal.localeCompare(bVal);
    return sortDir === "desc" ? -cmp : cmp;
  });

  return ideas;
}

export async function listPersonalIdeas(userId: string): Promise<Idea[]> {
  const all = await listIdeas(userId);
  return all.filter((i) => !i.sprintId);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function canAccessIdea(_userId?: string, _ideaId?: string): Promise<boolean> {
  // OSS: all ideas are accessible by the local user
  return true;
}

// ─── Sprint–Idea Linking ──────────────────────────────────────────

export async function listSprintIdeas(sprintId: string): Promise<Idea[]> {
  const all = readJSON<Idea[]>(IDEAS_KEY, []);
  return all.filter((i) => i.sprintId === sprintId);
}

export async function listCandidateIdeas(sprintId: string): Promise<Idea[]> {
  const all = readJSON<Idea[]>(IDEAS_KEY, []);
  // Candidates = ideas with no sprint
  return all.filter((i) => !i.sprintId && i.id !== sprintId);
}

export async function linkToSprint(ideaId: string, sprintId: string): Promise<Idea | null> {
  return updateIdea(ideaId, { sprintId });
}

export async function unlinkFromSprint(ideaId: string): Promise<Idea | null> {
  return updateIdea(ideaId, { sprintId: null });
}

// ─── Sprints ──────────────────────────────────────────────────────

const SPRINTS_KEY = `${PREFIX}:sprints`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function listSprints(_ownerId?: string): Promise<Sprint[]> {
  return readJSON<Sprint[]>(SPRINTS_KEY, []);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function listAccessibleSprints(_userId?: string): Promise<Sprint[]> {
  return readJSON<Sprint[]>(SPRINTS_KEY, []);
}

export async function getSprint(id: string): Promise<Sprint | null> {
  const all = readJSON<Sprint[]>(SPRINTS_KEY, []);
  return all.find((s) => s.id === id) ?? null;
}

export async function createSprint(data: {
  id?: string;
  name: string;
  ownerId: string;
  teamId?: string;
  description?: string;
  theme?: string;
  sessionMode?: SessionMode;
  phase?: SprintPhase;
}): Promise<Sprint> {
  const now = new Date().toISOString();
  const sprint: Sprint = {
    id: data.id ?? Math.random().toString(36).slice(2, 10) + Date.now().toString(36),
    name: data.name,
    ownerId: data.ownerId,
    teamId: data.teamId ?? null,
    description: data.description ?? "",
    theme: data.theme ?? "",
    status: "active",
    sessionMode: data.sessionMode ?? "quantity",
    phase: data.phase ?? "foundation",
    timerSecondsRemaining: 259200, // 72h
    timerRunning: false,
    startedAt: null,
    createdAt: now,
    updatedAt: now,
  };
  const all = readJSON<Sprint[]>(SPRINTS_KEY, []);
  all.unshift(sprint);
  writeJSON(SPRINTS_KEY, all);
  return sprint;
}

export async function updateSprint(
  id: string,
  updates: Partial<Pick<Sprint, "name" | "description" | "theme" | "status" | "sessionMode" | "phase" | "timerSecondsRemaining" | "timerRunning" | "startedAt">>
): Promise<Sprint | null> {
  const all = readJSON<Sprint[]>(SPRINTS_KEY, []);
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  const updated = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
  all[idx] = updated;
  writeJSON(SPRINTS_KEY, all);
  return updated;
}

export async function deleteSprint(id: string): Promise<boolean> {
  const all = readJSON<Sprint[]>(SPRINTS_KEY, []);
  const filtered = all.filter((s) => s.id !== id);
  if (filtered.length === all.length) return false;
  writeJSON(SPRINTS_KEY, filtered);
  return true;
}

// ─── Sprint Members ───────────────────────────────────────────────

const MEMBERS_KEY = `${PREFIX}:sprint-members`;

export async function addMemberToSprint(sprintId: string, userId: string, role?: string): Promise<void> {
  const all = readJSON<SprintMemberRecord[]>(MEMBERS_KEY, []);
  // Avoid duplicates
  if (all.some((m) => m.sprintId === sprintId && m.userId === userId)) return;
  all.push({ sprintId, userId, role: role ?? "member" });
  writeJSON(MEMBERS_KEY, all);
}

export async function removeMemberFromSprint(sprintId: string, userId: string): Promise<void> {
  const all = readJSON<SprintMemberRecord[]>(MEMBERS_KEY, []);
  writeJSON(MEMBERS_KEY, all.filter((m) => !(m.sprintId === sprintId && m.userId === userId)));
}

export async function listSprintMembers(sprintId: string): Promise<SprintMemberRecord[]> {
  const all = readJSON<SprintMemberRecord[]>(MEMBERS_KEY, []);
  return all.filter((m) => m.sprintId === sprintId);
}
