"use client";

import { create } from "zustand";
import type {
  Idea,
  IdeaStatus,
  Sprint,
  SprintMemberRecord,
  User,
  PromptPreferences,
} from "./types";
import { DEFAULT_PROMPT_PREFERENCES } from "./types";
import * as api from "./api";
import { createBlankIdea } from "./utils";

// ─── Auth Store ───────────────────────────────────────────────────
// OSS: hardcoded local user, no login required.

const LOCAL_USER: User = {
  id: "local-user",
  email: "you@localhost",
  name: "Local User",
  interests: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

interface AuthState {
  user: User;
}

export const useAuthStore = create<AuthState>(() => ({
  user: LOCAL_USER,
}));

// ─── Idea Store ───────────────────────────────────────────────────

interface IdeaState {
  ideas: Idea[];
  loading: boolean;
  filterStatus: IdeaStatus | null;
  searchQuery: string;
  sortBy: "updatedAt" | "createdAt" | "title";
  sortDir: "asc" | "desc";

  loadIdeas: (userId: string) => Promise<void>;
  addIdea: (partial?: Partial<Idea>, userId?: string) => Promise<Idea>;
  updateIdea: (id: string, updates: Partial<Idea>) => Promise<void>;
  removeIdea: (id: string) => Promise<void>;
  setFilterStatus: (status: IdeaStatus | null) => void;
  setSearchQuery: (q: string) => void;
  setSortBy: (field: "updatedAt" | "createdAt" | "title") => void;
  toggleSortDir: () => void;
  getIdea: (id: string) => Idea | undefined;
  filteredIdeas: () => Idea[];
}

export const useIdeaStore = create<IdeaState>((set, get) => ({
  ideas: [],
  loading: false,
  filterStatus: null,
  searchQuery: "",
  sortBy: "updatedAt",
  sortDir: "desc",

  loadIdeas: async (userId: string) => {
    set({ loading: true });
    try {
      const ideas = await api.listIdeas(userId);
      set({ ideas, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  addIdea: async (partial, userId) => {
    const uid = userId ?? useAuthStore.getState().user.id;
    const blank = createBlankIdea(uid);
    const idea: Idea = { ...blank, ...partial };
    const created = await api.createIdea(idea);
    set((s) => ({ ideas: [created, ...s.ideas] }));
    return created;
  },

  updateIdea: async (id, updates) => {
    const updated = await api.updateIdea(id, updates);
    if (!updated) return;
    set((s) => ({
      ideas: s.ideas.map((i) => (i.id === id ? updated : i)),
    }));
  },

  removeIdea: async (id) => {
    await api.deleteIdea(id);
    set((s) => ({ ideas: s.ideas.filter((i) => i.id !== id) }));
  },

  setFilterStatus: (status) => set({ filterStatus: status }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSortBy: (field) => set({ sortBy: field }),
  toggleSortDir: () => set((s) => ({ sortDir: s.sortDir === "asc" ? "desc" : "asc" })),

  getIdea: (id) => get().ideas.find((i) => i.id === id),

  filteredIdeas: () => {
    const { ideas, filterStatus, searchQuery, sortBy, sortDir } = get();
    let filtered = [...ideas];

    if (filterStatus) {
      filtered = filtered.filter((i) => i.status === filterStatus);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.problemStatement.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    filtered.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      const cmp = typeof aVal === "string" ? aVal.localeCompare(bVal as string) : 0;
      return sortDir === "desc" ? -cmp : cmp;
    });

    return filtered;
  },
}));

// ─── UI Store ─────────────────────────────────────────────────────

interface UIState {
  sidebarCollapsed: boolean;
  activeModal: string | null;
  wizardStep: number;

  toggleSidebar: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
  setWizardStep: (step: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  activeModal: null,
  wizardStep: 0,

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
  setWizardStep: (step) => set({ wizardStep: step }),
}));

// ─── Sprint Store ─────────────────────────────────────────────────

interface SprintState {
  sprints: Sprint[];
  activeSprint: Sprint | null;
  sprintIdeas: Idea[];
  candidateIdeas: Idea[];
  members: SprintMemberRecord[];
  loading: boolean;

  loadSprints: (userId: string) => Promise<void>;
  loadSprintDetail: (sprintId: string) => Promise<void>;
  loadCandidates: (sprintId: string) => Promise<void>;

  createSprint: (data: {
    name: string;
    ownerId: string;
    teamId?: string;
    description?: string;
    theme?: string;
  }) => Promise<Sprint>;
  updateSprint: (id: string, updates: Partial<Pick<Sprint, "name" | "description" | "theme" | "status" | "sessionMode" | "phase" | "timerSecondsRemaining" | "timerRunning" | "startedAt">>) => Promise<void>;
  deleteSprint: (id: string) => Promise<void>;

  addIdeaToSprint: (ideaId: string, sprintId: string) => Promise<void>;
  removeIdeaFromSprint: (ideaId: string) => Promise<void>;
  quickAddIdea: (title: string, sprintId: string, userId: string) => Promise<Idea>;

  addMember: (sprintId: string, userId: string, role?: string) => Promise<void>;
  removeMember: (sprintId: string, userId: string) => Promise<void>;
}

export const useSprintStore = create<SprintState>((set) => ({
  sprints: [],
  activeSprint: null,
  sprintIdeas: [],
  candidateIdeas: [],
  members: [],
  loading: false,

  loadSprints: async (userId: string) => {
    set({ loading: true });
    try {
      const sprints = await api.listAccessibleSprints(userId);
      set({ sprints, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  loadSprintDetail: async (sprintId: string) => {
    set({ loading: true });
    try {
      const [sprint, ideas, members] = await Promise.all([
        api.getSprint(sprintId),
        api.listSprintIdeas(sprintId),
        api.listSprintMembers(sprintId),
      ]);
      set({
        activeSprint: sprint,
        sprintIdeas: ideas,
        members,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  loadCandidates: async (sprintId: string) => {
    try {
      const candidates = await api.listCandidateIdeas(sprintId);
      set({ candidateIdeas: candidates });
    } catch {
      // silent
    }
  },

  createSprint: async (data) => {
    const created = await api.createSprint(data);
    await api.addMemberToSprint(created.id, data.ownerId, "lead");
    set((s) => ({ sprints: [created, ...s.sprints] }));
    return created;
  },

  updateSprint: async (id, updates) => {
    const updated = await api.updateSprint(id, updates);
    if (!updated) return;
    set((s) => ({
      sprints: s.sprints.map((sp) => (sp.id === id ? updated : sp)),
      activeSprint: s.activeSprint?.id === id ? updated : s.activeSprint,
    }));
  },

  deleteSprint: async (id) => {
    await api.deleteSprint(id);
    set((s) => ({
      sprints: s.sprints.filter((sp) => sp.id !== id),
      activeSprint: s.activeSprint?.id === id ? null : s.activeSprint,
    }));
  },

  addIdeaToSprint: async (ideaId, sprintId) => {
    const linked = await api.linkToSprint(ideaId, sprintId);
    if (!linked) return;
    set((s) => ({
      sprintIdeas: [linked, ...s.sprintIdeas],
      candidateIdeas: s.candidateIdeas.filter((i) => i.id !== ideaId),
    }));
  },

  removeIdeaFromSprint: async (ideaId) => {
    const unlinked = await api.unlinkFromSprint(ideaId);
    if (!unlinked) return;
    set((s) => ({
      sprintIdeas: s.sprintIdeas.filter((i) => i.id !== ideaId),
      candidateIdeas: [unlinked, ...s.candidateIdeas],
    }));
  },

  quickAddIdea: async (title, sprintId, userId) => {
    const blank = createBlankIdea(userId);
    const idea: Idea = {
      ...blank,
      title,
      sprintId,
      status: "draft",
      phase: "foundation",
    };
    const created = await api.createIdea(idea);
    set((s) => ({ sprintIdeas: [created, ...s.sprintIdeas] }));
    return created;
  },

  addMember: async (sprintId, userId, role) => {
    await api.addMemberToSprint(sprintId, userId, role);
    const members = await api.listSprintMembers(sprintId);
    set({ members });
  },

  removeMember: async (sprintId, userId) => {
    await api.removeMemberFromSprint(sprintId, userId);
    set((s) => ({
      members: s.members.filter((m) => m.userId !== userId),
    }));
  },
}));

// ─── Settings Store ───────────────────────────────────────────────
// OSS: localStorage only, no DB sync, no API keys management.

const PREFS_KEY = "ipramp-oss:prompt-prefs";

interface SettingsState {
  promptPrefs: PromptPreferences;
  promptPrefsLoaded: boolean;

  initPromptPrefs: () => void;
  updatePromptPrefs: (updates: Partial<PromptPreferences>) => void;
  savePromptPrefs: () => void;
  resetPromptPrefs: () => void;

  exportAllData: () => string;
  importAllData: (json: string) => boolean;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  promptPrefs: { ...DEFAULT_PROMPT_PREFERENCES },
  promptPrefsLoaded: false,

  initPromptPrefs: () => {
    try {
      const stored = localStorage.getItem(PREFS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({ promptPrefs: { ...DEFAULT_PROMPT_PREFERENCES, ...parsed }, promptPrefsLoaded: true });
      } else {
        set({ promptPrefsLoaded: true });
      }
    } catch {
      set({ promptPrefsLoaded: true });
    }
  },

  updatePromptPrefs: (updates) => {
    set((s) => ({ promptPrefs: { ...s.promptPrefs, ...updates } }));
  },

  savePromptPrefs: () => {
    const { promptPrefs } = get();
    localStorage.setItem(PREFS_KEY, JSON.stringify(promptPrefs));
  },

  resetPromptPrefs: () => {
    set({ promptPrefs: { ...DEFAULT_PROMPT_PREFERENCES } });
    localStorage.removeItem(PREFS_KEY);
  },

  exportAllData: () => {
    const data = {
      ideas: JSON.parse(localStorage.getItem("ipramp-oss:ideas") ?? "[]"),
      sprints: JSON.parse(localStorage.getItem("ipramp-oss:sprints") ?? "[]"),
      members: JSON.parse(localStorage.getItem("ipramp-oss:sprint-members") ?? "[]"),
      promptPrefs: JSON.parse(localStorage.getItem(PREFS_KEY) ?? "null"),
      exportedAt: new Date().toISOString(),
      version: "1.0.0",
    };
    return JSON.stringify(data, null, 2);
  },

  importAllData: (json: string) => {
    try {
      const data = JSON.parse(json);
      if (data.ideas) localStorage.setItem("ipramp-oss:ideas", JSON.stringify(data.ideas));
      if (data.sprints) localStorage.setItem("ipramp-oss:sprints", JSON.stringify(data.sprints));
      if (data.members) localStorage.setItem("ipramp-oss:sprint-members", JSON.stringify(data.members));
      if (data.promptPrefs) localStorage.setItem(PREFS_KEY, JSON.stringify(data.promptPrefs));
      return true;
    } catch {
      return false;
    }
  },
}));
