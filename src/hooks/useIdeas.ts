"use client";

import { useEffect } from "react";
import { useIdeaStore, useAuthStore } from "@/lib/store";

/**
 * Hook that loads ideas for the local user
 * and provides access to the idea store.
 */
export function useIdeas() {
  const userId = useAuthStore((s) => s.user.id);
  const store = useIdeaStore();

  useEffect(() => {
    store.loadIdeas(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return {
    ideas: store.filteredIdeas(),
    allIdeas: store.ideas,
    loading: store.loading,
    filterStatus: store.filterStatus,
    searchQuery: store.searchQuery,
    sortBy: store.sortBy,
    sortDir: store.sortDir,
    addIdea: store.addIdea,
    updateIdea: store.updateIdea,
    removeIdea: store.removeIdea,
    getIdea: store.getIdea,
    setFilterStatus: store.setFilterStatus,
    setSearchQuery: store.setSearchQuery,
    setSortBy: store.setSortBy,
    toggleSortDir: store.toggleSortDir,
  };
}
